📚 Book Recommendation Engine
This project is a book recommendation system with a backend powered by FastAPI and a modern frontend built with React. The system provides two main recommendation features:

Popular Recommendations: Displays a list of the most highly-rated books.

Collaborative Filtering: Suggests books based on the preferences of users with similar reading tastes.

This setup is perfect for developers looking to understand and build a full-stack recommendation system from scratch.

✨ Features
FastAPI Backend: A robust Python backend that serves book data and recommendations.

React Frontend: A dynamic and responsive user interface for exploring books.

Collaborative Filtering: An algorithm that provides personalized recommendations by identifying patterns in user ratings.

Popularity-Based Filtering: A straightforward method for displaying the most popular books based on user ratings.

Fuzzy String Matching: The system can handle minor typos in book titles to provide a better user experience.

🛠️ Tech Stack
Backend
Python: The core language for the backend logic.

FastAPI: A modern, fast web framework for building the API.

Pandas: Used for efficient data manipulation and analysis.

NumPy: Provides support for numerical operations.

Scikit-learn: Used for calculating cosine similarity for collaborative filtering.

Frontend
React: A JavaScript library for building the user interface.

Vite: A fast development build tool.

Bootstrap & Tailwind CSS: For styling and layout.

🚀 Getting Started
Follow these steps to get the project up and running on your local machine.

Prerequisites
You need to have the following installed:

Python 3.8+

Node.js (which includes npm)

1. Clone the Repository
Clone the project from GitHub and navigate into the main directory.

Bash

git clone https://github.com/sengobasar/Book-Recommendation-Engine.git
cd Book-Recommendation-Engine
2. Set up the Backend
Create a Python virtual environment to manage project dependencies.

Bash

python -m venv .venv
Activate the virtual environment.

On Windows:

Bash

.venv\Scripts\activate
On macOS/Linux:

Bash

source .venv/bin/activate
Install the Python dependencies.

Bash

pip install -r requirements.txt
(Note: You may need to create this file by running pip freeze > requirements.txt after installing the packages manually with pip install fastapi uvicorn pandas numpy scikit-learn)

Run the FastAPI server.

Bash

python -m uvicorn main:app --reload
The backend API will be available at http://localhost:8000.

3. Set up the Frontend
Navigate to the frontend directory in a new terminal window.

Bash

cd frontend
Install the Node.js dependencies.

Bash

npm install
Run the React development server.

Bash

npm run dev
The frontend will be available at http://localhost:5173.
