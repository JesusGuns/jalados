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
                img.style.maxHeight = '100vh';    // Tenia 80% pero al ponerle 100vh se arreglo jajaj
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


    
});


const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
const cards = document.querySelectorAll('.template-cards .card');

// actualizar los puntos
function updateDots() {
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

//navegar entre las tarjetas
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateCards();
        updateDots();
    });
});

//actualizar las tarjetas
function updateCards() {
    const itemsPerPage = 4;
    const start = currentIndex * itemsPerPage;
    const end = start + itemsPerPage;

    cards.forEach((card, index) => {
        if (index >= start && index < end) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

updateCards();
updateDots();




