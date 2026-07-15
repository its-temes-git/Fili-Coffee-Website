// ==========================================
// GSAP SETUP
// ==========================================
try {
  gsap.registerPlugin(ScrollTrigger);
} catch (e) {
  console.warn("GSAP / ScrollTrigger not loaded yet or blocked:", e);
}

// ==========================================
// LENIS SMOOTH SCROLL (Wrapped in Safe Try-Catch)
// ==========================================
let lenis;
try {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
} catch (e) {
  console.warn("Lenis Smooth Scroll failed to load:", e);
}

// ==========================================
// CUSTOM SPLIT TEXT HELPER (Preserves HTML & BR tags)
// ==========================================
function splitTextPreservingHTML(element) {
  if (!element) return [];
  const nodes = Array.from(element.childNodes);
  element.innerHTML = '';
  const chars = [];
  
  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      for (let char of text) {
        const span = document.createElement('span');
        if (char === ' ') {
          span.innerHTML = '&nbsp;';
        } else {
          span.textContent = char;
        }
        span.style.display = 'inline-block';
        span.style.transition = 'color 0.3s ease';
        element.appendChild(span);
        chars.push(span);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
      element.appendChild(document.createElement('br'));
    } else {
      element.appendChild(node.cloneNode(true));
    }
  });
  return chars;
}

// ==========================================
// THREE.JS HERO INTERACTIVE PARTICLE FIELD
// ==========================================
try {
  const canvas = document.getElementById('hero-canvas');
  if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      velocities.push({
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.002 + 0.001,
        z: (Math.random() - 0.5) * 0.002
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const ctx = pCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(194, 104, 25, 0.85)');
    grad.addColorStop(1, 'rgba(194, 104, 25, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(pCanvas);
    const material = new THREE.PointsMaterial({
      size: 0.22,
      map: texture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      targetY = (e.clientY / window.innerHeight - 0.5) * 1.5;
    });

    let frameId;
    function tick() {
      frameId = requestAnimationFrame(tick);
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      particleSystem.rotation.y = currentX * 0.25;
      particleSystem.rotation.x = -currentY * 0.25;

      const positionsArray = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positionsArray[i * 3 + 1] += velocities[i].y;
        positionsArray[i * 3] += velocities[i].x;

        if (positionsArray[i * 3 + 1] > 4) positionsArray[i * 3 + 1] = -4;
        if (positionsArray[i * 3] > 6 || positionsArray[i * 3] < -6) velocities[i].x *= -1;
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    }
    tick();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const hero = document.getElementById('section1');
    if (hero && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: hero,
        start: 'bottom top',
        onLeave: () => cancelAnimationFrame(frameId),
        onEnterBack: () => tick()
      });
    }
  }
} catch (e) {
  console.warn("Three.js particle canvas failed to initialize:", e);
}

// ==========================================
// HERO TEXT HOVER & ENTRY ANIMATIONS
// ==========================================
try {
  const heroHeading = document.getElementById('hero-heading');
  if (heroHeading && typeof gsap !== 'undefined') {
    const chars = splitTextPreservingHTML(heroHeading);
    if (chars.length) {
      gsap.from(chars, {
        y: 80,
        opacity: 0,
        rotate: () => gsap.utils.random(-15, 15),
        scale: 0.7,
        duration: 1.2,
        ease: 'back.out(1.7)',
        stagger: { amount: 0.6, from: 'random' }
      });

      chars.forEach(char => {
        char.addEventListener('mouseenter', () => {
          gsap.to(char, {
            y: -22,
            scale: 1.25,
            color: '#C26819',
            rotate: () => gsap.utils.random(-15, 15),
            duration: 0.35,
            ease: 'power2.out'
          });
        });

        char.addEventListener('mouseleave', () => {
          gsap.to(char, {
            y: 0,
            scale: 1,
            color: '#734425',
            rotate: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.4)'
          });
        });
      });
    }
  }
} catch (e) {
  console.warn("Hero text hover animation failed:", e);
}

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
try {
  const nav = document.getElementById("navbar");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 60);
    }, { passive: true });
  }
} catch (e) {
  console.warn("Navbar effect failed:", e);
}

