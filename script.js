const WHATS_NUMBER = '5551980406481';

function openWhatsApp({source='site', formData=null} = {}) {
    let message = 'Olá! Preciso de ajuda com meu carro.';
    
    if (formData) {
        message = `Olá! Meu nome é ${formData.nome}. ${formData.obs ? `Observação: ${formData.obs}` : ''}`;
    }
    
    const text = encodeURIComponent(message);
    const url = `https://wa.me/${WHATS_NUMBER}?text=${text}&utm_source=site&utm_medium=${source}&utm_campaign=whatsapp`;
    window.open(url, '_blank', 'noopener');
}

// Função para rolar suavemente para uma seção
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 2) JS — utilidades
const qs = (s, sc = document) => sc.querySelector(s);
const qsa = (s, sc = document) => [...sc.querySelectorAll(s)];
const trapFocus = (container, first, last, e) => {
  if (e.key !== 'Tab') return;
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
};

// 3) JS — montar overlay e wiring do menu (idempotente)
// ===== MENU MOBILE: drawer dedicado (id="mobile-menu") =====
// Drawer mobile removido; nenhum handler necessário

  // 4) JS — rolagem suave + compensação e destaque de link ativo
  // Rolagem suave em links internos (com compensação do header via CSS scroll-margin-top)
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const el = qs(`#${CSS.escape(id)}`);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${id}`);
      }
    });
  });

  // Destaque do link ativo ao rolar
  const sections = qsa('section[id], [id].section, [id].section-block');
  const navLinks = qsa('.nav-link');

  const spy = () => {
    const y = window.scrollY + 110; // um pouco abaixo do header
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop;
      if (y >= top) current = sec.id || current;
    });
    navLinks.forEach(l => {
      const href = l.getAttribute('href') || '';
      const id = href.startsWith('#') ? href.slice(1) : '';
      l.classList.toggle('active', id && id === current);
    });
  };
  spy();
  window.addEventListener('scroll', spy, { passive: true });
});


// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Sincronizar telefone exibido com o número do WhatsApp
    try {
        const raw = (WHATS_NUMBER || '').replace(/\D+/g, '');
        let num = raw;
        if (raw.startsWith('55')) num = raw.slice(2); // remove código do Brasil
        const ddd = num.slice(0, 2);
        const rest = num.slice(2);
        let pretty = '';
        if (rest.length === 8) {
            pretty = `(${ddd}) ${rest.slice(0,4)}-${rest.slice(4)}`;
        } else if (rest.length === 9) {
            pretty = `(${ddd}) ${rest.slice(0,5)}-${rest.slice(5)}`;
        } else {
            pretty = `(${ddd}) ${rest}`;
        }
        const phoneLink = document.getElementById('link-phone');
        if (phoneLink) {
            phoneLink.href = `https://wa.me/${raw}?text=${encodeURIComponent('Olá! Preciso de ajuda com meu carro.')}&utm_source=site&utm_medium=contato&utm_campaign=whatsapp`;
            phoneLink.textContent = pretty;
        }
    } catch (_) {}
    // Anexa UTM dos data attributes (se houver)
    document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
        const utm = a.getAttribute('data-utm');
        if (utm && !a.href.includes('utm_')) {
            const sep = a.href.includes('?') ? '&' : '?';
            a.href = `${a.href}${sep}${utm}`;
        }
    });

    // Adicionar animação de fade-in para elementos quando entram na viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar cards e seções para animação
    const animatedElements = document.querySelectorAll('.service-card, .diferencial-item, .depoimento-card, .dep');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
