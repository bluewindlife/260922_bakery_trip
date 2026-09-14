(() => {
  // v0.3: 画像多めのデジタルカタログ方針を復元。
  // ユーザー提供写真は使わず、公式・公式note・外部参照画像のみを出典付きで表示する。
  document.body.dataset.storage = 'bakery-trip-260922-v03';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = meta.content.replace('v0.2', 'v0.3');
  const conceptNote = [...document.querySelectorAll('.section-head')]
    .find((head) => head.querySelector('h2')?.textContent.includes('この日の設計'))
    ?.querySelector('.section-note');
  if (conceptNote) conceptNote.textContent = '写真強化 v0.3';
  const footer = document.querySelector('footer');
  if (footer) footer.textContent = '260922_bakery_trip · v0.3 · updated 2026-09-14';

  const figure = ({ src, alt, caption, href, source }) => `
    <figure>
      <img data-external loading="lazy" src="${src}" alt="${alt}" referrerpolicy="no-referrer">
      <figcaption>${caption} / <a href="${href}" target="_blank" rel="noopener noreferrer">${source}</a></figcaption>
    </figure>`;

  const visualData = {
    shimoda: {
      preview: {
        src: 'https://tblg.k-img.com/restaurant/images/Rvw/237059/640x640_rect_f4a8059d9b35776d1c8b99f361109157.jpg',
        alt: '下田流のパンが並ぶ店頭',
        caption: '下田流：店頭イメージ',
        href: 'https://tabelog.com/tokyo/A1322/A132205/13263179/',
        source: '食べログ'
      },
      gallery: [
        {
          src: 'https://tblg.k-img.com/restaurant/images/Rvw/233999/640x640_rect_6d3905ca5bd1686ba1f32e6ff56bbec4.jpg',
          alt: '下田流のパンのラインナップ',
          caption: 'パンのラインナップ参考（9/22の個別在庫は別確認）',
          href: 'https://tabelog.com/tokyo/A1322/A132205/13263179/',
          source: '食べログ'
        },
        {
          src: 'https://tblg.k-img.com/restaurant/images/Rvw/237059/640x640_rect_f4a8059d9b35776d1c8b99f361109157.jpg',
          alt: '下田流のパンが並ぶ店頭',
          caption: '店頭イメージ',
          href: 'https://tabelog.com/tokyo/A1322/A132205/13263179/',
          source: '食べログ'
        }
      ]
    },
    wakan: {
      preview: {
        src: 'https://assets.st-note.com/production/uploads/images/178251492/rectangle_large_type_2_babdea1d4213cef7c0b51259d798dda2.jpeg?fit=bounds&quality=85&width=1280',
        alt: '赤坂おぎ乃 和甘の生どらやきと包装',
        caption: '和甘：生どらやきのブランドイメージ',
        href: 'https://note.com/wakan_ogino/n/n1351360508d9',
        source: '和甘公式note'
      },
      gallery: [
        {
          src: 'https://rstatic.enjoytokyo.jp/assets/images/article/45/218110/3000111.jpg?1761015900=&p=t&w=1800',
          alt: '赤坂おぎ乃 和甘 あずきマスカルポーネ',
          caption: 'あずきマスカルポーネ（定番・9/22候補）',
          href: 'https://www.enjoytokyo.jp/article/202002/',
          source: 'レッツエンジョイ東京'
        },
        {
          src: 'https://crea.ismcdn.jp/mwimgs/2/2/670wm/img_2241cc383d51b50058d827612f4b813668028.jpg',
          alt: '赤坂おぎ乃 和甘 あずきマスカルポーネと包装',
          caption: 'あずきマスカルポーネ（定番）',
          href: 'https://crea.bunshun.jp/articles/-/47248',
          source: 'CREA'
        },
        {
          src: 'https://assets.st-note.com/production/uploads/images/178251492/rectangle_large_type_2_babdea1d4213cef7c0b51259d798dda2.jpeg?fit=bounds&quality=85&width=1280',
          alt: '赤坂おぎ乃 和甘 生どらやきの包装',
          caption: 'ブランド・包装イメージ',
          href: 'https://note.com/wakan_ogino/n/n1351360508d9',
          source: '和甘公式note'
        }
      ]
    },
    maru: {
      preview: {
        src: 'https://tblg.k-img.com/restaurant/images/Rvw/306704/dff786ac8a841d7f5aa51774f2e9c536.jpg',
        alt: 'maru bagelの現店舗外観',
        caption: 'maru bagel：2025年移転後の店舗イメージ',
        href: 'https://tabelog.com/saitama/A1101/A110102/11065547/',
        source: '食べログ'
      },
      gallery: [
        {
          src: 'https://tblg.k-img.com/restaurant/images/Rvw/307610/640x640_rect_27a67b2fc2f5e74f1fde2989175a8072.jpg',
          alt: 'maru bagelのベーグルが並ぶ店頭',
          caption: '2025年移転後の店頭イメージ（個別商品は9/22 LINEで確定）',
          href: 'https://tabelog.com/saitama/A1101/A110102/11065547/',
          source: '食べログ'
        },
        {
          src: 'https://tblg.k-img.com/restaurant/images/Rvw/306704/dff786ac8a841d7f5aa51774f2e9c536.jpg',
          alt: 'maru bagelの現店舗外観',
          caption: '店舗外観',
          href: 'https://tabelog.com/saitama/A1101/A110102/11065547/',
          source: '食べログ'
        }
      ]
    },
    commen: {
      preview: {
        src: 'https://commen.jp/brandsite/wp-content/uploads/bfd3aaa0add9d8d1c7e96cda78f36678-1-2000x1334.jpg',
        alt: "Comme'N TOKYO たまご明太サンド",
        caption: "Comme'N：たまご明太サンド（現行）",
        href: 'https://commen.jp/menu_list/%E3%81%9F%E3%81%BE%E3%81%94%E6%98%8E%E5%A4%AA%E3%82%B5%E3%83%B3%E3%83%89/',
        source: '公式'
      }
    }
  };

  function findShopCard(name) {
    return [...document.querySelectorAll('.shop-card')]
      .find((card) => card.querySelector('h3')?.textContent.includes(name));
  }

  // ファーストビューからタイムラインへ入る前に、4店を写真で比較できる帯を追加。
  const firstSection = document.querySelector('main > section');
  const routeSection = document.querySelector('#route');
  if (firstSection && routeSection && !document.querySelector('#photo-preview')) {
    const preview = document.createElement('section');
    preview.id = 'photo-preview';
    preview.setAttribute('aria-labelledby', 'photo-preview-title');
    preview.innerHTML = `
      <div class="section-head">
        <div><p class="section-kicker">PHOTO PREVIEW</p><h2 id="photo-preview-title">4店を写真で見る</h2></div>
        <span class="section-note">商品 / 店頭イメージを区別</span>
      </div>
      <div class="gallery">
        ${figure(visualData.shimoda.preview)}
        ${figure(visualData.wakan.preview)}
        ${figure(visualData.maru.preview)}
        ${figure(visualData.commen.preview)}
      </div>
      <p class="disclaimer">写真は「9/22に狙える現行・定番商品」と「店舗・ブランドイメージ」を分けて表記。店頭イメージに写る個々の商品は9/22の在庫を保証しません。ユーザー提供写真は使用していません。</p>`;
    routeSection.before(preview);
  }

  // 画像が少なかった3店を2〜3枚ずつに補強。Comme'Nの既存4枚はそのまま維持。
  const galleryTargets = [
    [findShopCard('下田流'), visualData.shimoda.gallery],
    [findShopCard('赤坂おぎ乃 和甘'), visualData.wakan.gallery],
    [findShopCard('maru bagel'), visualData.maru.gallery]
  ];
  galleryTargets.forEach(([card, items]) => {
    if (!card || card.querySelector('.gallery')) return;
    const gallery = document.createElement('div');
    gallery.className = 'gallery';
    gallery.innerHTML = items.map(figure).join('');
    card.prepend(gallery);
  });

  // 和甘は9月限定の実物写真ギャラリーへ直接飛べるようにする。
  const wakanCard = findShopCard('赤坂おぎ乃 和甘');
  if (wakanCard) {
    const actions = wakanCard.querySelector('.shop-actions');
    if (actions && !actions.querySelector('[data-september-photo]')) {
      const link = document.createElement('a');
      link.className = 'action';
      link.href = 'https://crea.bunshun.jp/articles/photo/59877?pn=1';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.dataset.septemberPhoto = 'true';
      link.textContent = '9月限定の写真9枚';
      actions.insertBefore(link, actions.children[1] || null);
    }
  }

  // maru bagelは9/14時点の公式ページ掲載候補を、9/22確定商品と混同しない形で補足。
  const maruCard = findShopCard('maru bagel');
  if (maruCard) {
    const boxes = maruCard.querySelectorAll('.detail-box');
    const buyList = boxes[0]?.querySelector('.buy-list');
    if (buyList && !buyList.querySelector('[data-current-maru]')) {
      const item = document.createElement('li');
      item.dataset.currentMaru = 'true';
      item.innerHTML = '<strong>9/14公式掲載候補：</strong> 梅むしどりクリームチーズ / 塩バター / 紅茶マロンホワイトチョコクリームチーズ。9/22はLINE取り置き画面に出たものだけ採用。';
      buyList.append(item);
    }
  }

  // 写真の出典をページ末尾にも集約。
  const sourceList = document.querySelector('.source-list');
  const addSource = (href, label) => {
    if (!sourceList || [...sourceList.querySelectorAll('a')].some((a) => a.href === href)) return;
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = label;
    sourceList.append(a);
  };
  addSource('https://tabelog.com/tokyo/A1322/A132205/13263179/', '下田流 写真の外部参照（食べログ）');
  addSource('https://tabelog.com/saitama/A1101/A110102/11065547/', 'maru bagel 現店舗の写真（食べログ）');
  addSource('https://note.com/wakan_ogino/n/n1351360508d9', '和甘 公式note（ブランド写真）');
  addSource('https://crea.bunshun.jp/articles/photo/59877?pn=1', '和甘 9月限定・定番商品の写真（CREA）');

  const storageKey = document.body.dataset.storage || 'bakery-trip-v03';
  const checks = [...document.querySelectorAll('[data-check]')];
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  checks.forEach((input) => {
    input.checked = Boolean(saved[input.dataset.check]);
    input.addEventListener('change', () => {
      const state = {};
      checks.forEach((c) => state[c.dataset.check] = c.checked);
      localStorage.setItem(storageKey, JSON.stringify(state));
      refreshStatus();
    });
  });
  document.querySelector('[data-reset]')?.addEventListener('click', () => {
    checks.forEach((c) => c.checked = false);
    localStorage.removeItem(storageKey);
    refreshStatus();
  });
  function refreshStatus() {
    const done = checks.filter((c) => c.checked).length;
    const total = checks.length || 1;
    const bar = document.querySelector('[data-status-bar]');
    const statusMeta = document.querySelector('[data-status-meta]');
    if (bar) bar.style.width = `${Math.round(done / total * 100)}%`;
    if (statusMeta) statusMeta.textContent = `準備 ${done}/${checks.length}`;
  }
  refreshStatus();

  // 外部画像が表示できない場合、大きな空枠を残さずその画像だけ消す。
  document.querySelectorAll('img[data-external]').forEach((img) => {
    img.addEventListener('error', () => {
      const figureEl = img.closest('figure');
      if (figureEl) {
        const gallery = figureEl.closest('.gallery');
        figureEl.remove();
        if (gallery && !gallery.querySelector('figure')) gallery.remove();
        return;
      }
      img.remove();
    }, { once: true });
  });

  const fab = document.querySelector('[data-top]');
  const toggleFab = () => fab?.classList.toggle('show', scrollY > 700);
  addEventListener('scroll', toggleFab, { passive: true });
  toggleFab();
  fab?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  const plans = [...document.querySelectorAll('[data-plan-time]')];
  const tripDate = document.body.dataset.tripDate;
  const statusTitle = document.querySelector('[data-status-title]');
  if (plans.length && statusTitle) {
    const now = new Date();
    const yyyyMmDd = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    if (yyyyMmDd === tripDate) {
      const mins = now.getHours() * 60 + now.getMinutes();
      let current = plans[0];
      for (const plan of plans) {
        const [h,m] = plan.dataset.planTime.split(':').map(Number);
        if (h * 60 + m <= mins) current = plan;
      }
      statusTitle.innerHTML = `<b>現在/次：</b> ${current.dataset.planLabel}`;
    }
  }
})();
