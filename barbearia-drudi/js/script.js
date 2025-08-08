// Aguarda a página inteira (incluindo imagens, CSS) carregar
document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DO PRELOADER COM TEMPO MÍNIMO ---
    // (Esta parte está correta, mas a coloquei aqui para referência)
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
    const navLinks = document.querySelectorAll('header .navbar a[href^="#"]');
    navLinks.forEach(anchor => {
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

    // 7. INICIALIZAÇÃO DO SCROLL REVEAL (ANIMAÇÕES DE ROLAGEM)
    // O código foi movido para aqui, no nível correto.
    const sr = ScrollReveal({
        origin: 'top',
        distance: '50px',
        duration: 3000,
        reset: true
    });

    // Agora, vamos aplicar a animação aos elementos que queremos
    sr.reveal('.home-content', { delay: 200 });
    sr.reveal('h2', { origin: 'left', distance: '80px', delay: 300 });
    sr.reveal('.secao-subtitulo', { origin: 'bottom', delay: 300 });
    sr.reveal('.servico-item', { interval: 200 });
    sr.reveal('.galeria-container img', { origin: 'bottom', interval: 300 });
    sr.reveal('.sobre-texto', { origin: 'left' });
    sr.reveal('.sobre-imagem', { origin: 'right', delay: 200 });
    sr.reveal('.video-container', { origin: 'bottom' });
    sr.reveal('.contato-container p', {});
    sr.reveal('.contato-botoes .btn', { interval: 200 });
    sr.reveal('.horario-atendimento', { interval: 200 });

    const options = {
        strings: ['Paixão.', 'Tradição.', 'Precisão.', 'Arte.'],
        typeSpeed: 70,   // Velocidade de digitação em milissegundos
        backSpeed: 50,   // Velocidade para apagar
        backDelay: 2000, // Tempo de espera depois de digitar antes de começar a apagar
        loop: true       // Repetir o loop de palavras
    };

    const typed = new Typed('#typed-output', options);

    // 9. LÓGICA DO BOTÃO "VOLTAR AO TOPO"
    const backToTopButton = document.querySelector('.back-to-top-btn');

    if (backToTopButton) {
        // Mostra ou esconde o botão baseado na posição da rolagem
        window.addEventListener('scroll', () => {
            // Se o usuário rolou mais de 300 pixels para baixo
            if (window.scrollY > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });

        // Rola suavemente para o topo quando o botão é clicado
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o comportamento padrão de "pulo" do link
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 10. LÓGICA DO FILTRO DA GALERIA (ISOTOPE)
    const galeriaContainer = document.querySelector('.galeria-container');
    
    if (galeriaContainer) {
        // Inicializa o Isotope depois que todas as imagens carregarem
        imagesLoaded(galeriaContainer, function() {
            const iso = new Isotope(galeriaContainer, {
                itemSelector: '.item-galeria',
                layoutMode: 'fitRows'
            });

            // Lógica para os botões de filtro
            const filtroBotoes = document.querySelector('.filtro-galeria');
            filtroBotoes.addEventListener('click', function(event) {
                if (!event.target.matches('button')) {
                    return;
                }

                const filterValue = event.target.getAttribute('data-filter');
                iso.arrange({ filter: filterValue });

                // Lógica para a classe 'active' nos botões
                const botoes = filtroBotoes.querySelectorAll('button');
                botoes.forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');
            });
        });
    }

});