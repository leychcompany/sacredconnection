document.addEventListener('DOMContentLoaded', function() {
    var carousels = document.querySelectorAll('.custom-categories-carousel');
    carousels.forEach(function(carousel) {
        var slidesPerViewDesktop = parseInt(carousel.getAttribute('data-slides-per-view-desktop')) || 4;
        var slidesPerViewTablet = parseInt(carousel.getAttribute('data-slides-per-view-tablet')) || 2;

        new Swiper(carousel, {
            slidesPerView: slidesPerViewDesktop, // Valor padrão para desktop
            spaceBetween: 15,
            loop: true,
            autoplay: {
                delay: 3000, // Ajuste o atraso em milissegundos
                disableOnInteraction: false, // Autoplay não será desativado após interações do usuário
                pauseOnMouseEnter: true, // O autoplay será pausado quando o usuário passar o mouse sobre o carrossel
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2, // Forçar sempre 1 slide por vez em dispositivos móveis
                },
                768: {
                    slidesPerView: slidesPerViewTablet, // Valor para tablets
                },
                1024: {
                    slidesPerView: slidesPerViewDesktop, // Valor para desktop
                }
            },
            // Configurações adicionais para garantir que o mobile use 1 slide
            on: {
                init: function () {
                    if (window.innerWidth <= 640) {
                        this.params.slidesPerView = 2;
                        this.update();
                    }
                },
                resize: function () {
                    if (window.innerWidth <= 640) {
                        this.params.slidesPerView = 2;
                        this.update();
                    }
                }
            }
        });
    });
});
