# A Magical World for Shikha ❤️

A responsive, browser-only Bhai Dooj greeting made with React and Vite. No backend, paid API, or database is required.

## Run locally

Requires Node.js 20 or newer.

```powershell
npm ci
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). To verify the production bundle:

```powershell
npm run build
npm run preview
```

## Personalize it

- The six supplied photos are displayed in the gallery, with Bhai Tika photos featured on the opening banner and downloadable greeting card. Use the gallery filters to switch between portraits and Bhai Tika moments. Add more permanent photos to `public/images/memories/` and add their paths, titles, and captions in `src/data/memories.js`. Use **Add our photos** for temporary previews; browser-selected photos disappear when the page is refreshed.
- Edit the eight questions and answer choices in `src/data/quizQuestions.js`.
- Set the date you celebrate using the date picker in the countdown; the chosen date is saved in this browser.
- Record a voice message on the Voice Message section. Microphone permission is only requested after pressing **Record a message**; use **Save audio** to download a copy.
- Add Nepali songs in the playlist using audio files you own or have permission to play (MP3, M4A, OGG, WAV, and other browser-supported formats). Files selected in the browser stay in that session and are never uploaded. To bundle songs with a deployment, put properly licensed audio files in `public/audio/` and add their titles and filenames to `src/data/nepaliSongs.js`.
- The animation preference and quiz progress are saved in this browser. Uploaded gallery images, playlist songs, and voice recordings are not uploaded to a server.
- Photos selected with **Add our photos** are stored in this browser's IndexedDB and remain after refresh on this device. They are private to this browser profile and are not part of a deployment; copy photos to `public/images/memories/` and add them to `src/data/memories.js` to share them with site visitors.
- Choose English, Hindi, or Nepali from the language selector. The choice is remembered in this browser.
- The festival playlist can play, pause, skip, adjust volume, and repeat the playlist. Playback starts only after a visitor presses Play because browsers block automatic audio. Add permitted tracks locally, or bundle licensed tracks using `src/data/nepaliSongs.js`.
- The greeting card can be downloaded or shared as a PNG. On browsers without native file sharing, Share downloads the card instead.

## Free deployment

### Render

1. Push the project to a GitHub repository.
2. In Render, choose **New → Blueprint** and connect the repository containing `render.yaml`.
3. Review the static site settings and choose **Apply**. Render builds the site and publishes the `dist` directory.
4. When the deployment finishes, open the `*.onrender.com` URL shown in the Render dashboard.

### Vercel

1. Push the project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected Vite settings: build command `npm run build`, output directory `dist`.
4. Select **Deploy**. Vercel provides a public `*.vercel.app` URL; share that URL with Shikha.

### Netlify

1. Push the project to a GitHub repository and import it in Netlify, or build locally with `npm ci` and `npm run build`.
2. For a connected repository, set the build command to `npm run build` and publish directory to `dist`.
3. For a manual deploy, drag the generated `dist` folder into Netlify Drop.
4. Netlify displays a public `*.netlify.app` URL that you can share.

### GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages. The Vite base path is automatically set from the repository name for project pages.

1. Push the project to a GitHub repository on its `main` branch.
2. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
3. Open the **Actions** tab and allow the workflow to finish.
4. The Pages URL is shown in **Settings → Pages** (typically `https://OWNER.github.io/REPOSITORY/`). Share that URL.

For any host, share the deployed public URL. A local `localhost` address is only available on your own device.
