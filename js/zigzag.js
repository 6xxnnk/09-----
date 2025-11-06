/* ============================================
   Zigzag Section Swiper 초기화 (카드 + 아이폰)
   Author: 6xxnnk
============================================ */
document.addEventListener('DOMContentLoaded', function(){

  // 기존 4대 아이폰(zigzag-1~4)용
  ['.zigzag-1', '.zigzag-2', '.zigzag-3', '.zigzag-4'].forEach(function(sel){
    const el = document.querySelector(sel);
    if(!el) return;

    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 8,
      navigation: {
        nextEl: el.querySelector('.swiper-button-next'),
        prevEl: el.querySelector('.swiper-button-prev')
      },
      allowTouchMove: true,
      loop: false,
      speed: 600,
    });
  });

  // 새 포트폴리오형 지그재그 레이아웃용 (zz-tile-1~4 + zz-phone-swiper)
  ['.zz-tile-1', '.zz-tile-2', '.zz-tile-3', '.zz-tile-4', '.zz-phone-swiper'].forEach(function(sel){
    const el = document.querySelector(sel);
    if(!el) return;

    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 8,
      allowTouchMove: true,
      loop: false,
      speed: 700,
    });
  });

});
