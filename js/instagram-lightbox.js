/* instagram-lightbox.js — 배경은 그대로, 이미지만 확대 + 스와이프 */
(() => {
  const lb = document.getElementById('lightbox');
  const lbClose = document.getElementById('lbClose');
  const wrap = document.querySelector('#lbSwiper .swiper-wrapper');
  if (!lb || !lbClose || !wrap) return;

  let swiperInstance = null;

  function openLightbox(images, startIndex = 0) {
    wrap.innerHTML = images
      .filter(Boolean)
      .map(src => `<div class="swiper-slide"><img src="${src.trim()}" alt=""></div>`)
      .join('');

    if (swiperInstance) swiperInstance.destroy(true, true);
    swiperInstance = new Swiper('#lbSwiper', {
      initialSlide: Math.max(0, startIndex),
      loop: images.length > 1,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      keyboard: { enabled: true },
      spaceBetween: 8
    });

    lb.classList.add('is-open');
    document.body.classList.add('ig-lb-lock');
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.classList.remove('ig-lb-lock');
  }

  // 타일 클릭 → 라이트박스 오픈 (클릭한 썸네일 인덱스 추정)
  document.addEventListener('click', (e) => {
    const tile = e.target.closest('.gallery-item');
    if (!tile) return;

    const list = (tile.getAttribute('data-images') || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (!list.length) return;

    // 현재 썸네일이 첫 번째 이미지라고 가정
    openLightbox(list, 0);
  });

  // 닫기 버튼
  lbClose.addEventListener('click', closeLightbox);

  // ESC로 닫기
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  // 페이지 떠날 때 정리
  window.addEventListener('beforeunload', () => {
    if (swiperInstance) swiperInstance.destroy(true, true);
  });
})();
