/* =======================================
   Arquivo: script.js
   Script Principal Unificado
   - Carousel + FAQ + Pop-up + Estoque + Timer
   ======================================= */

// ===== VARIÁVEIS GLOBAIS =====
let estoqueInicial = 80;
let estoqueAtual = estoqueInicial;
let kitosVendidosBase = 578;
let kitosVendidosAleatorio = kitosVendidosBase + Math.floor(Math.random() * 50);
let tempoRestante = 600;
let currentSlide = 0;

// ===== FUNÇÕES DO POP-UP =====
function popupFoiFechado() {
    return sessionStorage.getItem('popupFechado') === 'true';
}

function marcarPopupFechado() {
    sessionStorage.setItem('popupFechado', 'true');
}

function abrirPopup() {
    const popup = document.getElementById('oferta-popup');
    if (popup) {
        popup.classList.remove('hidden');
        iniciarTimer();
    }
}

function fecharPopup() {
    const popup = document.getElementById('oferta-popup');
    if (popup) {
        popup.classList.add('hidden');
        marcarPopupFechado();
    }
}

function irParaOferta() {
    fecharPopup();
    const ofertaSection = document.getElementById('oferta');
    if (ofertaSection) {
        ofertaSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function iniciarTimer() {
    tempoRestante = 600;
    const timerInterval = setInterval(() => {
        tempoRestante--;
        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = `${minutos}:${segundos.toString().padStart(2, '0')}`;
        }
        
        if (tempoRestante <= 0) {
            clearInterval(timerInterval);
            fecharPopup();
        }
    }, 1000);
}

// ===== FUNÇÕES DO ESTOQUE =====
function atualizarNumerosEstoque() {
    const vendidosElements = document.querySelectorAll('[data-vendidos]');
    vendidosElements.forEach(el => {
        el.textContent = kitosVendidosAleatorio + '+';
    });

    const estoqueElements = document.querySelectorAll('[data-estoque-count]');
    estoqueElements.forEach(el => {
        el.textContent = estoqueAtual;
    });

    const percentual = (estoqueAtual / estoqueInicial) * 100;
    const estoqueBar = document.getElementById('estoque-bar');
    if (estoqueBar) {
        estoqueBar.style.width = percentual + '%';
        
        if (percentual <= 25) {
            estoqueBar.className = 'bg-gradient-to-r from-red-500 to-red-600 h-full transition-all duration-300';
        } else if (percentual <= 50) {
            estoqueBar.className = 'bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-300';
        } else {
            estoqueBar.className = 'bg-gradient-to-r from-pink-500 to-red-500 h-full transition-all duration-300';
        }
    }
}

// ===== FUNÇÕES DO CAROUSEL =====
function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    slides.forEach(slide => slide.classList.add('opacity-0'));
    if (slides[n]) slides[n].classList.remove('opacity-0');
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// ===== EVENTO PRINCIPAL - DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicializar Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // ===== 2. CAROUSEL =====
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        showSlide(0);
        
        // Autoplay a cada 5 segundos
        setInterval(nextSlide, 5000);
    }

    // ===== 3. FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('[data-faq]');
    faqItems.forEach(item => {
        const toggle = item.querySelector('.faq-toggle');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('[data-feather="chevron-down"]');
        
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Fechar outros itens
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherContent = otherItem.querySelector('.faq-content');
                        const otherIcon = otherItem.querySelector('[data-feather="chevron-down"]');
                        if (otherContent) {
                            otherContent.classList.add('hidden');
                            otherContent.style.maxHeight = '0';
                        }
                        if (otherIcon) {
                            otherIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle item atual
                if (content) {
                    if (content.classList.contains('hidden')) {
                        content.classList.remove('hidden');
                        content.style.maxHeight = content.scrollHeight + 'px';
                        if (icon) icon.style.transform = 'rotate(180deg)';
                    } else {
                        content.classList.add('hidden');
                        content.style.maxHeight = '0';
                        if (icon) icon.style.transform = 'rotate(0deg)';
                    }
                }
            });
        }
    });

    // ===== 4. SCROLL SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ===== 5. INICIALIZAR POP-UP =====
    kitosVendidosAleatorio = kitosVendidosBase + Math.floor(Math.random() * 50);
    atualizarNumerosEstoque();
    
    // Abrir pop-up após 10 segundos (se não foi fechado)
    if (!popupFoiFechado()) {
        setTimeout(abrirPopup, 10000);
    }
    
    // Abrir pop-up ao tentar sair (se não foi fechado)
    document.addEventListener('mouseleave', () => {
        const popup = document.getElementById('oferta-popup');
        if (popup && popup.classList.contains('hidden') && !popupFoiFechado()) {
            setTimeout(abrirPopup, 500);
        }
    });

    // ===== 6. SIMULAR COMPRAS =====
    setInterval(() => {
        if (estoqueAtual > 0) {
            const reducao = Math.floor(Math.random() * 3) + 1;
            estoqueAtual = Math.max(0, estoqueAtual - reducao);
            atualizarNumerosEstoque();
        }
    }, 45000);

    // ===== 7. LIGHTBOX2 CUSTOMIZADO =====
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'showImageNumberLabel': true,
            'albumLabel': 'Design %1 de %2'
        });
    }
});* =======================================
   Arquivo: popup-script.js
   Script do Pop-up de Oferta com Estoque Dinâmico
   ======================================= */

