const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.static('public'));

const BASE_URL = 'https://www.desidubanime.me';
const data = {
  anime: [],
  genres: [],
  home: null,
  lastUpdated: null
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchHTML(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    return html;
  } catch (err) {
    console.error(`Error fetching ${url}: ${err.message}`);
    return null;
  }
}

function extractAnimeList(html) {
  const $ = cheerio.load(html);
  const items = [];
  $('.anime-item, .post-item, .movie-item, .anime-card, .entry-item').each((i, el) => {
    const link = $(el).find('a').first();
    const href = link.attr('href');
    if (!href) return;
    const title = link.text().trim() || $(el).find('.title').text().trim() || $(el).find('h2, h3, h4').text().trim();
    const img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
    const slug = href.replace(/^https?:\/\/[^\/]+/, '').replace(/\/$/, '').split('/').filter(Boolean).pop();
    if (slug && href.includes('/anime/')) {
      items.push({ slug, title, img, url: href });
    }
  });
  return items;
}

function extractAnimeDetail(html, slug) {
  const $ = cheerio.load(html);
  const title = $('h1.entry-title, .title, .anime-title').first().text().trim() || slug;
  const image = $('.post-thumbnail img, .anime-image img, .featured-image img').attr('src') || $('.entry-image img').attr('src') || '';
  const description = $('.entry-content p, .description, .anime-desc, .summary').first().text().trim() || '';
  const genres = [];
  $('.genre a, .genres a, .category a').each((i, el) => {
    const g = $(el).text().trim();
    if (g) genres.push(g);
  });
  const episodes = [];
  $('.episode-item, .episode-link, .episode-list a, .episodes a, .episode a').each((i, el) => {
    const epLink = $(el).attr('href');
    const epNum = $(el).text().trim() || $(el).find('.episode-number').text().trim() || i+1;
    if (epLink && epLink.includes('/episode/')) {
      episodes.push({ number: epNum, url: epLink });
    }
  });
  // also try to get episode from archive
  if (episodes.length === 0) {
    $('.entry-content a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('/episode/')) {
        const num = $(el).text().trim() || i+1;
        episodes.push({ number: num, url: href });
      }
    });
  }
  return { title, image, description, genres, episodes };
}

