# Petal & Page

A botanical, moonlit book tracker. React 19 + TypeScript + Tailwind v4 + Vite, with ESLint.

## Features

- Three shelves: **Currently Reading**, **Want to Read**, **Read** (plus an All view)
- Move books with the card dropdown, the shelf picker in the book detail view, or drag a card onto a shelf tab
- Five-blossom rating
- Reflections (comments) per book: add, edit, delete, timestamped
- Started / finished dates, auto-filled when you move a book
- Search Open Library to add books with covers, or add by hand
- Stats: read this year, total read, average rating, pages turned
- Data saved in `localStorage`, with Export / Import JSON backup

## Develop

```bash
yarn
yarn dev
yarn lint
yarn build
```

## Deploy to GitHub Pages

1. Push this project to a GitHub repo on the `main` branch.
2. In the repo, go to **Settings > Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml` (install, lint, build, deploy).

`vite.config.ts` uses `base: './'`, so it works at `https://<user>.github.io/<repo>/` with no changes.

## Notes

- Data is per browser. Use **Export backup** to move between devices or keep a copy.
- Theme tokens (colors, fonts) live in the `@theme` block in `src/index.css`.