function mostrarFeedback(mensagem, tipo = 'sucesso') {
    const feedback = document.createElement('div');
    feedback.className = `feedback feedback-${tipo}`;
    feedback.textContent = mensagem;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        background-color: ${tipo === 'sucesso' ? '#10b981' : '#ef4444'};
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// Adicionar CSS para animação de feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // ===== Dev Mobile Flag =====
    const root = document.documentElement; // <html>

    // Ativa via query ?mobile=1
    const params = new URLSearchParams(window.location.search);
    const qMobile = params.get('mobile');
    if (qMobile === '1') localStorage.setItem('forceMobile', '1');
    if (qMobile === '0') localStorage.removeItem('forceMobile');

    const applyMobileClass = () => {
        const force = localStorage.getItem('forceMobile') === '1';
        const mq = window.matchMedia('(max-width: 768px)').matches;
        // Liga is-mobile se forçada OU se a viewport for realmente mobile
        if (force || mq) root.classList.add('is-mobile');
        else root.classList.remove('is-mobile');
    };

    applyMobileClass();
    window.addEventListener('resize', applyMobileClass);

    // Toggle manual com Ctrl+M
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
            const cur = localStorage.getItem('forceMobile') === '1';
            if (cur) localStorage.removeItem('forceMobile');
            else localStorage.setItem('forceMobile','1');
            applyMobileClass();
        }
    });

    // WhatsApp CTAs
    document.getElementById('cta-whats-header')?.addEventListener('click', e => { 
        e.preventDefault(); 
        openWhatsApp({source:'header'}); 
    });
    
    document.getElementById('cta-whats-hero')?.addEventListener('click', e => { 
        e.preventDefault(); 
        openWhatsApp({source:'hero'}); 
    });
    
    // Agendar CTAs
    document.getElementById('cta-agendar-hero')?.addEventListener('click', e => { 
        e.preventDefault(); 
        scrollToSection('contato'); 
    });
    
    // Smooth scroll para links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // Skip empty href
            
            e.preventDefault();
            const targetId = href.substring(1);
            scrollToSection(targetId);
        });
    });
    
    // ===== Menu Toggle =====
    // This block is now handled by the new_code, so it's removed.
});

// Garantir imagem ou fallback
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const testImg = new Image();
    testImg.src = 'assets/background1.png';
    testImg.onload = () => {}; // ok, mantém imagem
    testImg.onerror = () => { hero.classList.add('no-image'); }; // usa gradiente
});

// Formulário de contato
document.getElementById('form-contato')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nome = fd.get('nome') || '';
    const mensagem = fd.get('mensagem') || '';
    
    // Validação básica
    if (!nome || !mensagem) {
        alert('Por favor, preencha o nome e a mensagem.');
        return;
    }
    
    openWhatsApp({
        source: 'contato',
        formData: {
            nome: nome,
            serv: 'Contato',
            obs: mensagem
        }
    });
    
    // Reset do formulário
    e.currentTarget.reset();
    
    // Feedback visual
    const submitBtn = e.currentTarget.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>Enviado!';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
});



// Ano automático no footer
document.getElementById('yy')?.append(new Date().getFullYear());

/* === 2B: FAQ animação + lazy-load imagens === */
document.addEventListener('DOMContentLoaded', () => {
  // Lazy-load seguro para imagens sem atributo
  document.querySelectorAll('img:not([loading])').forEach(img => img.loading = 'lazy');

  // === GALERIA LIGHTBOX ===
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || 'Imagem da RODABEM';
      
      // Criar lightbox
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Fechar">×</button>
          <img src="${img.src}" alt="${img.alt}" loading="eager">
          <h3 class="lightbox-title">${title}</h3>
        </div>
      `;
      
      // Adicionar ao DOM
      document.body.appendChild(lightbox);
      
      // Animar entrada
      setTimeout(() => lightbox.classList.add('active'), 10);
      
      // Fechar com ESC
      const handleEsc = (e) => {
        if (e.key === 'Escape') closeLightbox();
      };
      
      // Fechar com clique no botão ou fora
      const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
          document.body.removeChild(lightbox);
          document.removeEventListener('keydown', handleEsc);
        }, 300);
      };
      
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
          closeLightbox();
        }
      });
      
      document.addEventListener('keydown', handleEsc);
    });
  });

  // FAQ: garantir .faq-body/.faq-inner mesmo se não existir no HTML
  document.querySelectorAll('.faq-item').forEach(d => {
    let body = d.querySelector('.faq-body');
    if (!body) {
      const wrap = document.createElement('div');
      wrap.className = 'faq-body';
      const inner = document.createElement('div');
      inner.className = 'faq-inner';
      // move todos os elementos (exceto summary) para dentro
      const fr = document.createDocumentFragment();
      [...d.childNodes].forEach(n => { if (!(n.tagName && n.tagName.toLowerCase() === 'summary')) fr.appendChild(n); });
      inner.appendChild(fr);
      wrap.appendChild(inner);
      d.appendChild(wrap);
      body = wrap;
    }
    // estado inicial
    body.style.overflow = 'hidden';
    body.style.height = d.open ? 'auto' : '0px';

    d.addEventListener('toggle', () => {
      if (d.open) {
        body.style.height = body.scrollHeight + 'px';
        setTimeout(() => body.style.height = 'auto', 220);
      } else {
        // calcular altura atual e colapsar
        const h = body.scrollHeight;
        body.style.height = h + 'px';
        requestAnimationFrame(() => body.style.height = '0px');
      }
    });
  });
});
