// ── WORD SELECTOR ────────────────────────────────────────

function selectWord(btn) {
  document.querySelectorAll('.word-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const input = document.getElementById('word-input');
  input.value = btn.dataset.word;
  resizeInput(input);
}

// ── COPY ─────────────────────────────────────────────────

function copyBlock(blockId, btn) {
  const block = document.getElementById(blockId);
  const body  = block.querySelector('.prompt-body');
  const parts = [];

  Array.from(body.children).forEach(child => {
    if (child.classList.contains('paste-area')) {
      const val = child.value.trim();
      parts.push(val || `[${child.dataset.label}]`);
    } else if (child.classList.contains('prompt-segment')) {
      parts.push(getSegmentText(child));
    }
  });

  const text = parts.join('\n\n');

  navigator.clipboard.writeText(text).then(() => {
    const prev = btn.innerHTML;
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      Copiado
    `;
    btn.classList.add('copied');
    setTimeout(() => { btn.innerHTML = prev; btn.classList.remove('copied'); }, 2000);
  });
}

function getSegmentText(el) {
  let text = '';
  el.childNodes.forEach(n => {
    if      (n.nodeType === Node.TEXT_NODE)  text += n.textContent.replace(/[ \t\r\n]+/g, ' ');
    else if (n.nodeName  === 'BR')           text += '\n';
    else if (n.tagName   === 'INPUT')        text += n.value || n.placeholder;
    else                                     text += getSegmentText(n);
  });
  return text.trim();
}

// ── AUTO-RESIZE TEXTAREAS ────────────────────────────────

document.querySelectorAll('textarea.paste-area').forEach(ta => {
  const resize = () => {
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  };
  ta.addEventListener('input', resize);
  resize();
});

// ── AUTO-RESIZE INLINE INPUTS ─────────────────────────────

const _canvas = document.createElement('canvas');
const _ctx    = _canvas.getContext('2d');

function resizeInput(input) {
  const s = getComputedStyle(input);
  _ctx.font = `${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
  const w = _ctx.measureText(input.value || input.placeholder).width;
  input.style.width = Math.max(48, w + 12) + 'px';
}

document.querySelectorAll('input.f').forEach(input => {
  input.addEventListener('input', () => resizeInput(input));
  resizeInput(input);
});

// ── ACTIVE NAV ON SCROLL ──────────────────────────────────

const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('main > section');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => observer.observe(s));
