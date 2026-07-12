import * as cheerio from "cheerio";
import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";

const app = express();
const _port = 3434;
app.use(cors());
app.use(express.static(path.join(process.cwd(), "public")));
const _userAgent =
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36";

app.get("/", async (req, res) => {
  const url = "https://www.desidubanime.me/";
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": _userAgent,
    },
  });

  const $ = cheerio.load(data);

  const heroSect = [];
  const trending = [];
  const topAiring = $(".kira-grid-featured > section")
    .filter((_, el) => $(el).find("h2").text().trim() === "Top Airing!")
    .first();
  const mostpopularFilter = $(".kira-grid-featured > section")
    .filter((_, el) => $(el).find("h2").text().trim() === "Most Popular")
    .first();
  const completedSeriesFilter = $(".kira-grid-featured > section")
    .filter((_, el) => $(el).find("h2").text().trim() === "Completed Series")
    .first();

  const topAiringArray = [];
  const mostPopular = [];
  const completedSeries = [];
  const latestEpisodes = [];
  const latestMovies = [];
  const upComing = [];
  const genres = [];
  const popularPost = [];

  $(".swiper-spotlight .swiper-wrapper .swiper-slide").each((i, el) => {
    heroSect.push({
      img: $(el).find(".image-spotlight img").attr("data-src") || null,
      animeTitle: $(el).find("h2 span").text().trim() || null,
      animeALT: $(el).find("h2 span").text().trim() || null,
      AnimeDetailSlug:
        $(el).find("a").attr("href").split("https://www.desidubanime.me/")[1] ||
        null,
      AnimeWatchSlug:
        $(el)
          .find('a[href*="/watch/"]')
          .attr("href")
          .split("https://www.desidubanime.me/")[1] || null,

      description: $(el).find(".text-\\[13px\\]").text().trim(),

      type: $(el).find(".uppercase").text().replace("play_circle", "").trim(),

      duration: $(el)
        .find(".material-icons-round:contains('watch_later')")
        .parent()
        .text()
        .replace("watch_later", "")
        .trim(),

      aired: $(el)
        .find(".material-icons-round:contains('event')")
        .parent()
        .text()
        .replace("event", "")
        .trim(),

      quality: $(el).find(".quality").text().trim(),
    });
  });
  $(".swiper-trending .swiper-wrapper .swiper-slide").each((i, el) => {
    trending.push({
      AnimeInfoslug:
        $(el).find("a").attr("href").split("https://www.desidubanime.me/")[1] ||
        null,
      img: $(el).find("img").attr("src") || null,
      title: $(el).find("img").attr("alt") || null,
      JPtitle:
        $(el).find("span[class*='group-data-[language=jp]']").text().trim() ||
        null,
      ep: $(el).find(".font-medium.text-text").text().trim() || null,
    });
  });
  $(".kira-grid-featured ul li").each((i, el) => {
    topAiring.find("ul > li").each((_, li) => {
      topAiringArray.push({
        title: $(li).find(".dynamic-name span").first().text().trim(),
        slug:
          $(li)
            .find("a")
            .first()
            .attr("href")
            .split("https://www.desidubanime.me")[1] || null,
        img: $(li).find("img").attr("src"),
        ep: $(li)
          .find("span")
          .filter((_, el) => $(el).text().trim().startsWith("E"))
          .text()
          .trim(),
      });
    });
    completedSeriesFilter.find("ul > li").each((_, li) => {
      completedSeries.push({
        title: $(li).find(".dynamic-name span").first().text().trim(),
        slug:
          $(li)
            .find("a")
            .first()
            .attr("href")
            .split("https://www.desidubanime.me")[1] || null,
        img: $(li).find("img").attr("src"),
        ep: $(li)
          .find("span")
          .filter((_, el) => $(el).text().trim().startsWith("E"))
          .text()
          .trim(),
      });
    });
    mostpopularFilter.find("ul > li").each((_, li) => {
      mostPopular.push({
        title: $(li).find(".dynamic-name span").first().text().trim(),
        slug:
          $(li)
            .find("a")
            .first()
            .attr("href")
            .split("https://www.desidubanime.me")[1] || null,
        img: $(li).find("img").attr("src"),
        ep: $(li)
          .find("span")
          .filter((_, el) => $(el).text().trim().startsWith("E"))
          .text()
          .trim(),
      });
    });
  });
  $(".widget_kiranime_genre_list ul li").each((i, el) => {
    genres.push({
      title: $(el).find("a").text().trim(),
      slug: $(el).find("a").attr("href"),
    });
  });
  const currentUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  const shareTitle = "BunnyCrholl - Watch Anime Online";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BunnyCrholl | Watch Your Favorite Anime HD, Online Anime Streaming</title>
  <meta name="description" content="BunnyCrholl is the best website to watch anime online 2026. Stream English, Hindi subbed and dubbed episodes in HD quality. Enjoy fast, free, ad-free streaming. Watch your favorite anime now">
   <link rel="stylesheet" href="bunny-css-responsive-important.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Oswald:wght@200..700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <link rel="shortcut icon" href="./BunnyCrholl.ico" type="image/x-icon">
  <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css"
/>
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
  width: 100vw;
  height: 100vh;
  overflow-x: hidden !important;
  font-family: "Lato", sans-serif;
}
  .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      z-index: 9999999;
      display: none;
      justify-content: center;
      align-items: center;
    }
    .modal-overlay.active {
      display: flex;
    }
    .modal-box {
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      box-shadow: var(--shadow-lg);
      position: relative;
      animation: fadeIn 0.3s ease;
    }
    .modal-close {
      position: absolute;
      top: 12px;
      right: 16px;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.5rem;
      cursor: pointer;
      transition: color 0.2s;
    }
    .modal-close:hover {
      color: var(--text-primary);
    }
    .modal-title {
      font-family: 'Oswald', sans-serif;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      text-align: center;
      color: var(--text-primary);
    }
    .share-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
      gap: 1rem;
      justify-items: center;
    }
    .share-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 0.8rem 0.5rem;
      width: 100%;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      font-size: 0.75rem;
    }
    .share-btn:hover {
      background: var(--brand-primary);
      color: #fff;
      border-color: var(--brand-primary);
      transform: translateY(-3px);
    }
    .share-btn i {
      font-size: 1.8rem;
    }
    .share-btn .label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
