// Testimonial Carousel Functionality
class TestimonialCarousel {
  constructor() {
    this.currentIndex = 0;
    this.slides = document.querySelectorAll('.testimonial-slide');
    this.dots = document.querySelectorAll('.dot');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.track = document.querySelector('.carousel-track');
    this.autoplayInterval = null;
    this.init();
  }

  init() {
    // Button click handlers
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());

    // Dot click handlers
    this.dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.goToSlide(index);
      });
    });

    // Start autoplay
    this.startAutoplay();

    // Pause on hover
    const testimonialSection = document.querySelector('.testimonials-section');
    testimonialSection.addEventListener('mouseenter', () => this.stopAutoplay());
    testimonialSection.addEventListener('mouseleave', () => this.startAutoplay());
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

    // Transform the track to show the correct slide
    const offset = -index * 100;
    this.track.style.transform = `translateX(${offset}%)`;
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
    this.autoplayInterval = setInterval(() => this.next(), 6000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new TestimonialCarousel();
});
