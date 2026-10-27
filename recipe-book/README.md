# 📖 Recipe Book

A full-stack MERN (MongoDB, Express, React, Node.js) application that lets you create, browse, edit, and delete your personal recipe collection.

---

## ✨ Features

- **Browse Recipes** – View all recipes in a responsive card grid
- **Search & Filter** – Search by name, filter by category (Breakfast, Lunch, Dinner, Snack, Dessert, Other)
- **Add & Edit Recipes** – Full form with frontend and backend validation
- **Delete with Confirmation** – Modal confirm dialog before deleting
- **Image Support** – Optional image URL per recipe with a category-themed fallback
- **Toast Notifications** – Non-blocking success/error feedback
- **Responsive Design** – Mobile-first, works on all screen sizes
- **Loading & Error States** – Graceful handling of async operations

---

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, React Router DOM  |
| Styling   | Plain CSS with CSS Custom Properties |
| HTTP      | Axios                             |
| Icons     | Lucide React                      |
| Backend   | Node.js, Express                  |
| Database  | MongoDB Atlas (via Mongoose)      |

---

## 📁 Project Structure

```
recipe-book/
├── backend/
│   ├── models/
│   │   └── Recipe.js          # Mongoose schema
│   ├── routes/
│   │   └── recipeRoutes.js    # REST API routes
│   ├── .env.example           # Environment variable template
│   ├── package.json
│   └── server.js              # Express app entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── RecipeForm.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── Toast.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── RecipeDetails.jsx
│   │   │   └── RecipeFormPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A **MongoDB Atlas** account (free tier works great)

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd recipe-book
```

### 2. Set up the Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB Atlas connection string
```

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
# .env already points to http://localhost:5000/api
```

---

## 🌿 MongoDB Atlas Configuration

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. In **Database Access**, create a user with read/write permissions
4. In **Network Access**, allow your IP (or `0.0.0.0/0` for development)
5. Click **Connect → Connect your application** and copy the URI
6. Paste it into `backend/.env` as `MONGO_URI`:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable   | Description                     | Example                              |
|------------|---------------------------------|--------------------------------------|
| `MONGO_URI`| MongoDB Atlas connection string | `mongodb+srv://user:pass@...`        |
| `PORT`     | Server port (optional)          | `5000`                               |

### Frontend (`frontend/.env`)

| Variable        | Description               | Default                       |
|-----------------|---------------------------|-------------------------------|
| `VITE_API_URL`  | Backend API base URL      | `http://localhost:5000/api`   |

---

## ▶️ Starting the App

### Start the Backend

```bash
cd backend
npm run dev      # uses nodemon for hot-reload
# or
npm start        # production mode
```

The API will be available at `http://localhost:5000`.

### Start the Frontend

```bash
cd frontend
npm run dev
```

The app will open at `http://localhost:5173`.

---

## 🌐 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | `/health`          | Health check             |
| GET    | `/recipes`         | Get all recipes          |
| GET    | `/recipes/:id`     | Get a single recipe      |
| POST   | `/recipes`         | Create a new recipe      |
| PUT    | `/recipes/:id`     | Update a recipe          |
| DELETE | `/recipes/:id`     | Delete a recipe          |

### Recipe Object

```json
{
  "_id": "...",
  "name": "Spaghetti Carbonara",
  "category": "Dinner",
  "ingredients": "200g spaghetti\n2 eggs\n100g pancetta",
  "steps": "1. Boil pasta\n2. Fry pancetta\n3. Mix eggs and cheese",
  "cookingTime": 30,
  "imageUrl": "https://example.com/carbonara.jpg",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| `MONGO_URI is not defined` | Make sure `backend/.env` exists and has the correct `MONGO_URI` |
| MongoDB connection fails | Check Atlas network access — your IP must be whitelisted |
| CORS errors in browser | Ensure frontend runs on port 5173 or 3000 (already configured) |
| `VITE_API_URL` undefined | Ensure `frontend/.env` exists with `VITE_API_URL=http://localhost:5000/api` |
| Build fails | Run `npm install` in the `frontend` directory |
| Port already in use | Change `PORT` in `backend/.env` or kill the process on port 5000 |

---

## 📜 License

MIT