</style>
</head>
<body>
  <header id="mainHeader" class="fixed top-0 left-0 w-full z-[999999] h-15 px-2 md:px-8 transition-all duration-300">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 group">
      <img src="1000135534-removebg-preview.png" alt="BunnyCrholl" class="absolute top-[-12] left-0 h-40 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
      <span class="font-[Oswald] text-xl font-bold text-white hidden sm:inline-block tracking-wider">
        Bunny<span class="text-[var(--brand-primary)]">Crholl</span>
      </span>
    </a>

    <nav class="hidden md:flex items-center gap-1 lg:gap-2">
      <a href="/" class="nav-link px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all duration-300 relative">
        Home
        <span class="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </a>
      <a href="/trending" class="nav-link px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all duration-300 relative">
        Trending
        <span class="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </a>
      <a href="/airing" class="nav-link px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all duration-300 relative">
        Airing
        <span class="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </a>
      <a href="/popular" class="nav-link px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all duration-300 relative">
        Popular
        <span class="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </a>
      <a href="/completed" class="nav-link px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all duration-300 relative">
        Completed
        <span class="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </a>
      <a href="/genres" class="nav-link px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all duration-300 relative">
        Genres
        <span class="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </a>
      <button id="searchToggle" class="ml-2 p-2 rounded-full text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-all duration-300">
        <i class="fas fa-search text-sm"></i>
      </button>
    </nav>

    <div class="flex items-center gap-2 md:hidden">
      <button id="searchToggleMobile" class="p-2 rounded-full text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-all duration-300">
        <i class="fas fa-search text-sm"></i>
      </button>
      <button id="menuToggle" class="menu-btn relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all duration-300 group" aria-label="Toggle menu">
        <div class="menu-icon w-6 h-5 flex flex-col justify-between items-center relative">
          <span class="menu-bar block w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-left"></span>
          <span class="menu-bar block w-full h-0.5 bg-white rounded-full transition-all duration-300"></span>
          <span class="menu-bar block w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-left"></span>
        </div>
      </button>
    </div>
  </div>

  <div id="mobileOverlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 md:hidden"></div>

  <div id="mobileMenu" class="fixed top-0 right-0 w-[280px] sm:w-[320px] h-screen bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-l border-[var(--glass-border)] shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden z-[999999]">
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-5 border-b border-[var(--border)]">
        <span class="font-[Oswald] text-lg font-bold text-white">Menu</span>
        <button id="closeMenu" class="p-2 rounded-full hover:bg-white/10 transition-all duration-300">
          <i class="fas fa-times text-xl text-[var(--text-secondary)]"></i>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 px-5">
        <div class="flex flex-col gap-1">
          <a href="/" class="mobile-link flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200">
            <i class="fas fa-home w-5 text-center text-sm"></i>
            <span class="text-sm font-medium">Home</span>
          </a>
          <a href="/trending" class="mobile-link flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200">
            <i class="fas fa-fire w-5 text-center text-sm text-[var(--brand-primary)]"></i>
            <span class="text-sm font-medium">Trending</span>
          </a>
          <a href="/airing" class="mobile-link flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200">
            <i class="fas fa-play-circle w-5 text-center text-sm text-[var(--brand-secondary)]"></i>
            <span class="text-sm font-medium">Top Airing</span>
          </a>
          <a href="/popular" class="mobile-link flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200">
            <i class="fas fa-chart-line w-5 text-center text-sm text-[#a855f7]"></i>
            <span class="text-sm font-medium">Most Popular</span>
          </a>
          <a href="/completed" class="mobile-link flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200">
            <i class="fas fa-check-circle w-5 text-center text-sm text-[#22c55e]"></i>
            <span class="text-sm font-medium">Completed</span>
          </a>
          <a href="/genres" class="mobile-link flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200">
            <i class="fas fa-tags w-5 text-center text-sm text-[#06b6d4]"></i>
            <span class="text-sm font-medium">Genres</span>
          </a>
        </div>

        <div class="my-4 h-px bg-[var(--border)]"></div>

<div class="flex flex-col gap-1"> </div>
      </nav>

      <div class="p-5 border-t border-[var(--border)]">
        <span class="text-[10px] text-[var(--text-muted)] font-light tracking-wider">© 2026 BunnyCrholl</span>
      </div>
    </div>
  </div>
</header>

<style>
  #mainHeader {
    background: rgba(20, 20, 22, 0.6);
    backdrop-filter: blur(16px) saturate(1.2);
    -webkit-backdrop-filter: blur(16px) saturate(1.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  #mainHeader.scrolled {
    background: rgba(11, 11, 13, 0.85);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  }

  .nav-link {
    position: relative;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 60%;
    height: 2px;
    background: linear-gradient(90deg, var(--brand-primary), var(--brand-secondary));
    border-radius: 2px;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .nav-link:hover::after {
    transform: translateX(-50%) scaleX(1);
  }

  .nav-link.active {
    color: white;
  }

  .nav-link.active::after {
    transform: translateX(-50%) scaleX(1);
  }

  #mobileMenu {
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }
   #mobileMenu {
  transform: translateX(100%);
  }
  #mobileMenu.open {
    transform: translateX(0) !important;
  }

  #mobileOverlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  .menu-btn.active .menu-bar:nth-child(1) {
    transform: rotate(45deg) translate(2px, 2px);
    width: 70%;
  }

  .menu-btn.active .menu-bar:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }

  .menu-btn.active .menu-bar:nth-child(3) {
    transform: rotate(-45deg) translate(2px, -2px);
    width: 70%;
  }

  .mobile-link {
    transition: all 0.2s ease;
  }

  .mobile-link:active {
    transform: scale(0.97);
  }

  #mobileMenu nav::-webkit-scrollbar {
    width: 3px;
  }

  #mobileMenu nav::-webkit-scrollbar-track {
    background: transparent;
  }

  #mobileMenu nav::-webkit-scrollbar-thumb {
    background: var(--brand-primary);
    border-radius: 10px;
  }
  

  @media (max-width: 640px) {
    #mainHeader {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }

</style>

<script>
  (function() {
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');

    function openMenu() {
      mobileMenu.classList.add('open');
      mobileOverlay.classList.add('open');
      menuToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

function closeMenuFn() {
  mobileMenu.classList.remove("open");
  mobileOverlay.classList.remove("open");
  menuToggle.classList.remove("active");
  document.body.style.overflow = "";
}

window.closeMenuFn = closeMenuFn;

    menuToggle.addEventListener('click', openMenu);
    closeMenu.addEventListener('click', closeMenuFn);
    mobileOverlay.addEventListener('click', closeMenuFn);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenuFn();
      }
    });

    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    document.querySelectorAll('.mobile-link').forEach(function(link) {
      link.addEventListener('click', closeMenuFn);
    });

    document.getElementById('searchToggle')?.addEventListener('click', function() {
      alert('Search functionality coming soon!');
    });
    document.getElementById('searchToggleMobile')?.addEventListener('click', function() {
    
      alert('Search functionality coming soon!');
    });

    var currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link, .mobile-link').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href && href !== '/' && currentPath.startsWith(href)) {
        link.classList.add('active');
      } else if (href === '/' && currentPath === '/') {
        link.classList.add('active');
      }
    });
  })();
