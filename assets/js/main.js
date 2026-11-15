/* 大成广告装饰 · 交互脚本 */
(function () {
  "use strict";

  var head = document.getElementById("head");
  var hero = document.querySelector(".hero");

  /* 顶部导航：滚出首屏后变为实底 */
  if (head && hero) {
    var onScroll = function () {
      var threshold = hero.offsetHeight - head.offsetHeight - 40;
      head.classList.toggle("is-stuck", window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  /* 滚动进场 */
  var items = document.querySelectorAll("[data-reveal]");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!items.length) return;

  if (reduce || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(items, function (el) {
      el.classList.add("is-in");
    });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  Array.prototype.forEach.call(items, function (el, i) {
    el.style.transitionDelay = Math.min(i % 4, 3) * 70 + "ms";
    io.observe(el);
  });

  /* 导航按钮：优先调用系统内置地图（iOS 用苹果地图，安卓用系统地图选择器） */
  var navLinks = document.querySelectorAll("[data-nav]");
  if (navLinks.length) {
    var ua = navigator.userAgent;
    var isIOS = /iPad|iPhone|iPod/.test(ua);
    var isAndroid = /Android/i.test(ua);

    Array.prototype.forEach.call(navLinks, function (el) {
      el.addEventListener("click", function (e) {
        var q = el.getAttribute("data-nav");
        if (!q) return;

        var nativeUrl = "";
        if (isIOS) nativeUrl = "https://maps.apple.com/?q=" + encodeURIComponent(q);
        else if (isAndroid) nativeUrl = "geo:0,0?q=" + encodeURIComponent(q);

        if (!nativeUrl) return; // 桌面端沿用高德网页版
        e.preventDefault();
        window.location.href = nativeUrl;
      });
    });
  }

  /* 页脚年份 */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