// ==========================================
// MULTI-SECTION GSAP ANIMATIONS (Safe Guards)
// ==========================================
try {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.matchMedia({
      "(min-width: 1025px)": function () {
        const headphone = document.querySelector("#headphone");
        const s2 = document.querySelector("#section2");
        const s3 = document.querySelector("#section3");
        const s4 = document.querySelector("#section4");
        const s5 = document.querySelector("#section5");

        if (headphone && s2 && s3 && s4 && s5) {
          gsap.set(headphone, { rotate: -25 });
          gsap.from(headphone, {
            opacity: 0,
            scale: 0.7,
            duration: 1.2,
            ease: "power2.out"
          });

          // Section 2 Trigger
          gsap.to(headphone, {
            scrollTrigger: { trigger: s2, start: "top bottom", end: "center center", scrub: 1.2 },
            x: () => getPos(s2, 0.5, 0).x,
            y: () => getPos(s2, 0.5, 0.5).y,
            width: "28vw", rotate: 0,
            ease: "power1.inOut", immediateRender: false
          });

          // Section 3 Trigger
          gsap.to(headphone, {
            scrollTrigger: { trigger: s3, start: "top bottom", end: "bottom bottom", scrub: 1.2 },
            x: () => getPos(s3, 0.5, 0.6).x,
            y: () => getPos(s3, 0.5, 0.7).y,
            width: "35vw", rotate: 35,
            ease: "power1.inOut", immediateRender: false
          });

          // Section 4 Trigger
          gsap.to(headphone, {
            scrollTrigger: { trigger: s4, start: "top bottom", end: "center center", scrub: 1.2 },
            x: () => getPos(s4, 0.5, 0.5).x,
            y: () => getPos(s4, 0.5, 0.5).y,
            width: "35vw", rotate: 0,
            ease: "power1.inOut", immediateRender: false
          });

          // Section 5 Trigger
          gsap.to(headphone, {
            scrollTrigger: { trigger: s5, start: "top bottom", end: "center center", scrub: 1.2 },
            x: () => getPos(s5, 0.5, 0.43).x,
            y: () => getPos(s5, 0.5, 0.43).y,
            width: "300px",
            ease: "power1.inOut", immediateRender: false
          });
        }

        // Section 1 bg text parallax
        const s1Heading = document.querySelector("#section1 h1");
        if (s1Heading) {
          gsap.to(s1Heading, {
            scrollTrigger: { trigger: "#section1", start: "top top", end: "bottom top", scrub: 0.5 },
            y: "15%", opacity: 0.6
          });
        }

        // Section 2 content wrapper parallax
        const s2Content = document.querySelector("#section2 .content-wrapper");
        if (s2Content) {
          gsap.from(s2Content, {
            scrollTrigger: { trigger: "#section2", start: "-50% bottom", end: "center center", scrub: 1 },
            y: "35%", ease: "power1.out"
          });
        }

        // Section 4 collages
        const s4Imgs = document.querySelectorAll("#section4 img");
        if (s4Imgs.length) {
          gsap.from(s4Imgs, {
            scrollTrigger: { trigger: "#section4", start: "top bottom", end: "center center", scrub: 1.2 },
            scale: 0.8, opacity: 0.3, ease: "power1.out"
          });
        }

        if (lenis) {
          ScrollTrigger.addEventListener("refresh", () => lenis.update());
        }
        ScrollTrigger.refresh();
      }
    });
  }
} catch (e) {
  console.warn("GSAP Multi-section animations failed:", e);
}

// Helper coordinate function
function getPos(section, xPercent, yPercent) {
  if (!section) return { x: 0, y: 0 };
  const rect = section.getBoundingClientRect();
  const scrollY = window.scrollY || window.pageYOffset;
  return {
    x: rect.left + rect.width * xPercent - window.innerWidth / 2,
    y: rect.top + scrollY + rect.height * yPercent - window.innerHeight / 2
  };
}

// ==========================================
// PROGRESSIVE SCROLL-REVEAL INTERSECTION OBSERVER
// ==========================================
try {
  const animatables = document.querySelectorAll('[data-animate]');
  if (animatables.length) {
    // Dynamically apply hidden state only when JS starts executing
    animatables.forEach(el => {
      const type = el.getAttribute('data-animate');
      el.classList.add('js-hide');
      if (type === 'fade-up') el.classList.add('js-hide-fade-up');
      else if (type === 'card') el.classList.add('js-hide-card');
      else if (type === 'heading') el.classList.add('js-hide-heading');
      else if (type === 'pop') el.classList.add('js-hide-pop');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          
          setTimeout(() => {
            el.classList.remove('js-hide');
            el.classList.add('is-visible');
          }, delay);
          
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    animatables.forEach(el => observer.observe(el));
  }
} catch (e) {
  console.warn("Scroll reveal IntersectionObserver failed:", e);
}

// ==========================================
// MAGNETIC BUTTON HOVER EFFECTS
// ==========================================
try {
  if (typeof gsap !== 'undefined') {
    const magneticItems = document.querySelectorAll('.btn, .roast-link, .nav-links a, #view-gallery-btn');
    magneticItems.forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const mX = e.clientX - (rect.left + rect.width / 2);
        const mY = e.clientY - (rect.top + rect.height / 2);
        
        gsap.to(item, {
          x: mX * 0.22,
          y: mY * 0.22,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.45)'
        });
      });
    });
  }
} catch (e) {
  console.warn("Magnetic button hovers failed:", e);
}

// ==========================================
// PRODUCT CAROUSEL MARQUEE
// ==========================================
(function () {
  const wrap = document.getElementById("productCarouselWrap");
  const track = document.getElementById("productCarouselTrack");
  if (!wrap || !track) return;

  const origCards = Array.from(track.querySelectorAll(".pcard"));
  origCards.forEach(c => {
    const clone = c.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  let activeCard = null;
  let resumeTimer = null;

  function pauseAt(card) {
    clearTimeout(resumeTimer);
    track.classList.add("is-paused");
    if (activeCard && activeCard !== card) {
      activeCard.classList.remove("pcard--active");
    }
    activeCard = card;
    card.classList.add("pcard--active");
  }

  function scheduleResume() {
    resumeTimer = setTimeout(() => {
      track.classList.remove("is-paused");
      if (activeCard) {
        activeCard.classList.remove("pcard--active");
        activeCard = null;
      }
    }, 120);
  }

  function attachCardListeners(card) {
    card.addEventListener("mouseenter", () => pauseAt(card));
    card.addEventListener("mouseleave", scheduleResume);
  }

  track.querySelectorAll(".pcard").forEach(attachCardListeners);
})();
