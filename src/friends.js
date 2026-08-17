const EARS = {
  bunny: (c, inner) => `<ellipse cx="22" cy="10" rx="7" ry="18" fill="${c}"/><ellipse cx="58" cy="10" rx="7" ry="18" fill="${c}"/><ellipse cx="22" cy="12" rx="3" ry="12" fill="${inner}"/><ellipse cx="58" cy="12" rx="3" ry="12" fill="${inner}"/>`,
  cat: c => `<path d="M14 30 24 6 34 26Z" fill="${c}"/><path d="M46 26 56 6 66 30Z" fill="${c}"/>`,
  bear: (c, inner) => `<circle cx="20" cy="20" r="11" fill="${c}"/><circle cx="60" cy="20" r="11" fill="${c}"/><circle cx="20" cy="20" r="5" fill="${inner}"/><circle cx="60" cy="20" r="5" fill="${inner}"/>`,
  fox: c => `<path d="M10 32 24 6 34 28Z" fill="${c}"/><path d="M46 28 56 6 70 32Z" fill="${c}"/><path d="M18 24 24 12 28 24Z" fill="#fff"/><path d="M52 24 56 12 62 24Z" fill="#fff"/>`,
  horn: c => `<path d="M40 4 45 28 35 28Z" fill="#fde68a"/><ellipse cx="22" cy="18" rx="10" ry="12" fill="${c}"/><ellipse cx="58" cy="18" rx="10" ry="12" fill="${c}"/>`,
  round: c => `<ellipse cx="22" cy="18" rx="10" ry="12" fill="${c}"/><ellipse cx="58" cy="18" rx="10" ry="12" fill="${c}"/>`,
  chick: c => `<path d="M40 8 46 22 34 22Z" fill="#fbbf24"/><ellipse cx="22" cy="22" rx="8" ry="9" fill="${c}"/><ellipse cx="58" cy="22" rx="8" ry="9" fill="${c}"/>`,
  floppy: (c, inner) => `<ellipse cx="16" cy="28" rx="12" ry="8" fill="${c}" transform="rotate(-28 16 28)"/><ellipse cx="64" cy="28" rx="12" ry="8" fill="${c}" transform="rotate(28 64 28)"/><ellipse cx="16" cy="28" rx="6" ry="4" fill="${inner}" transform="rotate(-28 16 28)"/>`
};

const PROPS = {
  book: `<g transform="translate(46 58)"><rect width="24" height="18" rx="2" fill="#fff" stroke="#9d174d" stroke-width="1.4"/><path d="M12 0v18" stroke="#f9a8d4" stroke-width="1.2"/><rect x="3" y="4" width="7" height="2" rx="1" fill="#f9a8d4"/><rect x="14" y="4" width="7" height="2" rx="1" fill="#f9a8d4"/><rect x="3" y="8" width="6" height="2" rx="1" fill="#fda4af"/></g>`,
  ball: `<circle cx="64" cy="74" r="9" fill="#7dd3fc"/><path d="M55 74h18M64 65v18M58 68q6 6 12 0M58 80q6-6 12 0" fill="none" stroke="#fff" stroke-width="1.2"/>`,
  flower: `<g transform="translate(8 60)"><circle cx="10" cy="10" r="5" fill="#fbbf24"/><circle cx="10" cy="2" r="5" fill="#fb7185"/><circle cx="18" cy="10" r="5" fill="#f472b6"/><circle cx="10" cy="18" r="5" fill="#c4b5fd"/><circle cx="2" cy="10" r="5" fill="#86efac"/></g>`,
  glasses: `<g fill="none" stroke="#4a1942" stroke-width="1.6"><circle cx="31" cy="46" r="7.5"/><circle cx="49" cy="46" r="7.5"/><path d="M38.5 46h3"/></g>`,
  bow: `<g transform="translate(28 8)"><path d="M0 10 12 4 12 16Z" fill="#fb7185"/><path d="M24 10 12 4 12 16Z" fill="#f472b6"/><circle cx="12" cy="10" r="3.2" fill="#be185d"/></g>`,
  heart: `<path d="M64 68c0-6 8-9 8-2 0 8-8 12-8 12s-8-4-8-12c0-7 8-4 8 2z" fill="#e11d48"/>`,
  pencil: `<g transform="translate(58 52) rotate(28)"><rect width="6" height="22" rx="1" fill="#fbbf24"/><path d="M0 22 3 28 6 22Z" fill="#fdba74"/><rect y="-3" width="6" height="5" rx="1" fill="#fb7185"/></g>`,
  yarn: `<g transform="translate(54 62)"><circle cx="10" cy="10" r="10" fill="#f9a8d4"/><path d="M2 8q8 4 16 0M3 13q8 4 15-1M6 5q6 10 10 14" fill="none" stroke="#be185d" stroke-width="1.2"/></g>`,
  star: `<path d="M64 58 67 66 76 67 69 73 71 82 64 77 57 82 59 73 52 67 61 66Z" fill="#fde047"/>`,
  tea: `<g transform="translate(54 58)"><rect x="2" y="6" width="16" height="14" rx="3" fill="#fff" stroke="#9d174d"/><path d="M18 10q8 0 8 6 0 6-8 6" fill="none" stroke="#9d174d" stroke-width="1.6"/><ellipse cx="10" cy="6" rx="7" ry="3" fill="#fda4af"/></g>`,
  none: ""
};

