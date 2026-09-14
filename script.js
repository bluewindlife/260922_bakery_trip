(() => {
  'use strict';

  const storageKey = document.body.dataset.storage || 'bakery-trip-260922-v05';
  const checks = [...document.querySelectorAll('[data-check]')];
  let saved = {};

  try {
    saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  } catch {
    localStorage.removeItem(storageKey);
  }

  function refreshStatus() {
    const done = checks.filter((item) => item.checked).length;
    const total = checks.length || 1;
    const bar = document.querySelector('[data-status-bar]');
    const meta = document.querySelector('[data-status-meta]');
    if (bar) bar.style.width = Math.round(done / total * 100) + '%';
    if (meta) meta.textContent = '準備 ' + done + '/' + checks.length;
  }

  function saveChecks() {
    const state = {};
    checks.forEach((item) => {
      state[item.dataset.check] = item.checked;
    });
    localStorage.setItem(storageKey, JSON.stringify(state));
    refreshStatus();
  }

  checks.forEach((input) => {
    input.checked = Boolean(saved[input.dataset.check]);
    input.addEventListener('change', saveChecks);
  });

  document.querySelector('[data-reset]')?.addEventListener('click', () => {
    checks.forEach((item) => {
      item.checked = false;
    });
    localStorage.removeItem(storageKey);
    refreshStatus();
  });

  refreshStatus();

  let imageFailures = 0;
  document.body.dataset.imageFailures = '0';

  function removeBrokenImage(img) {
    if (!img.isConnected || img.dataset.failed === 'true') return;
    img.dataset.failed = 'true';
    imageFailures += 1;
    document.body.dataset.imageFailures = String(imageFailures);

    const figure = img.closest('figure');
    if (figure) {
      const gallery = figure.closest('.gallery, .candidate-gallery');
      figure.remove();
      if (gallery && !gallery.querySelector('figure')) gallery.remove();
      return;
    }

    img.remove();
  }

  document.querySelectorAll('img[data-external]').forEach((img) => {
    img.addEventListener('error', () => removeBrokenImage(img), { once: true });
    if (img.complete && img.naturalWidth === 0) {
      queueMicrotask(() => removeBrokenImage(img));
    }
  });

  const topButton = document.querySelector('[data-top]');
  const toggleTopButton = () => {
    topButton?.classList.toggle('show', window.scrollY > 700);
  };

  addEventListener('scroll', toggleTopButton, { passive: true });
  toggleTopButton();
  topButton?.addEventListener('click', () => {
    scrollTo({ top: 0, behavior: 'smooth' });
  });

  const plans = [...document.querySelectorAll('[data-plan-time]')];
  const tripDate = document.body.dataset.tripDate;
  const statusTitle = document.querySelector('[data-status-title]');

  if (plans.length && statusTitle && tripDate) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(new Date());

    const value = (type) => parts.find((part) => part.type === type)?.value || '';
    const today = value('year') + '-' + value('month') + '-' + value('day');

    if (today === tripDate) {
      const minutes = Number(value('hour')) * 60 + Number(value('minute'));
      let current = plans[0];

      plans.forEach((plan) => {
        const time = plan.dataset.planTime.split(':').map(Number);
        if (time[0] * 60 + time[1] <= minutes) current = plan;
      });

      statusTitle.textContent = '現在/次：' + current.dataset.planLabel;
    }
  }

  document.body.dataset.ready = 'true';
})();
