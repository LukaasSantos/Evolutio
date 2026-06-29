/**
 * Evolutio - Lógica da Aplicação (app.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. GERENCIAMENTO DE ABAS SPA (B2B vs B2C)
    // ----------------------------------------------------
    const tabButtons = document.querySelectorAll('[data-tab-target]');
    const tabPanels = document.querySelectorAll('[data-tab-panel]');

    function switchTab(targetId, updateHash = true) {
        // Normaliza o ID
        const activeTabId = targetId.replace('#', '');
        let found = false;

        tabPanels.forEach(panel => {
            if (panel.id === activeTabId) {
                panel.classList.remove('hidden');
                panel.classList.add('active');
                found = true;
            } else {
                panel.classList.add('hidden');
                panel.classList.remove('active');
            }
        });

        if (!found) return; // Se a aba não existir, não faz nada

        // Atualiza estilo dos botões das abas
        tabButtons.forEach(btn => {
            const btnTarget = btn.getAttribute('data-tab-target').replace('#', '');
            if (btnTarget === activeTabId) {
                btn.classList.add('bg-white', 'text-slate-900', 'shadow-sm');
                btn.classList.remove('text-slate-600', 'hover:text-slate-900');
            } else {
                btn.classList.remove('bg-white', 'text-slate-900', 'shadow-sm');
                btn.classList.add('text-slate-600', 'hover:text-slate-900');
            }
        });

        // Atualiza a hash na URL sem scrollar a tela
        if (updateHash) {
            if (history.pushState) {
                history.pushState(null, null, '#' + activeTabId);
            } else {
                location.hash = '#' + activeTabId;
            }
        }

        // Roda animações do AOS para re-alinhamento de elementos
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // Eventos de clique nos botões de abas
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const target = button.getAttribute('data-tab-target');
            switchTab(target, true); // Atualiza o hash no clique manual
        });
    });

    // Controla inicialização por hash da URL (Campanhas do Ads direcionadas)
    const currentHash = window.location.hash;
    if (currentHash === '#voce' || currentHash === '#empresa') {
        switchTab(currentHash, false); // Não atualiza hash na inicialização para evitar rolagem
    } else {
        // Default é B2B (empresa)
        switchTab('#empresa', false); // Não atualiza hash na inicialização para manter URL limpa
    }

    // ----------------------------------------------------
    // 2. MENU HAMBÚRGUER MOBILE
    // ----------------------------------------------------
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    function toggleMobileMenu() {
        menuBtn.classList.toggle('menu-open');
        mobileMenu.classList.toggle('menu-active');
    }

    menuBtn.addEventListener('click', toggleMobileMenu);

    // Fecha o menu ao clicar em qualquer link mobile
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('menu-active')) {
                toggleMobileMenu();
            }
        });
    });

    // ----------------------------------------------------
    // 3. CARROSSEL DE DEPOIMENTOS (Se houver na página)
    // ----------------------------------------------------
    const track = document.getElementById('carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const dotContainer = document.getElementById('carousel-dots');
        let currentIndex = 0;
        let autoPlayInterval;

        // Cria os dots dinamicamente baseado no número de slides
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot', 'h-2.5', 'w-2.5', 'rounded-full', 'bg-slate-300', 'transition-all', 'duration-300');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ir para slide ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotContainer.appendChild(dot);
        });

        const dots = Array.from(dotContainer.children);

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active', 'bg-emerald-400', 'w-6');
                    dot.classList.remove('bg-slate-300');
                } else {
                    dot.classList.remove('active', 'bg-emerald-400', 'w-6');
                    dot.classList.add('bg-slate-300');
                }
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
            resetAutoplay();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }

        function startAutoplay() {
            autoPlayInterval = setInterval(nextSlide, 5000); // 5 segundos por slide
        }

        function resetAutoplay() {
            clearInterval(autoPlayInterval);
            startAutoplay();
        }

        // Inicialização do carrossel
        if (slides.length > 0) {
            updateCarousel();
            startAutoplay();
        }
    }

    // ----------------------------------------------------
    // 4. MODAL DO VÍDEO DO YOUTUBE
    // ----------------------------------------------------
    const openVideoBtn = document.getElementById('open-video-btn');
    const videoModal = document.getElementById('video-modal');
    const closeVideoBtn = document.getElementById('close-video-btn');
    const videoContainer = document.getElementById('video-container');
    const youtubeVideoUrl = 'https://www.youtube.com/embed/TV5xuRMXOeg?autoplay=1';

    if (openVideoBtn) {
        openVideoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Cria o Iframe dinamicamente para não prejudicar a velocidade inicial da página
            videoContainer.innerHTML = `
                <iframe class="w-full h-full rounded-2xl" 
                        src="${youtubeVideoUrl}" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen>
                </iframe>
            `;
            videoModal.classList.remove('hidden');
            videoModal.classList.add('flex');
            document.body.classList.add('overflow-hidden');
        });
    }

    function closeVideoModal() {
        videoModal.classList.add('hidden');
        videoModal.classList.remove('flex');
        videoContainer.innerHTML = ''; // Limpa o iframe para parar o vídeo
        document.body.classList.remove('overflow-hidden');
    }

    if (closeVideoBtn) {
        closeVideoBtn.addEventListener('click', closeVideoModal);
    }
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

    // ----------------------------------------------------
    // 5. CAPTURA DE LEADS & INTEGRAÇÃO WHATSAPP
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Pega dados do formulário
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const company = document.getElementById('form-company').value || 'Não informada';
            const phone = document.getElementById('form-phone').value;
            const service = document.getElementById('form-service').value;
            const message = document.getElementById('form-message').value;

            // Identifica o tipo do formulário baseado na aba ativa
            const isB2B = document.getElementById('empresa').classList.contains('active');
            const formType = isB2B ? 'Consultoria B2B (Empresa)' : 'Mentoria/Carreira B2C (Pessoal)';

            // Dispara conversão do Google Ads de forma modularizada e protegida
            if (window.EvolutioTracker) {
                window.EvolutioTracker.trackFormSubmit(formType);
            }

            // Exibe mensagem de feedback bem sucedida
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 mr-3 inline-block" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> Enviando Solicitação...
            `;

            setTimeout(() => {
                // Mensagem de sucesso estilizada no próprio formulário
                contactForm.innerHTML = `
                    <div class="text-center py-12 px-6 bg-emerald-50 rounded-2xl border border-emerald-100" data-aos="zoom-in">
                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 class="text-2xl font-bold text-slate-900 mb-2">Solicitação Enviada!</h3>
                        <p class="text-slate-600 mb-6">Agradecemos o seu contato. Priscila Queiroz ou alguém de nossa equipe entrará em contato em breve para conversar sobre seu projeto de Gestão de Pessoas.</p>
                        
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="https://wa.me/5511933892468?text=Olá,%20meu%20nome%20é%20${encodeURIComponent(name)}.%20Gostaria%20de%20falar%20sobre%20o%20serviço%20de%20${encodeURIComponent(service)}." 
                               target="_blank" 
                               class="btn-primary-custom px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                               onclick="if(window.EvolutioTracker) window.EvolutioTracker.trackWhatsApp('Formulario');">
                                <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.595-1.006-5.034-2.837-6.87C16.656 2.16 14.234.96 11.643.96c-5.439 0-9.868 4.373-9.87 9.737-.001 1.763.486 3.488 1.41 5.02l-.997 3.637 3.864-.999zm11.387-7.797c-.301-.15-1.78-.879-2.053-.978-.275-.099-.475-.149-.675.15-.199.3-.773.977-.948 1.176-.175.2-.35.225-.651.075-1.041-.519-1.814-.919-2.522-2.129-.187-.318-.018-.474.129-.637.133-.147.301-.349.451-.524.149-.174.199-.299.299-.498.1-.2.05-.374-.025-.524-.075-.15-.675-1.623-.925-2.223-.244-.587-.492-.507-.675-.516-.174-.008-.374-.01-.574-.01-.2 0-.526.075-.802.374-.275.3-1.05 1.024-1.05 2.497 0 1.471 1.075 2.893 1.225 3.093.15.2 2.115 3.227 5.125 4.524.714.309 1.272.494 1.707.632.717.228 1.368.196 1.883.119.574-.085 1.78-.727 2.03-1.429.25-.701.25-1.3.175-1.429-.075-.125-.275-.199-.575-.349z"/>
                                </svg> Iniciar no WhatsApp
                            </a>
                            <button onclick="window.location.reload();" class="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700">
                                Enviar Nova Mensagem
                            </button>
                        </div>
                    </div>
                `;
            }, 1200);
        });
    }

    // Configura botões de contato direto para registrar clique do WhatsApp
    const directWaButtons = document.querySelectorAll('[data-wa-trigger]');
    directWaButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const context = btn.getAttribute('data-wa-trigger') || 'Direto';
            if (window.EvolutioTracker) {
                window.EvolutioTracker.trackWhatsApp(context);
            }
        });
    });

    const directPhoneButtons = document.querySelectorAll('a[href^="tel:"]');
    directPhoneButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.EvolutioTracker) {
                window.EvolutioTracker.trackPhoneClick();
            }
        });
    });

    // ----------------------------------------------------
    // 6. INICIALIZAÇÃO DE ANIMAÇÕES AOS.JS
    // ----------------------------------------------------
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // ----------------------------------------------------
    // 7. CONTADORES ANIMADOS (Credibility Badges)
    // ----------------------------------------------------
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: "0px 0px -50px 0px"
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // Duração de 2 segundos para a animação
                    const startTime = performance.now();

                    const updateCount = (currentTime) => {
                        const elapsedTime = currentTime - startTime;
                        if (elapsedTime < duration) {
                            const progress = elapsedTime / duration;
                            // Efeito desaceleração suave (easeOutQuad)
                            const easeProgress = progress * (2 - progress);
                            const currentValue = Math.floor(easeProgress * target);
                            
                            // Formata número para o padrão pt-BR (ex: 4000 vira 4.000)
                            counter.innerText = currentValue.toLocaleString('pt-BR');
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = target.toLocaleString('pt-BR');
                        }
                    };

                    requestAnimationFrame(updateCount);
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ----------------------------------------------------
    // 8. FAVICON COM FUNDO BRANCO DINÂMICO
    // ----------------------------------------------------
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
        const img = new Image();
        img.src = favicon.href;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            // Favicons geralmente são 32x32 ou 64x64
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            
            // Desenha fundo branco redondo ou quadrado (quadrado com cantos levemente arredondados)
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(0, 0, canvas.width, canvas.height, 12);
            ctx.fill();
            
            // Desenha a logo centralizada por cima do fundo branco
            const padding = 8; // margem para a logo respirar
            ctx.drawImage(img, padding, padding, canvas.width - (padding * 2), canvas.height - (padding * 2));
            
            // Substitui o favicon no navegador pela nova imagem gerada com fundo
            favicon.href = canvas.toDataURL('image/png');
        };
    }
});
