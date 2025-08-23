# --- Imports ---
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import joblib
import difflib
import os
from functools import lru_cache

# --- FastAPI App ---
app = FastAPI(title="Book Recommendation API", version="1.0.0")

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Cached Data Loaders ---
DATA_DIR = "."

@lru_cache
def get_books():
    return pd.read_csv(os.path.join(DATA_DIR, "Books.csv"), low_memory=False)

@lru_cache
def get_ratings():
    return pd.read_csv(os.path.join(DATA_DIR, "Ratings.csv"))

# --- Globals ---
final_popular_df = None
pt = None
similarity_scores = None

# --- Helpers ---
def build_popular_books():
    books = get_books()
    ratings = get_ratings()

    ratings_with_name = ratings.merge(books, on="ISBN")
    ratings_with_name["Book-Rating"] = pd.to_numeric(
        ratings_with_name["Book-Rating"], errors="coerce"
    )

    num_rating_df = ratings_with_name.groupby("Book-Title").count()["Book-Rating"].reset_index()
    num_rating_df.rename(columns={"Book-Rating": "num_ratings"}, inplace=True)

    avg_rating_df = ratings_with_name.groupby("Book-Title")["Book-Rating"].mean().reset_index()
    avg_rating_df.rename(columns={"Book-Rating": "avg_ratings"}, inplace=True)

    popular_df = num_rating_df.merge(avg_rating_df, on="Book-Title")
    popular_df = popular_df.merge(books, on="Book-Title").drop_duplicates("Book-Title")

    return popular_df[
        ["Book-Title", "Book-Author", "Image-URL-M", "num_ratings", "avg_ratings"]
    ]

def load_collaborative_data():
    if not os.path.exists("pivot.pkl") or not os.path.exists("similarity_scores.pkl"):
        print("❌ Run precompute.py first to generate pivot.pkl and similarity_scores.pkl")
        return None, None
    pt = joblib.load("pivot.pkl")
    similarity_scores = joblib.load("similarity_scores.pkl")
    print("✅ Loaded precomputed collaborative data")
    return pt, similarity_scores

# --- Startup ---
@app.on_event("startup")
def startup_event():
    global final_popular_df, pt, similarity_scores
    final_popular_df = build_popular_books()
    pt, similarity_scores = load_collaborative_data()
    print(
        f"✅ Startup complete. Popular: {len(final_popular_df)} books, "
        f"Collaborative: {len(pt) if pt is not None else 0} books"
    )

# --- API Endpoints ---
@app.get("/")
def root():
    return {
        "message": "Welcome to the Book Recommendation API!",
        "status": "connected",
        "books_loaded": len(final_popular_df) if final_popular_df is not None else 0,
    }

@app.get("/recommendations/popular")
def get_popular():
    if final_popular_df is None or final_popular_df.empty:
        raise HTTPException(status_code=500, detail="Popular data unavailable")
    return (
        final_popular_df.sort_values(by="num_ratings", ascending=False)
        .head(50)
        .to_dict("records")
    )

@app.get("/recommendations/collaborative")
def get_collaborative(book_title: str):
    if pt is None or similarity_scores is None:
        raise HTTPException(
            status_code=500,
            detail="Collaborative data not available (run precompute.py first)",
        )

    matches = difflib.get_close_matches(book_title, pt.index, n=1, cutoff=0.3)
    if not matches:
        raise HTTPException(status_code=404, detail=f"No match for '{book_title}'")
    closest = matches[0]

    index = np.where(pt.index == closest)[0][0]
    similar_items = sorted(
        list(enumerate(similarity_scores[index])), key=lambda x: x[1], reverse=True
    )[1:6]

    recs = []
    for i in similar_items:
        title = pt.index[i[0]]
        book_info = final_popular_df[final_popular_df["Book-Title"] == title].to_dict("records")
        if book_info:
            recs.append(book_info[0])
    return recs

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "books_available": len(final_popular_df) if final_popular_df is not None else 0,
        "collaborative_ready": pt is not None and similarity_scores is not None,
    }

# --- Run locally ---
if __name__ == "__main__":
    import uvicorn, os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
