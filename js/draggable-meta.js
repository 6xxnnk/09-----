// =========================================================
//  draggable-meta.js
//  v2025.11.08 — 드래그 가능한 MacOS-style 메타 카드 + Hover Tooltip
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const els = document.querySelectorAll("[data-draggable]");

  // -----------------------------
  // 1) Tooltip (재사용 1개만 생성)
  // -----------------------------
  const tooltip = document.createElement("div");
  tooltip.className = "draggable-tooltip";
  Object.assign(tooltip.style, {
    position: "fixed",
    top: "0px",
    left: "0px",
    transform: "translate(-50%, -8px)",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.02em",
    color: "#111",
    background: "linear-gradient(180deg,#fffdf4,#fff7cc)",
    border: "1px solid rgba(0,0,0,.12)",
    borderRadius: "10px",
    boxShadow: "0 10px 24px rgba(0,0,0,.12), inset 0 1px 0 #ffffff",
    pointerEvents: "none",
    zIndex: "99999",
    opacity: "0",
    transition: "opacity .15s ease, transform .15s ease",
    whiteSpace: "nowrap"
  });
  document.body.appendChild(tooltip);

  let ttTimer = null;

  function showTooltip(target, clientX = null, clientY = null) {
    clearTimeout(ttTimer);

    // 커스텀 문구가 있으면 사용, 없으면 기본 문구
    const text =
      target.getAttribute("data-tooltip") ||
      "드래그해서 위치를 바꿔보세요";

    tooltip.textContent = text;
    tooltip.style.opacity = "1";

    // 위치: 커서 기준이 있으면 커서 근처, 없으면 카드 상단 중앙
    if (clientX != null && clientY != null) {
      tooltip.style.left = `${clientX}px`;
      tooltip.style.top = `${clientY - 14}px`;
      tooltip.style.transform = "translate(-50%, -100%)";
    } else {
      const r = target.getBoundingClientRect();
      tooltip.style.left = `${r.left + r.width / 2}px`;
      tooltip.style.top = `${r.top - 10}px`;
      tooltip.style.transform = "translate(-50%, -100%)";
    }
  }

  function moveTooltip(clientX, clientY) {
    tooltip.style.left = `${clientX}px`;
    tooltip.style.top = `${clientY - 14}px`;
    tooltip.style.transform = "translate(-50%, -100%)";
  }

  function hideTooltip(delay = 0) {
    clearTimeout(ttTimer);
    ttTimer = setTimeout(() => {
      tooltip.style.opacity = "0";
    }, delay);
  }

  // -----------------------------
  // 2) Drag logic
  // -----------------------------
  els.forEach(win => {
    const handle = win.querySelector("[data-drag-handle]") || win;
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;
    let dragging = false;

    // 초기 위치가 지정되지 않았다면 스타일 기준 포지션 지정
    const cs = window.getComputedStyle(win);
    if (cs.position === "static") {
      win.style.position = "absolute";
    }

    const onDown = (e) => {
      const isTouch = e.type.startsWith("touch");
      const p = isTouch ? e.touches[0] : e;

      dragging = true;
      win.classList.add("dragging");

      // offsetLeft/Top 대신 getBoundingClientRect + 부모 offset 보정
      const parent = win.closest(".imac-shell") || document.body;
      const pr = parent.getBoundingClientRect();
      const wr = win.getBoundingClientRect();

      startLeft = wr.left - pr.left + parent.scrollLeft;
      startTop  = wr.top  - pr.top  + parent.scrollTop;

      startX = p.clientX;
      startY = p.clientY;

      document.addEventListener(isTouch ? "touchmove" : "mousemove", onMove, { passive: false });
      document.addEventListener(isTouch ? "touchend" : "mouseup", onUp, { once: true });

      hideTooltip(0); // 드래그 시작하면 툴팁 숨김
    };

    const onMove = (e) => {
      if (!dragging) return;
      const isTouch = e.type.startsWith("touch");
      const p = isTouch ? e.touches[0] : e;
      if (!isTouch) e.preventDefault();

      const dx = p.clientX - startX;
      const dy = p.clientY - startY;

      let left = startLeft + dx;
      let top  = startTop  + dy;

      const parent = win.closest(".imac-shell") || document.body;
      const pr = parent.getBoundingClientRect();
      const pw = pr.width, ph = pr.height;
      const ww = win.offsetWidth, wh = win.offsetHeight;

      // 살짝 밖으로도 나갈 수 있게 약간의 여유
      left = Math.min(Math.max(left, -ww * 0.6), pw - ww * 0.4);
      top  = Math.min(Math.max(top, -wh * 0.6), ph - wh * 0.4);

      win.style.left = `${left}px`;
      win.style.top  = `${top}px`;
      win.style.right = "auto";
      win.style.bottom = "auto";
    };

    const onUp = () => {
      dragging = false;
      win.classList.remove("dragging");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onMove);
    };

    handle.addEventListener("mousedown", onDown);
    handle.addEventListener("touchstart", onDown, { passive: true });

    // -----------------------------
    // 3) Tooltip events
    // -----------------------------
    // 마우스
    win.addEventListener("mouseenter", (e) => {
      if (dragging) return;
      showTooltip(win);
    });
    win.addEventListener("mousemove", (e) => {
      if (dragging) return;
      // 핸들 위에 있을 때만 커서 따라다니게 하려면 handle.contains(e.target) 체크
      moveTooltip(e.clientX, e.clientY);
    });
    win.addEventListener("mouseleave", () => hideTooltip(50));

    // 포커스 (접근성)
    win.addEventListener("focusin", () => showTooltip(win));
    win.addEventListener("focusout", () => hideTooltip(0));

    // 터치: 짧게 힌트 표시
    win.addEventListener("touchstart", (e) => {
      if (dragging) return;
      const t = e.touches[0];
      showTooltip(win, t.clientX, t.clientY);
      hideTooltip(900); // 0.9s 뒤 자동 숨김
    }, { passive: true });
  });
});
