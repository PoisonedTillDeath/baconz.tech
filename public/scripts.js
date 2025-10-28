document.addEventListener('DOMContentLoaded', function () {
  // Initialize AOS (Animate On Scroll)
  if (window.AOS) {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true });
  }

  // Quote rotator
  const quotes = [
    '"Make it simple, but significant."',
    '"Ship early. Ship often. Improve as you go."',
    '"Design for people, not for screens."',
    '"Small habits compound into meaningful work."'
  ];

  const rotator = document.getElementById('quote-rotator');
  if (rotator) {
    let idx = 0;
    const quoteEl = rotator.querySelector('.quote');
    // gentle fade-out / in
    setInterval(() => {
      if (!quoteEl) return;
      quoteEl.style.opacity = 0;
      setTimeout(() => {
        idx = (idx + 1) % quotes.length;
        quoteEl.textContent = quotes[idx];
        quoteEl.style.opacity = 1;
      }, 400);
    }, 4200);
  }
});
