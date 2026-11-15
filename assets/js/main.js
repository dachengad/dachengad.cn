/* 大成广告装饰 · 交互脚本 */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. 顶部导航：滚出首屏后变实底 ---------- */
  const head = document.getElementById("head");
  const hero = document.querySelector(".hero");

  if (head && hero) {
    const syncHead = () => {
      const threshold = hero.offsetHeight - head.offsetHeight - 40;
      head.classList.toggle("is-stuck", window.scrollY > threshold);
    };
    syncHead();
    window.addEventListener("scroll", syncHead, { passive: true });
    window.addEventListener("resize", syncHead, { passive: true });
  }

  /* ---------- 2. 移动端全屏菜单 ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const mnav = document.getElementById("mnav");

  if (menuBtn && mnav) {
    let hideTimer = 0;
    const isMenuOpen = () => mnav.classList.contains("is-open");

    const openMenu = () => {
      window.clearTimeout(hideTimer);
      mnav.hidden = false;
      void mnav.offsetHeight; // 强制回流，保证淡入过渡生效
      mnav.classList.add("is-open");
      document.body.classList.add("nav-open");
      if (head) head.classList.add("is-menu");
      menuBtn.classList.add("is-open");
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", "关闭导航");
    };

    const closeMenu = () => {
      if (!isMenuOpen()) return;
      mnav.classList.remove("is-open");
      menuBtn.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "打开导航");
      document.body.classList.remove("nav-open");
      if (head) head.classList.remove("is-menu");
      hideTimer = window.setTimeout(() => {
        mnav.hidden = true;
      }, 260);
    };

    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isMenuOpen()) closeMenu();
      else openMenu();
    });

    // 点任意锚点后收起菜单（默认跳转在事件之后执行，不会被滚动锁挡住）
    mnav.addEventListener("click", (e) => {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMenuOpen()) closeMenu();
    });

    window.addEventListener(
      "resize",
      () => {
        if (window.innerWidth > 900) closeMenu();
      },
      { passive: true }
    );
  }

  /* ---------- 3. 滚动进场 ---------- */
  const revealItems = document.querySelectorAll("[data-reveal]");

  if (revealItems.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
      );

      revealItems.forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
        io.observe(el);
      });
    }
  }

  /* ---------- 4. 导航高亮：滚到哪个区块就点亮对应入口 ---------- */
  const navAnchors = document.querySelectorAll('.nav a[href^="#"], .mnav__list a[href^="#"]');
  const spySections = document.querySelectorAll("main section[id]");

  if (navAnchors.length && spySections.length && "IntersectionObserver" in window) {
    const linksById = new Map();
    navAnchors.forEach((link) => {
      const id = link.getAttribute("href").slice(1);
      if (!linksById.has(id)) linksById.set(id, []);
      linksById.get(id).push(link);
    });

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navAnchors.forEach((link) => link.classList.remove("is-active"));
          (linksById.get(entry.target.id) || []).forEach((link) =>
            link.classList.add("is-active")
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    spySections.forEach((section) => spy.observe(section));
  }

  /* ---------- 5. 导航按钮：优先调用系统内置地图 ---------- */
  const navLinks = document.querySelectorAll("[data-nav]");

  if (navLinks.length) {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isAndroid = /Android/i.test(ua);

    navLinks.forEach((el) => {
      el.addEventListener("click", (e) => {
        const query = el.dataset.nav;
        if (!query) return;

        let nativeUrl = "";
        if (isIOS) nativeUrl = `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
        else if (isAndroid) nativeUrl = `geo:0,0?q=${encodeURIComponent(query)}`;

        if (!nativeUrl) return; // 桌面端沿用高德网页版
        e.preventDefault();
        window.location.href = nativeUrl;
      });
    });
  }

  /* ---------- 6. 作品集：按类别筛选 ---------- */
  const filters = document.getElementById("filters");

  if (filters) {
    const chips = Array.from(filters.querySelectorAll(".chip"));
    const shots = Array.from(document.querySelectorAll(".shot"));
    const count = document.getElementById("shotsCount");

    const applyFilter = (cat) => {
      let shown = 0;
      shots.forEach((shot) => {
        const show = cat === "all" || shot.dataset.cat === cat;
        shot.hidden = !show;
        if (show) shown += 1;
      });
      chips.forEach((chip) => {
        const on = chip.dataset.cat === cat;
        chip.classList.toggle("is-on", on);
        chip.setAttribute("aria-pressed", String(on));
      });
      if (count) count.textContent = `共 ${shown} 张`;
    };

    chips.forEach((chip) => {
      chip.addEventListener("click", () => applyFilter(chip.dataset.cat));
    });
  }

  /* ---------- 7. 作品大图：缩略图先显示，清晰图按需加载 ---------- */
  const lb = document.getElementById("lb");

  if (lb) {
    const lbImg = lb.querySelector(".lb__img");
    const lbSource = lb.querySelector(".lb__source");
    const lbThumb = lb.querySelector(".lb__thumb");
    const lbCap = lb.querySelector(".lb__cap");
    const lbClose = lb.querySelector(".lb__close");
    const lbPrev = lb.querySelector(".lb__nav--prev");
    const lbNext = lb.querySelector(".lb__nav--next");
    let lastFocus = null;
    let current = null;

    const visibleFigs = () =>
      Array.from(document.querySelectorAll("[data-lightbox]")).filter((fig) => !fig.hidden);

    const buildCaption = (fig) => {
      const cap = fig.querySelector("figcaption");
      if (!cap) return "";
      const label = cap.querySelector("span");
      const labelText = label ? label.textContent.trim() : "";
      const title = cap.textContent.trim().replace(labelText, "").trim();
      return labelText ? `${labelText} · ${title}` : title;
    };

    const openLb = (fig) => {
      const img = fig.querySelector("img");
      if (!img || !fig.dataset.full) return;
      current = fig;
      lastFocus = fig;

      // 已缓存的缩略图立即铺上，避免白屏
      lbThumb.src = img.currentSrc || img.src;
      lbThumb.classList.remove("is-hidden");

      lbImg.classList.remove("is-ready");
      lbImg.alt = img.alt || "";
      lbImg.onload = () => {
        lbImg.classList.add("is-ready");
        lbThumb.classList.add("is-hidden");
      };
      if (lbSource) lbSource.srcset = `${fig.dataset.full}.webp`;
      lbImg.src = `${fig.dataset.full}.jpg`;

      lbCap.textContent = buildCaption(fig);

      lb.hidden = false;
      document.body.classList.add("lb-open");
      requestAnimationFrame(() => lb.classList.add("is-open"));
      lbClose.focus({ preventScroll: true });
    };

    const step = (dir) => {
      const list = visibleFigs();
      if (!list.length || !current) return;
      let i = list.indexOf(current);
      if (i < 0) i = 0;
      openLb(list[(i + dir + list.length) % list.length]);
    };

    const closeLb = () => {
      lb.classList.remove("is-open");
      document.body.classList.remove("lb-open");
      current = null;
      window.setTimeout(() => {
        lb.hidden = true;
        lbImg.removeAttribute("src");
        lbThumb.removeAttribute("src");
      }, 280);
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };

    document.querySelectorAll("[data-lightbox]").forEach((fig) => {
      const img = fig.querySelector("img");
      if (!img) return;

      fig.setAttribute("role", "button");
      fig.tabIndex = 0;
      fig.setAttribute("aria-label", `${img.alt || "作品"}，点击看大图`);

      fig.addEventListener("click", () => openLb(fig));
      fig.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLb(fig);
        }
      });
    });

    if (lbPrev) lbPrev.addEventListener("click", () => step(-1));
    if (lbNext) lbNext.addEventListener("click", () => step(1));
    lbClose.addEventListener("click", closeLb);
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLb();
    });
    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft" && lbPrev) step(-1);
      else if (e.key === "ArrowRight" && lbNext) step(1);
    });
  }

  /* ---------- 8. 页脚年份 ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
