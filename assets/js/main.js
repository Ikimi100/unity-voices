(function () {
  "use strict";

  var GROUP = window.UV_GROUP;
  var DIRECT = "https://wa.me/2348037869734";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Navigation background + mobile call to action */
  var nav = document.querySelector(".nav");
  var hero = document.querySelector(".hero");
  var mobileCta = document.getElementById("mobile-cta");
  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      var pastTop = e.boundingClientRect.top < -40;
      nav.classList.toggle("is-solid", !e.isIntersecting || pastTop);
      var showCta = !e.isIntersecting;
      mobileCta.classList.toggle("is-visible", showCta);
      mobileCta.setAttribute("aria-hidden", showCta ? "false" : "true");
      mobileCta.querySelector("a").tabIndex = showCta ? 0 : -1;
    }, { threshold: [0, 0.05, 0.6] }).observe(hero);
  }
  window.addEventListener("scroll", function () {
    nav.classList.toggle("is-solid", window.scrollY > 40);
  }, { passive: true });

  /* Roles: stage plan + list */
  var ROLES = {
    singer: {
      title: "Good singers",
      text: "Strong, steady voices who can hold a melody, take a lead or a solo, and carry the congregation into praise. If people join in when you start a song, we want to hear you.",
      cta: "Introduce yourself as a singer"
    },
    chorister: {
      title: "Choristers",
      text: "Voices that blend and harmonise. You will learn your part (soprano, alto, tenor or bass) in rehearsal and carry corporate worship together with the whole choir.",
      cta: "Introduce yourself as a chorister"
    },
    keyboardist: {
      title: "Keyboardist",
      text: "Play for worship and rehearsals, follow the worship leader's flow, and give the choir its pitch and foundation.",
      cta: "Introduce yourself as a keyboardist"
    },
    guitarist: {
      title: "Lead guitarist",
      text: "Play lead lines and fills that lift the worship without crowding the voices, and lock in with the rest of the band.",
      cta: "Introduce yourself as a lead guitarist"
    },
    drummer: {
      title: "Drummer",
      text: "Keep a steady, sensitive groove that holds the whole team together, from quiet worship to high praise.",
      cta: "Introduce yourself as a drummer"
    }
  };

  var spots = document.querySelectorAll(".stage-svg .spot");
  var tabs = document.querySelectorAll(".role-tab");
  var roleTitle = document.getElementById("role-title");
  var roleText = document.getElementById("role-text");
  var roleCta = document.getElementById("role-cta");
  var roleSelect = document.getElementById("f-role");

  function selectRole(role) {
    var r = ROLES[role];
    if (!r) return;
    spots.forEach(function (s) {
      var on = s.getAttribute("data-role") === role;
      s.classList.toggle("is-active", on);
      s.setAttribute("aria-pressed", on ? "true" : "false");
    });
    tabs.forEach(function (t) {
      t.setAttribute("aria-pressed", t.getAttribute("data-role") === role ? "true" : "false");
    });
    roleTitle.textContent = r.title;
    roleText.textContent = r.text;
    roleCta.textContent = r.cta;
    roleCta.setAttribute("data-role", role);
  }

  spots.forEach(function (s) {
    s.addEventListener("click", function () { selectRole(s.getAttribute("data-role")); });
    s.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectRole(s.getAttribute("data-role")); }
    });
  });
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { selectRole(t.getAttribute("data-role")); });
  });
  roleCta.addEventListener("click", function () {
    var role = roleCta.getAttribute("data-role") || "chorister";
    roleSelect.value = role;
    updateMessage();
  });
  selectRole("chorister");

  /* The one orchestrated moment: open seats light up when the stage comes into view */
  var stageSvg = document.querySelector(".stage-svg");
  if (stageSvg) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      stageSvg.classList.add("is-lit");
    } else {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { stageSvg.classList.add("is-lit"); io.disconnect(); }
      }, { threshold: 0.35 });
      io.observe(stageSvg);
    }
  }

  /* Rehearsal countdown: every Saturday at 12:00 in Abuja (UTC+1, no daylight saving) */
  var cdD = document.getElementById("cd-d");
  var cdH = document.getElementById("cd-h");
  var cdM = document.getElementById("cd-m");
  var cdLabel = document.getElementById("countdown-label");
  function nextRehearsal(now) {
    var lagos = new Date(now.getTime() + 60 * 60 * 1000); // shift to Lagos wall-clock, read with UTC getters
    var day = lagos.getUTCDay();
    var daysAhead = (6 - day + 7) % 7;
    var target = Date.UTC(lagos.getUTCFullYear(), lagos.getUTCMonth(), lagos.getUTCDate() + daysAhead, 11, 0, 0); // 12:00 Lagos = 11:00 UTC
    var startedToday = false;
    if (target <= now.getTime()) {
      startedToday = daysAhead === 0;
      target += 7 * 24 * 60 * 60 * 1000;
    }
    return { target: target, startedToday: startedToday };
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    var now = new Date();
    var nr = nextRehearsal(now);
    var diff = Math.max(0, nr.target - now.getTime());
    var mins = Math.floor(diff / 60000);
    cdD.textContent = Math.floor(mins / 1440);
    cdH.textContent = pad(Math.floor((mins % 1440) / 60));
    cdM.textContent = pad(mins % 60);
    var lagosHour = new Date(now.getTime() + 3600000).getUTCHours();
    cdLabel.textContent = nr.startedToday && lagosHour < 15
      ? "Today's rehearsal started at 12 noon. The next one starts in"
      : "Next rehearsal starts in";
  }
  if (cdD) { tick(); setInterval(tick, 30000); }

  /* Areas + introduction builder */
  var areaSelect = document.getElementById("f-area");
  var areaButtons = document.querySelectorAll(".area");
  var areaStatus = document.getElementById("area-status");
  function markArea(name) {
    areaButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-area") === name ? "true" : "false");
    });
  }
  areaButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      var name = b.getAttribute("data-area");
      areaSelect.value = name;
      markArea(name);
      updateMessage();
      areaStatus.textContent = name + " added to your introduction.";
    });
  });
  areaSelect.addEventListener("change", function () { markArea(areaSelect.value); });

  var ROLE_PHRASE = {
    singer: "a lead singer",
    chorister: "a chorister",
    keyboardist: "a keyboardist",
    guitarist: "a lead guitarist",
    drummer: "a drummer",
    other: "an instrumentalist"
  };
  var form = document.getElementById("intro-form");
  var msgEl = document.getElementById("intro-message");
  var copyOpen = document.getElementById("copy-open");
  var sendDirect = document.getElementById("send-direct");
  var copyStatus = document.getElementById("copy-status");

  function buildMessage() {
    var name = document.getElementById("f-name").value.trim();
    var role = roleSelect.value;
    var detail = document.getElementById("f-detail").value.trim();
    var area = areaSelect.value;
    var memberInput = form.querySelector('input[name="member"]:checked');
    var member = memberInput ? memberInput.value : "no";

    var lines = [];
    lines.push("Hello Unity Voices! " + (name ? "My name is " + name + "." : "I'd love to join the choir."));
    var serve = "I want to serve as " + ROLE_PHRASE[role] + (detail ? " (" + detail + ")" : "") + ".";
    lines.push(serve);
    if (area && area !== "Somewhere else in Abuja") {
      lines.push("I live in " + area + ".");
    } else if (area) {
      lines.push("I live in Abuja.");
    }
    lines.push(member === "yes"
      ? "I'm a member of Unity Worship Centre."
      : "I'm not yet a member of Unity Worship Centre, and I'm ready to become one.");
    lines.push("I'll be at rehearsal on Saturday at 12 noon.");
    return lines.join("\n");
  }

  function updateMessage() {
    var msg = buildMessage();
    msgEl.textContent = msg;
    sendDirect.href = DIRECT + "?text=" + encodeURIComponent(msg);
  }
  form.addEventListener("input", updateMessage);
  form.addEventListener("change", updateMessage);
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  updateMessage();

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (err) { reject(err); }
      document.body.removeChild(ta);
    });
  }
  copyOpen.addEventListener("click", function () {
    copyText(buildMessage()).then(function () {
      copyStatus.textContent = "Message copied. Join the group, then paste it there.";
    }, function () {
      copyStatus.textContent = "Couldn't copy automatically. Select the message above and copy it, then paste it in the group.";
    });
  });

  /* Gallery lightbox */
  var items = Array.prototype.slice.call(document.querySelectorAll(".g-item button"));
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-cap");
  var current = 0;
  var lastFocus = null;
  function show(i) {
    current = (i + items.length) % items.length;
    var b = items[current];
    var img = b.querySelector("img");
    lbImg.src = b.getAttribute("data-full");
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt + " (" + (current + 1) + " of " + items.length + ")";
  }
  if (lb && typeof lb.showModal === "function") {
    items.forEach(function (b, i) {
      b.addEventListener("click", function () {
        lastFocus = b;
        show(i);
        lb.showModal();
      });
    });
    document.getElementById("lb-close").addEventListener("click", function () { lb.close(); });
    document.getElementById("lb-prev").addEventListener("click", function () { show(current - 1); });
    document.getElementById("lb-next").addEventListener("click", function () { show(current + 1); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener("close", function () { lbImg.src = ""; if (lastFocus) lastFocus.focus(); });
    var startX = null;
    lb.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
      startX = null;
    });
  } else {
    items.forEach(function (b) {
      b.addEventListener("click", function () { window.open(b.getAttribute("data-full"), "_blank"); });
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
