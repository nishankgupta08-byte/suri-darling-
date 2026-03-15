document.addEventListener('DOMContentLoaded', () => {
    // 1. Floating Hearts Animation Background
    const particlesContainer = document.getElementById('particles-container');
    const createHeart = () => {
        const heart = document.createElement('i');
        heart.classList.add('fa-solid', 'fa-heart', 'floating-heart');
        
        // Randomize physical properties for hearts
        const size = Math.random() * 1.5 + 0.8; // 0.8rem to 2.3rem
        const left = Math.random() * 100; // 0% to 100vw
        const duration = Math.random() * 8 + 6; // 6s to 14s duration
        const opacity = Math.random() * 0.3 + 0.1; // 0.1 to 0.4 opacity
        
        heart.style.fontSize = `${size}rem`;
        heart.style.left = `${left}vw`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.opacity = opacity;
        
        particlesContainer.appendChild(heart);
        
        // Cleanup after animation finishes
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    };

    // Instantiate a new heart every 450ms
    setInterval(createHeart, 450);


    // 2. Intersection Observer for Scroll Animations
    const fadeObserverOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    let typingStarted = false;

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible-section');
                
                // Trigger typing animation when love letter becomes visible
                if (entry.target.id === 'letter' && !typingStarted) {
                    typingStarted = true;
                    // Adding small delay for aesthetic entry
                    setTimeout(typeWriter, 800); 
                }
                
                fadeObserver.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    document.querySelectorAll('.section-animate').forEach(section => {
        fadeObserver.observe(section);
    });

    // 3. Typewriter Hand-Written Effect for Love Letter
    const textElement = document.getElementById('typewriter-text');
    const originalText = document.getElementById('original-text').innerText;
    let charIndex = 0;
    
    // Varying typing speed
    function typeWriter() {
        if (charIndex < originalText.length) {
            textElement.textContent += originalText.charAt(charIndex);
            charIndex++;
            
            // Randomize typing speed to simulate human handwriting
            let typingSpeed = Math.random() * 40 + 30; // 30ms to 70ms
            
            // Add extra pause for punctuation
            const char = originalText.charAt(charIndex - 1);
            if (char === '.' || char === '!' || char === '?') {
                typingSpeed += 300;
            } else if (char === ',' || char === '\n') {
                typingSpeed += 150;
            }
            
            setTimeout(typeWriter, typingSpeed);
        } else {
            // Typing finished
            textElement.style.borderRight = "none";
            // Show the sign-off part smoothly
            setTimeout(() => {
                document.querySelector('.letter-signoff').classList.add('visible');
            }, 500);
        }
    }

    // 4. Custom Lightbox Gallery Implementation
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let currentImageIndex = 0;
    const imageUrls = Array.from(galleryItems).map(item => item.getAttribute('data-src'));

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImg.src = imageUrls[currentImageIndex];
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Stop body scrolling
        
        // Re-trigger zoom animation
        lightboxImg.style.animation = 'none';
        lightboxImg.offsetHeight; // force flow reflow
        lightboxImg.style.animation = 'lightboxZoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }

    function closeLightbox() {
        // Small fade out effect manually before display off
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightbox.style.opacity = '1';
            document.body.style.overflow = 'auto'; // Restore scroll
        }, 300);
    }

    function showNext() {
        currentImageIndex = (currentImageIndex + 1) % imageUrls.length;
        lightboxImg.src = imageUrls[currentImageIndex];
    }

    function showPrev() {
        currentImageIndex = (currentImageIndex - 1 + imageUrls.length) % imageUrls.length;
        lightboxImg.src = imageUrls[currentImageIndex];
    }

    // Bind events to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Click outside image to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard Accessibility
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        }
    });
});
