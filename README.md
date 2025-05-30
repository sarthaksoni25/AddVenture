# 🎮 AddVenture

[![Backend Build](https://github.com/sarthaksoni25/AddVenture/actions/workflows/deploy-backend.yml/badge.svg)](https://github.com/sarthaksoni25/AddVenture/actions/workflows/deploy-backend.yml)
[![Frontend Build](https://github.com/sarthaksoni25/AddVenture/actions/workflows/deploy-frontend.yml/badge.svg)](https://github.com/sarthaksoni25/AddVenture/actions/workflows/deploy-frontend.yml)
[![Demo](https://img.shields.io/badge/demo-online-blue?style=flat-square)](https://www.add-venture.xyz/)

A **minimal mental‑math game** focused on raw speed. AddVenture throws rapid‑fire addition puzzles at you and tracks your best streaks.

Built with **React + Vite** on the frontend and **Node.js + Express** on the backend, shipped via **AWS (S3 · EC2 · CloudFront)** and **GitHub Actions**.

---

## ✨ Live Demo

> [https://www.add-venture.xyz/](https://www.add-venture.xyz/)

---

## 🗺 Table of Contents

1. [Features](#-features)
2. [Quick Start (Docker)](#-quick-start-docker)
3. [Local Development](#-local-development)
4. [Project Structure](#-project-structure)
5. [Tech Stack](#-tech-stack)
6. [Deployment](#-deployment)
7. [Roadmap](#-roadmap)
8. [Contributing](#-contributing)
9. [License](#-license)

---

## 🧠 Features

* ⚡ **Fast‑paced gameplay** — each round lasts 5 seconds.
* 👤 **Instant guest play** with a persistent `guestId` in localStorage.
* 📈 **Real‑time leaderboard** (top 10 by best score ⇒ shortest time tiebreaker).
* 🗓 **Personal history** of recent games.
* 📱 **Responsive UI** (mobile‑first, Ant Design components).
* 🚀 **1‑click deployments** via GitHub Actions (frontend → S3 + CloudFront, backend → EC2).

---

## 🚀 Quick Start (Docker)

```bash
# Clone
$ git clone https://github.com/sarthaksoni25/AddVenture.git
$ cd AddVenture

# Build & run both services
$ docker compose up --build
```

The bundled **`compose.yml`** spins up:

| Service  | Port  | Notes           |
| -------- | ----- | --------------- |
| `client` |  5173 | Vite dev server |
| `server` |  5000 | Express API     |

The client is automatically proxied to the API, so you can hit [http://localhost:5173](http://localhost:5173) and start playing. ([github.com](https://github.com/sarthaksoni25/AddVenture))

---

## ⚙️ Local Development

### Prerequisites

* **Node.js ≥ 20**
* **npm** (or **pnpm/yarn**)
* *Optional:* Docker ≥ 26 if you prefer containerised dev.

### Start Backend

```bash
cd server
npm install
npm run dev      # nodemon + dotenv
```

### Start Frontend (separate tab)

```bash
cd client
npm install
npm run dev
```

The Vite dev server proxies `/api/*` to `localhost:5000` during development, so CORS is painless.

---

## 🗂 Project Structure

```
AddVenture/
├── client/             # React + Vite
│   ├── src/            # Components & pages
│   └── dist/           # Production build (S3 upload)
├── server/             # Node.js + Express API
│   ├── index.js        # Entry point
│   └── ...
├── compose.yml         # Local dev with Docker
├── .github/workflows/  # CI/CD pipelines
│   ├── deploy-frontend.yml
│   └── deploy-backend.yml
└── Roadmap.md          # Feature backlog
```

---

## 📦 Tech Stack

| Layer    | Tech                                  |
| -------- | ------------------------------------- |
| Frontend | React, Vite, Ant Design               |
| Backend  | Node.js, Express                      |
| Database | SQLite (file‑based) → MySQL (planned) |
| CI/CD    | GitHub Actions                        |
| Infra    | AWS S3 · EC2 · CloudFront · ACM       |
| Auth     | Anonymous + guestId (localStorage)    |

---

## 🌍 Deployment

| Part         | How                                                                                     |
| ------------ | --------------------------------------------------------------------------------------- |
| **Frontend** | `deploy-frontend.yml` uploads `client/dist` to S3 and invalidates CloudFront.           |
| **Backend**  | `deploy-backend.yml` SSHes into the EC2 instance, pulls the repo & restarts Docker/PM2. |
| **Domain**   | DNS hosted on **Hostinger** with a CNAME → CloudFront.                                  |
| **TLS**      | Free certificates issued via **AWS ACM**.                                               |

---

## 🛣 Roadmap

See **[Roadmap.md](./Roadmap.md)** for the full backlog. Up next:

* Profile stats & streaks
* Mobile app wrapper (PWA/Expo)

---

## 🤝 Contributing

Found a bug or have an idea? Feel free to open an issue or PR – small improvements are very welcome!

---

## 📄 License

MIT © 2025 Sarthak Soni
