document.addEventListener('DOMContentLoaded', function () {
    const carousels = document.querySelectorAll('.unique-image-carousel');
    carousels.forEach(carousel => {
        const swiper = new Swiper(carousel, {
            loop: true,
            slidesPerView: 3,
            centeredSlides: true,
            spaceBetween: -100, // Ajuste conforme necessário
            initialSlide: 1, // Começar com o segundo slide (indexado a partir de zero, então '1' é o slide central)
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 300,
                modifier: 1,
                slideShadows: true,
            },
            navigation: {
                nextEl: carousel.querySelector('.unique-swiper-button-next'),
                prevEl: carousel.querySelector('.unique-swiper-button-prev'),
            },
            pagination: {
                el: carousel.querySelector('.unique-swiper-pagination'),
                clickable: true,
            },
            watchSlidesProgress: true,
            watchOverflow: true, // Desativa automaticamente a navegação quando não há slides suficientes
            
        });

        // Adiciona evento de clique para navegar para o slide clicado
        const slides = carousel.querySelectorAll('.swiper-slide');
        slides.forEach((slide, index) => {
            slide.addEventListener('click', () => {
                swiper.slideToLoop(index);
            });
        });
    });
});
