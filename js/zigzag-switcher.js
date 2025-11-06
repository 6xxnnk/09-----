// 썸네일 클릭 시 해당 패널(스와이퍼)만 표시하는 스위처
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.proj--zigzag-v2, .proj--zigzag');
  if (!root) return;

  // 왼쪽 썸네일들(순서 1~4)
  const thumbs = Array.from(root.querySelectorAll('.zz-thumb'));
  // 오른쪽 스와이퍼 패널들(순서 1~4)
  const panels = Array.from(root.querySelectorAll('.zz-panel'));

  // 패널별 Swiper 초기화(패널 내부의 .swiper 기준)
  const swipers = new Map();
  panels.forEach((panel, i) => {
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
    });

    // key는 data-key 있으면 그걸, 없으면 인덱스(1~4)
    const key = panel.dataset.key || String(i + 1);
    swipers.set(key, instance);
  });

  // 활성화 함수
  function activateByKey(key) {
    // 패널 show/hide
    panels.forEach((p, i) => {
      const k = p.dataset.key || String(i + 1);
      p.classList.toggle('is-active', k === key);
    });

    // 썸네일 상태
    thumbs.forEach((t, i) => {
      const k = t.dataset.key || String(i + 1);
      t.classList.toggle('is-active', k === key);
    });

    // 해당 스와이퍼 업데이트 & 첫 슬라이드로
    const sw = swipers.get(key);
    if (sw) {
      sw.update();
      sw.slideTo(0, 0); // 처음 장부터
    }
  }

  // 썸네일 클릭/키보드 접근성
  thumbs.forEach((t, i) => {
    // 포커스 가능하게(HTML에 tabindex 없으면 부여)
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '0');

    const key = t.dataset.key || String(i + 1);

    const handler = (e) => {
      if (e.type === 'click' ||
         (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))) {
        e.preventDefault?.();
        activateByKey(key);
      }
    };

    t.addEventListener('click', handler);
    t.addEventListener('keydown', handler);
  });

  // 초기: 첫 번째 활성화
  const firstKey =
    thumbs[0]?.dataset.key ||
    panels[0]?.dataset.key ||
    '1';
  activateByKey(firstKey);
});