// Gerar números aleatórios ao carregar a página
let estoqueInicial = 80;
let estoqueAtual = estoqueInicial;
let kitosVendidosBase = 578;
let kitosVendidosAleatorio = kitosVendidosBase + Math.floor(Math.random() * 50); // +0 a +49

// Atualizar valores aleatórios no carregamento
document.addEventListener('DOMContentLoaded', () => {
    // Números únicos para este cliente
    kitosVendidosAleatorio = kitosVendidosBase + Math.floor(Math.random() * 50);
    
    // Atualizar números na página
    atualizarNumerosEstoque();
    
    // Iniciar pop-up após 10 segundos
    setTimeout(abrirPopup, 10000);
    
    // Pop-up ao tentar sair
    document.addEventListener('mouseleave', () => {
        const popup = document.getElementById('oferta-popup');
        if (popup && popup.classList.contains('hidden')) {
            setTimeout(abrirPopup, 500);
        }
    });

    // Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

function atualizarNumerosEstoque() {
    // Atualizar kits vendidos (números aleatórios mas na margem)
    const vendidosElements = document.querySelectorAll('[data-vendidos]');
    vendidosElements.forEach(el => {
        el.textContent = kitosVendidosAleatorio + '+';
    });

    // Atualizar estoque atual
    const estoqueElements = document.querySelectorAll('[data-estoque-count]');
    estoqueElements.forEach(el => {
        el.textContent = estoqueAtual;
    });

    // Atualizar barra de progresso
    const percentual = (estoqueAtual / estoqueInicial) * 100;
    const estoqueBar = document.getElementById('estoque-bar');
    if (estoqueBar) {
        estoqueBar.style.width = percentual + '%';
    }

    // Mudar cor da barra conforme estoque diminui
    if (percentual <= 25) {
        estoqueBar.className = 'bg-gradient-to-r from-red-500 to-red-600 h-full transition-all duration-300';
    } else if (percentual <= 50) {
        estoqueBar.className = 'bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-300';
    }
}

// Funções do Pop-up
function abrirPopup() {
    const popup = document.getElementById('oferta-popup');
    if (popup) {
        popup.classList.remove('hidden');
        iniciarTimer();
    }
}

function fecharPopup() {
    const popup = document.getElementById('oferta-popup');
    if (popup) {
        popup.classList.add('hidden');
    }
}

function irParaOferta() {
    fecharPopup();
    const ofertaSection = document.getElementById('oferta');
    if (ofertaSection) {
        ofertaSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Timer do Pop-up (10 minutos = 600 segundos)
let tempoRestante = 600;
function iniciarTimer() {
    tempoRestante = 600;
    const timerInterval = setInterval(() => {
        tempoRestante--;
        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = `${minutos}:${segundos.toString().padStart(2, '0')}`;
        }
        
        if (tempoRestante <= 0) {
            clearInterval(timerInterval);
            fecharPopup();
        }
    }, 1000);
}

// Simular compras - reduz estoque a cada 45 segundos
setInterval(() => {
    if (estoqueAtual > 0) {
        // Reduz 1-3 kits por vez (simula múltiplos clientes)
        const reducao = Math.floor(Math.random() * 3) + 1;
        estoqueAtual = Math.max(0, estoqueAtual - reducao);
        atualizarNumerosEstoque();
    }
}, 45000);/* =======================================
   Arquivo: script.js
   Script Principal Unificado
   - Carousel + FAQ + Pop-up + Estoque + Timer
   ======================================= */

// ===== VARIÁVEIS GLOBAIS =====
let estoqueInicial = 80;
let estoqueAtual = estoqueInicial;
let kitosVendidosBase = 578;
let kitosVendidosAleatorio = kitosVendidosBase + Math.floor(Math.random() * 50);
let tempoRestante = 600;
let currentSlide = 0;

// ===== FUNÇÕES DO POP-UP =====
function popupFoiFechado() {
    return sessionStorage.getItem('popupFechado') === 'true';
}

function marcarPopupFechado() {
    sessionStorage.setItem('popupFechado', 'true');
}

function abrirPopup() {
    const popup = document.getElementById('oferta-popup');
    if (popup) {
        popup.classList.remove('hidden');
        iniciarTimer();
    }
}

function fecharPopup() {
    const popup = document.getElementById('oferta-popup');
    if (popup) {
        popup.classList.add('hidden');
        marcarPopupFechado();
    }
}

function irParaOferta() {
    fecharPopup();
    const ofertaSection = document.getElementById('oferta');
    if (ofertaSection) {
        ofertaSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function iniciarTimer() {
    tempoRestante = 600;
    const timerInterval = setInterval(() => {
        tempoRestante--;
        const minutos = Math.floor(tempoRestante / 60);
        const segundos = tempoRestante % 60;
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = `${minutos}:${segundos.toString().padStart(2, '0')}`;
        }
        
        if (tempoRestante <= 0) {
            clearInterval(timerInterval);
            fecharPopup();
        }
    }, 1000);
}

// ===== FUNÇÕES DO ESTOQUE =====
function atualizarNumerosEstoque() {
    const vendidosElements = document.querySelectorAll('[data-vendidos]');
    vendidosElements.forEach(el => {
        el.textContent = kitosVendidosAleatorio + '+';
    });

    const estoqueElements = document.querySelectorAll('[data-estoque-count]');
    estoqueElements.forEach(el => {
        el.textContent = estoqueAtual;
    });

    const percentual = (estoqueAtual / estoqueInicial) * 100;
    const estoqueBar = document.getElementById('estoque-bar');
    if (estoqueBar) {
        estoqueBar.style.width = percentual + '%';
        
        if (percentual <= 25) {
            estoqueBar.className = 'bg-gradient-to-r from-red-500 to-red-600 h-full transition-all duration-300';
        } else if (percentual <= 50) {
            estoqueBar.className = 'bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-300';
        } else {
            estoqueBar.className = 'bg-gradient-to-r from-pink-500 to-red-500 h-full transition-all duration-300';
        }
    }
}

// ===== FUNÇÕES DO CAROUSEL =====
function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    slides.forEach(slide => slide.classList.remove('active'));
    if (slides[n]) slides[n].classList.add('active');
}

function nextSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    const slides = document.querySelectorAll('.carousel-slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// ===== EVENTO PRINCIPAL - DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicializar Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // ===== 2. CAROUSEL =====
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // PRIMEIRA IMAGEM JÁ ESTÁ VISÍVEL (CSS)
        showSlide(0);
        
        // Autoplay a cada 5 segundos
        setInterval(nextSlide, 5000);
    }

    // ===== 3. FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('[data-faq]');
    faqItems.forEach(item => {
        const toggle = item.querySelector('.faq-toggle');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('[data-feather="chevron-down"]');
        
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Fechar outros itens
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherContent = otherItem.querySelector('.faq-content');
                        const otherIcon = otherItem.querySelector('[data-feather="chevron-down"]');
                        if (otherContent) {
                            otherContent.classList.add('hidden');
                            otherContent.style.maxHeight = '0';
                        }
                        if (otherIcon) {
                            otherIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle item atual
                if (content) {
                    if (content.classList.contains('hidden')) {
                        content.classList.remove('hidden');
                        content.style.maxHeight = content.scrollHeight + 'px';
                        if (icon) icon.style.transform = 'rotate(180deg)';
                    } else {
                        content.classList.add('hidden');
                        content.style.maxHeight = '0';
                        if (icon) icon.style.transform = 'rotate(0deg)';
                    }
                }
            });
        }
    });

    // ===== 4. SCROLL SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ===== 5. INICIALIZAR POP-UP =====
    kitosVendidosAleatorio = kitosVendidosBase + Math.floor(Math.random() * 50);
    atualizarNumerosEstoque();
    
    // Abrir pop-up após 10 segundos (se não foi fechado)
    if (!popupFoiFechado()) {
        setTimeout(abrirPopup, 10000);
    }
    
    // Abrir pop-up ao tentar sair (se não foi fechado)
    document.addEventListener('mouseleave', () => {
        const popup = document.getElementById('oferta-popup');
        if (popup && popup.classList.contains('hidden') && !popupFoiFechado()) {
            setTimeout(abrirPopup, 500);
        }
    });

    // ===== 6. SIMULAR COMPRAS =====
    setInterval(() => {
        if (estoqueAtual > 0) {
            const reducao = Math.floor(Math.random() * 3) + 1;
            estoqueAtual = Math.max(0, estoqueAtual - reducao);
            atualizarNumerosEstoque();
        }
    }, 45000);

    // ===== 7. LIGHTBOX2 CUSTOMIZADO =====
    if (typeof lightbox !== 'undefined') {
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'showImageNumberLabel': true,
            'albumLabel': 'Design %1 de %2'
        });
    }
});