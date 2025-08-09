const WHATS_NUMBER = '5551980406481';

function openWhatsApp({source='site', formData={}} = {}) {
    const msgDefault = 'Olá, quero atendimento.';
    const campos = [
        formData.nome    ? `Nome: ${formData.nome}`       : '',
        formData.tel     ? `Telefone: ${formData.tel}`    : '',
        formData.serv    ? `Serviço: ${formData.serv}`    : '',
        formData.data    ? `Data: ${formData.data}`       : '',
        formData.hora    ? `Hora: ${formData.hora}`       : '',
        formData.obs     ? `Obs: ${formData.obs}`         : '',
        `Origem: ${source.toUpperCase()}`
    ].filter(Boolean).join(' | ');
    const text = encodeURIComponent(campos || msgDefault);
    const url  = `https://wa.me/${WHATS_NUMBER}?text=${text}`;
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

// Função para lidar com o formulário de agendamento
function handleAgendamento(event) {
    event.preventDefault();
    
    // Obter valores do formulário
    const formData = new FormData(event.target);
    const nome = formData.get('nome');
    const telefone = formData.get('telefone');
    const placa = formData.get('placa');
    const servico = formData.get('servico');
    const data = formData.get('data');
    const hora = formData.get('hora');
    const observacoes = formData.get('observacoes');
    
    // Validação básica
    if (!nome || !telefone || !servico) {
        alert('Por favor, preencha os campos obrigatórios (nome, telefone e serviço).');
        return;
    }
    
    // Formatar data e hora
    let dataHora = '';
    if (data && hora) {
        const dataObj = new Date(data + 'T' + hora);
        dataHora = dataObj.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } else if (data) {
        const dataObj = new Date(data);
        dataHora = dataObj.toLocaleDateString('pt-BR');
    }
    
    // Montar mensagem
    let mensagem = `Olá, gostaria de agendar:\n`;
    mensagem += `• Serviço: ${servico}\n`;
    mensagem += `• Nome: ${nome}\n`;
    mensagem += `• Telefone: ${telefone}\n`;
    
    if (placa) {
        mensagem += `• Placa: ${placa}\n`;
    }
    
    if (dataHora) {
        mensagem += `• Data/Hora: ${dataHora}\n`;
    }
    
    if (observacoes) {
        mensagem += `• Observações: ${observacoes}\n`;
    }
    
    // Abrir WhatsApp com a mensagem
    openWhatsApp(mensagem);
    
    // Limpar formulário
    event.target.reset();
}

// Função para aplicar máscara na placa (opcional)
function formatarPlaca(input) {
    let value = input.value.replace(/\D/g, '').toUpperCase();
    
    if (value.length <= 3) {
        value = value;
    } else if (value.length <= 6) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    } else {
        value = value.slice(0, 3) + '-' + value.slice(3, 6) + value.slice(6, 7);
    }
    
    input.value = value;
}

// Função para aplicar máscara no telefone
function formatarTelefone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        if (value.length <= 2) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        } else if (value.length <= 10) {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
        } else {
            value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
        }
    }
    
    input.value = value;
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Aplicar máscaras nos campos
    const telefoneInput = document.getElementById('telefone');
    const placaInput = document.getElementById('placa');
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function() {
            formatarTelefone(this);
        });
    }
    
    if (placaInput) {
        placaInput.addEventListener('input', function() {
            formatarPlaca(this);
        });
    }
    
    // Adicionar smooth scroll para links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
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
    const animatedElements = document.querySelectorAll('.service-card, .diferencial-item, .depoimento-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Função para validar formulário antes do envio
function validarFormulario(form) {
    const camposObrigatorios = form.querySelectorAll('[required]');
    let valido = true;
    
    camposObrigatorios.forEach(campo => {
        if (!campo.value.trim()) {
            campo.style.borderColor = '#ef4444';
            valido = false;
        } else {
            campo.style.borderColor = '';
        }
    });
    
    return valido;
}

// Função para mostrar feedback visual
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
    document.getElementById('cta-whats-header')?.addEventListener('click', e => { 
        e.preventDefault(); 
        openWhatsApp({source:'header'}); 
    });
    
    document.getElementById('cta-whats-hero')?.addEventListener('click', e => { 
        e.preventDefault(); 
        openWhatsApp({source:'hero'}); 
    });
    
    document.getElementById('cta-agendar-hero')?.addEventListener('click', e => { 
        e.preventDefault(); 
        scrollToSection('contato'); 
    });
    
    // Menu hamburguer com animação suave
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const body = document.body;
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            const newState = !isExpanded;
            
            menuToggle.setAttribute('aria-expanded', newState);
            navList.classList.toggle('active', newState);
            body.classList.toggle('menu-open', newState);
            
            // Prevenir scroll quando menu estiver aberto
            if (newState) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                navList.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
            });
        });
        
        // Fechar menu ao clicar fora dele
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navList.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navList.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
            }
        });
        
        // Fechar menu com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navList.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
                menuToggle.focus();
            }
        });
    }
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
});



// Ano automático no footer
document.getElementById('yy')?.append(new Date().getFullYear());
