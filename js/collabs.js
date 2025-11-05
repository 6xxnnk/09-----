
(function(){
  const phone = document.querySelector('.phone-glossier');
  if(!phone) return;
  const stack = phone.querySelector('.stack');
  const io = new IntersectionObserver(([ent])=>{
    if(!ent) return;
    if(ent.isIntersecting){
      phone.classList.add('in-view');
      stack.classList.remove('reset');
      // 끝나면 원위치 → 재진입 시 다시 스크롤
      const total = 14000; // CSS와 동일(14s)
      clearTimeout(stack._t);
      stack._t = setTimeout(()=>{
        stack.classList.add('reset'); // 부드럽게 0으로
        phone.classList.remove('in-view');
      }, total + 200);
    }else{
      phone.classList.remove('in-view');
    }
  }, { threshold: 0.4 });
  io.observe(phone);
})();

/* ===== Zigzag: 간단 슬라이더(4장) ===== */
(function(){
  const track = document.getElementById('zigzagTrack');
  const prev = document.getElementById('prevZ');
  const next = document.getElementById('nextZ');
  if(!track || !prev || !next) return;

  const total = track.children.length;
  function go(idx){
    const max = total - 1;
    if(idx < 0) idx = 0;
    if(idx > max) idx = max;
    track.dataset.index = idx;
    track.style.transform = `translateX(${idx * -100}%)`;
  }
  prev.addEventListener('click', ()=> go(+track.dataset.index - 1));
  next.addEventListener('click', ()=> go(+track.dataset.index + 1));

  // 스와이프(모바일)
  let startX = null;
  track.addEventListener('pointerdown', (e)=>{ startX = e.clientX; track.setPointerCapture(e.pointerId); });
  track.addEventListener('pointerup', (e)=>{
    if(startX==null) return;
    const dx = e.clientX - startX;
    if(Math.abs(dx) > 40){
      if(dx < 0) go(+track.dataset.index + 1);
      else go(+track.dataset.index - 1);
    }
    startX = null;
  });
})();
