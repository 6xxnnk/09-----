(function(){
  const el = document.getElementById('contact-bounce');
  if(!el) return;

  const canvas = {
    el,
    get width(){ return this.el.clientWidth; },
    get height(){ return this.el.clientHeight; }
  };

  const colors = ["#111", "#ffd74f", "#ffb35f", "#ffcf7f"];

  function makeBall({color="#111", x=0, y=0, dx=2, dy=3, size=14}={}){
    const span = document.createElement('span');
    span.className = 'ball';
    span.style.backgroundColor = color;
    span.style.width = size + 'px';
    span.style.height = size + 'px';
    canvas.el.appendChild(span);

    let px = Math.max(0, Math.min(x, canvas.width - size));
    let py = Math.max(0, Math.min(y, canvas.height - size));
    let vx = dx, vy = dy;

    function tick(){
      px += vx; py += vy;
      if (px <= 0 || px >= canvas.width - size) vx = -vx;
      if (py <= 0 || py >= canvas.height - size) vy = -vy;
      span.style.transform = `translate(${px}px, ${py}px)`;
      requestAnimationFrame(tick);
    }
    tick();
  }

  // 스타터 볼들
  for(let i=0;i<5;i++){
    makeBall({
      color: colors[i % colors.length],
      x: Math.random() * Math.max(10, canvas.width - 20),
      y: Math.random() * Math.max(10, canvas.height - 20),
      dx: (Math.random()>0.5?1:-1) * (1 + Math.random()*2.5),
      dy: (Math.random()>0.5?1:-1) * (1 + Math.random()*2.5),
      size: 12 + Math.round(Math.random()*6)
    });
  }

  // 클릭으로 공 추가
  canvas.el.addEventListener('click', (e)=>{
    const r = canvas.el.getBoundingClientRect();
    const size = 12 + Math.round(Math.random()*6);
    makeBall({
      color: colors[Math.floor(Math.random()*colors.length)],
      x: e.clientX - r.left - size/2,
      y: e.clientY - r.top  - size/2,
      dx: (Math.random()>0.5?1:-1) * (1 + Math.random()*3),
      dy: (Math.random()>0.5?1:-1) * (1 + Math.random()*3),
      size
    });
  });
})();