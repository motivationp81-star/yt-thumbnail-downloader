# YT Thumbnail Downloader

Paste a YouTube video link and download its thumbnail in every size YouTube offers — HD (1280×720) down to small (120×90).

**Live demo:** https://motivationp81-star.github.io/yt-thumbnail-downloader/

## Features

- Works with any link style: `watch?v=`, `youtu.be`, Shorts, live, embed — or a bare video ID
- Shows all five sizes with previews: HD, SD, HQ, medium and small
- Honest “not available” marking when a video has no HD thumbnail (YouTube serves a tiny placeholder in that case — the tool detects it instead of pretending)
- One-click download, plus copy-the-image-link for each size
- No sign-up, no uploads, no tracking — everything runs locally in your browser

## How it works

Every YouTube thumbnail lives at a predictable public address (`i.ytimg.com/vi/<video-id>/<size>.jpg`). The tool extracts the video ID from your link, builds those addresses, and lets you save the ones you want.

Thumbnails belong to their respective video owners — please use them within YouTube's terms and copyright rules.

## Run it locally

Open `index.html` in a browser, or serve the folder with any static server.

## License

MIT — see [LICENSE](LICENSE).
