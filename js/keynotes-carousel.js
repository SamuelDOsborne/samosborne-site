// Keynotes Testimonial Carousel - Simplified and Reliable
(function() {
    'use strict';
    
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let autoplayTimer;

    if (!slides.length) {
        console.log('No testimonial slides found');
        return;
    }

    console.log('Carousel initialized with', slides.length, 'slides');

    function showSlide(index) {
        console.log('Showing slide', index);
        
        // Hide all slides
        slides.forEach((slide, i) => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });

        // Remove active from all dots
        dots.forEach(dot => dot.classList.remove('active'));

        // Show current slide
        slides[index].style.display = 'block';
        slides[index].classList.add('active');
        
        // Activate current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }

        // Add fade in animation
        slides[index].style.opacity = '0';
        setTimeout(() => {
            slides[index].style.transition = 'opacity 0.5s ease';
            slides[index].style.opacity = '1';
        }, 10);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, 8000);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
        }
    }

    // Button event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Next button clicked');
            stopAutoplay();
            nextSlide();
            startAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Prev button clicked');
            stopAutoplay();
            prevSlide();
            startAutoplay();
        });
    }

    // Dot event listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Dot', index, 'clicked');
            stopAutoplay();
            currentSlide = index;
            showSlide(currentSlide);
            startAutoplay();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            stopAutoplay();
            prevSlide();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            stopAutoplay();
            nextSlide();
            startAutoplay();
        }
    });

    // Pause on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoplay);
        carouselContainer.addEventListener('mouseleave', startAutoplay);
    }

    // Initialize
    showSlide(0);
    startAutoplay();
    
    console.log('Carousel started');
})();