async function scrapeAll() {
  console.log('🚀 Starting full site scrape...');
  const homeHTML = await fetchHTML(BASE_URL);
  if (!homeHTML) {
    console.error('❌ Failed to fetch homepage');
    return;
  }
  data.home = homeHTML;
  const initialAnime = extractAnimeList(homeHTML);
  const allSlugs = new Set();
  const allAnime = [];
  // Also get from genre pages, pagination, etc.
  // We'll just crawl all links from homepage that point to /anime/
  const $home = cheerio.load(homeHTML);
  $home('a[href*="/anime/"]').each((i, el) => {
    const href = $home(el).attr('href');
    if (href && href.startsWith(BASE_URL + '/anime/') || href.startsWith('/anime/')) {
      const full = href.startsWith('http') ? href : BASE_URL + href;
      const slug = full.replace(/^https?:\/\/[^\/]+/, '').replace(/\/$/, '').split('/').filter(Boolean).pop();
      if (slug && !allSlugs.has(slug)) {
        allSlugs.add(slug);
        const title = $home(el).text().trim() || slug;
        const img = $home(el).find('img').attr('src') || '';
        allAnime.push({ slug, title, img, url: full });
      }
    }
  });
  // Also grab from genre pages, but we'll limit to those found
  // Now for each slug, fetch detail
  const results = [];
  let count = 0;
  for (const item of allAnime) {
    count++;
    console.log(`📥 Scraping ${count}/${allAnime.size} ${item.slug}`);
    const detailHTML = await fetchHTML(item.url);
    if (detailHTML) {
      const detail = extractAnimeDetail(detailHTML, item.slug);
      results.push({
        slug: item.slug,
        title: detail.title || item.title,
        image: detail.image || item.img,
        description: detail.description,
        genres: detail.genres,
        episodes: detail.episodes.slice(0, 50) // limit
      });
      // collect genres globally
      detail.genres.forEach(g => {
        if (!data.genres.includes(g)) data.genres.push(g);
      });
    } else {
      results.push({ slug: item.slug, title: item.title, image: item.img, description: '', genres: [], episodes: [] });
    }
    await delay(200); // be gentle
  }
  data.anime = results;
  data.lastUpdated = new Date().toISOString();
  console.log(`✅ Scraped ${results.length} anime, ${data.genres.length} genres`);
  // save to file for persistence
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

// Load cached data if exists
if (fs.existsSync('data.json')) {
  try {
    const cached = JSON.parse(fs.readFileSync('data.json'));
    data.anime = cached.anime || [];
    data.genres = cached.genres || [];
    data.lastUpdated = cached.lastUpdated || null;
    console.log('📂 Loaded cached data');
  } catch(e) { console.warn('Cache read error'); }
}

// Scrape on startup if no data
if (data.anime.length === 0) {
  scrapeAll().then(() => {
    console.log('Scraping completed.');
  });
} else {
  // Refresh in background after 1 hour? we'll keep simple
  setTimeout(() => {
    scrapeAll();
  }, 3600000);
}

// -------- VIEW TEMPLATES (inline) --------
const baseTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BunnyCrholl - Anime Streaming</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <style>
    body { background: #0f0f12; color: #f1f1f5; font-family: 'Segoe UI', system-ui, sans-serif; }
    .glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); }
    .anime-card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
    .anime-card:hover { transform: scale(1.02); box-shadow: 0 12px 40px rgba(0,0,0,0.6); }
    .swiper-button-next, .swiper-button-prev { color: #f1f1f5; background: rgba(0,0,0,0.4); padding: 20px 10px; border-radius: 8px; }
    .swiper-pagination-bullet { background: #fff; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #1a1a20; }
    ::-webkit-scrollbar-thumb { background: #3b3b4a; border-radius: 10px; }
    .nav-link { transition: color 0.2s; }
    .nav-link:hover { color: #60a5fa; }
    .episode-btn { transition: background 0.2s; }
    .episode-btn:hover { background: #2563eb; }
  </style>
</head>
<body>
  <%- include('partials/header') %>
  <main class="container mx-auto px-4 py-6">
    <%- body %>
  </main>
  <%- include('partials/footer') %>
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  <script>
    // GSAP animations
    document.addEventListener('DOMContentLoaded', () => {
      gsap.from('.fade-in', { opacity: 0, y: 40, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
      // Swiper initialization
      new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        pagination: { el: '.swiper-pagination', clickable: true },
        autoplay: { delay: 5000 },
        breakpoints: {
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 20 }
        }
      });
    });
  </script>
</body>
</html>
`;

const headerPartial = `
<header class="glass sticky top-0 z-50 py-3 px-4 flex items-center justify-between">
  <div class="flex items-center space-x-2">
    <span class="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">BunnyCrholl</span>
    <span class="text-xs text-gray-400">beta</span>
  </div>
  <nav class="hidden md:flex space-x-6 text-sm font-medium">
    <a href="/" class="nav-link">Home</a>
    <a href="/browse" class="nav-link">Browse</a>
    <a href="/genres" class="nav-link">Genres</a>
    <a href="/search" class="nav-link">Search</a>
  </nav>
  <form action="/search" method="get" class="flex items-center space-x-2">
    <input type="text" name="q" placeholder="Search anime..." class="bg-transparent border border-gray-600 rounded-full px-4 py-1 text-sm focus:outline-none focus:border-blue-400 w-40 md:w-56">
    <button type="submit" class="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-full transition">Go</button>
  </form>
</header>
`;

const footerPartial = `
<footer class="mt-12 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
  <p>© BunnyCrholl — All data scraped from <a href="https://www.desidubanime.me" target="_blank" class="text-blue-400 hover:underline">DesiDubAnime</a></p>
  <p class="mt-1">Made with 💗 for anime lovers</p>
</footer>
`;

// Set up EJS with inline partials
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Write partials to disk so EJS can include them
if (!fs.existsSync('views')) fs.mkdirSync('views');
if (!fs.existsSync('views/partials')) fs.mkdirSync('views/partials');
fs.writeFileSync('views/partials/header.ejs', headerPartial);
fs.writeFileSync('views/partials/footer.ejs', footerPartial);
// Write layout as base.ejs
fs.writeFileSync('views/layout.ejs', baseTemplate);

// Helper to render
function renderPage(bodyContent, data = {}) {
  return ejs.renderFile('views/layout.ejs', { body: bodyContent, ...data });
}

// Routes
app.get('/', async (req, res) => {
  const topAnime = data.anime.slice(0, 12);
  const featured = data.anime.slice(0, 6);
  const genres = data.genres.slice(0, 10);
  // Render home
  const html = `
    <section class="fade-in">
      <div class="swiper rounded-xl overflow-hidden mb-8">
        <div class="swiper-wrapper">
          ${featured.map(a => `
            <div class="swiper-slide relative h-72 md:h-96">
              <img src="${a.image || '/placeholder.jpg'}" class="w-full h-full object-cover" alt="${a.title}">
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h2 class="text-2xl font-bold">${a.title}</h2>
                <a href="/anime/${a.slug}" class="inline-block mt-2 bg-blue-600 px-4 py-1 rounded-full text-sm">Watch Now</a>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
      </div>
    </section>

    <section class="fade-in">
      <h2 class="text-2xl font-bold mb-4">🔥 Latest Anime</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        ${topAnime.map(a => `
          <a href="/anime/${a.slug}" class="anime-card group">
            <div class="relative overflow-hidden rounded-lg bg-gray-800 aspect-[2/3]">
              <img src="${a.image || '/placeholder.jpg'}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" alt="${a.title}">
              <div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition"></div>
            </div>
            <h3 class="mt-2 text-sm font-medium line-clamp-2">${a.title}</h3>
          </a>
        `).join('')}
      </div>
    </section>

    <section class="fade-in mt-10">
      <h2 class="text-2xl font-bold mb-4">🎭 Genres</h2>
      <div class="flex flex-wrap gap-2">
        ${genres.map(g => `<a href="/genre/${encodeURIComponent(g)}" class="bg-gray-800 hover:bg-blue-600 px-4 py-1 rounded-full text-sm transition">${g}</a>`).join('')}
        ${genres.length < data.genres.length ? `<a href="/genres" class="text-blue-400 text-sm hover:underline">more...</a>` : ''}
      </div>
    </section>
  `;
  res.send(await renderPage(html));
});

app.get('/anime/:slug', async (req, res) => {
  const { slug } = req.params;
  const anime = data.anime.find(a => a.slug === slug);
  if (!anime) {
    return res.status(404).send('Anime not found');
  }
  const html = `
    <div class="fade-in flex flex-col md:flex-row gap-8">
      <div class="md:w-1/3 lg:w-1/4">
        <img src="${anime.image || '/placeholder.jpg'}" class="w-full rounded-xl shadow-2xl" alt="${anime.title}">
        <div class="mt-4 flex flex-wrap gap-2">
          ${anime.genres.map(g => `<span class="bg-gray-700 px-3 py-0.5 rounded-full text-xs">${g}</span>`).join('')}
        </div>
      </div>
      <div class="md:w-2/3 lg:w-3/4">
        <h1 class="text-3xl font-bold">${anime.title}</h1>
        <p class="mt-2 text-gray-300 leading-relaxed">${anime.description || 'No description available.'}</p>
        <h3 class="mt-6 text-xl font-semibold">Episodes (${anime.episodes.length})</h3>
        <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-2">
          ${anime.episodes.map(ep => `
            <a href="${ep.url}" target="_blank" class="episode-btn bg-gray-700 hover:bg-blue-600 text-center py-1 px-2 rounded text-sm transition">${ep.number}</a>
          `).join('')}
          ${anime.episodes.length === 0 ? '<p class="text-gray-400">No episodes found.</p>' : ''}
        </div>
      </div>
    </div>
  `;
  res.send(await renderPage(html));
});

app.get('/genre/:genre', async (req, res) => {
  const genre = decodeURIComponent(req.params.genre);
  const filtered = data.anime.filter(a => a.genres.includes(genre));
  const html = `
    <div class="fade-in">
      <h1 class="text-2xl font-bold mb-4">Genre: ${genre}</h1>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        ${filtered.map(a => `
          <a href="/anime/${a.slug}" class="anime-card">
            <div class="relative overflow-hidden rounded-lg bg-gray-800 aspect-[2/3]">
              <img src="${a.image || '/placeholder.jpg'}" class="w-full h-full object-cover" alt="${a.title}">
            </div>
            <h3 class="mt-2 text-sm font-medium line-clamp-2">${a.title}</h3>
          </a>
        `).join('')}
        ${filtered.length === 0 ? '<p class="text-gray-400">No anime in this genre.</p>' : ''}
      </div>
    </div>
  `;
  res.send(await renderPage(html));
});

app.get('/genres', async (req, res) => {
  const html = `
    <div class="fade-in">
      <h1 class="text-2xl font-bold mb-4">All Genres</h1>
      <div class="flex flex-wrap gap-2">
        ${data.genres.map(g => `<a href="/genre/${encodeURIComponent(g)}" class="bg-gray-800 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm transition">${g}</a>`).join('')}
      </div>
    </div>
  `;
  res.send(await renderPage(html));
});

app.get('/browse', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 24;
  const start = (page - 1) * limit;
  const total = data.anime.length;
  const pages = Math.ceil(total / limit);
  const list = data.anime.slice(start, start + limit);
  const html = `
    <div class="fade-in">
      <h1 class="text-2xl font-bold mb-4">Browse All Anime</h1>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        ${list.map(a => `
          <a href="/anime/${a.slug}" class="anime-card">
            <div class="relative overflow-hidden rounded-lg bg-gray-800 aspect-[2/3]">
              <img src="${a.image || '/placeholder.jpg'}" class="w-full h-full object-cover" alt="${a.title}">
            </div>
            <h3 class="mt-2 text-sm font-medium line-clamp-2">${a.title}</h3>
          </a>
        `).join('')}
      </div>
      <div class="flex justify-center gap-2 mt-6">
        ${Array.from({length: Math.min(pages, 10)}, (_, i) => {
          const p = i+1;
          return `<a href="/browse?page=${p}" class="px-3 py-1 rounded ${p === page ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 transition">${p}</a>`;
        }).join('')}
        ${pages > 10 ? `<span class="px-3 py-1">...</span><a href="/browse?page=${pages}" class="px-3 py-1 bg-gray-700 hover:bg-blue-500 transition">${pages}</a>` : ''}
      </div>
    </div>
  `;
  res.send(await renderPage(html));
});

app.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const results = data.anime.filter(a => a.title.toLowerCase().includes(q.toLowerCase()));
  const html = `
    <div class="fade-in">
      <h1 class="text-2xl font-bold mb-4">Search results for "${q}"</h1>
      ${results.length === 0 ? '<p class="text-gray-400">No anime found.</p>' : `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          ${results.map(a => `
            <a href="/anime/${a.slug}" class="anime-card">
              <div class="relative overflow-hidden rounded-lg bg-gray-800 aspect-[2/3]">
                <img src="${a.image || '/placeholder.jpg'}" class="w-full h-full object-cover" alt="${a.title}">
              </div>
              <h3 class="mt-2 text-sm font-medium line-clamp-2">${a.title}</h3>
            </a>
          `).join('')}
        </div>
      `}
    </div>
  `;
  res.send(await renderPage(html));
});

// Placeholder image endpoint (optional)
app.get('/placeholder.jpg', (req, res) => {
  // Just send a 1x1 transparent or a default image
  res.sendFile(path.join(__dirname, 'public', 'placeholder.jpg'), err => {
    if (err) {
      res.status(404).send('Placeholder not found');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🐰 BunnyCrholl running on http://localhost:${PORT}`);
});