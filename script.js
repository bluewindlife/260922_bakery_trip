(() => {
  // v0.4: 本命店カード内の写真を維持し、比較候補にも写真を追加。
  // 重複していた「4店を写真で見る」プレビューは廃止する。
  // ユーザー提供写真は使わず、公式・公式note・外部参照画像のみを出典付きで表示する。
  document.body.dataset.storage = 'bakery-trip-260922-v04';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = meta.content.replace(/v0\.[0-9]+/, 'v0.4');
  const conceptNote = [...document.querySelectorAll('.section-head')]
    .find((head) => head.querySelector('h2')?.textContent.includes('この日の設計'))
    ?.querySelector('.section-note');
  if (conceptNote) conceptNote.textContent = '写真強化 v0.4';
  const footer = document.querySelector('footer');
  if (footer) footer.textContent = '260922_bakery_trip · v0.4 · updated 2026-09-14';

  const figure = ({ src, alt, caption, href, source }) => `
    <figure>
      <img data-external loading="lazy" src="${src}" alt="${alt}" referrerpolicy="no-referrer">
      <figcaption>${caption} / <a href="${href}" target="_blank" rel="noopener noreferrer">${source}</a></figcaption>
    </figure>`;

  const visualData = {
    shimoda: {
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
    }
  };

  const candidateVisuals = {
    'Kepobagels': {
      src: 'https://tblg.k-img.com/restaurant/images/Rvw/276129/640x640_rect_deeef5f755b5f059a7f08f4ab302dd80.jpg',
      alt: 'Kepobagels 洗足店の店舗外観',
      caption: '洗足店の店舗イメージ',
      href: 'https://tabelog.com/tokyo/A1317/A131711/13304380/',
      source: '食べログ'
    },
    'HIGU BAGEL': {
      src: 'https://san-tatsu.jp/assets/uploads/2024/04/19145648/1713506208-3fcaf8c44a19bb13d04b26012d9d6d0b.jpg',
      alt: 'HIGU BAGEL & CAFEのベーグルが並ぶ店頭',
      caption: 'ベーグルの店頭イメージ',
      href: 'https://san-tatsu.jp/articles/308925/',
      source: '散歩の達人'
    },
    'TSUBASA COFFEE': {
      src: 'https://tblg.k-img.com/restaurant/images/Rvw/162674/640x640_rect_162674330.jpg',
      alt: 'TSUBASA COFFEEの店舗外観',
      caption: '店舗イメージ',
      href: 'https://tabelog.com/tokyo/A1304/A130402/13259936/',
      source: '食べログ'
    },
    'Ryumon Coffee Stand': {
      src: 'https://ximg.retty.me/crop/s400x400/q80/das/-/retty/img_repo/2l/01/37003002.jpg',
      alt: 'Ryumon Coffee Standのティラミスとドリンク',
      caption: 'ティラミスの参考イメージ',
      href: 'https://retty.me/area/PRE13/ARE663/SUB1202/100000026292/',
      source: 'Retty'
    },
    'ZONO BAGEL': {
      src: 'https://tblg.k-img.com/restaurant/images/Rvw/333526/640x640_rect_54d6a6c88a25454d11a993c6a69d6ace.jpg',
      alt: 'ZONO BAGELのベーグルが並ぶ店頭',
      caption: 'ベーグルの店頭イメージ',
      href: 'https://tabelog.com/tokyo/A1311/A131103/13316468/',
      source: '食べログ'
    },
    'tecona bagel works': {
      src: 'https://tblg.k-img.com/restaurant/images/Rvw/324708/94a743b3ef2c7b8984026e5a2c67c21b.jpg',
      alt: 'tecona bagel worksの店舗・ベーグルイメージ',
      caption: '店舗イメージ（今回は実食結果により除外）',
      href: 'https://tabelog.com/tokyo/A1303/A130302/13061492/',
      source: '食べログ'
    }
  };

  function findShopCard(name) {
    return [...document.querySelectorAll('.shop-card')]
      .find((card) => card.querySelector('h3')?.textContent.includes(name));
  }

  function findCandidateCard(name) {
    return [...document.querySelectorAll('.candidate-card')]
      .find((card) => card.querySelector('h3')?.textContent.includes(name));
  }

  // 本命店のカード内ギャラリーを維持。重複する独立プレビューは作らない。
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

  // 比較候補は文章だけでなく、候補ごとの写真をカード内に表示する。
  const candidateStyle = document.createElement('style');
  candidateStyle.textContent = `
    .candidate-card{overflow:hidden}
    .candidate-card .candidate-gallery{margin:-15px -15px 12px;padding:0;display:block;overflow:hidden;background:#e9e3dd}
    .candidate-card .candidate-gallery figure{width:100%;height:185px;margin:0;border-radius:0}
    .candidate-card .candidate-gallery img{width:100%;height:100%;object-fit:cover;display:block}
    @media(min-width:680px){.candidate-card .candidate-gallery figure{height:210px}}
  `;
  document.head.append(candidateStyle);

  Object.entries(candidateVisuals).forEach(([name, item]) => {
    const card = findCandidateCard(name);
    if (!card || card.querySelector('.candidate-gallery')) return;
    const gallery = document.createElement('div');
    gallery.className = 'gallery candidate-gallery';
    gallery.innerHTML = figure(item);
    card.prepend(gallery);
  });

  const candidateNote = document.querySelector('#candidates .section-note');
  if (candidateNote) candidateNote.textContent = '写真で比較・追加は1店まで';

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
  addSource('https://tabelog.com/tokyo/A1317/A131711/13304380/', 'Kepobagels 洗足店 写真（食べログ）');
  addSource('https://san-tatsu.jp/articles/308925/', 'HIGU BAGEL & CAFE 写真（散歩の達人）');
  addSource('https://tabelog.com/tokyo/A1304/A130402/13259936/', 'TSUBASA COFFEE 写真（食べログ）');
  addSource('https://retty.me/area/PRE13/ARE663/SUB1202/100000026292/', 'Ryumon Coffee Stand 写真（Retty）');
  addSource('https://tabelog.com/tokyo/A1311/A131103/13316468/', 'ZONO BAGEL 写真（食べログ）');
  addSource('https://tabelog.com/tokyo/A1303/A130302/13061492/', 'tecona bagel works 写真（食べログ）');

  const storageKey = document.body.dataset.storage || 'bakery-trip-v04';
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