</script>
  <div id="heroSect" class='mt-15 bg-[var(--bg-surface)] w-full h-[80vh]'>
    <div class="heroSwiper swiper w-full h-full">
      <div class="swiper-wrapper w-full h-full">
        ${heroSect
          .map(
            (anime) => `
        <div class="relative swiper-slide w-[100vw] h-[76vh]">
         <div class="absolute inset-0 w-full h-full bg-black/40 z-[88]"></div>
         <div class="absolute overflow-hidden w-full h-full z-[78] inset-0"><img src="${anime.img}" alt="${anime.animeALT}" class="w-full h-full inset-0 absolute object-cover"></div>
          <div class="absolute inset-0 film_info-BunnyCrholl w-full h-full z-[99] bg-transparent flex flex-col justify-end items-center px-4 py-5 gap-2 text-left">
            <h2 class="animeTitle font-[Oswald] text-3xl md:text-4xl">${anime.animeTitle}</h2>
           
            <span class="text-[10px] text-white/80 animeTicks w-full py-1 flex gap-2 flex-wrap">
              <span>${anime.type}</span>
              <span>${anime.duration}</span>
              <span>${anime.aired}</span>
              <span>${anime.quality}</span>
            </span>
            <p class="text-[12px]">${
              anime.description.length > 150
                ? anime.description.slice(0, 150) + "..."
                : anime.description
            }</p>
            <div class="w-full h-auto py-1 flex gap-2">
            <a href="/${anime.AnimeWatchSlug}" class="bg-[var(--brand-primary)] px-5 py-2 text-white font-[Oswald] rounded-sm">Watch</a>
            <a href="/${anime.AnimeDetailSlug}" class="bg-[var(--brand-primary)] px-5 py-2 text-white font-[Oswald] rounded-sm">Detail</a>
            </div>
          </div>
        </div>
        `,
          )
          .join("")}
      </div>
    </div>
  </div>
  <div id="trending" class="w-full h-auto bg-[var(--bg-secondary)] flex flex-col justify-center items-center gap-4 text-left py-8 md:py-12">
    <div class="w-full flex flex-col items-center gap-1">
        <h2 class="text-2xl md:text-3xl font-[Oswald] tracking-wide text-white relative inline-block">
            Trending Anime
            <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--brand-primary)] rounded-full"></span>
        </h2>
        <p class="text-xs text-[var(--text-muted)] font-light tracking-widest uppercase mt-1">Most popular right now</p>
    </div>

    <div class="trendingSwiper swiper w-full px-3 md:px-6 h-[360px] md:h-[400px] lg:h-[420px]">
        <div class="swiper-wrapper h-full">
            ${trending
              .map(
                (anime) => `
            <div class="group swiper-slide w-[200px] md:w-[240px] lg:w-[260px] h-[340px] md:h-[380px] lg:h-[400px] relative rounded-xl overflow-hidden bg-[var(--bg-card)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(255,122,0,0.25)] cursor-pointer">
                <div class="relative w-full h-[85%] overflow-hidden">
                    <img src="${anime.img}" alt="${anime.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                    <div class="absolute top-3 left-3 z-10">
                        <span class="bg-[var(--brand-primary)] text-[10px] font-bold px-3 py-1 rounded-full shadow-lg tracking-wide uppercase">${anime.ep || "TV"}</span>
                    </div>
                    <div class="absolute bottom-3 right-3 z-10 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-medium text-white/90 border border-white/10">
                        <a href="${anime.AnimeInfoslug}"><i class="fas fa-play-circle mr-1 text-[var(--brand-primary)]"></i> Watch</a>
                    </div>
                </div>
                <div class="w-full h-[15%] px-3 flex flex-col justify-center">
                    <h4 class="font-[Oswald] text-[13px] md:text-[14px] leading-tight line-clamp-1 text-white group-hover:text-[var(--brand-primary)] transition-colors">${anime.title}</h4>
                    ${anime.JPtitle ? `<span class="text-[10px] text-[var(--text-muted)] line-clamp-1 font-light">${anime.JPtitle}</span>` : ""}
                </div>
            </div>
            `,
              )
              .join("")}
        </div>
        <div class="swiper-pagination !relative !mt-4"></div>
    </div>

    <a href="/trending" class="w-[85%] md:w-[60%] lg:w-[40%] py-3 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-center rounded-full font-[Oswald] text-sm md:text-base tracking-wider text-white shadow-lg shadow-[var(--brand-primary)]/30 hover:shadow-[var(--brand-primary)]/50 hover:scale-[1.02] transition-all duration-300 active:scale-95">
        View All Trending <i class="fas fa-arrow-right ml-2 text-xs"></i>
    </a>
</div>
<div class="w-full h-[30vh] relative">
<img src="file_00000000efac71f59b5e6b2d4a27b871.png" alt="Share Banner" class="w-full h-full absolute inset-0" />
<div class="absolute inset-0 z-9 bg-black/30 flex justify-center items-center flex-col">
<h1 class="text-3xl font-[Oswald]">SHARE ANIME</h1><br />
<button id="shareBtn" class="block w-40 py-2 bg-[var(--brand-primary)] text-white rounded-full font-[Oswald] hover:scale-105 transition-transform">
        <i class="fa-solid fa-paper-plane mr-2"></i> Share
      </button>
</div>
</div>
<div id="shareModal" class="modal-overlay">
    <div class="modal-box">
      <button class="modal-close" id="closeModal">&times;</button>
      <h2 class="modal-title">Share This Page</h2>
      <div class="share-grid">
        <!-- WhatsApp -->
        <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + currentUrl)}" target="_blank" rel="noopener" class="share-btn">
          <i class="fab fa-whatsapp" style="color:#25D366;"></i>
          <span class="label">WhatsApp</span>
        </a>
        <!-- Facebook -->
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}" target="_blank" rel="noopener" class="share-btn">
          <i class="fab fa-facebook" style="color:#1877F2;"></i>
          <span class="label">Facebook</span>
        </a>
        <!-- Reddit -->
        <a href="https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareTitle)}" target="_blank" rel="noopener" class="share-btn">
          <i class="fab fa-reddit" style="color:#FF4500;"></i>
          <span class="label">Reddit</span>
        </a>
        <!-- Twitter -->
        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}" target="_blank" rel="noopener" class="share-btn">
          <i class="fab fa-twitter" style="color:#1DA1F2;"></i>
          <span class="label">Twitter</span>
        </a>
        <!-- Copy Link (as Instagram alternative) -->
        <button id="copyLinkBtn" class="share-btn">
          <i class="fas fa-link" style="color:#9ca3af;"></i>
          <span class="label">Copy Link</span>
        </button>
      </div>
      <p style="text-align:center; margin-top:1rem; font-size:0.75rem; color:var(--text-muted);">
        <i class="fas fa-info-circle"></i> Instagram sharing is not supported; copy the link instead.
      </p>
    </div>
  </div>
<style>
    #trending .swiper-slide {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    #trending .swiper-slide:hover {
        transform: scale(1.03);
        box-shadow: 0 12px 40px rgba(255, 122, 0, 0.25);
    }
    #trending .swiper-pagination-bullet {
        background: var(--text-muted);
        opacity: 0.5;
        transition: all 0.3s ease;
        width: 8px;
        height: 8px;
    }
    #trending .swiper-pagination-bullet-active {
        background: var(--brand-primary);
        opacity: 1;
        width: 24px;
        border-radius: 4px;
    }
    @media (max-width: 480px) {
        #trending .swiper-slide {
            width: 160px !important;
            height: 280px !important;
        }
        #trending .swiper {
            height: 300px !important;
        }
    }
    @media (min-width: 481px) and (max-width: 768px) {
        #trending .swiper-slide {
            width: 190px !important;
            height: 320px !important;
        }
        #trending .swiper {
            height: 340px !important;
        }
    }
</style>

<script>
    new Swiper(".trendingSwiper", {
        slidesPerView: "auto",
        spaceBetween: 12,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: ".trendingSwiper .swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            0: { spaceBetween: 8 },
            480: { spaceBetween: 10 },
            640: { spaceBetween: 12 },
            1024: { spaceBetween: 16 },
        },
    });
