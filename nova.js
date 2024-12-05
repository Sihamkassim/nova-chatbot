document.addEventListener('DOMContentLoaded', function () {
    const welcomeScript = document.querySelector('.welcome-text p');
    const message = "👋 Hello there! Welcome to [Nova]! 🎉 Just click start, and let’s get started! I’m excited to chat with you! 💬✨";
    let index = 0;

    function typeText() {
        if (index < message.length) {
            welcomeScript.innerHTML += message[index];
            index++;
            setTimeout(typeText, 55);
        }
    }

    typeText();
});

document.addEventListener('DOMContentLoaded', () => {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.hero-content, .feature-card');

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;

            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    });

    const textContent = document.querySelector('.text-content');
    if (textContent) {
        textContent.classList.add('animate-in');
    }

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
    });

    const nav = document.querySelector('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > lastScroll) {
            nav.style.background = 'rgba(0, 0, 0, 0.8)';
        } else {
            nav.style.background = 'rgba(0, 0, 0, 0.2)';
        }

        if (currentScroll === 0) {
            nav.style.background = 'rgba(0, 0, 0, 0.2)';
        }

        lastScroll = currentScroll;
    });
});
