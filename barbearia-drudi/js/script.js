// Aguarda a página inteira (incluindo imagens, CSS) carregar
document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DO PRELOADER COM TEMPO MÍNIMO ---
    const TEMPO_MINIMO_LOADER = 2000; // 2 segundos
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

    // 2. Efeito de escurecer o header ao rolar a página (USANDO CLASSLIST)
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            // Adiciona a classe 'scrolled' se a rolagem for maior que 50px, remove se for menor
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
                imgModal.alt = this.alt; // Copia o alt text para a imagem do modal
            });
        });

        spanFechar.addEventListener('click', function() {
            modal.style.display = "none";
        });

        // Fecha o modal se o usuário clicar fora da imagem
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
        const headerOffset = 150; // Offset para ativar o link um pouco antes

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
    const slideInterval = 5000; // Tempo de cada slide: 5 segundos

    function showNextSlide() {
        // Esconde o slide atual
        slides[currentSlide].classList.remove('active');

        // Calcula o próximo slide
        currentSlide = (currentSlide + 1) % slides.length;

        // Mostra o próximo slide
        slides[currentSlide].classList.add('active');
    }

    // Inicia o carrossel se houver mais de um slide
    if (slides.length > 1) {
        setInterval(showNextSlide, slideInterval);
    }
});