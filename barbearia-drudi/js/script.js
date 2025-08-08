// Aguarda a página inteira (incluindo imagens, CSS) carregar
document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DO PRELOADER COM TEMPO MÍNIMO ---
    const TEMPO_MINIMO_LOADER = 2000;
    const tempoInicial = new Date().getTime();

    window.addEventListener('load', function() {
        const tempoFinal = new Date().getTime();
        const tempoDeCarregamento = tempoFinal - tempoInicial;
        const preloader = document.getElementById('preloader');

        function esconderPreloader() {
            if (preloader) {
                preloader.classList.add('hidden');
            }
        }

        if (tempoDeCarregamento < TEMPO_MINIMO_LOADER) {
            const tempoRestante = TEMPO_MINIMO_LOADER - tempoDeCarregamento;
            setTimeout(esconderPreloader, tempoRestante);
        } else {
            esconderPreloader();
        }
    });


    // --- LÓGICA DO RESTANTE DO SITE ---

    // 1. Efeito de rolagem suave para os links do menu
    const navLinksSmooth = document.querySelectorAll('header .navbar a[href^="#"]');
    navLinksSmooth.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 2. Efeito de escurecer o header ao rolar a página
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // 3. LÓGICA DA GALERIA MODAL
    const miniaturas = document.querySelectorAll('.galeria-container img');
    const modal = document.getElementById('modal-galeria');
    const imgModal = document.getElementById('img-modal');
    const spanFechar = document.querySelector('.fechar-modal');

    if (modal && imgModal && spanFechar) {
        miniaturas.forEach(img => {
            img.addEventListener('click', function(){
                modal.style.display = "block";
                imgModal.src = this.src;
                imgModal.alt = this.alt;
            });
        });

        spanFechar.addEventListener('click', function() {
            modal.style.display = "none";
        });

        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }

    // 4. LÓGICA DO MENU ATIVO CONFORME A ROLAGEM
    const sections = document.querySelectorAll('main section[id]');
    const navHeaderLinks = document.querySelectorAll('header .navbar a');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const headerOffset = 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= (sectionTop - headerOffset)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navHeaderLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    });
    
    // 5. LÓGICA DO CARROSSEL DA HOME
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    const slideInterval = 5000;

    function showNextSlide() {
        if(slides.length > 0) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
    }
    
    if (slides.length > 1) {
        setInterval(showNextSlide, slideInterval);
    }

    // 7. INICIALIZAÇÃO DO SCROLL REVEAL
    const sr = ScrollReveal({
        origin: 'top',
        distance: '50px',
        duration: 2000,
        reset: true
    });

    sr.reveal('.home-content', { delay: 200 });
    sr.reveal('h2', { origin: 'left', distance: '80px', delay: 300 });
    sr.reveal('.secao-subtitulo', { origin: 'bottom', delay: 400 });
    sr.reveal('.servico-item', { interval: 200 });
    sr.reveal('.galeria-container img', { origin: 'bottom', interval: 150 });
    sr.reveal('.sobre-texto', { origin: 'left' });
    sr.reveal('.sobre-imagem', { origin: 'right', delay: 200 });
    sr.reveal('.video-container', { origin: 'bottom' });
    sr.reveal('.contato-container p', {});
    sr.reveal('.contato-botoes .btn', { interval: 200 });
    sr.reveal('.horario-atendimento', { interval: 200 });

    // 8. INICIALIZAÇÃO DO TYPED.JS
    const options = {
        strings: ['Paixão.', 'Tradição.', 'Precisão.', 'Arte.'],
        typeSpeed: 70,
        backSpeed: 50,
        backDelay: 2000,
        loop: true
    };

    if (document.getElementById('typed-output')) {
        const typed = new Typed('#typed-output', options);
    }

    // 9. LÓGICA DO BOTÃO "VOLTAR AO TOPO"
    const backToTopButton = document.querySelector('.back-to-top-btn');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 10. LÓGICA DO FILTRO DA GALERIA (ISOTOPE)
    const galeriaContainer = document.querySelector('.galeria-container');
    
    if (galeriaContainer) {
        imagesLoaded(galeriaContainer, function() {
            const iso = new Isotope(galeriaContainer, {
                itemSelector: '.item-galeria',
                layoutMode: 'fitRows'
            });

            const filtroBotoes = document.querySelector('.filtro-galeria');
            
            // ADICIONAMOS ESTA VERIFICAÇÃO DE SEGURANÇA
            if (filtroBotoes) {
                filtroBotoes.addEventListener('click', function(event) {
                    if (!event.target.matches('button')) {
                        return;
                    }

                    const filterValue = event.target.getAttribute('data-filter');
                    iso.arrange({ filter: filterValue });

                    const botoes = filtroBotoes.querySelectorAll('button');
                    botoes.forEach(btn => btn.classList.remove('active'));
                    event.target.classList.add('active');
                });
            }
        });
    }

    // 11. LÓGICA DO MENU HAMBÚRGUER
    const hamburger = document.getElementById('menu-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navMenuLinks = document.querySelectorAll('.nav-item');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        navMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

});