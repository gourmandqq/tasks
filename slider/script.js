const sliderTrack = document.getElementById('sliderTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const sliderDots = document.getElementById('sliderDots');

const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

let currentSlide = 1;
const maxSlide = totalSlides - 2;

function createDots() {
    for (let i = 1; i <= maxSlide; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDots.appendChild(dot);
    }
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide - 1);
    });
}

function updateSlides() {
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentSlide) {
            slide.classList.add('active');
        }
    });
}

function goToSlide(index) {
    currentSlide = Math.max(1, Math.min(index, maxSlide));
    const offset = (currentSlide - 1) * 33.333;
    sliderTrack.style.transform = `translateX(-${offset}%)`;
    updateDots();
    updateSlides();
}

function nextSlide() {
    if (currentSlide < maxSlide) {
        goToSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 1) {
        goToSlide(currentSlide - 1);
    }
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

createDots();
goToSlide(currentSlide);
