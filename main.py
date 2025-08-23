# main.py
# --- Imports (at the very top) ---

# --- Imports (at the very top) ---
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import difflib

# NEW: Firebase Admin SDK
import firebase_admin
from firebase_admin import credentials, auth
import os

# --- FastAPI App & Global Variables ---
app = FastAPI(title="Book Recommendation API", version="1.0.0")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store the dataframes and matrices
final_popular_df = None
pt = None  # Pivot table for collaborative filtering
similarity_scores = None # Cosine similarity matrix

# --- Load and prepare the data when the application starts ---
@app.on_event("startup")
def load_data():
    """
    Loads and pre-processes all necessary dataframes and matrices.
    """
    global final_popular_df, pt, similarity_scores
    
    try:
        # Load the raw data
        books = pd.read_csv('archive (1)/Books.csv', low_memory=False)
        ratings = pd.read_csv('archive (1)/Ratings.csv')

        # Pre-process for Popular Recommendations
        ratings_with_name = ratings.merge(books, on='ISBN')
        ratings_with_name['Book-Rating'] = pd.to_numeric(ratings_with_name['Book-Rating'], errors='coerce')

        num_rating_df = ratings_with_name.groupby('Book-Title').count()['Book-Rating'].reset_index()
        num_rating_df.rename(columns={'Book-Rating': 'num_ratings'}, inplace=True)

        avg_rating_df = ratings_with_name.groupby('Book-Title')['Book-Rating'].mean().reset_index()
        avg_rating_df.rename(columns={'Book-Rating': 'avg_ratings'}, inplace=True)

        popular_df = num_rating_df.merge(avg_rating_df, on='Book-Title')
        popular_df = popular_df.merge(books, on='Book-Title').drop_duplicates('Book-Title')
        final_popular_df = popular_df[['Book-Title', 'Book-Author', 'Image-URL-M', 'num_ratings', 'avg_ratings']]
        
        # Pre-process for Collaborative Filtering
        user_ratings_threshold = ratings_with_name.groupby('User-ID').count()['Book-Rating'] > 200
        active_users = user_ratings_threshold[user_ratings_threshold].index
        filtered_ratings = ratings_with_name[ratings_with_name['User-ID'].isin(active_users)]
        
        book_ratings_threshold = filtered_ratings.groupby('Book-Title').count()['Book-Rating'] >= 50
        filtered_books = book_ratings_threshold[book_ratings_threshold].index
        final_ratings = filtered_ratings[filtered_ratings['Book-Title'].isin(filtered_books)]
        
        # Create the pivot table (pt)
        pt = final_ratings.pivot_table(index='Book-Title', columns='User-ID', values='Book-Rating')
        pt.fillna(0, inplace=True)
        
        # Create the similarity matrix (similarity_scores)
        similarity_scores = cosine_similarity(pt)
        
        print(f"✅ Data loaded successfully! {len(final_popular_df)} popular books and {len(pt)} books for collaborative filtering available.")
        
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        final_popular_df = pd.DataFrame()
        pt = pd.DataFrame()
        similarity_scores = np.array([])
        # Re-raise the exception to prevent the server from starting with bad data
        raise

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Book Recommendation API!", 
        "status": "connected",
        "books_loaded": len(final_popular_df) if final_popular_df is not None else 0
    }

@app.get("/recommendations/popular")
def get_popular_books():
    """Get the most popular books based on number of ratings"""
    try:
        if final_popular_df is None or final_popular_df.empty:
            raise HTTPException(status_code=500, detail="No book data available. Server may be starting or data failed to load.")
        
        # Sort by ratings and return the top 50
        popular_books = final_popular_df.sort_values(by='num_ratings', ascending=False).head(50)
        return popular_books.to_dict('records')
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching popular books: {str(e)}")

@app.get("/recommendations/collaborative")
def get_collaborative_recommendations(book_title: str):
    """
    Get recommendations based on collaborative filtering with fuzzy matching.
    """
    try:
        if pt is None or pt.empty or similarity_scores is None or similarity_scores.size == 0:
            raise HTTPException(status_code=500, detail="Collaborative filtering data is not available. The server may still be loading the data.")
            
        # Use difflib to find the closest match with a lower, more forgiving cutoff
        matches = difflib.get_close_matches(book_title, pt.index, n=1, cutoff=0.3)
        
        if not matches:
            raise HTTPException(status_code=404, detail=f"Sorry, no close match found for '{book_title}'. Please try another title.")
        
        closest_match = matches[0]
        
        # Get the index of the closest matching book from the pivot table
        index = np.where(pt.index == closest_match)[0][0]
        
        # Get the similarity scores for that book
        similar_items = sorted(list(enumerate(similarity_scores[index])), key=lambda x: x[1], reverse=True)[1:6]
        
        data = []
        for i in similar_items:
            recommended_book_title = pt.index[i[0]]
            
            # Find the full book info from the popular books dataframe
            book_info = final_popular_df[final_popular_df['Book-Title'] == recommended_book_title].to_dict('records')
            
            if book_info:
                data.append(book_info[0])

        if not data:
            raise HTTPException(status_code=404, detail=f"No recommendations found for '{closest_match}'.")
            
        return data
    
    except IndexError:
        raise HTTPException(status_code=404, detail=f"Book '{book_title}' was matched to '{closest_match}' but no recommendations could be found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


@app.get("/recommendations/content")
def get_content_recommendations(book_title: str):
    """Content-based filtering recommendations (placeholder)"""
    return {
        "message": f"Content-based recommendations for '{book_title}' are coming soon!",
        "book_title": book_title,
        "status": "not_implemented"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "books_available": len(final_popular_df) if final_popular_df is not None else 0,
        "data_loaded": not (final_popular_df is None or final_popular_df.empty)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
