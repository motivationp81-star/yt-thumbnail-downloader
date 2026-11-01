"use strict";

// Sizes YouTube serves for every video: file name -> [label, width, height]
const SIZES = [
  ["maxresdefault", "HD (Full)", 1280, 720],
  ["sddefault", "HD (SD file)", 640, 480],
  ["hqdefault", "HQ", 480, 360],
  ["mqdefault", "Medium", 320, 180],
  ["default", "Small", 120, 90],
];

const input = document.getElementById("urlInput");
const goBtn = document.getElementById("goBtn");
const msg = document.getElementById("msg");
const results = document.getElementById("results");
const vidOut = document.getElementById("vidOut");
const cards = document.getElementById("cards");

function extractVideoId(text) {
  const t = (text || "").trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(t)) return t;
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /\/(?:shorts|live|embed|v)\/([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = t.match(re);
    if (m) return m[1];
  }
  return null;
}

function showMsg(text) {
  msg.textContent = text;
  msg.hidden = !text;
}

function thumbUrl(id, name) {
  return "https://i.ytimg.com/vi/" + id + "/" + name + ".jpg";
}

function makeCard(id, name, label, w, h) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.alt = label + " thumbnail";
  img.src = thumbUrl(id, name);

  const body = document.createElement("div");
  body.className = "body";
  const h3 = document.createElement("h3");
  h3.textContent = label;
  const dim = document.createElement("p");
  dim.className = "dim";
  dim.textContent = w + " × " + h + " px";
  const row = document.createElement("div");
  row.className = "row";
  const dl = document.createElement("button");
  dl.className = "btn";
  dl.type = "button";
  dl.textContent = "Download";
  dl.addEventListener("click", () => download(id, name));
  const copy = document.createElement("button");
  copy.className = "btn alt";
  copy.type = "button";
  copy.textContent = "Copy link";
  copy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(thumbUrl(id, name));
      copy.textContent = "Copied!";
      setTimeout(() => { copy.textContent = "Copy link"; }, 1400);
    } catch (e) {
      window.prompt("Copy the thumbnail link:", thumbUrl(id, name));
    }
  });
  row.appendChild(dl);
  row.appendChild(copy);
  body.appendChild(h3);
  body.appendChild(dim);
  body.appendChild(row);

  // YouTube answers missing big sizes with a tiny 120x90 placeholder image.
  // Detect that and mark the card as unavailable instead of lying about it.
  img.addEventListener("load", () => {
    if ((name === "maxresdefault" || name === "sddefault") && img.naturalWidth <= 120) {
      body.innerHTML = "";
      body.appendChild(h3);
      body.appendChild(dim);
      const na = document.createElement("p");
      na.className = "na";
      na.textContent = "Not available for this video";
      body.appendChild(na);
      img.style.opacity = "0.35";
    }
  });
  img.addEventListener("error", () => {
    dim.textContent = "Could not load";
  });

  card.appendChild(img);
  card.appendChild(body);
  return card;
}

async function download(id, name) {
  const url = thumbUrl(id, name);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = id + "-" + name + ".jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  } catch (e) {
    window.open(url, "_blank");
  }
}

function run() {
  const id = extractVideoId(input.value);
  if (!id) {
    results.hidden = true;
    showMsg("That does not look like a YouTube link or video ID. Paste the full video link and try again.");
    return;
  }
  showMsg("");
  vidOut.textContent = id;
  cards.innerHTML = "";
  for (const [name, label, w, h] of SIZES) {
    cards.appendChild(makeCard(id, name, label, w, h));
  }
  results.hidden = false;
}

goBtn.addEventListener("click", run);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") run();
});
