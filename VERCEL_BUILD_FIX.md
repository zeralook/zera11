# Vercel build fix

- The browser entry now uses a relative Vite module path (`./src/main.jsx`).
- Vercel Node runtime is explicitly included for the API function.
- `/api/*` is kept ahead of the SPA fallback.

If Vercel still shows the old build error, trigger a new deployment from the latest commit/version.
