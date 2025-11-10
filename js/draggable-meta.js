
// =========================================================
// draggable-meta.smooth.js  (bounded to .device--imac)
// • translate3d + rAF로 부드럽게
// • Pointer Events로 mouse/touch 통합
// • 이동 중 레이아웃 읽기 최소화(시작 시만 측정)
// v2025.11.10
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  const wins = document.querySelectorAll('[data-draggable]');

  // ---------- 0) Tooltip(동일) ----------
  const tooltip = document.createElement('div');
  tooltip.className = 'draggable-tooltip';
  Object.assign(tooltip.style, {
    position:'fixed', top:'0px', left:'0px', transform:'translate(-50%,-8px)',
    padding:'8px 10px', fontSize:'12px', fontWeight:'700', letterSpacing:'0.02em',
    color:'#111', background:'linear-gradient(180deg,#fffdf4,#fff7cc)',
    border:'1px solid rgba(0,0,0,.12)', borderRadius:'10px',
    boxShadow:'0 10px 24px rgba(0,0,0,.12), inset 0 1px 0 #fff',
    pointerEvents:'none', zIndex:'99999', opacity:'0',
    transition:'opacity .15s ease, transform .15s ease', whiteSpace:'nowrap'
  });
  document.body.appendChild(tooltip);

  const showTT = (target,x=null,y=null)=>{
    const text = target.getAttribute('data-tooltip') || '드래그해서 위치를 바꿔보세요';
    tooltip.textContent = text;
    tooltip.style.opacity = '1';
    if(x!=null && y!=null){
      tooltip.style.left = `${x}px`;
      tooltip.style.top  = `${y-14}px`;
      tooltip.style.transform = 'translate(-50%, -100%)';
    }else{
      const r = target.getBoundingClientRect();
      tooltip.style.left = `${r.left + r.width/2}px`;
      tooltip.style.top  = `${Math.max(8, r.top - 10)}px`;
      tooltip.style.transform = 'translate(-50%, -100%)';
    }
  };
  const moveTT = (x,y)=>{
    tooltip.style.left = `${x}px`;
    tooltip.style.top  = `${y-14}px`;
    tooltip.style.transform = 'translate(-50%, -100%)';
  };
  const hideTT = ()=> tooltip.style.opacity = '0';

  // ---------- 1) Drag ----------
  wins.forEach(win=>{
    const bound = win.closest('.device--imac') || win.closest('.project') || win.closest('section') || document.body;
    if(getComputedStyle(bound).position === 'static'){ bound.style.position = 'relative'; }

    // 핸들(없으면 자체)
    const handle = win.querySelector('[data-drag-handle]') || win;

    // 내부 상태
    let dragging = false;
    let startClientX = 0, startClientY = 0;
    let startTx = 0, startTy = 0;           // 시작 translate 값
    let curTx = 0, curTy = 0;               // 현재 translate 값
    let rafId = 0;
    let maxL = 0, maxT = 0, minL = 0, minT = 0; // 경계
    let zSeed = 1000;

    // 초기 위치가 left/top로 잡혀있다면 translate로 전환
    const normalizeInitialTransform = ()=>{
      const cs = getComputedStyle(win);
      if(cs.position === 'static') win.style.position = 'absolute';
      // left/top -> transform 변환
      const left = parseFloat(win.style.left || 0);
      const top  = parseFloat(win.style.top  || 0);
      if(left || top){
        win.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        win.style.left = '0'; win.style.top = '0';  // 좌표 기준 transform으로 통일
      }
      // 현재 transform 파싱
      const m = getComputedStyle(win).transform;
      if(m && m !== 'none'){
        const vals = m.match(/matrix\(([^)]+)\)/) || m.match(/matrix3d\(([^)]+)\)/);
        if(vals){
          const nums = vals[1].split(',').map(parseFloat);
          if(nums.length === 6){ curTx = nums[4]; curTy = nums[5]; }
          else if(nums.length === 16){ curTx = nums[12]; curTy = nums[13]; }
        }
      }
      startTx = curTx; startTy = curTy;
    };

    normalizeInitialTransform();

    // 경계 갱신(창 크기/리사이즈 시)
    const updateBounds = ()=>{
      const br = bound.getBoundingClientRect();
      const ww = win.offsetWidth, wh = win.offsetHeight;
      minL = 0; minT = 0;
      maxL = Math.max(0, br.width  - ww);
      maxT = Math.max(0, br.height - wh);
    };
    updateBounds();
    window.addEventListener('resize', updateBounds, {passive:true});

    // 렌더러(rAF 한곳에서만 DOM 쓰기)
    let nextTx = 0, nextTy = 0, needsRender = false;
    const render = ()=>{
      rafId = 0;
      if(!needsRender) return;
      needsRender = false;
      win.style.transform = `translate3d(${nextTx}px, ${nextTy}px, 0)`;
    };

    const onPointerDown = (e)=>{
      // 버튼 위에서는 툴팁/드래그 비활성(포트폴리오 버튼 클릭 방해 X)
      if(e.target.closest('.meta-actions')) return;

      dragging = true;
      win.classList.add('dragging');
      win.style.zIndex = String(++zSeed);
      hideTT();

      startClientX = e.clientX;
      startClientY = e.clientY;

      // 현재 tx/ty 다시 읽고 시작값으로 고정(레이아웃 읽기 최소화)
      const m = getComputedStyle(win).transform;
      curTx = startTx; curTy = startTy;
      if(m && m !== 'none'){
        const vals = m.match(/matrix\(([^)]+)\)/) || m.match(/matrix3d\(([^)]+)\)/);
        if(vals){
          const nums = vals[1].split(',').map(parseFloat);
          if(nums.length === 6){ curTx = nums[4]; curTy = nums[5]; }
          else if(nums.length === 16){ curTx = nums[12]; curTy = nums[13]; }
        }
      }
      startTx = curTx; startTy = curTy;

      updateBounds();
      handle.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e)=>{
      if(!dragging) return;
      e.preventDefault(); // 스크롤/텍스트 선택 방지

      const dx = e.clientX - startClientX;
      const dy = e.clientY - startClientY;

      let tx = startTx + dx;
      let ty = startTy + dy;

      // 경계(섹션 내부) — 제한 없애려면 아래 4줄 주석 처리
      if(tx < minL) tx = minL;
      if(ty < minT) ty = minT;
      if(tx > maxL) tx = maxL;
      if(ty > maxT) ty = maxT;

      nextTx = tx; nextTy = ty;
      needsRender = true;
      if(!rafId) rafId = requestAnimationFrame(render);
    };

    const onPointerUp = ()=>{
      if(!dragging) return;
      dragging = false;
      win.classList.remove('dragging');
      cancelAnimationFrame(rafId);
      rafId = 0;
      // 최종 위치를 현재 transform으로 고정
      const m = getComputedStyle(win).transform;
      if(m && m !== 'none'){
        const vals = m.match(/matrix\(([^)]+)\)/) || m.match(/matrix3d\(([^)]+)\)/);
        if(vals){
          const nums = vals[1].split(',').map(parseFloat);
          if(nums.length === 6){ startTx = nums[4]; startTy = nums[5]; }
          else if(nums.length === 16){ startTx = nums[12]; startTy = nums[13]; }
        }
      }
    };

    handle.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, {passive:false});
    window.addEventListener('pointerup', onPointerUp, {passive:true});
    window.addEventListener('pointercancel', onPointerUp, {passive:true});

    // ---------- 2) Tooltip ----------
    win.addEventListener('mouseenter', (e)=>{
      if(dragging) return;
      // 버튼 위에서는 툴팁 비활성
      if(e.target.closest('.meta-actions')) return;
      showTT(win);
    });
    win.addEventListener('mousemove', (e)=>{
      if(dragging) return;
      if(e.target.closest('.meta-actions')){ hideTT(); return; }
      moveTT(e.clientX, e.clientY);
    });
    win.addEventListener('mouseleave', hideTT);
    win.addEventListener('focusin', ()=> showTT(win));
    win.addEventListener('focusout', hideTT);
  });
});

