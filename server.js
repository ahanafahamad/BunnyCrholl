import * as cheerio from "cheerio";
import express from "express";
import axios from "axios";
import cors from "cors";

const PORT = 3433;
const app = express();

app.use(cors());

app.get("/", async (req, res) => {
  try {
    const { data } = await axios.get("https://animesalt.to", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36",
      },
    });

    const $ = cheerio.load(data);
    const heroSectResults = [];
    const recentlyUpdated = [];

    $(".swiper-slide:not(.swiper-slide-duplicate)").each((i, el) => {
      const href = $(el).find(".desi-head-title a").attr("href");
      const slug = href ? href.split("https://animesalt.to/")[1] : null;

      heroSectResults.push({
        title: $(el).find(".desi-head-title a").text().trim() || null,
        JPtitle: $(el).find(".desi-head-title").attr("data-jp") || null,
        slug,
        imagePoster: $(el).find(".film-poster-img").attr("src") || null,
        description: $(el).find(".desi-description").text().trim() || null,
      });
    });

    $(".film_list-wrap .flw-item").each((i, el) => {
      const href = $(el).find(".film-name a").attr("href");
      const slug = href ? href.split("https://animesalt.to/")[1] : null;

      recentlyUpdated.push({
        title: $(el).find(".film-name a").text().trim() || null,
        JPTitle: $(el).find(".film-name a").attr("data-jname") || null,
        slug,
        imgPosterURL:
          $(el).find(".film-poster-img").attr("src") ||
          $(el).find(".film-poster-img").attr("data-src") ||
          null,
        qualityTick: $(el).find(".tick-quality").text().trim() || null,
        subTick: $(el).find(".tick-sub").text().trim() || null,
        dubTick: $(el).find(".tick-dub").text().trim() || null,
        epTick: $(el).find(".tick-eps").text().trim() || null,
      });
    });

    const dates = [];
    $(".day-item").each((_, el) => {
      dates.push({
        day: $(el).find("span").text().trim(),
        date: $(el).find(".date").text().trim(),
        fullDate: $(el).attr("data-date"),
        active: $(el).find(".tsd-item").hasClass("active"),
      });
    });

    const schedule = [];
    $(".table_schedule-list li").each((_, el) => {
      const url = $(el).find(".tsl-link").attr("href");
      schedule.push({
        time: $(el).find(".time").text().trim(),
        title: $(el).find(".film-name").text().trim(),
        jpTitle: $(el).find(".film-name").attr("data-jname") || null,
        episode: $(el).find(".btn-play").text().replace("Episode", "").trim(),
        slug: url ? url.split("https://animesalt.to/")[1] : null,
        url,
      });
    });

    const topAnime = {
      today: [],
      week: [],
      month: [],
    };

    function scrapeTopAnime(selector, arr) {
      $(`${selector} li`).each((_, el) => {
        const url = $(el).find(".film-name a").attr("href");
        arr.push({
          rank: $(el).find(".film-number span").text().trim(),
          title: $(el).find(".film-name a").text().trim(),
          jpTitle: $(el).find(".film-name a").attr("data-jname") || null,
          views: $(el)
            .find(".fd-infor .fdi-item")
            .text()
            .replace(/\s+/g, " ")
            .replace(" ", "")
            .trim(),
          image:
            $(el).find(".film-poster-img").attr("src") ||
            $(el).find(".film-poster-img").attr("data-src") ||
            null,
          slug: url ? url.split("https://animesalt.to/")[1] : null,
          url,
        });
      });
    }

    scrapeTopAnime("#top-viewed-day .ulclear", topAnime.today);
    scrapeTopAnime("#top-viewed-week .ulclear", topAnime.week);
    scrapeTopAnime("#top-viewed-month .ulclear", topAnime.month);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BunnyCrholl | Watch Your Favorite Anime HD, Online Anime Streaming</title>
  <meta name="description" content="BunnyCrholl is the best website to watch anime online 2026. Stream English, Hindi subbed and dubbed episodes in HD quality. Enjoy fast, free, ad-free streaming. Watch your favorite anime now">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#0b0b0d">
  <link rel="apple-touch-icon" href="https://i.ibb.co.com/LzYgG7kf/Bunny-Crholl-1.jpg">
  <link rel="icon" href="https://i.ibb.co.com/LzYgG7kf/Bunny-Crholl-1.jpg" sizes="any">
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Outfit:wght@100..900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css" />
  <script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"></script>
  <style>
    :root {
      --bg-primary: #0b0b0d;
      --bg-secondary: #141416;
      --bg-surface: #1c1c20;
      --bg-card: #24242a;
      --brand-primary: #ff7a00;
      --brand-secondary: #ff9d00;
      --brand-accent: #ffb84d;
      --text-primary: #ffffff;
      --text-secondary: #d1d5db;
      --text-muted: #9ca3af;
      --success: #22c55e;
      --warning: #facc15;
      --danger: #ef4444;
      --info: #38bdf8;
      --border: #2d2d33;
      --border-light: #3f3f46;
      --glass: rgba(255, 255, 255, 0.05);
      --glass-border: rgba(255, 255, 255, 0.08);
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.25);
      --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.35);
      --shadow-lg: 0 12px 40px rgba(255, 122, 0, 0.18);
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 18px;
      --radius-xl: 24px;
      --transition: 0.25s ease;
    }
    html, body {
      background-color: var(--bg-primary);
      color: var(--text-primary);
      margin: 0;
      font-family: 'Inter', system-ui, sans-serif;
    }
    .mobile-menu {
      position: fixed;
      top: 0;
      right: 0;
      width: 280px;
      height: 100%;
      background-color: var(--bg-secondary);
      border-left: 1px solid var(--border);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      z-index: 60;
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
    }
    .mobile-menu.open {
      transform: translateX(0);
    }
    .menu-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 50;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .menu-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    * {
    font-family: "Inter", sans-serif;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col">
  <div class="menu-overlay" id="menu-overlay"></div>
  <div class="mobile-menu" id="mobile-menu">
    <div class="flex justify-end">
      <button id="close-menu" class="text-2xl hover:text-[var(--brand-primary)]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <nav class="mt-8 flex flex-col gap-5 text-lg font-medium font-[Inter]">
      <a href="/" class="hover:text-[var(--brand-primary)] transition-colors">Home</a>
      <a href="/az-list" class="hover:text-[var(--brand-primary)] transition-colors">A-Z List</a>
      <a href="#recently-updated" class="hover:text-[var(--brand-primary)] transition-colors">Recently Updated</a>
      <a href="#top-anime" class="hover:text-[var(--brand-primary)] transition-colors">Top Anime</a>
      <a href="/genres" class="hover:text-[var(--brand-primary)] transition-colors">Genres</a>
    </nav>
  </div>

  <header class="font-[Inter] sticky top-0 z-40 bg-[var(--bg-secondary)]/80 backdrop-blur-md border-b border-[var(--border)]">
    <div class="max-w-7xl mx-auto px-2 h-16 flex items-center justify-between">
      <img src="https://i.ibb.co.com/kVG7yd9B/1000135534-removebg-preview.png" alt="BunnyCrholl" class="w-45"/>
      <button id="hamburger-menu" class="p-2 text-2xl hover:text-[var(--brand-primary)] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </div>
  </header>

  <main class="flex-1 font-[Inter]">
    <section id="hero-sect" class="relative w-full h-[80vh] md:h-[95vh] overflow-hidden">
      <div class="swiper w-full h-full">
        <div class="swiper-wrapper">
          ${heroSectResults
            .map(
              (hero) => `
          <div class="font-[Inter] swiper-slide w-full h-full relative">
            <img src="${hero.imagePoster || ""}" alt="${hero.title + "|" + hero.JPtitle}" class="absolute inset-0 w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/60 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-20 max-w-4xl">
              <h1 class="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-2 drop-shadow-lg font-[Outfit]">${hero.title || ""}</h1>
              ${hero.JPtitle ? `<p class="text-sm md:text-lg text-[var(--text-muted)] mb-3">${hero.JPtitle}</p>` : ""}
              <p class="text-[var(--text-secondary)] line-clamp-3 mb-5 text-xs md:text-base max-w-xl">${hero.description || ""}</p>
              <a href="/${hero.slug || "#"}" class="inline-flex items-center gap-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-white font-semibold px-5 py-2.5 md:px-6 md:py-3 rounded-full transition-all shadow-[var(--shadow-lg)] text-sm md:text-base">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-4 h-4 md:w-5 md:h-5">
                  <path d="M5.888 22.5a.75.75 0 0 1-1.137-.648V2.148a.75.75 0 0 1 1.137-.648l16.5 9.852a.75.75 0 0 1 0 1.296l-16.5 9.852Z" />
                </svg>
                Watch Now
              </a>
            </div>
          </div>
          `,
            )
            .join("")}
        </div>
        <div class="swiper-pagination !bottom-1 md:!bottom-2"></div>
      </div>
    </section>

    <section class="font-[Inter] max-w-7xl mx-auto px-4 py-10" id="recently-updated">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl md:text-3xl font-bold font-[Outfit]">Recently Updated</h2>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
        ${recentlyUpdated
          .map(
            (anime) => `
        <a href="/${anime.slug || "#"}" class="group bg-[var(--bg-card)] rounded-[var(--radius-lg)] overflow-hidden hover:scale-[1.02] transition-transform shadow-[var(--shadow-md)]">
          <div class="relative aspect-[3/4] overflow-hidden">
            <img src="${anime.imgPosterURL || ""}" alt="${anime.title || ""}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div class="absolute top-2 left-2 flex flex-wrap gap-1">
              ${anime.qualityTick ? `<span class="bg-[var(--brand-primary)] text-white text-xs px-2 py-0.5 rounded-full font-medium">${anime.qualityTick}</span>` : ""}
              ${anime.subTick ? `<span class="bg-[var(--info)] text-white text-xs px-2 py-0.5 rounded-full font-medium">${anime.subTick}</span>` : ""}
              ${anime.dubTick ? `<span class="bg-[var(--success)] text-white text-xs px-2 py-0.5 rounded-full font-medium">${anime.dubTick}</span>` : ""}
            </div>
            ${anime.epTick ? `<div class="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">${anime.epTick}</div>` : ""}
          </div>
          <div class="p-3">
            <h3 class="font-semibold text-sm line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">${anime.title || ""}</h3>
            ${anime.JPTitle ? `<p class="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">${anime.JPTitle}</p>` : ""}
          </div>
        </a>
        `,
          )
          .join("")}
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 py-10" id="top-anime">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl md:text-3xl font-bold">Top Anime</h2>
      </div>
      <div class="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-5 md:p-6 shadow-[var(--shadow-md)]">
        <div class="flex gap-2 mb-6" id="top-tabs">
          <button class="top-tab-btn px-4 py-2 rounded-full text-sm font-medium bg-[var(--brand-primary)] text-white" data-tab="today">Today</button>
          <button class="top-tab-btn px-4 py-2 rounded-full text-sm font-medium bg-[var(--bg-surface)] text-[var(--text-secondary)]" data-tab="week">Week</button>
          <button class="top-tab-btn px-4 py-2 rounded-full text-sm font-medium bg-[var(--bg-surface)] text-[var(--text-secondary)]" data-tab="month">Month</button>
        </div>
        <div id="top-content">
          ${["today", "week", "month"]
            .map(
              (period) => `
          <div class="top-content-panel ${period === "today" ? "" : "hidden"}" data-period="${period}">
            <ul class="space-y-3 md:space-y-4">
              ${topAnime[period]
                .map(
                  (anime) => `
              <li class="flex items-center gap-3 md:gap-4 p-3 rounded-[var(--radius-md)] hover:bg-[var(--bg-surface)] transition-colors">
                <span class="text-[var(--brand-primary)] font-bold text-base md:text-lg w-6">#${anime.rank || ""}</span>
                <img src="${anime.image || ""}" alt="${anime.title || ""}" class="w-10 h-14 md:w-12 md:h-16 object-cover rounded-md flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <a href="/${anime.slug || "#"}" class="font-medium hover:text-[var(--brand-primary)] transition-colors line-clamp-1 text-sm md:text-base">${anime.title || ""}</a>
                  <p class="text-xs text-[var(--text-muted)]">${anime.views || ""}</p>
                </div>
              </li>
              `,
                )
                .join("")}
            </ul>
          </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </section>
  </main>

  <footer class="bg-[var(--bg-secondary)] border-t border-[var(--border)] py-6 mt-auto">
    <div class="max-w-7xl mx-auto px-4 text-center text-xs text-[var(--text-muted)]">
      <p>&copy; 2026 BunnyCrholl. This site does not store any files on its server.</p>
    </div>
  </footer>

  <script>
    const swiper = new Swiper('.swiper', {
      direction: 'horizontal',
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
    });

    const menuBtn = document.getElementById('hamburger-menu');
    const closeBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');

    function openMenu() {
      mobileMenu.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      mobileMenu.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    const topTabs = document.querySelectorAll('.top-tab-btn');
    topTabs.forEach(btn => {
      btn.addEventListener('click', function() {
        topTabs.forEach(b => {
          b.classList.remove('bg-[var(--brand-primary)]', 'text-white');
          b.classList.add('bg-[var(--bg-surface)]', 'text-[var(--text-secondary)]');
        });
        this.classList.add('bg-[var(--brand-primary)]', 'text-white');
        this.classList.remove('bg-[var(--bg-surface)]', 'text-[var(--text-secondary)]');
        const period = this.dataset.tab;
        document.querySelectorAll('.top-content-panel').forEach(panel => panel.classList.add('hidden'));
        const activePanel = document.querySelector('.top-content-panel[data-period="' + period + '"]');
        if (activePanel) activePanel.classList.remove('hidden');
      });
    });
  </script>
</body>
</html>`;
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

app.get("/api/v1/az-list", async (req, res) => {
  try {
    const { letter } = req.query;
    const url = letter
      ? `https://animesalt.to/az-list/${letter}`
      : `https://animesalt.to/az-list`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36",
      },
    });

    const $ = cheerio.load(data);
    const animeList = [];

    $(".anime-block-ul > ul > li").each((_, el) => {
      const link = $(el).find(".film-name a");
      const href = link.attr("href");

      animeList.push({
        title: link.text().trim(),
        jpTitle: link.attr("data-jname") || null,
        slug: href ? href.split("https://animesalt.to/")[1] : null,
        image:
          $(el).find(".film-poster-img").attr("src") ||
          $(el).find(".film-poster-img").attr("data-src") ||
          null,
        episode: $(el).find(".fdi-duration").text().trim(),
        type: $(el).find(".fd-infor .fdi-item").last().text().trim(),
      });
    });

    res.send({
      letter: letter || "All",
      total: animeList.length,
      data: animeList,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
app.get('/google48729a758d9060c6.html', (req, res) => {
  res.type('text/html');
  res.send('google-site-verification: google48729a758d9060c6.html');
});

export default app;