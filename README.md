# QA E2E Test Suite — evo.dev.theysaid.io

Playwright TypeScript end-to-end tests for the [TheySaid Evo](https://evo.dev.theysaid.io/) AI survey platform.

---

## Session Recording

[Google Drive — Manual Exploration Recording](https://drive.google.com/file/d/1fYekKIgbpULeBUUh4u_kG-mYY9u8dSpT/view?usp=drive_link)

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

---

### BUG-002 — Settings, Analytics and All Responses tabs disabled on newly created project

| Field | Detail |
|-------|--------|
| **Severity** | Medium / Functional |
| **Environment** | Chrome, evo.dev.theysaid.io (2026-06-16) |
| **Flow** | Create Project → Project editor |

**Steps to reproduce:**
1. Click "+ Add project" and complete the Create wizard.
2. Observe the tab bar in the project editor that appears at `/projects/new?project-type=Form&tab=form`.

**Expected:** All tabs (Questions, Settings, Analytics, All Responses) are accessible immediately after project creation.

**Actual:** Settings, Analytics, and All Responses tabs are rendered with `disabled` attribute and are unclickable indefinitely. The project URL remains `/projects/new` — a persistent unsaved state. Users must navigate back to the projects list and re-open the project to get a real UUID URL where tabs become functional.

**Impact:** Medium — new users cannot configure settings or publish directly after creating a project. They must discover the workaround of returning to the list first.

---

### BUG-003 — New project auto-generated title includes raw timestamp

| Field | Detail |
|-------|--------|
| **Severity** | Minor / UX |
| **Environment** | Chrome, evo.dev.theysaid.io (2026-06-16) |
| **Flow** | Create Project → Project editor |

**Steps to reproduce:**
1. Create any new project via the wizard.
2. Observe the project title in the editor header and in the projects list.

**Expected:** Project title defaults to a clean placeholder like "Untitled AI Survey" or prompts the user to name it.

**Actual:** Title is auto-generated with a raw numeric timestamp suffix (e.g., "Untitled AI Survey 0616202636129"), making projects hard to distinguish in the list when multiple are created in the same session.

**Impact:** Minor UX — no data loss, but the projects list becomes cluttered and unreadable during any testing or multi-session use.

---

### BUG-004 — New project shows validation errors on an empty template question

| Field | Detail |
|-------|--------|
| **Severity** | Minor / UX |
| **Environment** | Chrome, evo.dev.theysaid.io (2026-06-16) |
| **Flow** | Create Project → Project editor → Questions tab |

**Steps to reproduce:**
1. Create a new AI Survey project.
2. Click Skip on the Draft project modal.
3. Observe the Questions tab.

**Expected:** A new project starts with a clean, error-free state or an empty canvas prompting the user to add their first question.

**Actual:** A pre-populated placeholder rating question is shown with two immediate validation errors: "Question is required" and "Endpoint labels need to be updated. Use 'Improve question' to generate them automatically." These errors appear on a question the user never created or edited.

**Impact:** Minor — confusing for new users who see an error state before taking any action. May erode trust in the product quality.

---

### BUG-005 — Survey URL truncated in Published modal with no visible full URL

| Field | Detail |
|-------|--------|
| **Severity** | Minor / UX |
| **Environment** | Chrome, evo.dev.theysaid.io (2026-06-16) |
| **Flow** | Publish project → Published modal |

**Steps to reproduce:**
1. Create and publish a project via the Settings tab.
2. Observe the "Copy and paste link" field in the published modal.

**Expected:** The full survey URL is visible and selectable so users can copy it manually if needed.

**Actual:** The URL is truncated with an ellipsis (e.g., `https://evo.dev.theysaid.io/survey/project/c03707d5-757d-4193-90e0-…`). The field does not appear to be a standard `<input>` — clicking or selecting the text to copy it manually is not straightforward. Users must rely solely on the "Copy link" button.

**Impact:** Minor UX — functionality works via "Copy link" button, but the URL is not human-readable or manually copyable from the modal.

---

### BUG-006 — Teach AI page displays "null" for Target customers field

| Field | Detail |
|-------|--------|
| **Severity** | Minor / Content |
| **Environment** | Chrome, evo.dev.theysaid.io (2026-06-16) |
| **Flow** | Project → Teach AI (sidebar) → Company summary panel |

**Steps to reproduce:**
1. Open any project and navigate to Teach AI via the left sidebar.
2. Observe the Company summary panel on the right side.

**Expected:** Empty or unpopulated fields show a placeholder (e.g., "—", "Not set") or are hidden entirely.

**Actual:** The "Target customers" field displays the raw string `null` — a leaked internal null value rendered directly in the UI.

**Impact:** Minor — cosmetic data display bug. Indicates missing null-guard in the rendering layer. No functional impact.
