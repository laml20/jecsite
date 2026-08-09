/*
 * script.js — the invitation page (a7f3k9/index.html).
 * Envelope load sequence, sparkle transition, audio, countdown,
 * scroll reveals, RSVP modal, pull-to-return. See website-spec.md.
 */
(function () {
  'use strict';

  /* ==========================================================
     Config
     ========================================================== */
  // Deployed Apps Script web app (§9.1, checklist.md §6). Empty string
  // would run the RSVP modal in mock mode; live endpoint is wired in.
  var RSVP_ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbwcRLkhaVRb5KR9CdKxc8g80sGAt8ekpA19RkZzupI-OtJvQaXF7nHiyO9cKCHm4F8a/exec';

  // Mirrors the Invitados sheet shape (§9.2) for local testing.
  var MOCK_GUESTS = [
    { phone: '2815550134', name: 'Familia Ramírez', allotment: 5, lang: 'es' },
    { phone: '7135550199', name: 'Tía Carmen', allotment: 1, lang: 'en' }
  ];

  // TODO: real fallback number for the SMS escape hatch (§9.4 Step 5, checklist.md §6).
  var HOST_SMS_NUMBER = '+18325550100';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================
     Language toggle
     ========================================================== */
  function initLangToggle() {
    var lang = window.i18n.detectDefaultLang();
    window.i18n.applyLang(lang);
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.i18n.markToggled();
        window.i18n.applyLang(btn.getAttribute('data-lang-btn'));
      });
    });
  }

  /* ==========================================================
     Envelope — screen 1 (§5) + sparkle transition (§6)
     ========================================================== */
  var envelopeScreen, invitationScreen, envelopeWrap, envelopeBtn, headerControls;
  var nudgeTimer, envelopeOpened = false;

  function initEnvelope() {
    envelopeScreen = document.getElementById('envelope-screen');
    invitationScreen = document.getElementById('invitation-screen');
    envelopeWrap = document.getElementById('envelope-wrap');
    envelopeBtn = document.getElementById('envelope-btn');
    headerControls = document.getElementById('main-header-controls');

    document.body.classList.add('pre-reveal');

    nudgeTimer = setTimeout(function () {
      envelopeWrap.classList.add('is-nudging');
      setTimeout(function () { envelopeWrap.classList.remove('is-nudging'); }, 700);
    }, 10000);

    envelopeBtn.addEventListener('click', function onOpen() {
      envelopeBtn.removeEventListener('click', onOpen);
      clearTimeout(nudgeTimer);
      openEnvelope();
    });

    idle(function () {
      var sfx = document.getElementById('sfx');
      var music = document.getElementById('music');
      if (sfx) sfx.load();
      if (music) music.load();
    });
  }

  function idle(fn) {
    if ('requestIdleCallback' in window) window.requestIdleCallback(fn);
    else setTimeout(fn, 500);
  }

  function openEnvelope() {
    var sfx = document.getElementById('sfx');
    var music = document.getElementById('music');

    // §8 — .play() must be called synchronously inside the tap handler.
    try { sfx.currentTime = 0; sfx.play().catch(function () {}); } catch (e) {}
    music.volume = 0;
    var playPromise = music.play();
    if (playPromise && playPromise.then) {
      playPromise.then(function () { fadeAudio(music, 0.35, 2000); })
        .catch(function () {}); // autoplay blocked — plays muted/paused, no fallback UI per client request
    }

    history.pushState({ screen: 'invitation' }, '', '#invitacion');
    envelopeOpened = true;

    if (reducedMotion) {
      envelopeScreen.style.transition = 'opacity 400ms';
      envelopeScreen.style.opacity = '0';
      invitationScreen.classList.add('is-revealed');
      finishOpen();
      return;
    }

    envelopeWrap.classList.add('is-exiting');
    spawnSparkles(40, false);
    invitationScreen.classList.add('is-revealing');

    setTimeout(function () {
      invitationScreen.classList.remove('is-revealing');
      invitationScreen.classList.add('is-revealed');
      finishOpen();
    }, 1100);
  }

  function finishOpen() {
    envelopeScreen.style.display = 'none';
    envelopeWrap.classList.add('is-opened');
    envelopeBtn.classList.remove('envelope-pulse'); // §7.7 — no pulse on the pull-to-return preview
    document.body.classList.remove('pre-reveal');
    if (headerControls) headerControls.classList.add('is-visible');
    setTimeout(startCountdown, 500); // hero countdown fade lands at 1.6s post-wipe; ticking starts once visible
  }

  function spawnSparkles(count, inward) {
    var layer = document.createElement('div');
    layer.className = 'sparkle-layer';
    document.body.appendChild(layer);
    for (var i = 0; i < count; i++) {
      var s = document.createElement('div');
      s.className = 'sparkle';
      var angle = Math.random() * 360;
      var dist = 30 + Math.random() * 45;
      var spin = 360 + Math.random() * 360;
      var delay = Math.random() * 400;
      s.style.setProperty('--angle', angle + 'deg');
      s.style.setProperty('--dist', (inward ? -dist : dist) + 'vmax');
      s.style.setProperty('--spin', spin + 'deg');
      s.style.setProperty('--delay', delay + 'ms');
      layer.appendChild(s);
    }
    setTimeout(function () { layer.remove(); }, 1600);
  }

  function fadeAudio(el, target, duration) {
    var start = performance.now();
    var from = el.volume;
    function step(now) {
      // rAF's timestamp can precede this performance.now() call, so
      // (now - start) can be slightly negative on the first frame —
      // clamp both ends or el.volume throws outside [0, 1].
      var p = Math.max(0, Math.min(1, (now - start) / duration));
      el.volume = from + (target - from) * p;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ==========================================================
     Music toggle (§7.1, §8)
     ========================================================== */
  function initMusicToggle() {
    var btn = document.getElementById('music-toggle');
    var music = document.getElementById('music');
    if (!btn || !music) return;
    // Always starts unmuted on every visit — muted is a per-session choice,
    // not a persisted preference, so it never carries over from an earlier visit.
    var muted = false;
    applyMuted(muted);

    btn.addEventListener('click', function () {
      muted = !muted;
      applyMuted(muted);
    });

    function applyMuted(m) {
      music.muted = m;
      btn.classList.toggle('is-muted', m);
      var key = m ? 'musicOff' : 'musicOn';
      btn.setAttribute('data-i18n-aria', key);
      btn.setAttribute('aria-label', window.i18n.translate(key, document.documentElement.lang));
    }

    document.addEventListener('langchange', function () { applyMuted(muted); });
  }

  /* ==========================================================
     Countdown (§7.3) — anchored to Houston (CDT, UTC-5 in August)
     ========================================================== */
  var TARGET_MS = new Date('2026-08-29T12:00:00-05:00').getTime();
  var DAY_END_MS = new Date('2026-08-29T23:59:59-05:00').getTime();
  var countdownTimer = null;

  function startCountdown() {
    if (countdownTimer) return;
    tickCountdown();
    countdownTimer = setInterval(tickCountdown, 1000);
    document.addEventListener('langchange', function () {
      // re-render the post-event message text if applicable
      var now = Date.now();
      if (now >= TARGET_MS) tickCountdown();
    });
  }

  function tickCountdown() {
    var el = document.getElementById('countdown');
    if (!el) return;
    var now = Date.now();

    if (now < TARGET_MS) {
      if (!document.getElementById('cd-days')) restoreDigitsMarkup(el);
      var diff = TARGET_MS - now;
      setText('cd-days', pad(Math.floor(diff / 86400000)));
      setText('cd-hours', pad(Math.floor((diff % 86400000) / 3600000)));
      setText('cd-minutes', pad(Math.floor((diff % 3600000) / 60000)));
      setText('cd-seconds', pad(Math.floor((diff % 60000) / 1000)));
    } else if (now <= DAY_END_MS) {
      renderCountdownMessage(el, 'countdownToday');
      clearInterval(countdownTimer);
    } else {
      renderCountdownMessage(el, 'countdownPast');
      clearInterval(countdownTimer);
    }
  }

  function renderCountdownMessage(el, key) {
    el.innerHTML = '<p class="countdown__message" data-i18n="' + key + '">' +
      window.i18n.translate(key, document.documentElement.lang) + '</p>';
  }

  function restoreDigitsMarkup() {
    // no-op: digits markup is the default DOM state; message replaces it via innerHTML only in post-target states
  }

  function pad(n) { return String(n).padStart(2, '0'); }
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }

  /* ==========================================================
     Scroll reveals (§7.4)
     ========================================================== */
  function initReveals() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reducedMotion) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ==========================================================
     Itinerary sparkle fallback (§7.5) — browsers without
     animation-timeline: view()
     ========================================================== */
  function initItinerarySparkleFallback() {
    if (window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()')) return;
    var sparkles = document.querySelectorAll('.itinerary-sparkle');
    if (!sparkles.length) return;
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      sparkles.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var center = r.top + r.height / 2;
        var progress = 1 - Math.min(1, Math.abs(center - vh / 2) / (vh / 2));
        var scale = 0.5 + progress * 0.65;
        el.style.transform = 'scale(' + scale.toFixed(2) + ') rotate(' + (progress * 15).toFixed(1) + 'deg)';
        el.style.opacity = (0.4 + progress * 0.6).toFixed(2);
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ==========================================================
     RSVP modal (§9)
     ========================================================== */
  function normalizePhone(raw) {
    var digits = (raw || '').replace(/\D/g, '');
    if (digits.length === 11 && digits[0] === '1') digits = digits.slice(1);
    return digits;
  }

  function formatPhoneInput(input) {
    if (!input) return;
    input.addEventListener('input', function () {
      var d = input.value.replace(/\D/g, '').slice(0, 10);
      var out = d;
      if (d.length > 6) out = '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
      else if (d.length > 3) out = '(' + d.slice(0, 3) + ') ' + d.slice(3);
      else if (d.length > 0) out = '(' + d;
      input.value = out;
    });
  }

  function lookupPhone(phone) {
    if (!RSVP_ENDPOINT_URL) {
      var mock = MOCK_GUESTS.filter(function (g) { return g.phone === phone; })[0];
      return Promise.resolve(mock
        ? { found: true, name: mock.name, allotment: mock.allotment, lang: mock.lang }
        : { found: false });
    }
    return fetch(RSVP_ENDPOINT_URL + '?phone=' + encodeURIComponent(phone))
      .then(function (r) { return r.json(); })
      // A genuine network failure (offline, DNS, etc.) shouldn't leave the
      // modal stuck with no feedback — fall into the same "not found" step,
      // which already offers "continue anyway" as an escape hatch.
      .catch(function () { return { found: false }; });
  }

  function postRsvp(payload) {
    if (!RSVP_ENDPOINT_URL) {
      return new Promise(function (resolve) {
        setTimeout(function () { resolve({ ok: true }); }, 400);
      });
    }
    var body = new FormData();
    Object.keys(payload).forEach(function (k) { body.append(k, payload[k]); });
    body.append('honeypot', ''); // §11 — must stay empty; a filled value flags a bot server-side
    return fetch(RSVP_ENDPOINT_URL, { method: 'POST', body: body }).then(function (r) { return r.json(); });
  }

  function initRsvpModal() {
    var overlay = document.getElementById('rsvp-modal');
    if (!overlay) return;
    var panel = document.getElementById('rsvp-modal-panel');
    var openBtn = document.getElementById('rsvp-open-btn');
    var closeBtn = document.getElementById('rsvp-close');
    var phoneInput = document.getElementById('rsvp-phone');
    var altPhoneInput = document.getElementById('rsvp-alt-phone');
    formatPhoneInput(phoneInput);
    formatPhoneInput(altPhoneInput);

    var state = { phone: '', matched: false, guest: null, name: '', attending: null, adults: 1, kids: 0, extra: 0, reason: '', altPhone: '', message: '' };
    var lastFocused = null;

    function showStep(key) {
      panel.querySelectorAll('.modal__step').forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-step') === key);
      });
    }

    function getSavedSubmission() {
      try {
        var raw = localStorage.getItem('jessi-rsvp-submitted');
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    }

    function openModal() {
      lastFocused = document.activeElement;
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      var already = getSavedSubmission();
      var savedPhone = null;
      try { savedPhone = localStorage.getItem('jessi-rsvp-phone'); } catch (e) {}
      if (savedPhone) phoneInput.value = savedPhone;

      if (already) {
        state.phone = already.phone;
        state.name = already.name;
        state.attending = already.attending === 'si';
        state.adults = already.adults || 1;
        state.kids = already.kids || 0;
        state.extra = already.extraRequested || 0;
        state.message = already.message || '';
        state.matched = true;
        state.guest = { name: already.name, allotment: Infinity, lang: already.lang };
        document.getElementById('rsvp-guest-name').textContent = already.name;
        document.getElementById('rsvp-guest-greeting').hidden = false;
        document.getElementById('rsvp-name-field').hidden = true;
        document.getElementById('rsvp-message').value = state.message;
        if (state.attending) {
          document.getElementById('rsvp-cap-notice').hidden = true;
          updateStepperDisplay();
          showStep('3');
        } else {
          showStep('4');
        }
      } else {
        showStep('1');
      }
      phoneInput.focus();
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });
    panel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusables = panel.querySelectorAll('button:not([hidden]), [href]:not([hidden]), input:not([hidden]), textarea:not([hidden])');
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    var lookupBtn = document.querySelector('[data-action="lookup"]');
    var lookupBtnLabel = lookupBtn.textContent;
    lookupBtn.addEventListener('click', function () {
      var phone = normalizePhone(phoneInput.value);
      if (!phone) return;
      state.phone = phone;
      lookupBtn.setAttribute('disabled', 'disabled');
      lookupBtn.textContent = window.i18n.translate('step5Submitting', document.documentElement.lang);
      lookupPhone(phone).then(function (result) {
        if (result && result.found) {
          state.matched = true;
          state.guest = result;
          state.name = result.name;
          try { localStorage.setItem('jessi-rsvp-phone', phoneInput.value); } catch (e) {}
          document.getElementById('rsvp-guest-greeting').hidden = false;
          document.getElementById('rsvp-guest-name').textContent = result.name;
          document.getElementById('rsvp-name-field').hidden = true;
          maybeShowLangHint(result.lang);
          showStep('2a');
        } else {
          state.matched = false;
          showStep('2b');
        }
      }).finally(function () {
        lookupBtn.removeAttribute('disabled');
        lookupBtn.textContent = lookupBtnLabel;
      });
    });

    document.querySelector('[data-action="retry"]').addEventListener('click', function () {
      showStep('1');
      phoneInput.focus();
    });

    document.querySelector('[data-action="continue-anyway"]').addEventListener('click', function () {
      state.matched = false;
      state.guest = null;
      document.getElementById('rsvp-guest-greeting').hidden = true;
      document.getElementById('rsvp-name-field').hidden = false;
      document.getElementById('rsvp-lang-hint').hidden = true;
      showStep('2a');
    });

    function maybeShowLangHint(guestLang) {
      var hint = document.getElementById('rsvp-lang-hint');
      var currentLang = document.documentElement.lang;
      if (guestLang && guestLang !== currentLang && !window.i18n.hasTouchedToggle()) {
        hint.hidden = false;
        hint.textContent = window.i18n.translate('viewInEnglish', currentLang);
        hint.onclick = function (e) {
          e.preventDefault();
          window.i18n.applyLang(guestLang);
          hint.hidden = true;
        };
      } else {
        hint.hidden = true;
      }
    }

    document.querySelector('[data-action="attend-yes"]').addEventListener('click', function () {
      state.attending = true;
      if (!state.matched) state.name = document.getElementById('rsvp-name-input').value.trim();
      state.adults = 1; state.kids = 0; state.extra = 0; state.reason = '';
      document.getElementById('rsvp-cap-notice').hidden = true;
      updateStepperDisplay();
      showStep('3');
    });

    document.querySelector('[data-action="attend-no"]').addEventListener('click', function () {
      state.attending = false;
      if (!state.matched) state.name = document.getElementById('rsvp-name-input').value.trim();
      state.adults = 0; state.kids = 0; state.extra = 0;
      showStep('4');
    });

    function updateStepperDisplay() {
      setStepperValue('adults', state.adults);
      setStepperValue('kids', state.kids);
      setStepperValue('extra', state.extra);
      var allotment = state.matched && state.guest ? state.guest.allotment : Infinity;
      var atCap = (state.adults + state.kids) >= allotment;
      panel.querySelectorAll('[data-stepper="adults"][data-delta="1"], [data-stepper="kids"][data-delta="1"]').forEach(function (btn) {
        btn.setAttribute('aria-disabled', atCap ? 'true' : 'false');
      });
    }
    function setStepperValue(name, v) {
      var el = document.querySelector('[data-stepper-value="' + name + '"]');
      if (el) el.textContent = v;
    }

    panel.querySelectorAll('[data-stepper]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        handleStepperChange(btn.getAttribute('data-stepper'), parseInt(btn.getAttribute('data-delta'), 10));
      });
    });

    function handleStepperChange(name, delta) {
      if (name === 'extra') {
        state.extra = Math.max(0, Math.min(2, state.extra + delta));
        setStepperValue('extra', state.extra);
        return;
      }
      var allotment = state.matched && state.guest ? state.guest.allotment : Infinity;
      var nextAdults = name === 'adults' ? Math.max(0, state.adults + delta) : state.adults;
      var nextKids = name === 'kids' ? Math.max(0, state.kids + delta) : state.kids;

      if (nextAdults === 0 && nextKids === 0) return;
      if (name === 'adults' && nextAdults === 0 && state.kids === 0) return;

      var sum = nextAdults + nextKids;
      if (delta > 0 && sum > allotment) {
        revealCapNotice(allotment);
        return;
      }
      state.adults = nextAdults;
      state.kids = nextKids;
      updateStepperDisplay();
    }

    function revealCapNotice(allotment) {
      var notice = document.getElementById('rsvp-cap-notice');
      var msg = document.getElementById('rsvp-cap-message');
      msg.textContent = window.i18n.translate('step3CapReached', document.documentElement.lang, { n: allotment });
      notice.hidden = false;
    }

    document.getElementById('rsvp-reason').addEventListener('input', function (e) { state.reason = e.target.value; });

    document.querySelector('[data-action="to-step4"]').addEventListener('click', function () { showStep('4'); });

    document.getElementById('rsvp-show-alt-phone').addEventListener('click', function () {
      document.getElementById('rsvp-alt-phone-field').hidden = false;
      document.getElementById('rsvp-show-alt-phone').hidden = true;
    });

    document.querySelector('[data-action="submit"]').addEventListener('click', function () {
      state.altPhone = normalizePhone(altPhoneInput.value);
      state.message = document.getElementById('rsvp-message').value.trim();
      submitRsvp();
    });

    function submitRsvp() {
      var btn = document.querySelector('[data-action="submit"]');
      var originalLabel = btn.textContent;
      btn.setAttribute('disabled', 'disabled');
      btn.textContent = window.i18n.translate('step5Submitting', document.documentElement.lang);

      var payload = {
        phone: state.phone,
        name: state.name,
        attending: state.attending ? 'si' : 'no',
        adults: state.attending ? state.adults : 0,
        kids: state.attending ? state.kids : 0,
        extraRequested: state.attending ? state.extra : 0,
        reason: state.reason,
        altPhone: state.altPhone,
        message: state.message,
        lang: document.documentElement.lang
      };

      postRsvp(payload).then(function () {
        try { localStorage.setItem('jessi-rsvp-submitted', JSON.stringify(payload)); } catch (e) {}
        renderSuccess(payload);
        showStep('success');
        updateRsvpButtonLabel();
      }).catch(function () {
        showStep('failure');
        wireSmsFallback(payload);
      }).finally(function () {
        btn.removeAttribute('disabled');
        btn.textContent = originalLabel;
      });
    }

    function renderSuccess(payload) {
      var echo = document.getElementById('rsvp-success-echo');
      var requestNote = document.getElementById('rsvp-request-note');
      var calLinks = document.getElementById('rsvp-cal-links');
      if (payload.attending === 'si') {
        var total = payload.adults + payload.kids;
        echo.hidden = false;
        echo.textContent = window.i18n.translate('step5SuccessEcho', document.documentElement.lang, { total: total, adults: payload.adults, kids: payload.kids });
        calLinks.hidden = false;
        requestNote.hidden = !(payload.extraRequested > 0);
      } else {
        echo.hidden = true;
        calLinks.hidden = true;
        requestNote.hidden = true;
      }
    }

    function wireSmsFallback(payload) {
      var link = document.getElementById('rsvp-sms-fallback');
      var body = encodeURIComponent(
        (payload.name || '') + ' — ' + payload.attending + ' — ' +
        payload.adults + 'A/' + payload.kids + 'N — ' + (payload.message || '')
      );
      link.href = 'sms:' + HOST_SMS_NUMBER + '?&body=' + body;
    }

    function updateRsvpButtonLabel() {
      var already = getSavedSubmission();
      if (already) {
        openBtn.removeAttribute('data-i18n');
        openBtn.textContent = window.i18n.translate('rsvpAlreadyConfirmed', document.documentElement.lang);
      }
    }
    updateRsvpButtonLabel();
    document.addEventListener('langchange', updateRsvpButtonLabel);
  }

  /* ==========================================================
     Pull-to-return (§7.7) — build last, cut if time is short
     ========================================================== */
  function initPullToReturn() {
    if (reducedMotion) return;
    var threshold = 110;
    var pulling = false, prepared = false, startY = 0, pullDist = 0;

    function atTop() { return window.scrollY <= 0; }
    function isInvitationVisible() { return invitationScreen.classList.contains('is-revealed'); }

    window.addEventListener('touchstart', function (e) {
      if (!atTop() || !isInvitationVisible()) { pulling = false; return; }
      pulling = true;
      prepared = false;
      startY = e.touches[0].clientY;
      pullDist = 0;
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (!pulling) return;
      var dy = e.touches[0].clientY - startY;
      if (dy <= 0) { if (prepared) setPullVisual(0); return; }
      if (!prepared) { prepareEnvelopeForReturn(); prepared = true; }
      pullDist = dy;
      setPullVisual(dy);
    }, { passive: true });

    window.addEventListener('touchend', function () {
      if (!pulling) return;
      pulling = false;
      if (prepared && pullDist > threshold) {
        runReturnTransition();
      } else if (prepared) {
        cancelPullPreview();
      }
    });

    // Desktop wheel equivalent — higher threshold, momentum makes accidental triggers likelier.
    var wheelAccum = 0, wheelTimer = null, wheelPrepared = false;
    window.addEventListener('wheel', function (e) {
      if (!atTop() || !isInvitationVisible() || e.deltaY >= 0) {
        wheelAccum = 0;
        if (wheelPrepared) cancelPullPreview();
        wheelPrepared = false;
        return;
      }
      wheelAccum += -e.deltaY;
      if (!wheelPrepared) { prepareEnvelopeForReturn(); wheelPrepared = true; }
      setPullVisual(Math.min(wheelAccum, threshold * 1.8));
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(function () {
        if (wheelAccum > threshold * 1.5) {
          runReturnTransition();
        } else if (wheelPrepared) {
          cancelPullPreview();
        }
        wheelAccum = 0;
        wheelPrepared = false;
      }, 150);
    }, { passive: true });

    function prepareEnvelopeForReturn() {
      envelopeWrap.classList.add('is-opened');
      envelopeScreen.style.display = 'flex';
      envelopeScreen.classList.add('is-pull-preview');
      envelopeWrap.style.transition = 'none';
      envelopeWrap.style.opacity = '0';
      envelopeWrap.style.transform = 'scale(0.9)';
    }

    function setPullVisual(dy) {
      var resisted = dy * 0.4;
      var progress = Math.min(1, resisted / threshold);
      var scale = 0.9 + progress * 0.1;
      envelopeWrap.style.opacity = String(progress);
      envelopeWrap.style.transform = 'scale(' + scale.toFixed(3) + ')';
    }

    function cancelPullPreview() {
      envelopeWrap.style.transition = 'transform 300ms var(--ease-soft), opacity 300ms var(--ease-soft)';
      envelopeWrap.style.opacity = '0';
      envelopeWrap.style.transform = 'scale(0.9)';
      setTimeout(function () {
        envelopeScreen.style.display = 'none';
        envelopeScreen.classList.remove('is-pull-preview');
        envelopeWrap.style.transition = '';
      }, 300);
    }

    function runReturnTransition() {
      var savedScroll = window.scrollY;
      envelopeWrap.style.transition = 'transform 300ms var(--ease-soft), opacity 300ms var(--ease-soft)';
      envelopeWrap.style.opacity = '1';
      envelopeWrap.style.transform = 'scale(1)';

      spawnSparkles(15, true);
      invitationScreen.classList.remove('is-revealed');
      invitationScreen.classList.add('is-returning');

      setTimeout(function () {
        invitationScreen.classList.remove('is-returning');
        envelopeScreen.classList.remove('is-pull-preview');
        envelopeWrap.style.transition = '';
        document.body.classList.add('pre-reveal');
        if (headerControls) headerControls.classList.remove('is-visible');
        history.pushState({ screen: 'envelope' }, '', location.pathname + location.search);
        wireForwardAgain(savedScroll);
      }, 1100);
    }

    function wireForwardAgain(savedScroll) {
      envelopeBtn.addEventListener('click', function goForward() {
        envelopeBtn.removeEventListener('click', goForward);
        envelopeScreen.style.display = '';
        envelopeWrap.style.opacity = '';
        envelopeWrap.style.transform = '';
        spawnSparkles(20, false);
        invitationScreen.classList.add('is-revealing');
        setTimeout(function () {
          invitationScreen.classList.remove('is-revealing');
          invitationScreen.classList.add('is-revealed');
          envelopeScreen.style.display = 'none';
          document.body.classList.remove('pre-reveal');
          if (headerControls) headerControls.classList.add('is-visible');
          window.scrollTo(0, savedScroll);
          history.pushState({ screen: 'invitation' }, '', '#invitacion');
        }, 800);
      });
    }
  }

  /* ==========================================================
     Boot
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initLangToggle();
    initEnvelope();
    initMusicToggle();
    initReveals();
    initItinerarySparkleFallback();
    initRsvpModal();
    initPullToReturn();
  });
})();
