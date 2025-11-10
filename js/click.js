(function(){
  // 범위를 좁히려면 root를 document 대신 document.querySelector('.protect')로 바꿔도 됩니다.
  const root = document;

  // 1) 우클릭 메뉴 차단
  root.addEventListener('contextmenu', (e) => {
    // 버튼/입력 같은 UI는 허용하고 싶다면 예외 처리
    if (e.target.closest('input, textarea, select, [contenteditable], .allow-context')) return;
    e.preventDefault();
  }, {capture:true});

  // 2) 드래그 시작 차단(이미지/텍스트 모두)
  root.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  // 3) 복사/잘라내기/선택 시작 차단
  ['copy','cut','selectstart'].forEach(type => {
    root.addEventListener(type, (e) => {
      // 폼 입력은 그대로 쓰게 두고 싶다면:
      if (e.target.closest('input, textarea, [contenteditable="true"], .allow-select')) return;
      e.preventDefault();
    }, {capture:true});
  });

  // 4) 이미지 길게 누르기 저장(iOS/모바일) 더 차단
  ['touchstart','touchend','touchcancel'].forEach(type=>{
    root.addEventListener(type, (e)=>{
      if (e.target.closest('img, picture, video, svg, .guard-media')) {
        // 길게 눌러도 기본 호출(저장 시트) 방지
        e.preventDefault();
      }
    }, {passive:false, capture:true});
  });

  // 5) 저장/인쇄/개발자도구(완벽 차단은 불가, 기본 단축키만 방지)
  root.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    const mod = e.ctrlKey || e.metaKey;

    // 저장 / 인쇄
    if ((mod && (k === 's' || k === 'p'))) { e.preventDefault(); return; }

    // 보기 소스/개발자 도구 (완벽 방지는 불가)
    if (mod && (k === 'u' || k === 'i' || k === 'j' || k === 'c')) { e.preventDefault(); return; }
    if (e.key === 'F12') { e.preventDefault(); return; }
  });

  // 6) 이미지에 draggable="false" 강제 주입(혹시 빠진 경우)
  document.querySelectorAll('img, picture, svg, video').forEach(el=>{
    el.setAttribute('draggable', 'false');
  });
})();

