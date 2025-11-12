
(function(){
  const wrap = document.getElementById('zzThumbs');
  const stageImg = document.getElementById('zzStageImg');
  if(!wrap || !stageImg) return;

  // 썸네일 클릭 핸들러
  wrap.addEventListener('click', function(e){
    const btn = e.target.closest('.zz-thumb');
    if(!btn) return;

    const nextSrc = btn.getAttribute('data-mock');
    if(!nextSrc) return;

    // 이미 표시 중이면 무시
    if(stageImg.dataset.src === nextSrc) return;

    // is-active 토글
    wrap.querySelectorAll('.zz-thumb.is-active').forEach(b=>b.classList.remove('is-active'));
    btn.classList.add('is-active');

    // 부드러운 페이드 교체 (미리 로드 후 교체)
    stageImg.classList.add('is-fading');
    const preload = new Image();
    preload.onload = () => {
      stageImg.src = nextSrc;
      stageImg.dataset.src = nextSrc;
      // 접근성: alt는 썸네일 이미지 alt를 따라가게(빈값이면 그대로 둠)
      const a = btn.querySelector('img');
      if(a && a.getAttribute('alt') !== null){
        stageImg.alt = a.getAttribute('alt');
      }
      requestAnimationFrame(()=> stageImg.classList.remove('is-fading'));
    };
    preload.src = nextSrc;
  });

  // 키보드 접근성: 엔터/스페이스로도 동작
  wrap.querySelectorAll('.zz-thumb').forEach(btn=>{
    btn.setAttribute('type','button'); // form 영향 차단
    btn.addEventListener('keydown', (ev)=>{
      if(ev.key === 'Enter' || ev.key === ' '){
        ev.preventDefault();
        btn.click();
      }
    });
  });
})();

