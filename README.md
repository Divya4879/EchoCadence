# EchoCadence

**Vocabulary learning that actually sticks.**

EchoCadence is a language learning web app built around spaced repetition — the scientifically proven method for long-term memory retention. Add vocabulary across multiple languages, learn with flashcards, and let the algorithm decide when to bring each word back.

🔗 **Live:** [echocadence.vercel.app](https://echocadence.vercel.app)

---

## What it does

You add vocabulary. EchoCadence turns it into flashcards and schedules reviews at the right intervals — not too soon, not too late — so what you learn today is still with you months from now.

---

## Features

### Languages & Vocabulary
- Track up to **5 languages** simultaneously
- Each language gets its own isolated workspace
- **7 built-in categories** per language: Words & Meanings, Synonyms, Antonyms, Phrases, Slangs & Meanings, Grammar Rules, Pronunciation
- Add up to **3 custom categories** with any two fields you define
- Full edit and delete support for all entries

### Flashcards
- **Learn mode** — new vocabulary you haven't seen yet
- **Revise mode** — cards due for review based on your spaced repetition schedule
- Flip animation, "Got it / Not quite" feedback
- Rate each card as Easy, Medium, or Hard — once, after your first correct answer
- Missed cards get a single retry pass at the end of the session, then scheduled for later

### Spaced Repetition
- Powered by the **SM-2 algorithm** (the same method behind Anki)
- Every card has its own review schedule — hard cards come back sooner, easy ones give you breathing room
- Customizable review intervals: same-day, end-of-day, weekly, monthly
- First-attempt correct answers tracked separately

### Progress
- See all your cards filtered by difficulty: Easy, Medium, Hard, Not rated
- Next review date shown per card
- First-attempt success highlighted
- Review schedule visible and editable

### Account
- Sign in with email/password or Google
- Username chosen on first login
- Profile picture pulled from Google if available
- Session persists across browser restarts

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | TimescaleDB (Tiger Cloud) |
| Auth | Auth0 |
| Deployment | Vercel |

The review log (`card_reviews`) is a **TimescaleDB hypertable** — time-partitioned for efficient querying at scale. A **continuous aggregate** (`daily_review_stats`) pre-computes daily review metrics per user.

---

## Built for Global Hack Week: Data

This project was built as part of [Global Hack Week: Data](https://ghw.mlh.io/) and completes two TimescaleDB challenges:

- ✅ **Set up a Tiger Cloud service and create your first Hypertable** — `card_reviews` table is a hypertable partitioned by time
- ✅ **Accelerate Dashboards with Continuous Aggregates** — `daily_review_stats` CAGG pre-computes hourly/daily review totals

---

## License

MIT
