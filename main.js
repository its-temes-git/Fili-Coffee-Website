// -----------------------------
// GSAP SETUP
// -----------------------------
gsap.registerPlugin(ScrollTrigger, SplitText);

// -----------------------------
// LENIS SMOOTH SCROLL
// -----------------------------
const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// -----------------------------
// SECTION RELATIVE HELPER (FIXED)
// -----------------------------
function getPos(section, xPercent, yPercent) {
  const rect = section.getBoundingClientRect();
  const scrollY = window.scrollY || window.pageYOffset;

  return {
    x: rect.left + rect.width * xPercent - window.innerWidth / 2,
    y: rect.top + scrollY + rect.height * yPercent - window.innerHeight / 2
  };
}

// -----------------------------
// MAIN LOGIC
// -----------------------------
ScrollTrigger.matchMedia({
  "(min-width: 1025px)": function () {

    const headphone = document.querySelector("#headphone");

    const s2 = document.querySelector("#section2");
    const s3 = document.querySelector("#section3");
    const s4 = document.querySelector("#section4");
    const s5 = document.querySelector("#section5");

    // -------------------------
    // SECTION 2 → RIGHT SIDE
    // -------------------------
    gsap.to(headphone, {
      scrollTrigger: {
        trigger: s2,
        start: "top bottom",
        end: "center center",
        scrub: 1.2,
      },
      x: () => getPos(s2, 0.78, 0.35).x,
      y: () => getPos(s2, 0.78, 0.35).y,
      width: "32vw",
      rotate: 90,
      ease: "power1.inOut",
      immediateRender: false
    });

    // -------------------------
    // SECTION 3 → LOWER CENTER
    // -------------------------
    gsap.to(headphone, {
      scrollTrigger: {
        trigger: s3,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1.2,
      },
      x: () => getPos(s3, 0.5, 0.6).x,
      y: () => getPos(s3, 0.5, 0.6).y,
      width: "35vw",
      rotate: 35,
      ease: "power1.inOut",
      immediateRender: false
    });

    // -------------------------
    // SECTION 4 → CENTER BIG
    // -------------------------
    gsap.to(headphone, {
      scrollTrigger: {
        trigger: s4,
        start: "top bottom",
        end: "center center",
        scrub: 1.2,
      },
      x: () => getPos(s4, 0.5, 0.5).x,
      y: () => getPos(s4, 0.5, 0.5).y,
      width: "42vw",
      rotate: 0,
      ease: "power1.inOut",
      immediateRender: false
    });

    // -------------------------
    // SECTION 5 → PRODUCT SECTION
    // -------------------------
    gsap.to(headphone, {
      scrollTrigger: {
        trigger: s5,
        start: "center bottom",
        end: "bottom bottom",
        scrub: 1.2,
      },
      x: () => getPos(s5, 0.5, 0.43).x,
      y: () => getPos(s5, 0.5, 0.43).y,
      width: "300px",
      ease: "power1.inOut",
      immediateRender: false
    });

    // -------------------------
    // ENTRY ANIMATION
    // -------------------------
    gsap.from(headphone, {
      opacity: 0,
      scale: 0.6,
      duration: 1,
      ease: "power2.out"
    });

    // -------------------------
    // TEXT ANIMATIONS
    // -------------------------
    gsap.from("#section2 .content-wrapper", {
      scrollTrigger: {
        trigger: "#section2",
        start: "-50% bottom",
        end: "center center",
        scrub: true,
      },
      y: "140%",
      ease: "power1.inOut"
    });

    gsap.from("#section3 .heading", {
      scrollTrigger: {
        trigger: "#section3",
        start: "top bottom",
        end: "center bottom",
        scrub: true,
      },
      y: "140%",
      ease: "power1.inOut"
    });

    gsap.from("#section4 img", {
      scrollTrigger: {
        trigger: "#section4",
        start: "top bottom",
        end: "center center",
        scrub: true,
      },
      width: 0,
      opacity: 0,
      ease: "power1.inOut"
    });

    gsap.from("#section6 .content-wrapper", {
      scrollTrigger: {
        trigger: "#section6",
        start: "top bottom",
        end: "center bottom",
        scrub: true,
      },
      y: "40%",
      duration: 2,
      ease: "power1.inOut"
    });

    // -------------------------
    // TEXT SPLIT ANIMATION
    // -------------------------
    let split = SplitText.create("#section1 .heading", {
      type: "chars, words, lines",
      mask: "lines"
    });

    gsap.from(split.chars, {
      yPercent: () => gsap.utils.random(-100, 100),
      rotation: () => gsap.utils.random(-30, 30),
      autoAlpha: 0,
      ease: "back.out(1.5)",
      stagger: {
        amount: 0.5,
        from: "random"
      },
      duration: 1.5
    });

    // -------------------------
    // FIX RESIZE + LENIS SYNC
    // -------------------------
    ScrollTrigger.addEventListener("refresh", () => {
      lenis.update();
    });

    ScrollTrigger.refresh();
  }
});