function puppet({ fill, belly = "#fff7fb", inner = "#fecdd3", ear = "round", prop = "none", snout = false }) {
  const earFn = EARS[ear] || EARS.round;
  const ears = earFn.length > 1 ? earFn(fill, inner) : earFn(fill);
  const restMouth = snout
    ? `<ellipse cx="40" cy="56" rx="6" ry="4" fill="${inner}"/><circle cx="40" cy="55" r="1.6" fill="#3f1726"/><path d="M36 60q4 3 8 0" fill="none" stroke="#3f1726" stroke-width="1.4" stroke-linecap="round"/>`
    : `<path d="M36 58q4 4.5 8 0" fill="none" stroke="#3f1726" stroke-width="1.7" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 88" aria-hidden="true">${ears}
    <ellipse cx="40" cy="50" rx="26" ry="28" fill="${fill}"/>
    <ellipse cx="40" cy="58" rx="16" ry="14" fill="${belly}"/>
    <g class="face-rest">
      <circle cx="31" cy="46" r="6.2" fill="#fff"/><circle cx="49" cy="46" r="6.2" fill="#fff"/>
      <circle cx="33" cy="47.2" r="2.7" fill="#3f1726"/><circle cx="51" cy="47.2" r="2.7" fill="#3f1726"/>
      <ellipse cx="24" cy="54" rx="4.2" ry="2.3" fill="#fb7185" opacity=".55"/><ellipse cx="56" cy="54" rx="4.2" ry="2.3" fill="#fb7185" opacity=".55"/>
      ${restMouth}
    </g>
    <g class="face-happy">
      <path d="M25 45q6 7 12 0" fill="none" stroke="#3f1726" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M43 45q6 7 12 0" fill="none" stroke="#3f1726" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="22" cy="55" rx="5.2" ry="3" fill="#fb7185" opacity=".9"/><ellipse cx="58" cy="55" rx="5.2" ry="3" fill="#fb7185" opacity=".9"/>
      <path d="M27 58q13 14 26 0" fill="none" stroke="#3f1726" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M32 61q8 8 16 0" fill="#ff8fab" opacity=".45"/>
    </g>
    <g class="face-wink">
      <circle cx="31" cy="46" r="6.2" fill="#fff"/><circle cx="33" cy="47.2" r="2.7" fill="#3f1726"/>
      <path d="M43 45q6 7 12 0" fill="none" stroke="#3f1726" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M28 58q12 10 24 0" fill="none" stroke="#3f1726" stroke-width="2" stroke-linecap="round"/>
    </g>
    <g class="face-wow">
      <circle cx="31" cy="46" r="7" fill="#fff"/><circle cx="49" cy="46" r="7" fill="#fff"/>
      <circle cx="31" cy="47" r="3.2" fill="#3f1726"/><circle cx="49" cy="47" r="3.2" fill="#3f1726"/>
      <ellipse cx="40" cy="62" rx="5" ry="6" fill="none" stroke="#3f1726" stroke-width="2"/>
    </g>
    <g class="face-sleep">
      <path d="M25 46q6 4 12 0" fill="none" stroke="#3f1726" stroke-width="2" stroke-linecap="round"/>
      <path d="M43 46q6 4 12 0" fill="none" stroke="#3f1726" stroke-width="2" stroke-linecap="round"/>
      <path d="M34 60q6 4 12 0" fill="none" stroke="#3f1726" stroke-width="1.6" stroke-linecap="round"/>
    </g>
    <g class="face-tongue">
      <path d="M25 45q6 7 12 0" fill="none" stroke="#3f1726" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M43 45q6 7 12 0" fill="none" stroke="#3f1726" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M28 57q12 12 24 0" fill="none" stroke="#3f1726" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="40" cy="66" rx="4.5" ry="5.5" fill="#fb7185"/>
    </g>
    ${PROPS[prop] || ""}</svg>`;
}

