/* Glossier: 뷰포트 진입 시 세로 자동 스크롤 */
(() => {
  const phones = document.querySelectorAll('.phone-glossier');
  if (!phones.length) return;

  phones.forEach((phone) => {
    const stack = phone.querySelector('.stack');
    if (!stack) return;

    const DURATION = 14000; // 14s
    let timer = null;

    const start = () => {
      phone.classList.add('in-view');
      stack.classList.remove('reset');
      clearTimeout(timer);
      timer = setTimeout(() => {
        stack.classList.add('reset');     // 원위치
        phone.classList.remove('in-view');
      }, DURATION + 200);
    };

    const stop = () => {
      phone.classList.remove('in-view');
      clearTimeout(timer);
    };

    const io = new IntersectionObserver(([ent]) => {
      if (!ent) return;
      ent.isIntersecting ? start() : stop();
    }, { threshold: 0.4 });

    io.observe(phone);
  });
})();
