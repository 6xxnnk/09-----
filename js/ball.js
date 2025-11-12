document.addEventListener('DOMContentLoaded', function(){
  const canvasEl = document.getElementById('contact-bounce');
  if(!canvasEl) return; // 엘리먼트 없으면 중단(초기 빈 실행 이슈 방지)

  // 섹션 전체 크기를 실시간 참조
  const canvas = {
    el: canvasEl,
    get width(){ return this.el.clientWidth; },
    get height(){ return this.el.clientHeight; }
  };

  const colors = ["#111", "#ffd74f", "#ffb35f", "#ffcf7f"];

  function makeBall({color="#111", x=0, y=0, dx=2, dy=3, size=14}={}){
    const el = document.createElement('span');
    el.className = 'ball';
    el.style.backgroundColor = color;
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    canvas.el.appendChild(el);

    // 시작 위치를 영역 안으로 클램프
    let px = Math.max(0, Math.min(x, canvas.width  - size));
    let py = Math.max(0, Math.min(y, canvas.height - size));
    let vx = dx, vy = dy;

    function tick(){
      px += vx; py += vy;

      // 벽 충돌
      if (px <= 0 || px >= canvas.width  - size) vx = -vx;
      if (py <= 0 || py >= canvas.height - size) vy = -vy;

      el.style.transform = `translate(${px}px, ${py}px)`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // 초기 공 여러 개 뿌리기 (섹션이 충분히 렌더된 뒤)
  function seed(){
    const W = Math.max(10, canvas.width  - 20);
    const H = Math.max(10, canvas.height - 20);
    for(let i=0;i<8;i++){
      const size = 12 + Math.round(Math.random()*6);
      makeBall({
        color: colors[i % colors.length],
        x: Math.random() * W,
        y: Math.random() * H,
        dx: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random()*2.5),
        dy: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random()*2.5),
        size
      });
    }
  }

  // 클릭하면 그 위치에 공 추가
  canvas.el.addEventListener('click', (e)=>{
    const r = canvas.el.getBoundingClientRect();
    const size = 12 + Math.round(Math.random()*6);
    makeBall({
      color: colors[Math.floor(Math.random()*colors.length)],
      x: e.clientX - r.left - size/2,
      y: e.clientY - r.top  - size/2,
      dx: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random()*3),
      dy: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random()*3),
      size
    });
  });

  // 레이아웃이 0x0일 때(비가시/탭 전환) 대비 — 보이는 순간 시드
  if (canvas.width > 0 && canvas.height > 0) {
    seed();
  } else {
    const io = new IntersectionObserver((entries)=>{
      if(entries.some(en => en.isIntersecting)){
        seed();
        io.disconnect();
      }
    });
    io.observe(canvas.el);
  }

  // 리사이즈해도 애니메이션은 자동 적응(폭/높이는 getter로 읽음)
});