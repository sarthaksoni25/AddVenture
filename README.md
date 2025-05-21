# 🎮 AddVenture

Link: https://www.add-venture.xyz/

A minimal mental math game built with speed and simplicity in mind.  
Solve rapid-fire addition puzzles and track your best scores!

Built using **React (Vite)** on the frontend and **Node.js** on the backend, deployed via **AWS** and **GitHub Actions**.

---

## 🧠 Features

- ⚡ Fast-paced addition gameplay
- 👤 Guest login with persistent ID
- 📈 Leaderboard showing top scores
- 🕓 Game history tracking
- 📱 Fully responsive UI
- 🚀 CI/CD deployment to AWS (S3 + EC2)

---

## 🗂️ Project Structure

```

AddVenture/
├── client/             # React + Vite frontend
│   ├── src/            # Components and pages
│   └── dist/           # Built static files (for S3)
├── server/             # Node.js backend
│   └── guest-logs.json # Game logs (ignored by git)
├── .github/workflows/  # GitHub Actions CI/CD
│   ├── deploy-frontend.yml
│   └── deploy-backend.yml

````

---

## 🚀 Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/yourname/AddVenture.git
cd AddVenture

# Frontend setup
cd client
npm install

# Backend setup
cd ../server
npm install
````

### 2. Run locally

```bash
# Start backend
cd server
node index.js

# Start frontend (in a separate terminal)
cd ../client
npm run dev
```

---

## 🌍 Deployment

* **Frontend**: Auto-deployed to AWS S3 via GitHub Actions + CloudFront + HTTPS (ACM)
* **Backend**: Runs on AWS EC2 (manually or via SSH CI/CD)
* **Domain**: Configured with Hostinger DNS

---

## 📦 Tech Stack

| Layer    | Tech                    |
| -------- | ----------------------- |
| Frontend | React, Vite, Ant Design |
| Backend  | Node.js, Express        |
| CI/CD    | GitHub Actions          |
| Infra    | AWS EC2, S3, CloudFront |
| Auth     | Guest ID (localStorage) |

---

## 📸 Screenshots


---

## 📌 Roadmap

* [ ] Google OAuth login
* [ ] Global leaderboard with pagination
* [ ] Profile stats and streaks
* [ ] Mobile app wrapper (PWA or Expo)


Let me know if you want to include API routes or an architecture diagram too.
