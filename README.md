# QA E2E Test Suite — evo.dev.theysaid.io

Playwright TypeScript end-to-end tests for the [TheySaid Evo](https://evo.dev.theysaid.io/) AI survey platform.

---

## Session Recording

[Google Drive — Manual Exploration Recording](https://drive.google.com/your-link-here)

> Replace the URL above with the actual Google Drive link before submission.

---

## Flows Covered

| Worker | Spec | Flow |
|--------|------|------|
| 1 | `tests/auth/login.spec.ts` | Login page loads, session redirect, sign-up link |
| 2 | `tests/projects/create-project.spec.ts` | Create AI Survey via Teach AI wizard |
| 3 | `tests/teach-ai/upload-document.spec.ts` | Upload .txt via Teach AI dropzone |
| 4 | `tests/publish/publish-survey.spec.ts` | Publish project + take survey as respondent |

---

## Prerequisites

- Node.js 18+
- A TheySaid Evo account (register at [evo.dev.theysaid.io](https://evo.dev.theysaid.io/))

---

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Configure your email
cp .env.example .env
# Edit .env and set TEST_EMAIL=your@email.com

# Run the one-time interactive auth setup (opens a browser)
npm run test:setup
# → Check your email, enter the OTP code in the browser
# → Session is saved to playwright/.auth/user.json
```

The saved session is reused by all 4 test workers — you only need to run the setup once per session expiry.

---

## Run Tests

```bash
# Run all tests (4 parallel workers)
npm test

# Run with headed browser (visible)
npm run test:headed

# Open the HTML report after a run
npm run show-report
```

---

## Project Structure

```
qa-evo-tests/
├── playwright.config.ts          # workers: 4, storageState strategy
├── tests/
│   ├── auth/
│   │   ├── auth.setup.ts         # one-time OTP login → saves user.json
│   │   └── login.spec.ts         # login page assertions
│   ├── projects/
│   │   └── create-project.spec.ts
│   ├── teach-ai/
│   │   └── upload-document.spec.ts
│   └── publish/
│       └── publish-survey.spec.ts
├── pages/                        # Page Object Model
│   ├── LoginPage.ts
│   ├── ProjectsPage.ts
│   ├── TeachAIPage.ts
│   ├── CreatePage.ts
│   └── PublishPage.ts
└── fixtures/
    └── test-document.txt         # upload fixture
```

---

## Auth Strategy

TheySaid Evo uses **WorkOS AuthKit** with email OTP — full OTP automation is out of scope. The `setup` Playwright project (`auth.setup.ts`) performs the one-time interactive login and saves browser `storageState` to `playwright/.auth/user.json`. All 4 test workers load that state at startup, so no test has to re-authenticate.

The `playwright/.auth/` directory is gitignored; the directory stub is tracked via `.gitkeep`.

---

## Bug Report

### BUG-001 — Text overlap in Teach AI modal after file upload

| Field | Detail |
|-------|--------|
| **Severity** | Minor / Cosmetic |
| **Environment** | Chrome, evo.dev.theysaid.io (2026-06-16) |
| **Flow** | Create Project → Teach AI modal → Attach file |

**Steps to reproduce:**
1. Click "+ Add project" on the Projects page.
2. In the Teach AI modal, click "Attach file".
3. Upload any file (e.g., a .txt file).

**Expected:** File card appears cleanly below the dropzone with the filename and size.

**Actual:** A small text element visually overlaps the file card content — text from the "Drop or Browse to add file" label or a nearby element bleeds into the file card area.

**Impact:** Visual glitch only; upload functionality is unaffected. No data loss or broken flow.
