# SellXSell Revenue Diagnostic

React + TypeScript + Vite implementation of the SellXSell revenue diagnostic flow.

## What This App Does

- Hero screen
- 13-question diagnostic
- Email gate before results
- Weighted scoring across ICP, MEDDIC, and Internal Alignment
- Dynamic results states: green, yellow, red
- CTA section for booking a 30-minute pipeline pressure test

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS Modules
- EmailJS

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Environment Variables

Create a local `.env` from `.env.example`.

Required for email sending:

- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_USER_TEMPLATE_ID`
- `VITE_EMAILJS_OWNER_TEMPLATE_ID`

Optional CTA overrides:

- `VITE_PRIMARY_CTA_URL`

If EmailJS variables are missing, the app still works, but email sending is skipped.

## Deployment

This project can be deployed to Vercel.

- Build command: `npm run build`
- Output directory: `dist`

## Project Structure

```text
src/
  components/
    screens/
      HeroSection.tsx
      QuizSection.tsx
      GateSection.tsx
      ResultsSection.tsx
    ScoreRing.tsx
  data/
    diagnostic.ts
  lib/
    email.ts
    storage.ts
  App.tsx
```

## Notes

- The results flow is driven by the spec-defined question set and score thresholds.
- Session state is persisted in localStorage.
- `shelley@sellxsell.com` bypasses the gate automatically.
- The default primary CTA points to a Calendly placeholder until the final booking link is provided.
