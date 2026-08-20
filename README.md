# bibu

Three-page site: about me, an embedded Typeform, and a results page tailored
to each respondent. React + Vite static site, deployed on Netlify, backed by
Netlify Database (managed Postgres) and two Netlify functions.

## How it works

1. **Home** (`/`) — static bio page, edit [src/pages/Home.jsx](src/pages/Home.jsx).
2. **Quiz** (`/quiz`) — embeds your Typeform via `@typeform/embed-react`. On
   submit, the widget gives us the Typeform `responseId` and we redirect the
   visitor to `/results?rid=<responseId>`.
3. Typeform also fires a **webhook** to `/api/webhook` (a Netlify function,
   routed via [netlify.toml](netlify.toml)) with the full submission. That
   function computes the tailored result and upserts a row into the
   `responses` table, keyed by `response_id`.
4. **Results** (`/results`) — reads `rid` from the URL and calls
   `/api/result` (another Netlify function) to fetch that row, polling a few
   times in case the webhook hasn't landed yet.

The database connection string is never exposed to the browser — the client
only talks to `/api/result`, and both functions use `@netlify/database`,
which is auto-provisioned and auto-configured by Netlify.

## One-time setup

### 1. Netlify Database

Nothing to provision manually — the schema lives in
[netlify/database/migrations/0001_create_responses.sql](netlify/database/migrations/0001_create_responses.sql)
and Netlify automatically creates the database and applies it on your first
deploy (and on every deploy preview, against an isolated branch). See
[Netlify Database docs](https://docs.netlify.com/build/data-and-storage/netlify-database/)
for how branching and migrations work.

### 2. Typeform

- Note your form ID → `VITE_TYPEFORM_FORM_ID`.
- In the form's **Connect → Webhooks**, add an endpoint pointing to your
  deployed `https://<your-domain>/api/webhook` and enable it.

### 3. Tailoring logic

Edit `computeTailoredResult()` in
[netlify/functions/webhook.js](netlify/functions/webhook.js) — it receives a
flat `{ fieldRef: answer }` map built from the Typeform payload and returns
whatever shape you want rendered on the results page
([src/pages/Results.jsx](src/pages/Results.jsx)).

### 4. Environment variables

Copy `.env.example` to `.env` for local dev. `VITE_TYPEFORM_FORM_ID` is the
only variable you need to set — also add it in Netlify → Site configuration →
Environment variables for production. The database connection is handled
automatically by Netlify.

### 5. Deploy

```
npm install
npx netlify-cli deploy --build --prod
```

Or connect the repo in the Netlify dashboard for auto-deploys on push (it
picks up the build command and functions directory from
[netlify.toml](netlify.toml) automatically).

## Local development

```
npm run dev
```

Note: `/api/webhook` only runs under Netlify's runtime. Use `npx netlify-cli
dev` to run the site + function together locally; Typeform also needs a
public URL to send webhooks to, so testing the full loop generally requires
a deployed preview URL (or a tunnel like `netlify dev --live`).
