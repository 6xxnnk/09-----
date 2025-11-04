/* hero 섹션 전용 스크립트
   - 타입 애니메이션 (유령 플레이스홀더)
   - Search 제출 시 아래 컨텐츠로 스크롤
*/
(function () {
  const ghost = document.getElementById('typingGhost');
  const input = document.getElementById('q');
  const phrase = 'Do you love vintage?';
  let i = 0, dir = 1, stopped = false;

  function tick() {
    if (stopped) return;
    // 입력을 시작하면 유령 placeholder 숨김
    if (document.activeElement === input || input.value.length) {
      ghost.classList.add('hidden');
    } else {
      ghost.classList.remove('hidden');
      ghost.textContent = phrase.slice(0, i);
      i += dir;
      if (i > phrase.length + 4) dir = -1; // 끝에서 잠깐 머무름
      if (i <= 0) dir = 1;                 // 다시 증가
    }
    setTimeout(tick, 80);
  }
  tick();

  input.addEventListener('focus', () => ghost.classList.add('hidden'));
  input.addEventListener('blur', () => {
    if (!input.value.length) ghost.classList.remove('hidden');
  });

  // Search → 아래 섹션으로 스크롤
  const form = document.getElementById('searchForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const target = document.getElementById('content');
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // 페이지가 숨겨질 때 타이핑 루프 중지(성능)
  document.addEventListener('visibilitychange', () => {
    stopped = document.hidden;
    if (!stopped) tick();
  });
})();
