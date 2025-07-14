# AddVenture — Roadmap

> **Legend**  
> **P1** = Must-do first (core stability / credibility)  
> **P2** = High impact (user value)  
> **P3** = Nice-to-have (depth / growth)  
> **P4** = Long-term (scale / ops)

---

## Sprint 0 – Repo polish & guard-rails (P1)

- [ ] **Add LICENSE** (MIT or Apache-2.0)
- [ ] **README badges**: build | deploy | license | demo
- [ ] **CONTRIBUTING.md** + Issue/PR templates
- [ ] **Architecture diagram / GIF** in README
- [ ] **ESLint + Prettier** configs
- [ ] **Husky pre-commit hook**
- [ ] **Enable Dependabot & CodeQL**
- [ ] **Basic tests**  
  - [ ] Vitest (frontend)  
  - [ ] Jest / Supertest (backend)  
  - [ ] GitHub Action runs tests on every PR

---

## Sprint 1 – User-facing polish (P2)

- [ ] **Incremental TypeScript migration**  
  - [ ] Add `tsconfig.json`  
  - [ ] Convert game-logic files
- [ ] **PWA support** (vite-plugin-pwa, manifest, service-worker)
- [ ] **Daily Challenge** mode  
  - [ ] Cron/seed job for daily puzzle  
  - [ ] Emoji grid share
- [ ] **Sound & haptics** for answers
- [ ] **Accessibility & Dark mode** with Ant Design tokens

---

## Sprint 2 – Persistence & social (P3)

- [ ] **Google OAuth** (keep guest flow fallback)
- [ ] **Move scores/history to DB** (Postgres/Supabase or DynamoDB)
- [ ] **Leaderboard API**  
  - [ ] “Top 100” endpoint  
  - [ ] “Around me” endpoint
- [ ] **Analytics** (GA4 or PostHog)

---

## Sprint 3 – DevOps & cost control (P3 → P4)

- [ ] **Dockerise app** (`Dockerfile` + `docker-compose.yml`)
- [ ] **Infrastructure-as-Code** (Terraform/CDK for S3, CloudFront, ACM, Route 53)
- [ ] **Budget alarms** (AWS Budget → SNS / Slack)  
  - [ ] Optional Lambda to stop EC2 on threshold
- [ ] **Zero-downtime deploy** (blue/green or dual-bucket S3)

---

## Sprint 4 – Virality & launch prep (P4)

- [ ] **Streak SVG badge generator**
- [ ] **Friend duels** (socket.io battle rooms)
- [ ] **Shareable result cards** (copy-to-clipboard)

---

### Backlog / Ideas

- [ ] Multiplayer tournament mode
- [ ] In-game power-ups store
- [ ] A/B test harder puzzle types
- [ ] Mobile app wrapper (Capacitor/React Native)

### Add infra to-dos

- [ ] Add Redis service to compose.yml
- [ ] Integrate Redis caching in server/
- [ ] docker compose up → measure speed
- [ ] kompose convert and kubectl apply 
- [ ] Create Terraform root module for S3 + EKS
- [ ] Move k8s manifests into Terraform kubernetes_manifest resources