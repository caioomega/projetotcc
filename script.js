/* =====================================================
   SYNCSENTRIX — script.js
===================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV SCROLL ─────────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── HAMBURGER ──────────────────────────────────── */
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('nav__links--open');
    hamburger.classList.toggle('nav__hamburger--open', open);
    navLinks.style.cssText = open ? `
      display:flex; flex-direction:column; position:fixed;
      top:72px; left:0; right:0;
      background:rgba(248,249,251,0.97); backdrop-filter:blur(20px);
      padding:24px; gap:8px; border-bottom:1px solid rgba(47,75,124,0.12);
      z-index:999; box-shadow:0 8px 32px rgba(47,75,124,0.12);
    ` : '';
  });

  /* ── SMOOTH SCROLL ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navLinks.classList.contains('nav__links--open')) {
          navLinks.classList.remove('nav__links--open');
          navLinks.style.cssText = '';
        }
      }
    });
  });

  /* ── SCROLL ANIMATE ─────────────────────────────── */
  const animEls = document.querySelectorAll(
    '.feature-card,.step,.metric-card,.testimonial-card,.team-card,.section__header,.metrics__content,.metrics__grid,.hero__float,.demo__panel'
  );
  animEls.forEach(el => el.classList.add('animate-on-scroll'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const idx = Array.from(entry.target.parentElement?.children || []).indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('in-view'), idx * 80);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  animEls.forEach(el => io.observe(el));

  /* ── COUNTER ANIMATION ──────────────────────────── */
  const animateCounter = el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.querySelector('span')?.textContent || '';
    const start = performance.now();
    const tick = time => {
      const p = Math.min((time - start) / 2000, 1);
      const v = (1 - Math.pow(1 - p, 3)) * target;
      el.innerHTML = (Number.isInteger(target) ? Math.round(v) : v.toFixed(2)) + `<span>${suffix}</span>`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('.metric-card__value[data-target]').forEach(c => cio.observe(c));

  /* ── 3D CARD HOVER ──────────────────────────────── */
  document.querySelectorAll('.feature-card,.metric-card,.testimonial-card,.team-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 4;
      const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * -4;
      card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── DASHBOARD BAR ANIMATION ────────────────────── */
  setTimeout(() => {
    document.querySelectorAll('.dash-bar').forEach((bar, i) => {
      setTimeout(() => { bar.style.transition = `height 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 80}ms`; }, 300);
    });
  }, 800);

  /* ══════════════════════════════════════════════════
     DEMO INTERATIVA
  ══════════════════════════════════════════════════ */

  /* -- Tab switching -- */
  document.querySelectorAll('.demo__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.demo__tab').forEach(t => t.classList.remove('demo__tab--active'));
      document.querySelectorAll('.demo__tab-content').forEach(c => c.classList.remove('demo__tab-content--active'));
      tab.classList.add('demo__tab--active');
      const content = document.getElementById(`content-${tab.dataset.tab}`);
      if (content) content.classList.add('demo__tab-content--active');
    });
  });

  /* -- Helpers -- */
  const fmtTime = () => new Date().toLocaleTimeString('pt-BR');
  const rand = (min, max) => min + Math.random() * (max - min);
  const randInt = (min, max) => Math.round(rand(min, max));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  /* ── PONTO ELETRÔNICO ───────────────────────────── */
  const employees = [
    { name: 'Ana Carolina Silva', sector: 'Produção', entry: '07:32' },
    { name: 'João Pedro Matos', sector: 'Logística', entry: '08:00' },
    { name: 'Fernanda Lima', sector: 'Qualidade', entry: '07:45' },
    { name: 'Lucas Rodrigues', sector: 'Manutenção', entry: '06:00' },
    { name: 'Mariana Costa', sector: 'TI', entry: '09:00' },
    { name: 'Rafael Souza', sector: 'RH', entry: '08:15' },
    { name: 'Beatriz Oliveira', sector: 'Financeiro', entry: '08:30' },
    { name: 'Carlos Mendes', sector: 'Produção', entry: '07:00' },
  ];

  const statusMap = [
    { label: 'Ativo', cls: 'status--active', weight: 70 },
    { label: 'Pausa', cls: 'status--pause', weight: 15 },
    { label: 'Saída', cls: 'status--out', weight: 15 },
  ];

  const pickStatus = () => {
    const r = rand(0, 100);
    let acc = 0;
    for (const s of statusMap) { acc += s.weight; if (r < acc) return s; }
    return statusMap[0];
  };

  const renderPonto = () => {
    const tbody = document.getElementById('ponto-tbody');
    const ts = document.getElementById('ponto-timestamp');
    if (!tbody) return;
    if (ts) ts.textContent = fmtTime();
    tbody.innerHTML = employees.map(emp => {
      const st = pickStatus();
      const hrs = rand(5.5, 9.5).toFixed(1);
      const init = emp.name.split(' ').map(n => n[0]).slice(0, 2).join('');
      return `<tr class="demo__row">
        <td><div class="demo__emp"><div class="demo__emp-avatar">${init}</div><span>${emp.name}</span></div></td>
        <td><span class="demo__tag">${emp.sector}</span></td>
        <td>${emp.entry}</td>
        <td>${hrs}h</td>
        <td><span class="demo__status ${st.cls}">${st.label}</span></td>
      </tr>`;
    }).join('');
  };

  /* ── MÁQUINAS ───────────────────────────────────── */
  const machines = [
    { id: 'M-001', name: 'Prensa Hidráulica A', icon: 'bi-gear-fill', sector: 'Linha 1' },
    { id: 'M-002', name: 'Torno CNC #3', icon: 'bi-arrows-angle-contract', sector: 'Usinagem' },
    { id: 'M-003', name: 'Esteira Principal', icon: 'bi-skip-forward-fill', sector: 'Linha 2' },
    { id: 'M-004', name: 'Compressor Ind.', icon: 'bi-wind', sector: 'Utilidades' },
    { id: 'M-005', name: 'Forno de Tratamento', icon: 'bi-thermometer-high', sector: 'Térmico' },
    { id: 'M-006', name: 'Robô Soldador #2', icon: 'bi-robot', sector: 'Montagem' },
  ];

  const machineStatus = [
    { label: 'Operando', cls: 'machine--ok', w: 65 },
    { label: 'Alerta', cls: 'machine--warn', w: 20 },
    { label: 'Parado', cls: 'machine--off', w: 15 },
  ];

  const pickMachineStatus = () => {
    const r = rand(0, 100); let acc = 0;
    for (const s of machineStatus) { acc += s.w; if (r < acc) return s; }
    return machineStatus[0];
  };

  const renderMachines = () => {
    const grid = document.getElementById('machines-grid');
    const ts = document.getElementById('maquinas-timestamp');
    if (!grid) return;
    if (ts) ts.textContent = fmtTime();
    grid.innerHTML = machines.map(m => {
      const st = pickMachineStatus();
      const tmp = randInt(55, 145);
      const rpm = randInt(800, 2400);
      const eff = randInt(68, 99);
      const tmpPct = Math.min(100, ((tmp - 55) / 90) * 100);
      const tmpColor = tmp > 130 ? '#ef4444' : tmp > 105 ? '#f59e0b' : '#22c55e';
      return `<div class="machine-card ${st.cls}">
        <div class="machine-card__header">
          <div class="machine-card__icon"><i class="bi ${m.icon}"></i></div>
          <div class="machine-card__meta">
            <div class="machine-card__name">${m.name}</div>
            <div class="machine-card__sector">${m.sector} · ${m.id}</div>
          </div>
          <span class="machine-card__status-badge">${st.label}</span>
        </div>
        <div class="machine-card__metrics">
          <div class="machine-metric">
            <span class="machine-metric__label">Temperatura</span>
            <div class="machine-metric__bar-wrap">
              <div class="machine-metric__bar"><div class="machine-metric__fill" style="width:${tmpPct}%;background:${tmpColor}"></div></div>
              <span class="machine-metric__val" style="color:${tmpColor}">${tmp}°C</span>
            </div>
          </div>
          <div class="machine-metric machine-metric--inline">
            <span class="machine-metric__label">RPM</span>
            <span class="machine-metric__val">${rpm.toLocaleString('pt-BR')}</span>
          </div>
          <div class="machine-metric">
            <span class="machine-metric__label">Eficiência</span>
            <div class="machine-metric__bar-wrap">
              <div class="machine-metric__bar"><div class="machine-metric__fill" style="width:${eff}%;background:var(--blue)"></div></div>
              <span class="machine-metric__val">${eff}%</span>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');
  };

  /* ── RELATÓRIO ──────────────────────────────────── */
  const renderReport = () => {
    const box = document.getElementById('demo-report');
    const ts = document.getElementById('relatorio-timestamp');
    if (!box) return;
    if (ts) ts.textContent = fmtTime();
    const total = randInt(148, 165);
    const pont = rand(86, 98).toFixed(1);
    const prod = rand(88, 99).toFixed(1);
    const maqs = randInt(18, 24);
    const uptime = rand(97.5, 99.98).toFixed(2);
    const bars = Array.from({ length: 24 }, (_, i) => {
      const h = randInt(40, 98);
      const active = i === new Date().getHours();
      return `<div class="report__bar${active ? ' report__bar--active' : ''}" style="--h:${h}%"><span>${i}h</span></div>`;
    }).join('');
    box.innerHTML = `
      <div class="report__header">
        <div>
          <h3 class="report__title">Relatório Operacional</h3>
          <p class="report__date">${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
        <span class="report__auto-badge">Gerado automaticamente</span>
      </div>
      <div class="report__kpis">
        <div class="report__kpi">
          <div class="report__kpi-icon blue"><i class="bi bi-people-fill"></i></div>
          <div class="report__kpi-val">${total}</div>
          <div class="report__kpi-label">Colaboradores</div>
        </div>
        <div class="report__kpi">
          <div class="report__kpi-icon green"><i class="bi bi-clock-fill"></i></div>
          <div class="report__kpi-val">${pont}%</div>
          <div class="report__kpi-label">Pontualidade</div>
        </div>
        <div class="report__kpi">
          <div class="report__kpi-icon amber"><i class="bi bi-lightning-fill"></i></div>
          <div class="report__kpi-val">${prod}%</div>
          <div class="report__kpi-label">Produtividade</div>
        </div>
        <div class="report__kpi">
          <div class="report__kpi-icon red"><i class="bi bi-cpu-fill"></i></div>
          <div class="report__kpi-val">${maqs}</div>
          <div class="report__kpi-label">Máquinas</div>
        </div>
      </div>
      <div class="report__chart-section">
        <p class="report__chart-label">Eficiência por hora — Últimas 24h</p>
        <div class="report__chart">${bars}</div>
      </div>
      <div class="report__footer">
        <i class="bi bi-shield-check"></i>
        Uptime do sistema: <strong>${uptime}%</strong> · Gerado às ${fmtTime()} · SyncSentrix v2.4
      </div>`;
  };

  /* -- Init + Refresh buttons -- */
  renderPonto();
  renderMachines();
  renderReport();

  const bindRefresh = (btnId, renderFn) => {
    const btn = document.getElementById(btnId);
    btn?.addEventListener('click', () => {
      btn.classList.add('spinning');
      renderFn();
      setTimeout(() => btn.classList.remove('spinning'), 600);
    });
  };

  bindRefresh('refresh-ponto', renderPonto);
  bindRefresh('refresh-maquinas', renderMachines);
  bindRefresh('refresh-relatorio', renderReport);

  /* -- Auto-refresh every 8s while tab is visible -- */
  let autoInterval;
  const startAuto = () => {
    autoInterval = setInterval(() => {
      const active = document.querySelector('.demo__tab--active')?.dataset.tab;
      if (active === 'ponto') renderPonto();
      if (active === 'maquinas') renderMachines();
      if (active === 'relatorio') renderReport();
    }, 8000);
  };
  startAuto();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(autoInterval);
    else startAuto();
  });

});
