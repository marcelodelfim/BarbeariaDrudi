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
                setTimeout(() => preloader.remove(), 500); // Remove do DOM após animação
            }
        }

        if (tempoDeCarregamento < TEMPO_MINIMO_LOADER) {
            const tempoRestante = TEMPO_MINIMO_LOADER - tempoDeCarregamento;
            setTimeout(esconderPreloader, tempoRestante);
        } else {
            esconderPreloader();
        }
    });

    // --- 1. Rolagem suave com offset do header ---
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 0;
    document.querySelectorAll('header .navbar a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const topPos = target.offsetTop - headerHeight;
                window.scrollTo({ top: topPos, behavior: 'smooth' });
            }
        });
    });

    // --- 2. Header escurecido ao rolar ---
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- 3. Modal da galeria ---
    const modal = document.getElementById('modal-galeria');
    const imgModal = document.getElementById('img-modal');
    const spanFechar = document.querySelector('.fechar-modal');
    const miniaturas = document.querySelectorAll('.galeria-container img');

    if (modal && imgModal && spanFechar) {
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-modal', 'true');

        miniaturas.forEach(img => {
            img.addEventListener('click', function() {
                modal.style.display = "block";
                modal.setAttribute('aria-hidden', 'false');
                imgModal.src = this.src;
                imgModal.alt = this.alt;
            });
        });

        spanFechar.addEventListener('click', () => {
            modal.style.display = "none";
            modal.setAttribute('aria-hidden', 'true');
        });

        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.style.display = "none";
                modal.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // --- 4. Menu ativo conforme rolagem ---
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('header .navbar a');

    window.addEventListener('scroll', () => {
        let currentId = '';
        const offset = headerHeight + 20; // ajuste fino
        sections.forEach(sec => {
            if (window.pageYOffset >= (sec.offsetTop - offset)) {
                currentId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentId)) {
                link.classList.add('active');
            }
        });
    });

    // --- 5. Carrossel da home ---
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    const slideInterval = 5000;

    function showNextSlide() {
        if (slides.length > 0) {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
    }

    if (slides.length > 1) setInterval(showNextSlide, slideInterval);

    // --- 6. ScrollReveal ---
    const sr = ScrollReveal({ origin: 'top', distance: '50px', duration: 2000, reset: true });
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

    // --- 7. Typed.js ---
    const typedOutput = document.getElementById('typed-output');
    if (typedOutput) {
        new Typed('#typed-output', {
            strings: ['Paixão.', 'Tradição.', 'Precisão.', 'Arte.'],
            typeSpeed: 70,
            backSpeed: 50,
            backDelay: 2000,
            loop: true
        });
    }

    // --- 8. Botão "Voltar ao Topo" ---
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    if (backToTopBtn) {
        backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
        backToTopBtn.setAttribute('tabindex', '0');

        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('active', window.scrollY > 300);
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 9. Filtro da galeria (Isotope) ---
    const galeriaContainer = document.querySelector('.galeria-container');
    if (galeriaContainer) {
        imagesLoaded(galeriaContainer, () => {
            const iso = new Isotope(galeriaContainer, { itemSelector: '.item-galeria', layoutMode: 'fitRows' });
            const filtroBotoes = document.querySelector('.filtro-galeria');

            if (filtroBotoes) {
                filtroBotoes.addEventListener('click', (e) => {
                    if (!e.target.matches('button')) return;

                    const filterValue = e.target.getAttribute('data-filter');
                    iso.arrange({ filter: filterValue });

                    filtroBotoes.querySelectorAll('button').forEach(btn => {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-pressed', 'false');
                    });

                    e.target.classList.add('active');
                    e.target.setAttribute('aria-pressed', 'true');
                });
            }
        });
    }

    // --- 10. Menu hambúrguer ---
    const hamburger = document.getElementById('menu-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navMenuLinks = document.querySelectorAll('.nav-item');

    if (hamburger && navMenu) {
        hamburger.setAttribute('aria-expanded', 'false');

        hamburger.addEventListener('click', () => {
            const expanded = navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', expanded);
        });

        navMenuLinks.forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('active'));
        });
    }

});
