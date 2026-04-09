# Prepora
 
**Personal crisis preparedness tool — plan ahead, protect your family.**
 
![Angular](https://img.shields.io/badge/Angular_21-DD0031?style=flat&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat&logo=pwa&logoColor=white)
![AES-256](https://img.shields.io/badge/AES--256_encryption-2E7D32?style=flat&logo=letsencrypt&logoColor=white)
 
🌐 **Live:** [prepora.ru](https://prepora.ru) //temporary unavailable

:gear: **APP:** [anderskaev.ru/prepora](https://anderskaev.ru/prepora)
 
---
 
## What is Prepora?
 
Prepora helps individuals and families prepare for life crises before they happen — job loss, account freezing, losing a breadwinner, criminal prosecution, debt, and more.
 
The app provides structured preparation scenarios, a secure local document vault, and reminders to keep the plan up to date. Think of it as a personal emergency protocol, not a generic checklist.
 
**13 built-in scenarios** covering the most common crisis types, plus the ability to build custom ones from scratch.
 
---
 
## Key features
 
- **Scenario-based preparation** — structured templates for each crisis type, adaptable to personal situations
- **Encrypted local vault** — store documents, contacts, and account access info; everything is encrypted on the device before any sync
- **Offline-first** — full functionality without internet (PWA with service worker)
- **Reminder system** — periodic prompts to review and update the plan
- **Knowledge base** — articles from lawyers and financial advisors, free for all tiers
- **Family access** — shared encrypted storage for the Family plan
 
---
 
## Privacy & security
 
Zero Knowledge architecture: all data is encrypted client-side with AES-256 before it reaches the server. The server stores only encrypted blobs — it is technically impossible to read user content without the user's key.
 
- Encryption key never leaves the device
- No ads, no tracking
- One-time payment — no subscriptions, no recurring access to user data
 
---
 
## Tech stack
 
| Layer | Technology |
|---|---|
| Frontend | Angular 21, TypeScript, SCSS |
| PWA | Angular Service Worker |
| CI/CD | GitHub Actions |
| Hosting | prepora.ru (temp unavailable) |
 
---
 
## Architecture notes
 
- Standalone Angular components throughout
- Client-side encryption before any server communication
- PWA with full offline support via service worker caching strategy
 
---
 
## Status
 
Version **1.0.1** — live and accepting early users. Active development.
 
---
 
## Contact
 
- 📧 [hello@prepora.ru](mailto:hello@prepora.ru)
- 💬 Telegram: [t.me/pp_crizis](https://t.me/pp_crizis)