</script>
<div id="airing" class="w-full h-auto bg-[var(--bg-primary)] flex flex-col justify-center items-center gap-4 text-left py-8 md:py-12 border-t border-[var(--border)]">
    <div class="w-full flex flex-col items-center gap-1">
        <h2 class="text-2xl md:text-3xl font-[Oswald] tracking-wide text-white relative inline-block">
            Top Airing
            <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--brand-secondary)] rounded-full"></span>
        </h2>
        <p class="text-xs text-[var(--text-muted)] font-light tracking-widest uppercase mt-1">Currently popular episodes</p>
    </div>

    <div class="airingSwiper swiper w-full px-3 md:px-6 h-[370px] md:h-[410px] lg:h-[440px]">
        <div class="swiper-wrapper h-full">
            ${topAiringArray
              .map(
                (anime) => `
            <div class="group swiper-slide w-[200px] md:w-[240px] lg:w-[260px] h-[350px] md:h-[390px] lg:h-[420px] relative rounded-2xl overflow-hidden bg-[var(--bg-card)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(255,157,0,0.25)] cursor-pointer border border-[var(--border)] hover:border-[var(--brand-secondary)]/40">
                <div class="relative w-full h-[75%] overflow-hidden">
                    <img src="${anime.img}" alt="${anime.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>
                    <!-- Episode badge – fallback to "Airing" if missing -->
                    <div class="absolute top-3 left-3 z-10 flex items-center gap-2">
                        <span class="bg-[var(--brand-secondary)] text-[10px] font-bold px-3 py-1 rounded-full shadow-lg tracking-wide uppercase text-black">${anime.ep ? anime.ep : "Airing"}</span>
                        <span class="bg-[var(--brand-secondary)] text-[10px] font-bold px-3 py-1 rounded-full shadow-lg tracking-wide uppercase text-black">${"Airing"}</span>
                    </div>
                    <!-- Action buttons – fallback slugs if missing -->
                    <div class="absolute bottom-3 right-3 z-10 flex gap-2">
                        <a href="${anime.AnimeInfoslug ? "/" + anime.AnimeInfoslug : "#"}" class="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-medium text-white/90 border border-white/10 hover:bg-[var(--brand-secondary)] hover:text-black transition-all duration-200">
                            <i class="fas fa-info-circle mr-1"></i> Info
                        </a>
                        <a href="${anime.slug})}" class="bg-[var(--brand-primary)] px-3 py-1.5 rounded-full text-[10px] font-bold text-white shadow-lg shadow-[var(--brand-primary)]/30 hover:shadow-[var(--brand-primary)]/50 transition-all duration-200 hover:scale-105">
                            <i class="fas fa-play-circle mr-1"></i> Watch
                        </a>
                    </div>
                </div>
                <div class="w-full h-[25%] px-4 flex flex-col justify-center">
                    <h4 class="font-[Oswald] text-[14px] md:text-[15px] leading-tight line-clamp-1 text-white group-hover:text-[var(--brand-secondary)] transition-colors">${anime.title}</h4>
                    <!-- Japanese title – only shown if available -->
                    ${anime.JPtitle ? `<span class="text-[10px] text-[var(--text-muted)] line-clamp-1 font-light">${anime.JPtitle}</span>` : ""}
                </div>
            </div>
            `,
              )
              .join("")}
        </div>
        <div class="swiper-pagination !relative !mt-4"></div>
    </div>

    <a href="/airing" class="w-[85%] md:w-[60%] lg:w-[40%] py-3 bg-gradient-to-r from-[var(--brand-secondary)] to-[#ffcc00] text-center rounded-full font-[Oswald] text-sm md:text-base tracking-wider text-black font-semibold shadow-lg shadow-[var(--brand-secondary)]/30 hover:shadow-[var(--brand-secondary)]/50 hover:scale-[1.02] transition-all duration-300 active:scale-95">
        View All Airing <i class="fas fa-arrow-right ml-2 text-xs"></i>
    </a>
</div>

<style>
    #airing .swiper-slide {
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
    #airing .swiper-pagination-bullet {
        background: var(--text-muted);
        opacity: 0.5;
        transition: all 0.3s ease;
        width: 8px;
        height: 8px;
    }
    #airing .swiper-pagination-bullet-active {
        background: var(--brand-secondary);
        opacity: 1;
        width: 24px;
        border-radius: 4px;
    }
    @media (max-width: 480px) {
        #airing .swiper-slide {
            width: 160px !important;
            height: 290px !important;
        }
        #airing .swiper {
            height: 310px !important;
        }
    }
    @media (min-width: 481px) and (max-width: 768px) {
        #airing .swiper-slide {
            width: 190px !important;
            height: 330px !important;
        }
        #airing .swiper {
            height: 350px !important;
        }
    }
</style>

<script>
    new Swiper(".airingSwiper", {
        slidesPerView: "auto",
        spaceBetween: 12,
        loop: true,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: ".airingSwiper .swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            0: { spaceBetween: 8 },
            480: { spaceBetween: 10 },
            640: { spaceBetween: 12 },
            1024: { spaceBetween: 16 },
        },
    });
</script>
<script>
  atOptions = {
    'key' : 'e3113f45c7206bf8c8e2dd971ebe7204',
    'format' : 'iframe',
    'height' : 60,
    'width' : 468,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/e3113f45c7206bf8c8e2dd971ebe7204/invoke.js"></script>
<div id="popular" class="w-full h-auto bg-[var(--bg-secondary)] flex flex-col justify-center items-center gap-4 text-left py-8 md:py-12 border-t border-[var(--border)]">
    <div class="w-full flex flex-col items-center gap-1">
        <h2 class="text-2xl md:text-3xl font-[Oswald] tracking-wide text-white relative inline-block">
            Most Popular
            <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#a855f7] rounded-full"></span>
        </h2>
        <p class="text-xs text-[var(--text-muted)] font-light tracking-widest uppercase mt-1">Fan favorites of the season</p>
    </div>

    <div class="popularSwiper swiper w-full px-3 md:px-6 h-[370px] md:h-[410px] lg:h-[440px]">
        <div class="swiper-wrapper h-full">
            ${mostPopular
              .map(
                (anime) => `
            <div class="group swiper-slide w-[200px] md:w-[240px] lg:w-[260px] h-[350px] md:h-[390px] lg:h-[420px] relative rounded-2xl overflow-hidden bg-[var(--bg-card)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(168,85,247,0.30)] cursor-pointer border border-[var(--border)] hover:border-[#a855f7]/40">
                <div class="relative w-full h-[75%] overflow-hidden">
                    <img src="${anime.img || ""}" alt="${anime.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22260%22 height=%22320%22 fill=%22%2324242a%22%3E%3Crect width=%22260%22 height=%22320%22/%3E%3Ctext x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22sans-serif%22 font-size=%2214%22%3ENo Image%3C/text%3E%3C/svg%3E'" />
                    <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>
                    <!-- Episode badge – fallback -->
                    <div class="absolute top-3 left-3 z-10 flex items-center gap-2">
                        <span class="bg-[#a855f7] text-[10px] font-bold px-3 py-1 rounded-full shadow-lg tracking-wide uppercase text-white">${anime.ep || "Popular"}</span>
                    </div>
                    <!-- Action buttons -->
                    <div class="absolute bottom-3 right-3 z-10 flex gap-2">
                        <a href="${anime.slug ? "/" + anime.slug : "#"}" class="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-medium text-white/90 border border-white/10 hover:bg-[#a855f7] hover:text-white transition-all duration-200">
                            <i class="fas fa-info-circle mr-1"></i> Info
                        </a>
                        <a href="${anime.slug ? "/watch/" + anime.slug : "#"}" class="bg-[var(--brand-primary)] px-3 py-1.5 rounded-full text-[10px] font-bold text-white shadow-lg shadow-[var(--brand-primary)]/30 hover:shadow-[var(--brand-primary)]/50 transition-all duration-200 hover:scale-105">
                            <i class="fas fa-play-circle mr-1"></i> Watch
                        </a>
                    </div>
                </div>
                <div class="w-full h-[25%] px-4 flex flex-col justify-center">
                    <h4 class="font-[Oswald] text-[14px] md:text-[15px] leading-tight line-clamp-1 text-white group-hover:text-[#a855f7] transition-colors">${anime.title || "Unknown Title"}</h4>
                    ${anime.ep ? `<span class="text-[10px] text-[var(--text-muted)] font-light">${anime.ep}</span>` : ""}
                </div>
            </div>
            `,
              )
              .join("")}
        </div>
        <div class="swiper-pagination !relative !mt-4"></div>
    </div>

    <a href="/popular" class="w-[85%] md:w-[60%] lg:w-[40%] py-3 bg-gradient-to-r from-[#a855f7] to-[#7c3aed] text-center rounded-full font-[Oswald] text-sm md:text-base tracking-wider text-white font-semibold shadow-lg shadow-[#a855f7]/30 hover:shadow-[#a855f7]/50 hover:scale-[1.02] transition-all duration-300 active:scale-95">
        View All Popular <i class="fas fa-arrow-right ml-2 text-xs"></i>
    </a>
</div>

<style>
    #popular .swiper-slide {
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
    #popular .swiper-pagination-bullet {
        background: var(--text-muted);
        opacity: 0.5;
        transition: all 0.3s ease;
        width: 8px;
        height: 8px;
    }
    #popular .swiper-pagination-bullet-active {
        background: #a855f7;
        opacity: 1;
        width: 24px;
        border-radius: 4px;
    }
    @media (max-width: 480px) {
        #popular .swiper-slide {
            width: 160px !important;
            height: 290px !important;
        }
        #popular .swiper {
            height: 310px !important;
        }
    }
    @media (min-width: 481px) and (max-width: 768px) {
        #popular .swiper-slide {
            width: 190px !important;
            height: 330px !important;
        }
        #popular .swiper {
            height: 350px !important;
        }
    }
