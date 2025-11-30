# Book Recommendation Server

Express + Mongoose backend for the Book Recommendation Engine.

Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI`.

2. Install dependencies from `server/`:

```powershell
cd server
npm install
```

3. Import CSV data into MongoDB:

```powershell
# ensure MongoDB is running and .env MONGO_URI is correct
npm run import-csv
```

4. Generate collaborative recommendations JSON (Python precompute exporter):

```powershell
# from project root
python precompute_export.py
```

5. Start server

```powershell
npm run dev
```

Endpoints

- `GET /api/recommendations/popular` — top popular books
- `GET /api/recommendations/collaborative?book_title=...` — collaborative recs (requires `collab_recs.json` produced by Python exporter)
