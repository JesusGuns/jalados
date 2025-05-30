document.addEventListener('DOMContentLoaded', function () {
    const carouselInner = document.querySelector('#smartCarousel .carousel-inner');

    const imageNames = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg'];
    let isFirst = true;


    imageNames.forEach(name => {
        const div = document.createElement('div');
        div.className = 'carousel-item' + (isFirst ? ' active' : '');
        isFirst = false;

        const img = document.createElement('img');
        img.src = 'images/' + name;
        img.className = 'd-block w-100';
        img.alt = 'Imagen carrusel';

        div.appendChild(img);
        carouselInner.appendChild(div);
    });

    const carousel = new bootstrap.Carousel('#smartCarousel', {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true,
        ride: 'carousel'
        
    });

    function smartImageFit() {
        const items = document.querySelectorAll('#smartCarousel .carousel-item');
        const isMobile = window.innerWidth <= 992;

        items.forEach(item => {
            const img = item.querySelector('img');
            if (!img) return;

            if (isMobile) {
                img.style.objectFit = 'contain'; 
                img.style.maxHeight = '100vh'; 
                img.style.height = 'auto';       
                item.style.height = 'auto';      
            } else {
                img.style.objectFit = 'cover';  
                img.style.height = '100vh';     
                img.style.width = '100%';       
                item.style.height = '100vh';    
            }
        });
    }

    smartImageFit();

    window.addEventListener('resize', smartImageFit);

    imageNames.forEach(src => {
        const img = new Image();
        img.src = 'images/' + src;
    });


    $('#smartCarousel').on('slid.bs.carousel', function () {
        const items = document.querySelectorAll('.carousel-item');
        items.forEach(item => {
            item.classList.remove('carousel-item-next', 'carousel-item-prev');
        });
    });


  
    const captions = {
    cumpleanos: ["Cumpleaños 1", "Cumpleaños 2", "Cumpleaños 3"],
    babyshower: ['<a href="./templates/BabyShower_1.html">Baby Shower 1</a>', "Baby Shower 2", "Baby Shower 3"],
    xvanos: ['<a href="./templates/XV_1.html">XV Años 1</a>', '<a href="./templates/XV_2.html">XV Años 2</a>', '<a href="./templates/XV_3.html">XV Años 3</a>'],
    bodas: ["Bodas 1", "Bodas 2", "Bodas 3"]
    };

    function createSwiper(selector, captionsId, captionsArr) {
        const swiper = new Swiper(selector, {
        effect: "cards",
        grabCursor: true,
        on: {
            slideChange: function () {
            const idx = this.activeIndex;
            document.getElementById(captionsId).innerHTML = captionsArr[idx];
            },
        },
        });
        return swiper;
    }

    createSwiper(".cumpleanosSwiper", "cumpleCaption", captions.cumpleanos);
    createSwiper(".babyshowerSwiper", "babyshowerCaption", captions.babyshower);
    createSwiper(".xvanosSwiper", "xvanosCaption", captions.xvanos);
    createSwiper(".bodasSwiper", "bodasCaption", captions.bodas);
});