</style>

<script>
    new Swiper(".popularSwiper", {
        slidesPerView: "auto",
        spaceBetween: 12,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: ".popularSwiper .swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            0: { spaceBetween: 8 },
            480: { spaceBetween: 10 },
            640: { spaceBetween: 12 },
            1024: { spaceBetween: 16 },
        },
    });
</script>
<div id="ad-container-78900" style="
  width: 100%; 
  max-width: 400px; 
  min-height: 250px; 
  margin: 0 auto; 
  border-radius: 12px; 
  overflow: hidden; 
  display: flex; 
  align-items: center; 
  justify-content: center;
"></div>
<div id="completed" class="w-full h-auto bg-[var(--bg-primary)] flex flex-col justify-center items-center gap-4 text-left py-8 md:py-12 border-t border-[var(--border)]">
    <div class="w-full flex flex-col items-center gap-1">
        <h2 class="text-2xl md:text-3xl font-[Oswald] tracking-wide text-white relative inline-block">
            Completed Series
            <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#22c55e] rounded-full"></span>
        </h2>
        <p class="text-xs text-[var(--text-muted)] font-light tracking-widest uppercase mt-1">Full seasons ready to binge</p>
    </div>

    <div class="completedSwiper swiper w-full px-3 md:px-6 h-[370px] md:h-[410px] lg:h-[440px]">
        <div class="swiper-wrapper h-full">
            ${completedSeries
              .map(
                (anime) => `
            <div class="group swiper-slide w-[200px] md:w-[240px] lg:w-[260px] h-[350px] md:h-[390px] lg:h-[420px] relative rounded-2xl overflow-hidden bg-[var(--bg-card)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(34,197,94,0.30)] cursor-pointer border border-[var(--border)] hover:border-[#22c55e]/40">
                <div class="relative w-full h-[75%] overflow-hidden">
                    <img src="${anime.img || ""}" alt="${anime.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22260%22 height=%22320%22 fill=%22%2324242a%22%3E%3Crect width=%22260%22 height=%22320%22/%3E%3Ctext x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%239ca3af%22 font-family=%22sans-serif%22 font-size=%2214%22%3ENo Image%3C/text%3E%3C/svg%3E'" />
                    <div class="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>
                    <!-- Completed badge -->
                    <div class="absolute top-3 left-3 z-10 flex items-center gap-2">
                        <span class="bg-[#22c55e] text-[10px] font-bold px-3 py-1 rounded-full shadow-lg tracking-wide uppercase text-white">${anime.ep || "Complete"}</span>
                    </div>
                    <!-- Action buttons -->
                    <div class="absolute bottom-3 right-3 z-10 flex gap-2">
                        <a href="${anime.slug ? "/" + anime.slug : "#"}" class="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-medium text-white/90 border border-white/10 hover:bg-[#22c55e] hover:text-white transition-all duration-200">
                            <i class="fas fa-info-circle mr-1"></i> Info
                        </a>
                        <a href="${anime.slug ? "/watch/" + anime.slug : "#"}" class="bg-[var(--brand-primary)] px-3 py-1.5 rounded-full text-[10px] font-bold text-white shadow-lg shadow-[var(--brand-primary)]/30 hover:shadow-[var(--brand-primary)]/50 transition-all duration-200 hover:scale-105">
                            <i class="fas fa-play-circle mr-1"></i> Watch
                        </a>
                    </div>
                </div>
                <div class="w-full h-[25%] px-4 flex flex-col justify-center">
                    <h4 class="font-[Oswald] text-[14px] md:text-[15px] leading-tight line-clamp-1 text-white group-hover:text-[#22c55e] transition-colors">${anime.title || "Unknown Title"}</h4>
                    ${anime.ep ? `<span class="text-[10px] text-[var(--text-muted)] font-light">${anime.ep}</span>` : ""}
                </div>
            </div>
            `,
              )
              .join("")}
        </div>
        <div class="swiper-pagination !relative !mt-4"></div>
    </div>

    <a href="/completed" class="w-[85%] md:w-[60%] lg:w-[40%] py-3 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-center rounded-full font-[Oswald] text-sm md:text-base tracking-wider text-white font-semibold shadow-lg shadow-[#22c55e]/30 hover:shadow-[#22c55e]/50 hover:scale-[1.02] transition-all duration-300 active:scale-95">
        View All Completed <i class="fas fa-arrow-right ml-2 text-xs"></i>
    </a>
</div>

<style>
    #completed .swiper-slide {
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
    #completed .swiper-pagination-bullet {
        background: var(--text-muted);
        opacity: 0.5;
        transition: all 0.3s ease;
        width: 8px;
        height: 8px;
    }
    #completed .swiper-pagination-bullet-active {
        background: #22c55e;
        opacity: 1;
        width: 24px;
        border-radius: 4px;
    }
    @media (max-width: 480px) {
        #completed .swiper-slide {
            width: 160px !important;
            height: 290px !important;
        }
        #completed .swiper {
            height: 310px !important;
        }
    }
    @media (min-width: 481px) and (max-width: 768px) {
        #completed .swiper-slide {
            width: 190px !important;
            height: 330px !important;
        }
        #completed .swiper {
            height: 350px !important;
        }
    }
</style>

<script>
    new Swiper(".completedSwiper", {
        slidesPerView: "auto",
        spaceBetween: 12,
        loop: true,
        autoplay: {
            delay: 5500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: ".completedSwiper .swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            0: { spaceBetween: 8 },
            480: { spaceBetween: 10 },
            640: { spaceBetween: 12 },
            1024: { spaceBetween: 16 },
        },
    });
