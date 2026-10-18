document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Real-time Video Frame Color & Text Contrast Sync Engine ---
    const bgVideo = document.getElementById('bg-video');
    const heroContent = document.querySelector('.hero-content');
    const heroHeadings = document.querySelectorAll('.hero-content h1, .hero-content h2, .hero-content p, .hero-content .greeting');

    if (bgVideo) {
        bgVideo.playbackRate = 0.85; // Smooth slow cinematic play

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        bgVideo.addEventListener('timeupdate', () => {
            if (bgVideo.paused || bgVideo.ended) return;

            try {
                canvas.width = 50;
                canvas.height = 50;
                context.drawImage(bgVideo, 0, 0, 50, 50);

                // Video frame ke center ka average color nikalna
                const frameData = context.getImageData(10, 10, 30, 30).data;
                let r = 0, g = 0, b = 0, count = 0;

                for (let i = 0; i < frameData.length; i += 4) {
                    r += frameData[i];
                    g += frameData[i+1];
                    b += frameData[i+2];
                    count++;
                }

                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);

                // Luminance (Brightness) calculate karna (0 to 255)
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;

                // Frame ke hisaab se text aur glass tint ko dynamic adjust karna
                if (brightness > 130) {
                    // Agar background bright/light hai -> Text Dark hoga, Glass halka dark transparent rahega
                    if (heroContent) {
                        heroContent.style.background = 'rgba(0, 0, 0, 0.35)';
                        heroContent.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }
                    heroHeadings.forEach(el => {
                        if (!el.classList.contains('greeting') && !el.querySelector('span')) {
                            el.style.color = '#1e293b'; // Dark crisp text for bright bg
                            el.style.textShadow = '0 1px 4px rgba(255, 255, 255, 0.8)';
                        }
                    });
                } else {
                    // Agar background dark hai -> Text Clean White hoga, Glass transparent rahega
                    if (heroContent) {
                        heroContent.style.background = 'rgba(255, 255, 255, 0.05)';
                        heroContent.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }
                    heroHeadings.forEach(el => {
                        if (!el.classList.contains('greeting') && !el.querySelector('span')) {
                            el.style.color = '#ffffff'; // Pure white text for dark bg
                            el.style.textShadow = '0 2px 8px rgba(0, 0, 0, 0.9)';
                        }
                    });
                }
            } catch (e) {
                // Cross-origin or loading fallback protection
                console.log("Frame analysis waiting...");
            }
        });
    }

    // --- 2. Mobile Navbar Toggle ---
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

    // --- 3. Dynamic Typing Effect ---
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
        if (isDeleting) typeSpeed /= 2; 

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

    // --- 4. YouTube 3D Projector Modal ---
    const projectorModal = document.getElementById('projector-modal');
    const projectorContainer = document.getElementById('projector-video-container');
    const closeProjectorBtn = document.querySelector('.close-projector');
    const ambientLight = document.getElementById('projector-ambient-light');
    const videoThumbs = document.querySelectorAll('.click-to-play');

    videoThumbs.gh = videoThumbs.forEach(wrapper => {
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

    function closeProjector() {
        if (projectorModal) projectorModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            if (projectorContainer) projectorContainer.innerHTML = ''; 
            if (ambientLight) ambientLight.style.backgroundImage = 'none'; 
        }, 400); 
    }

    if (closeProjectorBtn) closeProjectorBtn.addEventListener('click', closeProjector);

    if (projectorModal) {
        projectorModal.addEventListener('click', (e) => {
            if(e.target === projectorModal || e.target === ambientLight) {
                closeProjector();
            }
        });
    }
});