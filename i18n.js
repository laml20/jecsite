/*
 * i18n.js — all ES + EN copy for the invitation and the gate page.
 * See website-spec.md §10 for the source copy deck.
 */
(function (global) {
  'use strict';

  var t = {
    es: {
      // Screen 1 — envelope
      envelopeName: 'Jessica Anahí Mendoza',
      envelopeEyebrow: 'Mis XV Años',
      promptOpen: 'Oprima el sobre para ver la invitación',
      ariaOpenEnvelope: 'Abrir la invitación',

      // Hero
      eyebrow: 'Mis XV Años',
      date: '29 de agosto del 2026',
      countdownDays: 'Días',
      countdownHours: 'Horas',
      countdownMinutes: 'Minutos',
      countdownSeconds: 'Segundos',
      countdownToday: '¡Hoy es el día!',
      countdownPast: 'Gracias por celebrar con nosotros',

      // Intro + family
      intro: 'Ha llegado un momento muy especial en mi vida, un día en el que he soñado con alegría y emoción…',
      blessing: 'Con la bendición de mis padres,',
      parentsName: 'José Arturo y María de Jesús Mendoza',
      siblingsLabel: 'y mis hermanos,',
      siblingsName: 'Lizeth Alejandra y David Arturo Mendoza',
      inviteLine: 'nos complace invitarle a ser parte de este día tan especial',

      // Misa / Recepción
      misaHeading: 'Misa',
      misaTime: '12:00 PM',
      misaVenue: 'St. Ambrose Catholic Church',
      recepcionHeading: 'Recepción',
      recepcionTime: '6:00 PM',
      recepcionVenue: 'Champions Ballroom',
      mapButton: 'Ver ubicación',

      // Itinerario
      itineraryHeading: 'Itinerario del Evento',
      itineraryReception: 'Recepción',
      itineraryPresentation: 'Presentación + Vals',
      itineraryDinner: 'Cena',
      itineraryDinnerTime: '6:00 PM – 8:00 PM',
      itineraryBlessing: 'Bendición de los alimentos',
      itineraryDancing: 'Baile + Celebración',

      // Dress code
      dressCodeHeading: 'Código de Vestimenta',
      dressCodeBody: 'Amablemente solicitamos a nuestros invitados que se abstengan de vestir los colores rosa y dorado, ya que están reservados exclusivamente para la quinceañera',

      // Gifts
      giftsHeading: 'Regalos',
      giftsBody: '¡Su presencia es el regalo más significativo para nosotros! Sin embargo, si desea tener un detalle con la quinceañera, se agradece profundamente 💵✉️',

      // RSVP
      rsvpHeading: 'Confirmar Asistencia',
      rsvpBody: '¡Su presencia es muy importante para nosotros! Les solicitamos amablemente confirmar su asistencia antes del 19 de agosto de 2026',
      rsvpButton: 'Confirmar Asistencia',
      rsvpDeadline: 'Confirma antes del 19 de agosto de 2026.',
      rsvpAlreadyConfirmed: 'Ya confirmaste — ¿cambiar?',

      // Closing
      closing: 'Gracias por acompañarnos y por ser parte de este momento tan importante de mi vida',
      signoff: 'Con mucho cariño,',

      // Header controls
      musicOn: 'Silenciar música',
      musicOff: 'Activar música',
      langToggleAria: 'Cambiar idioma',
      tapToPlayMusic: 'Toca para reproducir música',

      // RSVP modal
      modalClose: 'Cerrar',
      step1Label: 'Ingresa tu número de teléfono',
      step1Helper: 'Usa el número donde recibiste la invitación.',
      step1Continue: 'Continuar',
      step2aGreetingSuffix: '¡Qué gusto verte por aquí!',
      step2aQuestion: '¿Nos acompañarán?',
      step2aYes: 'Sí, asistiremos',
      step2aNo: 'No podremos asistir',
      step2bNotFound: 'No encontramos ese número. ¿Es el mismo donde recibiste la invitación? Revísalo e inténtalo de nuevo.',
      step2bRetry: 'Intentar de nuevo',
      step2bContinueAnyway: 'Continuar de todos modos',
      step2aNameLabel: 'Tu nombre',
      step2aNamePlaceholder: 'Nombre completo',
      step3AdultsLabel: 'Adultos',
      step3KidsLabel: 'Niños',
      step3CapReached: 'Tenemos {n} lugares apartados para ustedes. ¿Necesitas un lugar más?',
      step3CapReachedNoRequest: 'Tenemos {n} lugares apartados para ustedes. Si necesitas más, escríbenos.',
      step3ExtraLabel: 'lugares adicionales',
      step3ReasonPlaceholder: 'Cuéntanos brevemente (opcional)',
      step4AddPhone: '+ Agregar otro número',
      step4AltPhoneLabel: 'Otro número de teléfono',
      step4MessageLabel: 'Mensaje para Jessica',
      step4MessagePlaceholder: 'Escribe un mensaje (opcional)',
      step5Submit: 'Enviar confirmación',
      step5Submitting: 'Enviando…',
      step5SuccessTitle: '¡Gracias! Tu confirmación fue recibida.',
      step5SuccessEcho: '{total} personas — {adults} adultos, {kids} niños.',
      step5RequestNote: 'Recibimos tu solicitud y te confirmaremos pronto.',
      step5Failure: 'No pudimos enviar tu confirmación. Puedes enviarnos un mensaje aquí.',
      step5SmsFallback: 'Enviar por mensaje de texto',
      addToCalendar: 'Agregar a mi calendario',
      addToCalendarMisa: 'Misa (12:00 PM)',
      addToCalendarRecepcion: 'Recepción (6:00 PM)',
      viewInEnglish: 'View in English?',
      backButton: 'Atrás',

      // Bare-domain gate page
      gateName: 'Jessica Anahí Mendoza',
      gateHeading: 'Mis XV Años',
      gateLabel: 'Ingresa tu número de teléfono',
      gateHelper: 'Usa el número donde recibiste la invitación.',
      gateButton: 'Continuar',
      gateNotFound: 'No encontramos ese número. Por favor usa el número donde recibiste tu invitación.'
    },
    en: {
      envelopeName: 'Jessica Anahí Mendoza',
      envelopeEyebrow: 'My Quinceañera',
      promptOpen: 'Tap the envelope to open your invitation',
      ariaOpenEnvelope: 'Open the invitation',

      eyebrow: 'My Quinceañera',
      date: 'August 29, 2026',
      countdownDays: 'Days',
      countdownHours: 'Hours',
      countdownMinutes: 'Minutes',
      countdownSeconds: 'Seconds',
      countdownToday: "Today's the day!",
      countdownPast: 'Thank you for celebrating with us',

      intro: 'A very special moment in my life has arrived — a day I have dreamed of with joy and excitement…',
      blessing: "With my parents' blessing,",
      parentsName: 'José Arturo y María de Jesús Mendoza',
      siblingsLabel: 'and my siblings,',
      siblingsName: 'Lizeth Alejandra y David Arturo Mendoza',
      inviteLine: 'we are delighted to invite you to be part of this very special day',

      misaHeading: 'Mass',
      misaTime: '12:00 PM',
      misaVenue: 'St. Ambrose Catholic Church',
      recepcionHeading: 'Reception',
      recepcionTime: '6:00 PM',
      recepcionVenue: 'Champions Ballroom',
      mapButton: 'Get directions',

      itineraryHeading: 'Event Itinerary',
      itineraryReception: 'Reception',
      itineraryPresentation: 'Presentation + Waltz',
      itineraryDinner: 'Dinner',
      itineraryDinnerTime: '6:00 PM – 8:00 PM',
      itineraryBlessing: 'Blessing of the Meal',
      itineraryDancing: 'Dancing + Celebration',

      dressCodeHeading: 'Dress Code',
      dressCodeBody: 'We kindly ask our guests to avoid wearing pink and gold, as these colors are reserved exclusively for the quinceañera',

      giftsHeading: 'Gifts',
      giftsBody: 'Your presence is the most meaningful gift of all! If you would like to give something to the quinceañera, it is deeply appreciated 💵✉️',

      rsvpHeading: 'RSVP',
      rsvpBody: 'Your presence means so much to us! Please kindly confirm your attendance by August 19, 2026',
      rsvpButton: 'RSVP',
      rsvpDeadline: 'Please confirm by August 19, 2026.',
      rsvpAlreadyConfirmed: "You're confirmed — change your response?",

      closing: 'Thank you for joining us and for being part of this important moment in my life',
      signoff: 'With much love,',

      musicOn: 'Mute music',
      musicOff: 'Play music',
      langToggleAria: 'Switch language',
      tapToPlayMusic: 'Tap to play music',

      modalClose: 'Close',
      step1Label: 'Enter your phone number',
      step1Helper: 'Use the number where you received your invitation.',
      step1Continue: 'Continue',
      step2aGreetingSuffix: "So glad you're here!",
      step2aQuestion: 'Will you be joining us?',
      step2aYes: "Yes, we'll be there",
      step2aNo: "We can't make it",
      step2bNotFound: "We couldn't find that number. Is it the same one your invitation was sent to? Please check and try again.",
      step2bRetry: 'Try again',
      step2bContinueAnyway: 'Continue anyway',
      step2aNameLabel: 'Your name',
      step2aNamePlaceholder: 'Full name',
      step3AdultsLabel: 'Adults',
      step3KidsLabel: 'Kids',
      step3CapReached: "We've reserved {n} places for you. Need an extra seat?",
      step3CapReachedNoRequest: "We've reserved {n} places for you. If you need more, please text us.",
      step3ExtraLabel: 'extra seats',
      step3ReasonPlaceholder: 'Tell us briefly (optional)',
      step4AddPhone: '+ Add another number',
      step4AltPhoneLabel: 'Another phone number',
      step4MessageLabel: 'Message for Jessica',
      step4MessagePlaceholder: 'Write a message (optional)',
      step5Submit: 'Submit RSVP',
      step5Submitting: 'Submitting…',
      step5SuccessTitle: 'Thank you! Your RSVP was received.',
      step5SuccessEcho: '{total} guests — {adults} adults, {kids} kids.',
      step5RequestNote: "We've received your request and will confirm soon.",
      step5Failure: "We couldn't send your RSVP. You can send us a message here.",
      step5SmsFallback: 'Send via text message',
      addToCalendar: 'Add to my calendar',
      addToCalendarMisa: 'Mass (12:00 PM)',
      addToCalendarRecepcion: 'Reception (6:00 PM)',
      viewInEnglish: '¿Ver en español?',
      backButton: 'Back',

      gateName: 'Jessica Anahí Mendoza',
      gateHeading: 'My Quinceañera',
      gateLabel: 'Enter your phone number',
      gateHelper: 'Use the number where you received your invitation.',
      gateButton: 'Continue',
      gateNotFound: "We couldn't find that number. Please use the number your invitation was sent to."
    }
  };

  var STORAGE_KEY = 'jessi-lang';
  var STORAGE_TOUCHED_KEY = 'jessi-lang-touched';

  function detectDefaultLang() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (stored === 'es' || stored === 'en') return stored;
    if (typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().indexOf('es') === 0) {
      return 'es';
    }
    return 'es';
  }

  function hasTouchedToggle() {
    try { return localStorage.getItem(STORAGE_TOUCHED_KEY) === '1'; } catch (e) { return false; }
  }

  function markToggled() {
    try { localStorage.setItem(STORAGE_TOUCHED_KEY, '1'); } catch (e) {}
  }

  function translate(key, lang, vars) {
    var dict = t[lang] || t.es;
    var str = dict[key];
    if (str == null) str = t.es[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.replace('{' + k + '}', vars[k]);
      });
    }
    return str;
  }

  function applyLang(lang) {
    if (lang !== 'es' && lang !== 'en') lang = 'es';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = translate(key, lang);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', translate(key, lang));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      el.setAttribute('placeholder', translate(key, lang));
    });
    document.querySelectorAll('[data-lang-active]').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-lang-active') === lang);
    });
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  global.i18n = {
    t: t,
    translate: translate,
    applyLang: applyLang,
    detectDefaultLang: detectDefaultLang,
    hasTouchedToggle: hasTouchedToggle,
    markToggled: markToggled
  };
})(window);