</script>
  <script>
  const swiper = new Swiper(".heroSwiper", {
  loop: true,
    speed: 800,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  }
  });
  const modal = document.getElementById('shareModal');
    const shareBtn = document.getElementById('shareBtn');
    const closeBtn = document.getElementById('closeModal');

    function openModal() {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeModalFn() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    shareBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModalFn);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModalFn();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModalFn();
    });

    // Copy link button
    document.getElementById('copyLinkBtn').addEventListener('click', function() {
      navigator.clipboard.writeText('${currentUrl}').then(() => {
        const original = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check" style="color:#22c55e;"></i><span class="label">Copied!</span>';
        setTimeout(() => { this.innerHTML = original; }, 2000);
      }).catch(() => {
        // Fallback
        const input = document.createElement('input');
        input.value = '${currentUrl}';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('Link copied!');
      });
    });
    document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("div").forEach(el => {
      el.dataset.dataServers = "BunnyCrholl";
      el.dataset.itemId = crypto.randomUUID();
  });
});
</script>
<div id="genres" class="w-full h-auto bg-[var(--bg-secondary)] flex flex-col justify-center items-center gap-4 text-left py-8 md:py-12 border-t border-[var(--border)]">
    <div class="w-full flex flex-col items-center gap-1">
        <h2 class="text-2xl md:text-3xl font-[Oswald] tracking-wide text-white relative inline-block">
            Browse Genres
            <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#06b6d4] rounded-full"></span>
        </h2>
        <p class="text-xs text-[var(--text-muted)] font-light tracking-widest uppercase mt-1">Discover by your favorite category</p>
    </div>

    <div class="w-full px-4 md:px-8 overflow-x-auto scrollbar-hide">
        <div class="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
            ${genres
              .map(
                (genre) => `
            <a href="${genre.slug || "#"}" class="inline-block px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-[#06b6d4] hover:border-[#06b6d4] transition-all duration-200 shadow-sm hover:shadow-[0_4px_15px_rgba(6,182,212,0.3)] active:scale-95">
                ${genre.title || "Unnamed"}
            </a>
            `,
              )
              .join("")}
        </div>
    </div>

    <a href="/genres" class="w-[85%] md:w-[60%] lg:w-[40%] py-3 bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-center rounded-full font-[Oswald] text-sm md:text-base tracking-wider text-white font-semibold shadow-lg shadow-[#06b6d4]/30 hover:shadow-[#06b6d4]/50 hover:scale-[1.02] transition-all duration-300 active:scale-95">
        View All Genres <i class="fas fa-arrow-right ml-2 text-xs"></i>
    </a>
</div>

<style>
    #genres .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    #genres .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    #genres .flex-wrap {
        justify-content: center;
    }
    @media (min-width: 640px) {
        #genres .flex-wrap {
            justify-content: flex-start;
        }
    }
</style>
<script>
/**
 * @typedef {Object} Sponsor
 * @property {string} imageUrl - The URL of the advertisement image.
 * @property {string} targetUrl - The destination URL when the ad is clicked.
 */

class AdManager {
    constructor({ containerId, sponsors = [] }) {
        this.containerId = containerId;
        this.sponsors = sponsors;
    }

    #getRandomSponsor() {
        if (!Array.isArray(this.sponsors) || this.sponsors.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * this.sponsors.length);
        return this.sponsors[randomIndex];
    }

    render() {
    console.log("render called");
        const container = document.getElementById(this.containerId);

        if (!container) {
            return;
        }

        const sponsor = this.#getRandomSponsor();
        console.log(sponsor);
        if (!sponsor) return;

        // Clear existing content
        container.innerHTML = "";

        // 1. Create a wrapper that takes up the full space of your Flexbox container
        const adWrapper = document.createElement("div");
        Object.assign(adWrapper.style, {
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        });

        // 2. Create the clickable link element
        const linkElement = document.createElement("a");
        linkElement.href = sponsor.targetUrl;
        linkElement.target = "_blank";
        linkElement.rel = "noopener noreferrer";
        Object.assign(linkElement.style, {
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        });

        // 3. Create the image element
        const imgElement = document.createElement("img");
        imgElement.src = sponsor.imageUrl;
        imgElement.alt = "Advertisement";

        // 4. The Magic CSS: This guarantees the picture NEVER gets cut off
        Object.assign(imgElement.style, {
            width: "100%",
            height: "100%",
            maxHeight: "400px", // Stops super tall portrait images from stretching the container too much
            objectFit: "contain", // FIT WITHOUT CROPPING (Na kete cover korbe)
            display: "block"
        });

        // 5. Create the Modern Branding Badge
        const brandBadge = document.createElement("div");
        brandBadge.innerText =
            "Marin Kitagawa Fan Page | ads by Media-BUNNYCRHOLL.ads.ko";
        Object.assign(brandBadge.style, {
            position: "absolute",
            bottom: "0",
            right: "0",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "#ffffff",
            fontSize: "10px",
            fontFamily: "sans-serif",
            padding: "5px 8px",
            pointerEvents: "none",
            borderTopLeftRadius: "8px", // Matches your modern container border-radius
            borderBottomRightRadius: "12px" // Matches the container's bottom corner
        });

        // 6. Assemble everything
        linkElement.appendChild(imgElement);
        adWrapper.appendChild(linkElement);
        adWrapper.appendChild(brandBadge);
        container.appendChild(adWrapper);
    }
}

// ==========================================
// Usage Implementation
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const sponsorData = [
        {
            imageUrl:
                "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyMHVubm1hODM3dGFpeW51bTM1NGdmMDd2Z3dqY2UyMzV5YjI5amk0biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bHmWgL6lpAfd3QlnT0/giphy.gif",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl:
                "https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyaXhwbHVwazlpYmozZTBkMzEyZTAwMzl3ajk4aTcyZWZ2M2xrdTVuYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Iyb8RamvYSRyYTWX19/giphy.gif",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl:
                "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyaGdnczdtYzAxOGk5d2d0dTNlMjFqZGIwN3ZhaGh6MmkxZXd5Zmx4YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/s9pS6i0QwwPNNhfJtk/giphy.gif",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl:
                "https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUydDJvczZ2bnVsdzgwMm55NGtzbDB2bmg3c2c0bzVpZnFkcmEybGg2YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4Hc0JQQCtsnXEmS3fN/giphy.gif",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl:
                "https://media1.giphy.com/media/v1.Y2lkPTZjMDliOTUyYmZiYXpid211d2x2bnc5NmEwczZkdWY1N2cxMGJ3ODc1dmgwMnVheCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GSScoaI9XMKmSGfrtN/giphy.gif",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl:
                "https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUycTRtMzg2cGlqOHE4NGpnN3oydnZicjJkYWw5bDVwZG1nbXhnOHBkeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rbgd25V68HMFlMUy0i/giphy.gif",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl: "https://i.ytimg.com/vi/p7gOOAop8gY/maxresdefault.jpg",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl: "https://i.imgur.com/cXSGwmv.jpeg",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl: "https://i.imgur.com/dFBfhq4.jpeg",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl: "https://i.imgur.com/IT78Vs6.jpeg",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl: "https://i.imgur.com/BYmlO80.jpeg",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl: "https://i.imgur.com/U54OpnQ.jpeg",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl: "https://i.imgur.com/6Lmswza.jpeg",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl: "https://i.imgur.com/4bEhnup.jpeg",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        },
        {
            imageUrl: "https://i.imgur.com/87beels.jpeg",
            targetUrl: "https://fan-marin-kitagawa.vercel.app/"
        }
    ];

    const bannerAd = new AdManager({
        containerId: "ad-container-78900",
        sponsors: sponsorData
    });

    bannerAd.render();
});</script>


