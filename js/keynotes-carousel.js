/**
 * Testimonial Carousel
 * Interactive carousel for rotating testimonials
 * Sam Osborne Website - Keynotes Section
 */

class TestimonialCarousel {
    constructor() {
        this.currentIndex = 0;
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.autoplayInterval = null;
        this.autoplayDelay = 6000; // 6 seconds
        
        this.init();
    }

    init() {
        // Only initialize if carousel elements exist
        if (!this.slides.length) return;

        // Button click handlers
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prev();
                this.resetAutoplay();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.next();
                this.resetAutoplay();
            });
        }
        
        // Dot click handlers
        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(index);
                this.resetAutoplay();
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Start autoplay
        this.startAutoplay();

        // Pause on hover
        const testimonialSection = document.querySelector('.testimonials-section');
        if (testimonialSection) {
            testimonialSection.addEventListener('mouseenter', () => this.stopAutoplay());
            testimonialSection.addEventListener('mouseleave', () => this.startAutoplay());
        }

        // Pause on focus (accessibility)
        const interactiveElements = document.querySelectorAll('.carousel-btn, .dot');
        interactiveElements.forEach(element => {
            element.addEventListener('focus', () => this.stopAutoplay());
            element.addEventListener('blur', () => this.startAutoplay());
        });
    }

    goToSlide(index) {
        // Remove active class from current slide and dot
        this.slides[this.currentIndex].classList.remove('active');
        this.dots[this.currentIndex].classList.remove('active');

        // Update index
        this.currentIndex = index;

        // Add active class to new slide and dot
        this.slides[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    startAutoplay() {
        this.stopAutoplay(); // Clear any existing interval
        this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TestimonialCarousel();
    });
} else {
    new TestimonialCarousel();
}
