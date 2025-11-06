/* File: js/zigzag-panels.js (전체 교체) */
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.proj--zigzag-v2');
  if (!root) return;

  const left = root.querySelector('#zzThumbs');
  const right = root.querySelector('#zzRight');
  const thumbs = Array.from(root.querySelectorAll('.zz-thumb'));
  const panels = Array.from(root.querySelectorAll('.zz-swiper'));

  // 패널별 Swiper 생성
  const swipers = new Map();
  panels.forEach(panel => {
    const el = panel.querySelector('.swiper');
    if (!el) return;
    const instance = new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 8,
      navigation: {
        nextEl: panel.querySelector('.swiper-button-next'),
        prevEl: panel.querySelector('.swiper-button-prev'),
      },
      allowTouchMove: true,
      loop: false,
      observer: true,           // DOM 변화 감지
      observeParents: true,
    });
    if (panel.dataset.id) swipers.set(panel.dataset.id, instance);
  });

  // 오른쪽 영역 높이를 왼쪽 2x2 썸네일 총 높이에 맞추기
  function syncRightHeight() {
    if (!left || !right) return;
    const h = Math.round(left.getBoundingClientRect().height);
    right.style.setProperty('--zzH', h + 'px');
  }
  const onReady = () => {
    syncRightHeight();
    requestAnimationFrame(syncRightHeight);
    setTimeout(syncRightHeight, 200);
  };
  window.addEventListener('resize', syncRightHeight);
  thumbs.forEach(t => {
    const img = t.querySelector('img');
    if (img && !img.complete) {
      img.addEventListener('load', syncRightHeight, { once: true });
      img.addEventListener('error', syncRightHeight, { once: true });
    }
  });
  onReady();

  // 패널 활성화
  function activate(key) {
    // 썸네일 상태
    thumbs.forEach(btn => {
      const on = btn.dataset.target === key;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    // 패널 show/hide (opacity/visibility로)
    panels.forEach(panel => {
      const on = panel.dataset.id === key;
      panel.classList.toggle('is-active', on);
    });

    // 스타일 반영된 다음에 Swiper 치수 재계산
    requestAnimationFrame(() => {
      const sw = swipers.get(key);
      if (sw) {
        sw.updateSize();
        sw.updateSlides();
        sw.updateProgress();
        sw.update();
        // 필요 시 첫 슬라이드로 이동 (유지 원하면 주석)
        sw.slideTo(0, 0);
      }
      syncRightHeight();
    });
  }

  // 클릭/키보드 이벤트
  thumbs.forEach(btn => {
    if (!btn.hasAttribute('tabindex')) btn.setAttribute('tabindex', '0');
    btn.setAttribute('role', 'button');

    const run = e => {
      if (e.type === 'click' ||
          (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
        e.preventDefault?.();
        const key = btn.dataset.target;
        if (key) activate(key);
      }
    };
    btn.addEventListener('click', run);
    btn.addEventListener('keydown', run);
  });

  // 초기 활성화
  const first = thumbs.find(t => t.classList.contains('is-active')) || thumbs[0];
  activate(first?.dataset.target || '1');
});