<footer class="w-full bg-[var(--bg-surface)] border-t border-[var(--border)] py-12 px-4 md:px-8">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
      <div class="col-span-1 md:col-span-1 flex flex-col items-center md:items-start">
        <img src="1000135534-removebg-preview.png" alt="BunnyCrholl" class="h-40 w-auto object-contain mb-3" />
        <p class="text-[var(--text-muted)] text-sm leading-relaxed text-center md:text-left max-w-xs">
          BunnyCrholl doesn't host any videos on its server. We just index and arrange data that is already on the internet.
        </p>
        
    <div class="border-t border-[var(--border)] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
      <span class="text-[var(--text-muted)] text-xs font-light tracking-wider">
        &copy; 2026 BunnyCrholl. All rights reserved.
      </span>
      <span class="text-[var(--text-muted)] text-[10px] font-light tracking-wider">
        Made with <i class="fas fa-heart text-[var(--brand-primary)]"></i> for anime lovers
      </span>
    </div>
  </div>
</footer>

<style>
  footer a {
    text-decoration: none;
  }
  footer input::placeholder {
    color: var(--text-muted);
    font-weight: 300;
  }
  @media (max-width: 640px) {
    footer .grid {
      gap: 2rem;
    }
    footer .col-span-1 {
      text-align: center;
    }
    footer .col-span-1 ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem 1rem;
    }
    footer .col-span-1 ul li {
      width: auto;
    }
    footer .col-span-1:first-child {
      align-items: center;
    }
    footer form {
      flex-direction: column;
      max-width: 300px;
      margin: 0 auto;
    }
  }
  
</style>
<script>
// ============================================
// SWIPER RESPONSIVE INITIALIZATION
// Ensures all sliders are responsive on all devices
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // ----- Hero Swiper -----
  const heroSwiper = new Swiper('.heroSwiper', {
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    // No specific breakpoints needed – full width always
  });

  // ----- Trending Swiper -----
  new Swiper('.trendingSwiper', {
    slidesPerView: 'auto',
    spaceBetween: 12,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.trendingSwiper .swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      0: { spaceBetween: 8 },
      480: { spaceBetween: 10 },
      640: { spaceBetween: 12 },
      1024: { spaceBetween: 16 },
    },
  });

  // ----- Airing Swiper -----
  new Swiper('.airingSwiper', {
    slidesPerView: 'auto',
    spaceBetween: 12,
    loop: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.airingSwiper .swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      0: { spaceBetween: 8 },
      480: { spaceBetween: 10 },
      640: { spaceBetween: 12 },
      1024: { spaceBetween: 16 },
    },
  });

  // ----- Popular Swiper -----
  new Swiper('.popularSwiper', {
    slidesPerView: 'auto',
    spaceBetween: 12,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.popularSwiper .swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      0: { spaceBetween: 8 },
      480: { spaceBetween: 10 },
      640: { spaceBetween: 12 },
      1024: { spaceBetween: 16 },
    },
  });

  // ----- Completed Swiper -----
  new Swiper('.completedSwiper', {
    slidesPerView: 'auto',
    spaceBetween: 12,
    loop: true,
    autoplay: {
      delay: 5500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.completedSwiper .swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      0: { spaceBetween: 8 },
      480: { spaceBetween: 10 },
      640: { spaceBetween: 12 },
      1024: { spaceBetween: 16 },
    },
  });

  // ----- Optional: Re-init on window resize to fix any layout glitches -----
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll('.swiper').forEach(swiper => {
        if (swiper.swiper) swiper.swiper.update();
      });
    }, 250);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  
  function refreshSwipers() {
    document.querySelectorAll('.swiper').forEach(function(swiperEl) {
      if (swiperEl.swiper) {
        swiperEl.swiper.update();
        swiperEl.swiper.updateSize();
        swiperEl.swiper.updateSlides();
      }
    });
  }

  
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshSwipers, 200);
  });

  setTimeout(refreshSwipers, 500);
});

</script>
</body>
</html>
`;
  res.send(html);
});
app.get("/watch/:slug", async (req, res)=>{
  const {slug} = req.params;
  const {data} = await axios.get(`https://desidubanime.me/watch/${slug}`, {
    headers: {
      "User-Agent": _userAgent,
    }
  });

  const $ = cheerio.load(data);

  const videoLink = [];
  const animeInfo = [];

  $(".episode-player-box").each((i, el)=>{
    videoLink.push({
      vidSrc: $(el).find("iframe").attr("src") || null,
    })
  })

  $("#episode-page-detail").each((i, el)=>{
    animeInfo.push({
      title: $(el).find("h1").text().trim() || "BUNNY-SERVER_ANIME-VIDEO-TITLE",
      img: $(el).find("h1").text().trim() || "BUNNY-SERVER_ANIME-VIDEO-TITLE",
      banner: $(el).find("div.bg-cover").css("background-image").match(/url\(['"]?(.*?)['"]?\)/)?.[1] || null,
    })
  })

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BunnyCrholl | Watch Your Favorite Anime HD, Online Anime Streaming</title>
  <meta name="description" content="BunnyCrholl is the best website to watch anime online 2026. Stream English, Hindi subbed and dubbed episodes in HD quality. Enjoy fast, free, ad-free streaming. Watch your favorite anime now">
   <link rel="stylesheet" href="bunny-css-responsive-important.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Oswald:wght@200..700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <link rel="shortcut icon" href="../../BunnyCrholl.ico" type="image/x-icon">
  <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css"
/>
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
  width: 100vw;
  height: 100vh;
  overflow-x: hidden !important;
  font-family: "Lato", sans-serif;
}
  .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(4px);
      z-index: 9999999;
      display: none;
      justify-content: center;
      align-items: center;
    }
    .modal-overlay.active {
      display: flex;
    }
    .modal-box {
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      box-shadow: var(--shadow-lg);
      position: relative;
      animation: fadeIn 0.3s ease;
    }
    .modal-close {
      position: absolute;
      top: 12px;
      right: 16px;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.5rem;
      cursor: pointer;
      transition: color 0.2s;
    }
    .modal-close:hover {
      color: var(--text-primary);
    }
    .modal-title {
      font-family: 'Oswald', sans-serif;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      text-align: center;
      color: var(--text-primary);
    }
    .share-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
      gap: 1rem;
      justify-items: center;
    }
    .share-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 0.8rem 0.5rem;
      width: 100%;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      font-size: 0.75rem;
    }
    .share-btn:hover {
      background: var(--brand-primary);
      color: #fff;
      border-color: var(--brand-primary);
      transform: translateY(-3px);
    }
    .share-btn i {
      font-size: 1.8rem;
    }
    .share-btn .label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
