document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.getElementById('carousel');
    let isDragging = false;
    let startX, currentAngle = 0, startAngle = 0, velocity = 0;
    let animationId, lastTime;
    const friction = 0.95;
    const numPhotos = 8;
    const angleIncrement = 360 / numPhotos;

    const photos = [
        { src: "2.jpg", quote: "May your birthday be as wonderful as you are!", frame: "frame1" },
        { src: "https://via.placeholder.com/150?text=Photo2", quote: "Wishing you health, happiness and success!", frame: "frame2" },
        { src: "https://via.placeholder.com/150?text=Photo3", quote: "Another year of amazing adventures begins today!", frame: "frame3" },
        { src: "https://via.placeholder.com/150?text=Photo4", quote: "Cheers to you on your special day!", frame: "frame4" },
        { src: "https://via.placeholder.com/150?text=Photo5", quote: "May all your birthday wishes come true!", frame: "frame5" },
        { src: "https://via.placeholder.com/150?text=Photo6", quote: "You're not getting older, you're getting better!", frame: "frame6" },
        { src: "https://via.placeholder.com/150?text=Photo7", quote: "Today is all about you - enjoy every moment!", frame: "frame7" },
        { src: "https://via.placeholder.com/150?text=Photo8", quote: "Sending you smiles for every moment of your day!", frame: "frame8" }
    ];

    photos.forEach((photo, i) => {
        const angle = i * angleIncrement;
        const photoItem = document.createElement('div');
        photoItem.className = `photo-item ${photo.frame}`;
        photoItem.style.transform = `rotateY(${angle}deg) translateZ(300px)`;

        photoItem.innerHTML = `
            <div class="photo-content">
                <img src="${photo.src}" alt="Birthday Photo" class="photo-img">
                <div class="photo-quote">${photo.quote}</div>
            </div>
        `;

        carousel.appendChild(photoItem);
    });

    function updateCarousel() {
        carousel.style.transform = `rotateY(${currentAngle}deg)`;
    }

    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        if (!isDragging && Math.abs(velocity) > 0.1) {
            currentAngle += velocity * deltaTime / 16;
            velocity *= friction;
            updateCarousel();
            animationId = requestAnimationFrame(animate);
        } else {
            velocity = 0;
            const snappedAngle = Math.round(currentAngle / angleIncrement) * angleIncrement;
            currentAngle = snappedAngle;
            updateCarousel();
        }
    }

    function startDrag(e) {
        isDragging = true;
        startAngle = currentAngle;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        document.addEventListener(e.type === 'mousedown' ? 'mousemove' : 'touchmove', drag, { passive: false });
        document.addEventListener(e.type === 'mousedown' ? 'mouseup' : 'touchend', endDrag);
        cancelAnimationFrame(animationId);
        carousel.style.transition = 'none';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const deltaX = clientX - startX;
        currentAngle = startAngle + deltaX * 0.5;
        updateCarousel();
    }

    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        const clientX = e.type === 'mouseup' ? e.clientX : e.changedTouches[0].clientX;
        const deltaX = clientX - startX;
        velocity = deltaX * 0.2;
        carousel.style.transition = 'transform 0.5s ease-out';
        animate();
        document.removeEventListener(e.type === 'mouseup' ? 'mousemove' : 'touchmove', drag);
        document.removeEventListener(e.type === 'mouseup' ? 'mouseup' : 'touchend', endDrag);
    }

    carousel.addEventListener('mousedown', startDrag);
    carousel.addEventListener('touchstart', startDrag, { passive: false });
    updateCarousel();
});