function butterfly(a, b) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" aria-hidden="true">
    <ellipse cx="26" cy="30" rx="16" ry="20" fill="${a}"/><ellipse cx="54" cy="30" rx="16" ry="20" fill="${b}"/>
    <ellipse cx="28" cy="52" rx="12" ry="13" fill="${a}" opacity=".85"/><ellipse cx="52" cy="52" rx="12" ry="13" fill="${b}" opacity=".85"/>
    <rect x="38" y="22" width="4" height="40" rx="2" fill="#4a1942"/><circle cx="40" cy="20" r="4" fill="#4a1942"/>
    <path d="M40 20q-10-12-16-8M40 20q10-12 16-8" fill="none" stroke="#4a1942" stroke-width="1.4"/></svg>`;
}

function rainbow() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 56" aria-hidden="true">
    <path d="M8 52a40 40 0 0 1 80 0" fill="none" stroke="#fb7185" stroke-width="7" stroke-linecap="round"/>
    <path d="M15 52a33 33 0 0 1 66 0" fill="none" stroke="#fbbf24" stroke-width="7" stroke-linecap="round"/>
    <path d="M22 52a26 26 0 0 1 52 0" fill="none" stroke="#86efac" stroke-width="7" stroke-linecap="round"/>
    <path d="M29 52a19 19 0 0 1 38 0" fill="none" stroke="#7dd3fc" stroke-width="7" stroke-linecap="round"/>
    <circle cx="14" cy="44" r="7" fill="#fff"/><circle cx="22" cy="40" r="9" fill="#fff"/><circle cx="82" cy="44" r="7" fill="#fff"/><circle cx="74" cy="40" r="9" fill="#fff"/></svg>`;
}

