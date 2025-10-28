// Client-side contact + header-typing + localStorage (clean implementation)
(function () {
  const qs = (s) => document.querySelector(s);

  const contactToggle = qs('#contactToggle');
  const contactPanel = qs('#contactPanel');
  const closeContact = qs('#closeContact');
  const contactForm = qs('#contactForm');
  const formStatus = qs('#formStatus');
  const baconIcon = qs('.parallax-content .icon');
  const livePreview = qs('#liveHtmlPreview');

  const STORAGE_KEY = 'baconz_contacts_v1';

  function readContacts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to read contacts', e);
      return [];
    }
  }

  function writeContacts(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to write contacts', e);
    }
  }

  // header elements and originals
  const headerEls = {
    h1: qs('.parallax-content h1'),
    h2: qs('.parallax-content h2'),
    banner: qs('.parallax-content .banner')
  };

  (function () {
    const qs = (s) => document.querySelector(s);

    const contactToggle = qs('#contactToggle');
    const contactPanel = qs('#contactPanel');
    const closeContact = qs('#closeContact');
    const contactForm = qs('#contactForm');
    const formStatus = qs('#formStatus');
    const baconIcon = qs('.parallax-content .icon');
    const livePreview = qs('#liveHtmlPreview');

    const STORAGE_KEY = 'baconz_contacts_v1';

    function readContacts() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.error('Failed to read contacts', e);
        return [];
      }
    }

    function writeContacts(list) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.error('Failed to write contacts', e);
      }
    }

    const headerEls = {
      h1: qs('.parallax-content h1'),
      h2: qs('.parallax-content h2'),
      banner: qs('.parallax-content .banner')
    };

    const originals = {
      h1: headerEls.h1 ? headerEls.h1.textContent : '',
      h2: headerEls.h2 ? headerEls.h2.textContent : '',
      banner: headerEls.banner ? headerEls.banner.textContent : ''
    };

    function escapeHtml(s) {
      return (s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function updateLivePreview() {
      if (!livePreview) return;
      const h1 = escapeHtml(headerEls.h1 ? headerEls.h1.textContent : '');
      const h2 = escapeHtml(headerEls.h2 ? headerEls.h2.textContent : '');
      const banner = escapeHtml(headerEls.banner ? headerEls.banner.textContent : '');
      const html = `<h1>${h1}</h1>\n<h2>${h2}</h2>\n<div class="banner">${banner}</div>`;
      livePreview.textContent = html;
    }

    function typeText(el, text, speed = 60) {
      return new Promise((res) => {
        if (!el) return res();
        el.textContent = '';
        let i = 0;
        const t = setInterval(() => {
          el.textContent += text.charAt(i++);
          updateLivePreview();
          if (i >= text.length) { clearInterval(t); res(); }
        }, speed);
      });
    }

    function eraseText(el, speed = 40) {
      return new Promise((res) => {
        if (!el) return res();
        let txt = el.textContent || '';
        const t = setInterval(() => {
          txt = txt.slice(0, -1);
          el.textContent = txt;
          updateLivePreview();
          if (txt.length === 0) { clearInterval(t); res(); }
        }, speed);
      });
    }

    async function animateEraseAndType() {
      if (livePreview) { livePreview.classList.remove('hidden'); livePreview.classList.add('visible'); livePreview.setAttribute('aria-hidden', 'false'); }
      await eraseText(headerEls.banner, 20);
      await eraseText(headerEls.h2, 30);
      await eraseText(headerEls.h1, 30);
      await typeText(headerEls.h1, originals.h1 || 'Baconz', 80);
    }

    async function restoreHeaderText() {
      if (livePreview) { livePreview.classList.remove('visible'); livePreview.classList.add('hidden'); livePreview.setAttribute('aria-hidden', 'true'); }
      await eraseText(headerEls.h1, 20);
      await typeText(headerEls.h1, originals.h1, 40);
      await typeText(headerEls.h2, originals.h2, 30);
      headerEls.banner.textContent = originals.banner;
      updateLivePreview();
    }

    function openContact() {
      if (!contactPanel) return;
      contactPanel.classList.remove('hidden');
      contactPanel.classList.add('visible');
      contactPanel.setAttribute('aria-hidden', 'false');
      if (baconIcon) baconIcon.classList.add('hide');
      animateEraseAndType();
      setTimeout(() => {
        const first = contactPanel.querySelector('input, textarea, button');
        if (first) first.focus();
      }, 260);
    }

    function closeContactPanel() {
      if (!contactPanel) return;
      contactPanel.classList.remove('visible');
      contactPanel.setAttribute('aria-hidden', 'true');
      setTimeout(() => {
        contactPanel.classList.add('hidden');
        if (baconIcon) baconIcon.classList.remove('hide');
      }, 250);
    }

    function initForm() {
      if (!contactForm) return;
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        formStatus.textContent = 'Saving...';
        const name = (contactForm.name.value || '').trim();
        const email = (contactForm.email.value || '').trim();
        const message = (contactForm.message.value || '').trim();
        if (!name || !email) {
          formStatus.textContent = 'Please provide at least name and email.';
          return;
        }
        const contacts = readContacts();
        const entry = { id: Date.now().toString(36) + Math.random().toString(36).slice(2,6), name, email, message, created: Date.now() };
        contacts.push(entry);
        writeContacts(contacts);
        formStatus.textContent = 'Saved locally. Thanks!';
        contactForm.reset();
      });
    }

    if (contactToggle) contactToggle.addEventListener('click', openContact);
    if (closeContact) closeContact.addEventListener('click', () => {
      closeContactPanel();
      restoreHeaderText();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeContactPanel();
        restoreHeaderText();
      }
    });

    document.addEventListener('DOMContentLoaded', () => {
      if (livePreview) {
        livePreview.classList.remove('visible');
        livePreview.classList.add('hidden');
        livePreview.setAttribute('aria-hidden', 'true');
      }
      initForm();
      updateLivePreview();
    });

  })();