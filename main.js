/* Discount Beds Belfast: shared page behaviour for index.html and ottoman-offer.html.
   Every feature here supports a conversion (call, callback / reservation, showroom visit)
   or measures one (analytics, call tracking, A/B test). */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var PAGE = document.body.getAttribute("data-page") || "page";
  var params = new URLSearchParams(location.search);
  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Analytics: consent-gated GA4 ---------- */
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  // Google Consent Mode: nothing is stored until the visitor accepts.
  gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });

  var variant = null;
  function track(event, data) {
    var payload = Object.assign({ page: PAGE, variant: variant, source: store.sget("utm_source") || "direct" }, data || {});
    gtag("event", event, payload);
  }

  function loadGA() {
    if (!CFG.ga4Id || window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(CFG.ga4Id);
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", CFG.ga4Id);
  }

  function setConsent(granted) {
    store.set("consent", granted ? "granted" : "denied");
    gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
    if (granted) loadGA();
  }

  (function consentBanner() {
    var choice = store.get("consent");
    if (choice === "granted") { setConsent(true); return; }
    if (choice === "denied") return;
    var el = document.createElement("div");
    el.className = "consent";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "Cookie preferences");
    el.innerHTML = '<p><strong>Can we measure your visit?</strong> Analytics cookies only, never advertising. <a href="privacy.html#cookies">Read more</a></p>' +
      '<div class="consent-actions"><button class="btn btn-ghost" data-consent="no">No thanks</button><button class="btn btn-primary" data-consent="yes">Accept</button></div>';
    document.body.appendChild(el);
    // Keep the first screen clear for the hero CTAs: ask once the visitor scrolls past the hero.
    var show = function () { el.classList.add("show"); };
    var hero = document.querySelector(".hero, .pdp");
    if (hero && "IntersectionObserver" in window) {
      var seen = false;
      new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) seen = true;
          else if (seen) { show(); obs.disconnect(); }
        });
      }, { threshold: 0.4 }).observe(hero);
    } else { requestAnimationFrame(show); }
    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-consent]");
      if (!b) return;
      setConsent(b.getAttribute("data-consent") === "yes");
      el.remove();
    });
  })();

  /* ---------- Traffic source + call tracking (dynamic number insertion) ---------- */
  ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach(function (k) {
    if (params.get(k)) store.sset(k, params.get(k).toLowerCase());
  });
  (function swapPhone() {
    var ph = CFG.phone || {};
    var src = store.sget("utm_source");
    var pick = (ph.byPage && ph.byPage[PAGE]) || (src && ph.bySource && ph.bySource[src]) || null;
    if (!pick || !pick.tel) return;
    $$("[data-phone]").forEach(function (a) { a.setAttribute("href", "tel:" + pick.tel); });
    $$("[data-phone-display]").forEach(function (s) { s.textContent = pick.display; });
  })();

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track]");
    if (!el) return;
    var href = el.getAttribute("href") || "";
    track(href.indexOf("tel:") === 0 ? "phone_call_click" : "cta_click", { cta: el.getAttribute("data-track") });
  });

  /* ---------- A/B test: hero headline (force with ?v=a or ?v=b) ---------- */
  var headline = $("#hero-headline");
  if (headline && headline.hasAttribute("data-variant-a")) {
    variant = (params.get("v") || store.get("hero_variant") || (Math.random() < 0.5 ? "a" : "b")).toLowerCase();
    if (variant !== "a" && variant !== "b") variant = "a";
    store.set("hero_variant", variant);
    headline.textContent = headline.getAttribute("data-variant-" + variant);
    track("ab_exposure", { test: "hero_headline" });
  }

  /* ---------- Ad-matched copy on campaign pages (?utm_content=storage | price | showroom) ---------- */
  var adKey = params.get("utm_content") || store.sget("utm_content");
  if (adKey) {
    $$("[data-ad-" + adKey + "]").forEach(function (el) { el.textContent = el.getAttribute("data-ad-" + adKey); });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = $(".icon-btn[aria-controls]");
  var nav = $("#main-nav");
  function closeMenu() { if (!nav) return; nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.innerHTML = '<i class="ph ph-list"></i>'; }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.innerHTML = open ? '<i class="ph ph-x"></i>' : '<i class="ph ph-list"></i>';
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  }

  /* ---------- Opening hours (Belfast time) ---------- */
  function belfastNow() {
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", weekday: "short", hour: "numeric", hour12: false }).formatToParts(new Date());
    var m = {};
    parts.forEach(function (p) { m[p.type] = p.value; });
    return { day: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[m.weekday], hour: parseInt(m.hour, 10) % 24 };
  }
  var now = belfastNow();
  var workday = now.day >= 1 && now.day <= 6;
  var isOpen = workday && now.hour >= 10 && now.hour < 17;
  if ($("#open-status")) {
    $("#open-status").textContent = isOpen ? "Open now until 5pm" : "Open Monday to Saturday, 10am to 5pm";
    if (!isOpen && $("#open-dot")) $("#open-dot").classList.add("closed");
  }
  $$('#hours [data-day="' + now.day + '"]').forEach(function (el) { el.classList.add("today"); });
  if ($("#year")) $("#year").textContent = new Date().getFullYear();

  // When will we call back? Said plainly in the form and on the thank-you screen.
  function callbackWhen() {
    if (workday && now.hour < 10) return "today after 10am";
    if (workday && now.hour < 16) return "today before 5pm";
    if (now.day === 6 || now.day === 0) return "on Monday from 10am";
    return "tomorrow from 10am";
  }

  /* ---------- Details deep links (#returns, #delivery) ---------- */
  function openDetails(id) { var d = document.getElementById(id); if (d && d.tagName === "DETAILS") d.open = true; }
  $$("[data-open]").forEach(function (a) { a.addEventListener("click", function () { openDetails(a.getAttribute("data-open")); }); });
  if (location.hash) openDetails(location.hash.slice(1));

  /* ---------- Reviews (only real ones, from config.js) ---------- */
  var rv = CFG.reviews || {};
  var reviewsEl = $("#reviews");
  if (reviewsEl && rv.items && rv.items.length) {
    var stars = '<span class="stars" aria-hidden="true">' + new Array(6).join('<i class="ph-fill ph-star"></i>') + "</span>";
    reviewsEl.innerHTML = '<div class="wrap"><div class="rating-line">' + stars +
      (rv.rating ? "<strong>" + rv.rating + " out of 5</strong>" : "") +
      (rv.count ? '<span class="muted">from ' + rv.count + " Google reviews</span>" : "") +
      (rv.url ? '<a class="text-link" href="' + rv.url + '" target="_blank" rel="noopener">Read them on Google</a>' : "") +
      '</div><div class="review-grid">' + rv.items.slice(0, 3).map(function (r) {
        return '<figure class="testimonial" style="margin:0"><blockquote>“' + r.text + '”</blockquote><cite>' + r.name + (r.area ? ' <span>' + r.area + '</span>' : '') + '</cite></figure>';
      }).join("") + "</div></div>";
    reviewsEl.hidden = false;
  }

  /* ---------- Real showroom media (config.js) replaces the stock photo when supplied ---------- */
  var media = $("#why-media");
  var sr = CFG.showroom || {};
  if (media && (sr.video || sr.photo)) {
    var first = media.querySelector("img");
    if (sr.video) {
      var f = document.createElement("iframe");
      f.src = sr.video; f.title = "Walk around the Discount Beds Belfast showroom"; f.loading = "lazy";
      f.allow = "accelerometer; encrypted-media; picture-in-picture"; f.allowFullscreen = true;
      f.style.cssText = "width:100%;aspect-ratio:4/5;border:0;border-radius:24px;display:block";
      first.replaceWith(f);
    } else { first.src = sr.photo; first.alt = "Inside the Discount Beds Belfast showroom"; }
  }

  /* ---------- Product grid ---------- */
  var grid = $("#products");
  var PAGE_SIZE = 8;
  var shop = { cat: "all", q: "", sort: "popular", expanded: false };
  var catLabel = window.CATEGORIES || {};

  function money(n) { return "£" + n.toLocaleString("en-GB"); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function card(p) {
    var href = p.link || "#callback";
    var attrs = p.link ? "" : ' data-product="' + esc(p.name) + '"';
    var badge = p.was ? '<span class="badge badge-promo">Save ' + money(p.was - p.price) + "</span>" : (p.rank <= 3 ? '<span class="badge badge-ink">Best seller</span>' : "");
    return '<article class="product">' +
      '<a class="product-thumb" href="' + href + '"' + attrs + ' tabindex="-1" aria-hidden="true">' + badge + '<img src="' + p.img + '" alt="" loading="lazy"></a>' +
      '<div class="product-info"><span class="product-cat">' + esc(catLabel[p.cat] || "") + '</span>' +
      '<h3><a href="' + href + '"' + attrs + ">" + esc(p.name) + "</a></h3>" +
      '<p class="product-price">From <b>' + money(p.price) + "</b>" + (p.was ? "<s>" + money(p.was) + "</s>" : "") + "</p>" +
      '<p class="product-meta">' + esc(p.detail || "") + "</p></div>" +
      '<a class="btn btn-ghost" href="' + href + '"' + attrs + ">" + (p.link ? "View offer" : "Check availability") + "</a>" +
      "</article>";
  }

  function renderShop() {
    if (!grid || !window.PRODUCTS) return;
    var q = shop.q.trim().toLowerCase();
    var list = window.PRODUCTS.filter(function (p) {
      return (shop.cat === "all" || p.cat === shop.cat) &&
        (!q || (p.name + " " + (catLabel[p.cat] || "") + " " + (p.detail || "")).toLowerCase().indexOf(q) > -1);
    }).sort(function (a, b) {
      if (shop.sort === "price-asc") return a.price - b.price;
      if (shop.sort === "price-desc") return b.price - a.price;
      return a.rank - b.rank;
    });
    var shown = shop.expanded ? list : list.slice(0, PAGE_SIZE);
    grid.innerHTML = shown.map(card).join("");
    grid.hidden = list.length === 0;
    $("#empty").classList.toggle("show", list.length === 0);
    var plural = { all: "products", mattress: "mattresses", ottoman: "ottoman beds", divan: "divan beds", upholstered: "upholstered beds", bunk: "bunk and kids beds", sofa: "sofas and sofa beds" };
    $("#result-count").textContent = list.length ? "Showing " + shown.length + " of " + list.length + " " + plural[shop.cat] : "";
    var more = $("#show-more");
    more.hidden = list.length <= shown.length;
    more.textContent = "Show all " + list.length;
  }

  function setCat(cat) {
    shop.cat = cat; shop.expanded = false;
    $$(".filters .pill-tab").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === cat)); });
    renderShop();
  }

  if (grid) {
    $$(".filters .pill-tab").forEach(function (b) { b.addEventListener("click", function () { setCat(b.getAttribute("data-cat")); }); });
    $("#search").addEventListener("input", function (e) { shop.q = e.target.value; shop.expanded = false; renderShop(); });
    $("#sort").addEventListener("change", function (e) { shop.sort = e.target.value; renderShop(); });
    $("#show-more").addEventListener("click", function () { shop.expanded = true; renderShop(); track("show_all_products", { cat: shop.cat }); });
    // Every nav pill, category card and footer link filters in-page, so they all behave the same way.
    $$("a[data-filter]").forEach(function (a) {
      a.addEventListener("click", function () {
        shop.q = ""; $("#search").value = "";
        setCat(a.getAttribute("data-filter"));
        track("category_click", { cat: a.getAttribute("data-filter") });
      });
    });
    var catParam = params.get("cat");
    if (catParam && catLabel[catParam]) setCat(catParam); else renderShop();
  }

  /* ---------- Lead / reservation form ---------- */
  var form = $("#lead-form");
  var cardEl = $("#form-card");
  if (form && cardEl) {
    var el = form.elements;
    var alertBox = $("#form-alert");
    var replyEmail = function () { return el.reply_by && el.reply_by.value === "email"; };

    // Best practice: auto-fill known details for repeat visitors.
    ["name", "phone", "email"].forEach(function (k) { if (el[k] && store.get("lead_" + k)) el[k].value = store.get("lead_" + k); });

    var when = $("#f-when");
    if (when) when.textContent = "We aim to call you " + callbackWhen() + ". Opening hours are Mon to Sat, 10am to 5pm.";

    // Phone or email reply.
    function syncReply() {
      if (!el.reply_by) return;
      var byEmail = replyEmail();
      $("#phone-field").hidden = byEmail;
      $("#email-field").hidden = !byEmail;
      el.phone.required = !byEmail;
      el.email.required = byEmail;
    }
    $$('input[name="reply_by"]', form).forEach(function (r) { r.addEventListener("change", syncReply); });
    syncReply();

    // "Check availability" etc: pre-fill the product, then put the cursor in the first empty field.
    var guess = function (name) {
      var n = name.toLowerCase();
      if (/landlord/.test(n)) return "Landlord order";
      if (/sofa|recliner/.test(n)) return "Sofa or sofa bed";
      if (/bunk|sleeper|cabin/.test(n)) return "Bunk or kids bed";
      if (/ottoman|gaslift/.test(n)) return "Ottoman bed";
      if (/divan/.test(n)) return "Divan bed";
      if (/mattress/.test(n)) return "Mattress";
      return "Upholstered bed";
    };
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href="#callback"], a[href="#reserve"]');
      if (!a) return;
      var product = a.getAttribute("data-product");
      if (product && el.message && el.message.tagName === "TEXTAREA") {
        el.message.value = "I'm interested in the " + product + ".";
        if (el.interest && el.interest.tagName === "SELECT") el.interest.value = guess(product);
      }
      setTimeout(function () {
        var target = [el.name, replyEmail() ? el.email : el.phone].filter(function (f) { return f && !f.value; })[0] || el.name;
        if (target) target.focus({ preventScroll: true });
      }, 500);
    });

    var rules = [
      [function () { return el.name; }, function (v) { return v.length > 1; }],
      [function () { return replyEmail() ? null : el.phone; }, function (v) { return v.replace(/\D/g, "").length >= 10; }],
      [function () { return replyEmail() ? el.email : null; }, function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }],
      [function () { return el.interest && el.interest.tagName === "SELECT" ? el.interest : null; }, function (v) { return v !== ""; }]
    ];
    function check(rule) {
      var f = rule[0]();
      if (!f) return true;
      var ok = rule[1](f.value.trim());
      f.closest(".field").classList.toggle("invalid", !ok);
      f.setAttribute("aria-invalid", String(!ok));
      return ok;
    }
    form.addEventListener("input", function (e) {
      var wrap = e.target.closest(".field");
      if (wrap && wrap.classList.contains("invalid")) rules.forEach(function (r) { if (r[0]() === e.target) check(r); });
    });

    function done() {
      var first = el.name.value.trim().split(" ")[0];
      $("#done-name").textContent = first;
      $("#done-msg").innerHTML = replyEmail()
        ? "We'll email <strong>" + esc(el.email.value.trim()) + "</strong>, aiming for the end of the next working day."
        : "We aim to call you on <strong>" + esc(el.phone.value.trim()) + "</strong> " + callbackWhen() + ".";
      cardEl.classList.remove("sending");
      cardEl.classList.add("sent");
      track("generate_lead", { form: PAGE, interest: el.interest ? el.interest.value : "" });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      alertBox.classList.remove("show");
      var bad = rules.filter(function (r) { return !check(r); });
      if (bad.length) { bad[0][0]().focus(); return; }

      ["name", "phone", "email"].forEach(function (k) { if (el[k] && el[k].value.trim()) store.set("lead_" + k, el[k].value.trim()); });
      cardEl.classList.add("sending");

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.source = store.sget("utm_source") || "direct";
      data.campaign = store.sget("utm_campaign") || "";
      data.variant = variant || "";

      if (!CFG.formEndpoint) {
        // Demo mode: no endpoint configured yet (see SETUP.md). Nothing is sent.
        console.info("[demo] form not sent, set formEndpoint in js/config.js", data);
        setTimeout(done, 500);
        return;
      }
      fetch(CFG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () {
          cardEl.classList.remove("sending");
          alertBox.innerHTML = 'Sorry, that didn\'t send. Please try again, or call us on <a href="tel:+442890453723">028 9045 3723</a>.';
          alertBox.classList.add("show");
          track("lead_error", { form: PAGE });
        });
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver only) ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("in"); });
  }
})();