function cloudHeart() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 56" aria-hidden="true">
    <ellipse cx="28" cy="34" rx="18" ry="12" fill="#fff"/><ellipse cx="50" cy="34" rx="20" ry="14" fill="#fff"/><ellipse cx="40" cy="24" rx="14" ry="12" fill="#fff"/>
    <path d="M38 22c0-4 6-6 6-1 0 6-6 9-6 9s-6-3-6-9c0-5 6-3 6 1z" fill="#fb7185"/></svg>`;
}

const CAST = [
  puppet({ fill: "#fb7185", ear: "bunny", prop: "book" }),
  puppet({ fill: "#f472b6", ear: "cat", prop: "yarn", snout: true }),
  puppet({ fill: "#fdba74", ear: "floppy", inner: "#fed7aa", prop: "ball" }),
  puppet({ fill: "#fb923c", ear: "fox", prop: "flower" }),
  puppet({ fill: "#c4b5fd", ear: "bear", inner: "#e9d5ff", prop: "tea" }),
  puppet({ fill: "#a8a29e", belly: "#f5f5f4", ear: "round", prop: "glasses" }),
  puppet({ fill: "#fde047", ear: "chick", prop: "flower" }),
  puppet({ fill: "#f9a8d4", ear: "horn", prop: "star" }),
  puppet({ fill: "#fb7185", ear: "round", prop: "bow" }),
  puppet({ fill: "#7dd3fc", ear: "round", prop: "book", belly: "#e0f2fe" }),
  puppet({ fill: "#86efac", ear: "bunny", inner: "#bbf7d0", prop: "pencil" }),
  puppet({ fill: "#fca5a5", ear: "cat", prop: "heart", snout: true }),
  puppet({ fill: "#fda4af", ear: "bear", prop: "book" }),
  puppet({ fill: "#d8b4fe", ear: "horn", prop: "bow" }),
  puppet({ fill: "#67e8f9", ear: "round", prop: "ball", belly: "#cffafe" }),
  puppet({ fill: "#fcd34d", ear: "chick", prop: "glasses" }),
  puppet({ fill: "#f9a8d4", ear: "bunny", prop: "tea" }),
  puppet({ fill: "#fdba74", ear: "fox", prop: "book" }),
  puppet({ fill: "#a7f3d0", ear: "bear", inner: "#d1fae5", prop: "flower" }),
  puppet({ fill: "#fecdd3", ear: "floppy", prop: "yarn" }),
  puppet({ fill: "#e879f9", ear: "cat", prop: "star" }),
  puppet({ fill: "#fb7185", ear: "horn", prop: "heart" }),
  puppet({ fill: "#93c5fd", ear: "round", prop: "pencil", belly: "#dbeafe" }),
  puppet({ fill: "#fbcfe8", ear: "bunny", prop: "glasses" }),
  puppet({ fill: "#fcd34d", ear: "bear", inner: "#fef08a", prop: "ball" }),
  puppet({ fill: "#c4b5fd", ear: "floppy", inner: "#ddd6fe", prop: "book" }),
  puppet({ fill: "#fb7185", ear: "fox", prop: "tea" }),
  puppet({ fill: "#6ee7b7", ear: "cat", prop: "flower" }),
  puppet({ fill: "#f472b6", ear: "round", prop: "yarn" }),
  puppet({ fill: "#fdba74", ear: "chick", prop: "heart" }),
  puppet({ fill: "#a5b4fc", ear: "bear", inner: "#c7d2fe", prop: "star" }),
  puppet({ fill: "#f9a8d4", ear: "horn", prop: "pencil" }),
  puppet({ fill: "#7dd3fc", ear: "bunny", inner: "#bae6fd", prop: "bow" }),
  puppet({ fill: "#fca5a5", ear: "floppy", prop: "tea" }),
  puppet({ fill: "#d8b4fe", ear: "cat", prop: "book" }),
  puppet({ fill: "#86efac", ear: "fox", prop: "ball" }),
  puppet({ fill: "#fb7185", ear: "bear", prop: "glasses" }),
  puppet({ fill: "#fde68a", ear: "round", prop: "flower" }),
  puppet({ fill: "#f472b6", ear: "bunny", prop: "star" }),
  puppet({ fill: "#67e8f9", ear: "horn", prop: "tea" })
];

const FLUTTERS = [
  butterfly("#fb7185", "#f9a8d4"),
  butterfly("#c4b5fd", "#fde68a"),
  butterfly("#7dd3fc", "#86efac"),
  butterfly("#fdba74", "#fb7185"),
  butterfly("#f472b6", "#a5b4fc"),
  butterfly("#86efac", "#f9a8d4"),
  butterfly("#fde047", "#fb7185"),
  butterfly("#67e8f9", "#c4b5fd")
];

const MOTIONS = ["friend-bob", "friend-sway", "friend-read", "friend-wiggle"];

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function uniqueFrom(list, seed, count) {
  const out = [];
  const used = new Set();
  for (let i = 0; out.length < count && i < list.length * 4; i++) {
    const idx = (seed + i * 19 + i * i * 7) % list.length;
    if (!used.has(idx)) { used.add(idx); out.push({ html: list[idx], idx }); }
  }
  return out;
}

function slot(html, cls, style, smile = false) {
  const tag = smile ? "button" : "div";
  const extra = smile ? ` type="button" class="friend friend-hit ${cls}" aria-label="Mascotte, clique pour une animation"` : ` class="friend ${cls}"`;
  return `<${tag}${extra} style="${style}">${html}</${tag}>`;
}

const FACES = { happy: "is-happy", wink: "is-wink", wow: "is-wow", sleep: "is-sleep", tongue: "is-tongue" };
const FACE_CLASSES = Object.values(FACES);
const REACTIONS = [
  { id: "smile", face: "happy", burst: "♥", particles: ["♥", "💕"], ms: 1500 },
  { id: "kiss", face: "happy", burst: "💋", particles: ["♥", "💕", "♥"], ms: 1400 },
  { id: "wink", face: "wink", burst: "😉", ms: 900 },
  { id: "tongue", face: "tongue", burst: "😛", ms: 1000 },
  { id: "surprise", face: "wow", burst: "❗", ms: 800 },
  { id: "yawn", face: "sleep", burst: "💤", ms: 1400 },
  { id: "jump", face: "happy", burst: "✦", ms: 900 },
  { id: "hop", face: "happy", burst: "⬆", ms: 1000 },
  { id: "bounce", face: "happy", burst: "•", ms: 900 },
  { id: "spin", face: "wow", burst: "🌟", ms: 1000 },
  { id: "flip", face: "wow", burst: "✨", ms: 1100 },
  { id: "cartwheel", face: "wow", burst: "★", ms: 1200 },
  { id: "roll", face: "sleep", burst: "🌀", ms: 1100 },
  { id: "tada", face: "happy", burst: "🎉", particles: ["✦", "★", "✧"], ms: 1200 },
  { id: "shake", face: "wow", burst: "!", ms: 800 },
  { id: "wobble", face: "tongue", burst: "☺", ms: 1000 },
  { id: "jello", face: "happy", burst: "◆", ms: 1100 },
  { id: "rubber", face: "wow", burst: "◎", ms: 1000 },
  { id: "pulse", face: "happy", burst: "💗", ms: 900 },
  { id: "heartbeat", face: "happy", burst: "💓", ms: 1000 },
  { id: "swing", face: "happy", burst: "♪", ms: 1100 },
  { id: "wave", face: "wink", burst: "✿", ms: 1200 },
  { id: "nod", face: "happy", burst: "✔", ms: 900 },
  { id: "nope", face: "wow", burst: "✕", ms: 800 },
  { id: "giggle", face: "tongue", burst: "😄", ms: 900 },
  { id: "dance", face: "happy", burst: "🎵", particles: ["♪", "♫", "♬"], ms: 1400 },
  { id: "inflate", face: "wow", burst: "🎈", ms: 1000 },
  { id: "pop", face: "happy", burst: "💥", ms: 800 },
  { id: "spring", face: "happy", burst: "✿", ms: 1000 },
  { id: "float", face: "sleep", burst: "☁", ms: 1400 },
  { id: "drop", face: "wow", burst: "⬇", ms: 900 },
  { id: "zigzag", face: "wink", burst: "⚡", ms: 1000 },
  { id: "moonwalk", face: "wink", burst: "🌙", ms: 1200 },
  { id: "fly", face: "happy", burst: "🦋", ms: 1200 },
  { id: "twist", face: "tongue", burst: "🎀", ms: 1000 },
  { id: "teeter", face: "wow", burst: "•", ms: 1100 },
  { id: "peek", face: "wink", burst: "✦", ms: 1000 },
  { id: "sparkle", face: "happy", burst: "✨", particles: ["✦", "✧", "★", "✩"], ms: 1300 },
  { id: "bloom", face: "happy", burst: "🌸", particles: ["✿", "❀", "❁"], ms: 1400 },
  { id: "rainbow", face: "happy", burst: "🌈", particles: ["❤", "💛", "💚", "💙"], ms: 1400 },
  { id: "stars", face: "wow", burst: "⭐", particles: ["★", "☆", "✮"], ms: 1300 },
  { id: "notes", face: "happy", burst: "🎶", particles: ["♪", "♫", "♩"], ms: 1300 },
  { id: "confetti", face: "happy", burst: "🎊", particles: ["◆", "●", "▲", "■"], ms: 1400 },
  { id: "snow", face: "happy", burst: "❄", particles: ["❄", "❅", "❆"], ms: 1400 },
  { id: "magic", face: "wink", burst: "✦", particles: ["✦", "✧", "✨"], ms: 1400 },
  { id: "bow", face: "happy", burst: "🎀", ms: 1000 },
  { id: "dizzy", face: "wow", burst: "💫", particles: ["★", "☆", "✦"], ms: 1300 },
  { id: "shrink", face: "wow", burst: "◎", ms: 900 }
];

const recentReactions = [];
function pickReaction() {
  let r, n = 0;
  do {
    r = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
    n++;
  } while (recentReactions.includes(r.id) && n < 20);
  recentReactions.push(r.id);
  if (recentReactions.length > 10) recentReactions.shift();
  return r;
}

function playReaction(hit) {
  const r = pickReaction();
  hit.classList.remove("is-reacting", ...FACE_CLASSES);
  hit.removeAttribute("data-react");
  hit.querySelectorAll(".react-particle").forEach(node => node.remove());
  void hit.offsetWidth;
  hit.dataset.react = r.id;
  hit.style.setProperty("--burst", `"${r.burst}"`);
  hit.classList.add("is-reacting");
  if (r.face && FACES[r.face]) hit.classList.add(FACES[r.face]);
  (r.particles || []).forEach((glyph, i) => {
    const span = document.createElement("span");
    span.className = "react-particle";
    span.textContent = glyph;
    const angle = (i / Math.max((r.particles || []).length, 1)) * Math.PI * 2 - Math.PI / 2;
    span.style.setProperty("--dx", `${Math.round(Math.cos(angle) * 44)}px`);
    span.style.setProperty("--dy", `${Math.round(Math.sin(angle) * 36 - 8)}px`);
    span.style.setProperty("--delay", `${i * 40}ms`);
    hit.appendChild(span);
  });
  clearTimeout(hit._reactTimer);
  hit._reactTimer = setTimeout(() => {
    hit.classList.remove("is-reacting", ...FACE_CLASSES);
    hit.removeAttribute("data-react");
    hit.querySelectorAll(".react-particle").forEach(node => node.remove());
  }, r.ms);
}

function viewKey() {
  const h1 = document.querySelector("#app h1")?.textContent || "";
  return `${location.hash}|${h1}|${document.querySelector("#app .eyebrow")?.textContent || ""}`;
}

function paint() {
  const dock = document.getElementById("friends-dock");
  const left = document.getElementById("friends-gutter-l");
  const right = document.getElementById("friends-gutter-r");
  const bar = document.getElementById("friends-bar");
  const pins = document.getElementById("friends-pins");
  if (!dock || !left || !right || !bar || !pins) return;
  const seed = hashStr(viewKey());
  const mascots = uniqueFrom(CAST, seed, 8);
  const flies = uniqueFrom(FLUTTERS, seed + 91, 4);
  const m = i => MOTIONS[(seed + i) % MOTIONS.length];
  const delay = i => `${((seed >> (i % 8)) % 12) / 10}s`;

  bar.innerHTML = [
    slot(mascots[0].html, `${m(0)} friend-inline`, `animation-delay:${delay(0)}`, true),
    slot(mascots[1].html, `${m(1)} friend-inline`, `animation-delay:${delay(1)}`, true)
  ].join("");

  dock.innerHTML = [
    slot(mascots[2].html, m(2), `left:10px;bottom:4px;animation-delay:${delay(2)}`, true),
    slot(mascots[3].html, m(3), `right:10px;bottom:4px;animation-delay:${delay(3)}`, true)
  ].join("");

  pins.innerHTML = [
    slot(mascots[4].html, m(4), `top:76px;left:8px;animation-delay:${delay(4)}`, true),
    slot(mascots[5].html, m(5), `top:76px;right:8px;animation-delay:${delay(5)}`, true)
  ].join("");

  left.innerHTML = [
    slot(cloudHeart(), "friend-cloud", "top:8%;left:12%;width:72px;height:44px"),
    slot(flies[0].html, "friend-fly", `top:22%;left:18%;width:56px;animation-delay:${delay(4)}`),
    slot(flies[1].html, "friend-fly-alt", `top:58%;left:22%;width:48px;animation-delay:${delay(6)}`)
  ].join("");

  right.innerHTML = [
    slot(rainbow(), "friend-rainbow", "top:6%;right:6%;width:88px"),
    slot(flies[2].html, "friend-fly", `top:40%;right:10%;width:52px;animation-delay:${delay(2)}`),
    slot(flies[3].html, "friend-fly-alt", `bottom:18%;right:16%;width:44px;animation-delay:${delay(1)}`)
  ].join("");
}

export function startFriends() {
  if (document.getElementById("friends-root")) return;
  const header = document.querySelector(".topbar");
  const actions = document.querySelector(".header-actions");
  const bar = document.createElement("div");
  bar.id = "friends-bar";
  if (header && actions) header.insertBefore(bar, actions);
  else document.body.appendChild(bar);

  const root = document.createElement("div");
  root.id = "friends-root";
  root.innerHTML = `<div id="friends-pins"></div><div id="friends-gutter-l" class="friends-gutter"></div><div id="friends-gutter-r" class="friends-gutter"></div><div id="friends-dock"></div>`;
  document.body.appendChild(root);
  document.body.classList.add("has-friends");
  paint();
  document.addEventListener("click", event => {
    const hit = event.target.closest(".friend-hit");
    if (!hit) return;
    event.preventDefault();
    playReaction(hit);
  });
  const app = document.querySelector("#app");
  let t = 0;
  const schedule = () => {
    clearTimeout(t);
    t = setTimeout(paint, 40);
  };
  if (app) new MutationObserver(schedule).observe(app, { childList: true });
  window.addEventListener("hashchange", schedule);
}
