# --- Imports ---
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os

DATA_DIR = "."

def build_collaborative_data():
    books = pd.read_csv(os.path.join(DATA_DIR, "Books.csv"), low_memory=False)
    ratings = pd.read_csv(os.path.join(DATA_DIR, "Ratings.csv"))

    ratings_with_name = ratings.merge(books, on="ISBN")
    ratings_with_name["Book-Rating"] = pd.to_numeric(
        ratings_with_name["Book-Rating"], errors="coerce"
    )

    # --- Filter active users ---
    user_counts = ratings_with_name.groupby("User-ID").count()["Book-Rating"]
    active_users = user_counts[user_counts > 200].index
    filtered_ratings = ratings_with_name[ratings_with_name["User-ID"].isin(active_users)]

    # --- Filter popular books ---
    book_counts = filtered_ratings.groupby("Book-Title").count()["Book-Rating"]
    popular_books = book_counts[book_counts >= 50].index
    final_ratings = filtered_ratings[filtered_ratings["Book-Title"].isin(popular_books)]

    # --- Pivot table ---
    pt = final_ratings.pivot_table(
        index="Book-Title", columns="User-ID", values="Book-Rating"
    )
    pt.fillna(0, inplace=True)

    # --- Compute similarity ---
    print("⚡ Computing similarity matrix...")
    similarity_scores = cosine_similarity(pt)

    # --- Save ---
    joblib.dump(pt, "pivot.pkl")
    joblib.dump(similarity_scores, "similarity_scores.pkl")
    print("✅ Precomputation complete. Saved pivot.pkl & similarity_scores.pkl")

if __name__ == "__main__":
    build_collaborative_data()
