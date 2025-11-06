// zigzag-swipers.js (또는 네가 스와이퍼 초기화해둔 파일)
document.addEventListener('DOMContentLoaded', function(){
  const ids = ['zz-s1','zz-s2','zz-s3','zz-s4'];
  const swipers = {};

  ids.forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;

    swipers[id] = new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 8,
      // === 전환을 더 부드럽게 ===
      speed: 700,                 // 기본 300 → 700ms
      resistanceRatio: 0.9,       // 스와이프 탄성 부드럽게
      longSwipesRatio: 0.2,       // 짧은 드래그도 전환되도록
      followFinger: true,
      allowTouchMove: true,
      // 네비게이션 그대로 유지
      navigation: {
        nextEl: el.querySelector('.swiper-button-next'),
        prevEl: el.querySelector('.swiper-button-prev')
      }
    });
  });

  // 패널 토글 로직이 따로 있다면 그대로 사용하면 됨
});
