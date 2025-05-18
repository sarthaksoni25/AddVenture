# AddVenture

A minimal math game that challenges users to solve quick addition puzzles.  
Built with **React (Vite)** for the frontend and **Node.js** for the backend.

---

## 🧠 Features

- Simple addition-based gameplay
- User login and game history tracking
- Responsive and minimal UI

---

## 🗂️ Project Structure

```

AddVenture/
├── client/          # Vite React frontend
│   ├── src/         # UI and components
│   └── dist/        # Built static files (for S3)
├── server/          # Node.js backend API
└── .github/workflows/
└── deploy-frontend.yml  # CI/CD to S3

````

---

## 🚀 Getting Started

### Clone & install

```bash
git clone https://github.com/yourname/AddVenture.git
cd AddVenture

cd client
npm install

cd ../server
npm install
````

### Run locally

```bash
# Start backend
cd server
node index.js

# Start frontend (in new terminal)
cd client
npm run dev
```

---

## 🔄 Deployment

* Frontend auto-deploys to AWS S3 via GitHub Actions
* Backend runs on EC2 (manual or CI/CD via SSH)

---

## 📦 Tech Stack

* **Frontend**: React + Vite
* **Backend**: Node.js
* **CI/CD**: GitHub Actions
* **Infra**: AWS EC2 + S3


Let me know if you want to include example screenshots or API usage details.
```
