define(["jquery", "helpers"], function ($,helpers) {
    
    var actions = {
        onUpdateImages: function() {
            const wrapper = carousel.querySelector('._image-wrapper');
            const boxes = wrapper.querySelectorAll('._rotated-box');
            boxes.forEach((box, i) => {
                const img = document.createElement('img');
                img.src = helpers.onGetResources().MainEvent.CollageImages[i];
                box.innerHTML = '';
                box.appendChild(img); 
            });
        },
        onMoveImageToFront: function() {
            const movedImage = helpers.onGetResources().MainEvent.CollageImages.pop(); 
            helpers.onGetResources().MainEvent.CollageImages.unshift(movedImage); 
            actions.onUpdateImages();
        },
        onGallery: function() {
            const carousel = document.getElementById('carousel');
            document.querySelector('._box4').addEventListener('click', actions.onMoveImageToFront);
            actions.onUpdateImages();

            let startX = 0;
            let endX = 0;
            carousel.addEventListener('touchstart', (e) => {
                startX = e.changedTouches[0].screenX;
            });
            carousel.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].screenX;
                if (Math.abs(endX - startX) > 50) {
                    actions.onMoveImageToFront();
                }
            });
        },
    };
    
    
    var module = {
        onCreateGallery: function(){
            actions.onGallery();
        }
    };

    return module;
});
