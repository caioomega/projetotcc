/* =====================================================
   SYNCSENTRIX — Premium Interactive Experience
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════════
     CUSTOM CURSOR
  ═══════════════════════════════════════════════════ */
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorDot = document.getElementById('cursor-dot');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorGlow.classList.add('active');
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
  });

  // Smooth cursor follow
  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    if (cursorDot) {
      cursorDot.style.left = cursorX + 'px';
      cursorDot.style.top = cursorY + 'px';
    }
    
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  // Cursor hover effects on interactive elements
  const hoverElements = document.querySelectorAll('a, button, .tilt-card, .magnetic-btn');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot?.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorDot?.classList.remove('hover'));
  });

  /* ═══════════════════════════════════════════════════
     MAGNETIC BUTTONS
  ═══════════════════════════════════════════════════ */
  const magneticBtns = document.querySelectorAll('.magnetic-btn');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ═══════════════════════════════════════════════════
     NAV SCROLL EFFECT
  ═══════════════════════════════════════════════════ */
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    nav.classList.toggle('scrolled', currentScroll > 50);
    
    // Hide/show nav on scroll direction
    if (currentScroll > lastScroll && currentScroll > 500) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  }, { passive: true });

  /* ═══════════════════════════════════════════════════
     HAMBURGER MENU
  ═══════════════════════════════════════════════════ */
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  
  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav__links--open');
    hamburger.classList.toggle('nav__hamburger--open', isOpen);
    
    if (isOpen) {
      navLinks.style.cssText = `
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 80px;
        left: 0;
        right: 0;
        background: rgba(9, 9, 11, 0.98);
        backdrop-filter: blur(20px);
        padding: 24px;
        gap: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 999;
        animation: slideDown 0.3s ease;
      `;
    } else {
      navLinks.style.cssText = '';
    }
  });

  /* ═══════════════════════════════════════════════════
     SMOOTH SCROLL
  ═══════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        
        const offset = 100;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navLinks?.classList.contains('nav__links--open')) {
          navLinks.classList.remove('nav__links--open');
          navLinks.style.cssText = '';
          hamburger?.classList.remove('nav__hamburger--open');
        }
      }
    });
  });

  /* ═══════════════════════════════════════════════════
     SCROLL ANIMATIONS (Intersection Observer)
  ═══════════════════════════════════════════════════ */
  const animatedElements = document.querySelectorAll(
    '.bento-card, .step, .metric-card, .testimonial-card, .team-card, ' +
    '.section__header, .demo__panel, .hero__float'
  );

  animatedElements.forEach(el => el.classList.add('animate-on-scroll'));

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = Array.from(entry.target.parentElement?.children || [])
          .indexOf(entry.target) * 100;
        
        setTimeout(() => {
          entry.target.classList.add('in-view');
        }, delay);
        
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animatedElements.forEach(el => scrollObserver.observe(el));

  /* ═══════════════════════════════════════════════════
     3D TILT EFFECT
  ═══════════════════════════════════════════════════ */
  const tiltCards = document.querySelectorAll('.tilt-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateZ(10px)
        scale3d(1.02, 1.02, 1.02)
      `;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ═══════════════════════════════════════════════════
     COUNTER ANIMATION
  ═══════════════════════════════════════════════════ */
  const animateCounter = (element) => {
    const target = parseFloat(element.dataset.target);
    const suffix = element.querySelector('span')?.textContent || '';
    const duration = 2000;
    const start = performance.now();
    
    const tick = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      
      if (Number.isInteger(target)) {
        element.innerHTML = Math.round(current) + `<span>${suffix}</span>`;
      } else {
        element.innerHTML = current.toFixed(2) + `<span>${suffix}</span>`;
      }
      
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };
    
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.metric-card__value[data-target]').forEach(counter => {
    counterObserver.observe(counter);
  });

  /* ═══════════════════════════════════════════════════
     HERO PARTICLES
  ═══════════════════════════════════════════════════ */
  const particlesContainer = document.getElementById('hero-particles');
  
  if (particlesContainer) {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(0, 212, 255, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        pointer-events: none;
        animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
      `;
      particlesContainer.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => particle.remove(), 20000);
    };
    
    // Create initial particles
    for (let i = 0; i < 30; i++) {
      setTimeout(createParticle, i * 200);
    }
    
    // Continuously create particles
    setInterval(createParticle, 500);
  }

  // Add particle animation styles
  const particleStyles = document.createElement('style');
  particleStyles.textContent = `
    @keyframes particleFloat {
      0% {
        transform: translateY(0) translateX(0) scale(1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px) scale(0);
        opacity: 0;
      }
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(particleStyles);

  /* ═══════════════════════════════════════════════════
     DASHBOARD BAR ANIMATION
  ═══════════════════════════════════════════════════ */
  const dashBars = document.querySelectorAll('.dash-bar');
  
  const dashObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        dashBars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.setProperty('--h', bar.style.getPropertyValue('--h'));
          }, i * 100);
        });
        dashObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  if (dashBars.length > 0) {
    dashObserver.observe(dashBars[0].parentElement);
  }

  /* ═══════════════════════════════════════════════════
     DEMO INTERACTIVE
  ═══════════════════════════════════════════════════ */

  // Tab switching
  document.querySelectorAll('.demo__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.demo__tab').forEach(t => t.classList.remove('demo__tab--active'));
      document.querySelectorAll('.demo__tab-content').forEach(c => c.classList.remove('demo__tab-content--active'));
      
      tab.classList.add('demo__tab--active');
      const content = document.getElementById(`content-${tab.dataset.tab}`);
      if (content) {
        content.classList.add('demo__tab-content--active');
      }
    });
  });

  // Helper functions
  const fmtTime = () => new Date().toLocaleTimeString('pt-BR');
  const rand = (min, max) => min + Math.random() * (max - min);
  const randInt = (min, max) => Math.round(rand(min, max));

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
    for (const s of statusMap) {
      acc += s.weight;
      if (r < acc) return s;
    }
    return statusMap[0];
  };

  const renderPonto = () => {
    const tbody = document.getElementById('ponto-tbody');
    const ts = document.getElementById('ponto-timestamp');
    if (!tbody) return;
    if (ts) ts.textContent = fmtTime();
    
    tbody.innerHTML = employees.map((emp, i) => {
      const st = pickStatus();
      const hrs = rand(5.5, 9.5).toFixed(1);
      const init = emp.name.split(' ').map(n => n[0]).slice(0, 2).join('');
      
      return `<tr class="demo__row" style="animation: fadeIn 0.3s ${i * 0.05}s both;">
        <td>
          <div class="demo__emp">
            <div class="demo__emp-avatar">${init}</div>
            <span>${emp.name}</span>
          </div>
        </td>
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
    const r = rand(0, 100);
    let acc = 0;
    for (const s of machineStatus) {
      acc += s.w;
      if (r < acc) return s;
    }
    return machineStatus[0];
  };

  const renderMachines = () => {
    const grid = document.getElementById('machines-grid');
    const ts = document.getElementById('maquinas-timestamp');
    if (!grid) return;
    if (ts) ts.textContent = fmtTime();
    
    grid.innerHTML = machines.map((m, i) => {
      const st = pickMachineStatus();
      const tmp = randInt(55, 145);
      const rpm = randInt(800, 2400);
      const eff = randInt(68, 99);
      const tmpPct = Math.min(100, ((tmp - 55) / 90) * 100);
      const tmpColor = tmp > 130 ? '#EF4444' : tmp > 105 ? '#F59E0B' : '#22C55E';
      
      return `<div class="machine-card ${st.cls}" style="animation: fadeIn 0.3s ${i * 0.08}s both;">
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
              <div class="machine-metric__bar">
                <div class="machine-metric__fill" style="width:${tmpPct}%;background:${tmpColor}"></div>
              </div>
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
              <div class="machine-metric__bar">
                <div class="machine-metric__fill" style="width:${eff}%;background:var(--accent-cyan)"></div>
              </div>
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
    
    const currentHour = new Date().getHours();
    const bars = Array.from({ length: 24 }, (_, i) => {
      const h = randInt(40, 98);
      const active = i === currentHour;
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
        Uptime do sistema: <strong>${uptime}%</strong> · Gerado às ${fmtTime()} · SyncSentrix v3.0
      </div>`;
  };

  // Initialize demo
  renderPonto();
  renderMachines();
  renderReport();

  // Refresh buttons
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

  // Auto-refresh every 10s
  let autoInterval;
  const startAutoRefresh = () => {
    autoInterval = setInterval(() => {
      const activeTab = document.querySelector('.demo__tab--active')?.dataset.tab;
      if (activeTab === 'ponto') renderPonto();
      if (activeTab === 'maquinas') renderMachines();
      if (activeTab === 'relatorio') renderReport();
    }, 10000);
  };
  
  startAutoRefresh();
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(autoInterval);
    } else {
      startAutoRefresh();
    }
  });

  /* ═══════════════════════════════════════════════════
     MINI CHART ANIMATION (Features Section)
  ═══════════════════════════════════════════════════ */
  const miniChartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.mini-bar').forEach((bar, i) => {
          setTimeout(() => {
            bar.style.opacity = '1';
          }, i * 100);
        });
        miniChartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.mini-chart').forEach(chart => {
    miniChartObserver.observe(chart);
  });

  /* ═══════════════════════════════════════════════════
     TYPING EFFECT (Optional - for hero title)
  ═══════════════════════════════════════════════════ */
  const typeWriter = (element, text, speed = 50) => {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  };

  /* ═══════════════════════════════════════════════════
     PARALLAX EFFECT ON SCROLL
  ═══════════════════════════════════════════════════ */
  const parallaxElements = document.querySelectorAll('.hero__gradient');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    parallaxElements.forEach((el, i) => {
      const speed = (i + 1) * 0.1;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, { passive: true });

  /* ═══════════════════════════════════════════════════
     INTERSECTION OBSERVER FOR METRIC BARS
  ═══════════════════════════════════════════════════ */
  const metricBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.metric-card__bar-fill');
        if (bar) {
          setTimeout(() => {
            bar.style.width = bar.style.getPropertyValue('--w');
          }, 300);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.metric-card').forEach(card => {
    metricBarObserver.observe(card);
  });

  /* ═══════════════════════════════════════════════════
     SMOOTH REVEAL FOR LOGO STRIP
  ═══════════════════════════════════════════════════ */
  const logoTrack = document.querySelector('.logos__track');
  
  if (logoTrack) {
    const logoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          logoObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    logoTrack.style.opacity = '0';
    logoTrack.style.transition = 'opacity 0.8s ease';
    logoObserver.observe(logoTrack);
  }

  /* ═══════════════════════════════════════════════════
     KEYBOARD NAVIGATION
  ═══════════════════════════════════════════════════ */
  document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape' && navLinks?.classList.contains('nav__links--open')) {
      navLinks.classList.remove('nav__links--open');
      navLinks.style.cssText = '';
      hamburger?.classList.remove('nav__hamburger--open');
    }
  });

  /* ═══════════════════════════════════════════════════
     PERFORMANCE: Disable animations if user prefers
  ═══════════════════════════════════════════════════ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--duration-fast', '0s');
    document.documentElement.style.setProperty('--duration-normal', '0s');
    document.documentElement.style.setProperty('--duration-slow', '0s');
    
    // Disable cursor effects
    if (cursorGlow) cursorGlow.style.display = 'none';
    if (cursorDot) cursorDot.style.display = 'none';
  }

  console.log('🚀 SyncSentrix v3.0 - Premium Experience Loaded');
});