</style>
</head>
<body>
  <header id="mainHeader" class="fixed top-0 left-0 w-full z-[999999] h-15 px-2 md:px-8 transition-all duration-300">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 group">
      <img src="../../1000135534-removebg-preview.png" alt="BunnyCrholl" class="absolute top-[-12] left-0 h-40 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
      <span class="font-[Oswald] text-xl font-bold text-white hidden sm:inline-block tracking-wider">
        Bunny<span class="text-[var(--brand-primary)]">Crholl</span>
      </span>
    </a>

    <nav class="hidden md:flex items-center gap-1 lg:gap-2">
      <a href="/" class="nav-link px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all duration-300 relative">
        Home
        <span class="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </a>
      <a href="/trending" class="nav-link px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all duration-300 relative">
        Trending
        <span class="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </a>
      <a href="/airing" class="nav-link px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all duration-300 relative">
        Airing
        <span class="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </a>
      <a href="/popular" class="nav-link px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all duration-300 relative">
        Popular
        <span class="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </a>
      <a href="/completed" class="nav-link px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all duration-300 relative">
        Completed
        <span class="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </a>
      <a href="/genres" class="nav-link px-4 py-2 rounded-full text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-all duration-300 relative">
        Genres
        <span class="absolute inset-0 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
      </a>
      <button id="searchToggle" class="ml-2 p-2 rounded-full text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-all duration-300">
        <i class="fas fa-search text-sm"></i>
      </button>
    </nav>

    <div class="flex items-center gap-2 md:hidden">
      <button id="searchToggleMobile" class="p-2 rounded-full text-[var(--text-secondary)] hover:text-white hover:bg-white/10 transition-all duration-300">
        <i class="fas fa-search text-sm"></i>
      </button>
      <button id="menuToggle" class="menu-btn relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all duration-300 group" aria-label="Toggle menu">
        <div class="menu-icon w-6 h-5 flex flex-col justify-between items-center relative">
          <span class="menu-bar block w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-left"></span>
          <span class="menu-bar block w-full h-0.5 bg-white rounded-full transition-all duration-300"></span>
          <span class="menu-bar block w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-left"></span>
        </div>
      </button>
    </div>
  </div>

  <div id="mobileOverlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 md:hidden"></div>

  <div id="mobileMenu" class="fixed top-0 right-0 w-[280px] sm:w-[320px] h-screen bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-l border-[var(--glass-border)] shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden z-[999999]">
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-5 border-b border-[var(--border)]">
        <span class="font-[Oswald] text-lg font-bold text-white">Menu</span>
        <button id="closeMenu" class="p-2 rounded-full hover:bg-white/10 transition-all duration-300">
          <i class="fas fa-times text-xl text-[var(--text-secondary)]"></i>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 px-5">
        <div class="flex flex-col gap-1">
          <a href="/" class="mobile-link flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200">
            <i class="fas fa-home w-5 text-center text-sm"></i>
            <span class="text-sm font-medium">Home</span>
          </a>
          <a href="/trending" class="mobile-link flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200">
            <i class="fas fa-fire w-5 text-center text-sm text-[var(--brand-primary)]"></i>
            <span class="text-sm font-medium">Trending</span>
          </a>
          <a href="/airing" class="mobile-link flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200">
            <i class="fas fa-play-circle w-5 text-center text-sm text-[var(--brand-secondary)]"></i>
            <span class="text-sm font-medium">Top Airing</span>
          </a>
          <a href="/popular" class="mobile-link flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200">
            <i class="fas fa-chart-line w-5 text-center text-sm text-[#a855f7]"></i>
            <span class="text-sm font-medium">Most Popular</span>
          </a>
          <a href="/completed" class="mobile-link flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200">
            <i class="fas fa-check-circle w-5 text-center text-sm text-[#22c55e]"></i>
            <span class="text-sm font-medium">Completed</span>
          </a>
          <a href="/genres" class="mobile-link flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-all duration-200">
            <i class="fas fa-tags w-5 text-center text-sm text-[#06b6d4]"></i>
            <span class="text-sm font-medium">Genres</span>
          </a>
        </div>

        <div class="my-4 h-px bg-[var(--border)]"></div>

<div class="flex flex-col gap-1"> </div>
      </nav>

      <div class="p-5 border-t border-[var(--border)]">
        <span class="text-[10px] text-[var(--text-muted)] font-light tracking-wider">© 2026 BunnyCrholl</span>
      </div>
    </div>
  </div>
</header>

<style>
  #mainHeader {
    background: rgba(20, 20, 22, 0.6);
    backdrop-filter: blur(16px) saturate(1.2);
    -webkit-backdrop-filter: blur(16px) saturate(1.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  #mainHeader.scrolled {
    background: rgba(11, 11, 13, 0.85);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  }

  .nav-link {
    position: relative;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 60%;
    height: 2px;
    background: linear-gradient(90deg, var(--brand-primary), var(--brand-secondary));
    border-radius: 2px;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .nav-link:hover::after {
    transform: translateX(-50%) scaleX(1);
  }

  .nav-link.active {
    color: white;
  }

  .nav-link.active::after {
    transform: translateX(-50%) scaleX(1);
  }

  #mobileMenu {
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  }
   #mobileMenu {
  transform: translateX(100%);
  }
  #mobileMenu.open {
    transform: translateX(0) !important;
  }

  #mobileOverlay.open {
    opacity: 1;
    pointer-events: auto;
  }

  .menu-btn.active .menu-bar:nth-child(1) {
    transform: rotate(45deg) translate(2px, 2px);
    width: 70%;
  }

  .menu-btn.active .menu-bar:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }

  .menu-btn.active .menu-bar:nth-child(3) {
    transform: rotate(-45deg) translate(2px, -2px);
    width: 70%;
  }

  .mobile-link {
    transition: all 0.2s ease;
  }

  .mobile-link:active {
    transform: scale(0.97);
  }

  #mobileMenu nav::-webkit-scrollbar {
    width: 3px;
  }

  #mobileMenu nav::-webkit-scrollbar-track {
    background: transparent;
  }

  #mobileMenu nav::-webkit-scrollbar-thumb {
    background: var(--brand-primary);
    border-radius: 10px;
  }
  

  @media (max-width: 640px) {
    #mainHeader {
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }

</style>

<script>
  (function() {
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');

    function openMenu() {
      mobileMenu.classList.add('open');
      mobileOverlay.classList.add('open');
      menuToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

function closeMenuFn() {
  mobileMenu.classList.remove("open");
  mobileOverlay.classList.remove("open");
  menuToggle.classList.remove("active");
  document.body.style.overflow = "";
}

window.closeMenuFn = closeMenuFn;

    menuToggle.addEventListener('click', openMenu);
    closeMenu.addEventListener('click', closeMenuFn);
    mobileOverlay.addEventListener('click', closeMenuFn);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenuFn();
      }
    });

    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    document.querySelectorAll('.mobile-link').forEach(function(link) {
      link.addEventListener('click', closeMenuFn);
    });

    document.getElementById('searchToggle')?.addEventListener('click', function() {
      alert('Search functionality coming soon!');
    });
    document.getElementById('searchToggleMobile')?.addEventListener('click', function() {
    
      alert('Search functionality coming soon!');
    });

    var currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link, .mobile-link').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href && href !== '/' && currentPath.startsWith(href)) {
        link.classList.add('active');
      } else if (href === '/' && currentPath === '/') {
        link.classList.add('active');
      }
    });
  })();
</script>
  <div id="app" class="relative w-full h-auto mt-15 flex flex-col justify-center items-center py-3">
  <div class="absolute inset-0 z-[8] info text-left px-2 py-4 text-3xl font-[Oswald]">
  <h2>${animeInfo[0]?.title}</h2></div>
  <iframe class="z-[8] w-full h-full border-none outline-none" src="${videoLink[0]?.vidSrc}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
  <div class="w-[100%] h-[200px]">
  allowfullscreen
  referrerpolicy="strict-origin-when-cross-origin"
  loading="eager"></iframe>
  </div>
  
  <img class="absolute inset-0 z-[1] w-full h-screen object-fit" src="${animeInfo[0]?.banner}">
  <div class="bg-black/90 absolute inset-0 z-[5] w-full h-screen backdrop-blur"></div>
  </div>
  </body>
</html>`
  res.send(html)
})
app.listen(_port, () => {
  console.log(`http://localhost:${_port}`);
});
