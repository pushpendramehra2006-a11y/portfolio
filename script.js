document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Mobile Navbar Toggle ---
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- 2. Dynamic Typing Effect ---
    const textElement = document.querySelector('.typing-text');
    const phrases = ["Electronics Engineer", "Full-Stack Developer", "Video Editor", "Tech Enthusiast"];
    let phraseIndex = 0;
    let letterIndex = 0;
    let currentPhrase = "";
    let isDeleting = false;

    function typeEffect() {
        if (!textElement) return;

        currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, letterIndex - 1);
            letterIndex--;
        } else {
            textElement.textContent = currentPhrase.substring(0, letterIndex + 1);
            letterIndex++;
        }

        let typeSpeed = 100;

        if (isDeleting) {
            typeSpeed /= 2; 
        }

        if (!isDeleting && letterIndex === currentPhrase.length) {
            typeSpeed = 2000; 
            isDeleting = true;
        } 
        else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; 
        }

        setTimeout(typeEffect, typeSpeed);
    }

    if(textElement) {
        setTimeout(typeEffect, 1000);
    }

    // --- 3. YouTube 3D Projector Modal Fix ---
    const projectorModal = document.getElementById('projector-modal');
    const projectorContainer = document.getElementById('projector-video-container');
    const closeProjectorBtn = document.querySelector('.close-projector');
    const ambientLight = document.getElementById('projector-ambient-light');
    const videoThumbs = document.querySelectorAll('.click-to-play');

    // Video open karne ka logic
    videoThumbs.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const videoId = wrapper.getAttribute('data-video-id');
            
            if (ambientLight && videoId) {
                ambientLight.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;
            }

            if (projectorContainer) {
                projectorContainer.innerHTML = ''; 
                if (videoId) {
                    const iframe = document.createElement('iframe');
                    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
                    iframe.setAttribute('title', 'YouTube video player');
                    iframe.setAttribute('frameborder', '0');
                    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                    iframe.setAttribute('allowfullscreen', 'true');
                    projectorContainer.appendChild(iframe);
                }
            }

            if (projectorModal) {
                projectorModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Video close karne ka logic
    function closeProjector() {
        if (projectorModal) {
            projectorModal.classList.remove('show');
        }
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            if (projectorContainer) projectorContainer.innerHTML = ''; 
            if (ambientLight) ambientLight.style.backgroundImage = 'none'; 
        }, 400); 
    }

    if (closeProjectorBtn) {
        closeProjectorBtn.addEventListener('click', closeProjector);
    }

    if (projectorModal) {
        projectorModal.addEventListener('click', (e) => {
            // Modal ke bahar ya close button par click karne par band hoga
            if(e.target === projectorModal || e.target === ambientLight) {
                closeProjector();
            }
        });
    }
});