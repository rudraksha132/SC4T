// ========================================
// PASSWORD PROTECTION
// ========================================
const KEY = [109, 48, 109, 48];

const lock = document.getElementById('lock');
const pass = document.getElementById('pass');
const content = document.getElementById('content');

function verify(input) {
    if (input.length !== KEY.length) return false;
    let valid = true;
    for (let i = 0; i < KEY.length; i++) {
        if (input.charCodeAt(i) !== KEY[i]) valid = false;
    }
    return valid;
}

pass.addEventListener('input', () => {
    if (pass.value.length < 4) return;

    if (verify(pass.value)) {
        lock.classList.add('unlocked');
        content.classList.add('visible');
        if (navigator.vibrate) navigator.vibrate(30);
        initSite();
    } else {
        pass.classList.add('error');
        pass.value = '';
        if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
        setTimeout(() => pass.classList.remove('error'), 300);
    }
});

// ========================================
// MAIN SITE INITIALIZATION
// ========================================
function initSite() {
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const images = document.querySelectorAll('.images img');
    const burst = document.querySelectorAll('.burst img');
    const titleHeadings = document.querySelectorAll('.title');
    const splitTextMap = new Map();

    document.fonts.ready.then(() => {
        titleHeadings.forEach((heading) => {
            const split = new SplitText(heading, { type: "words" });
            split.words.forEach((word) => word.classList.add("word"));
            splitTextMap.set(heading, split);
        });
        animate();
    });

    function animate() {
        const totalImages = images.length;
        const mainImage = images[0];
        const iframe = document.querySelector("iframe");
        const isMobile = window.innerWidth <= 768;
        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;
        const scatterMultiplier = isMobile ? 2.5 : 0.5;
        const marqueeTrack = document.querySelector('.marquee-track');
        const scatterDirections = [
            { x: 1.3, y: 0.7 }, { x: -1.5, y: 1.0 }, { x: 1.1, y: -1.3 },
            { x: -1.7, y: -0.8 }, { x: 0.8, y: 1.5 }, { x: -1.0, y: -1.4 },
            { x: 1.6, y: 0.3 }, { x: -0.7, y: 1.7 }, { x: 1.2, y: -1.6 },
            { x: -1.4, y: 0.9 }, { x: 1.8, y: -0.5 }, { x: -1.1, y: -1.8 },
            { x: 0.9, y: 1.8 }, { x: -1.9, y: 0.4 }, { x: 1.0, y: -1.9 },
            { x: -0.8, y: 1.9 }, { x: 1.7, y: -1.0 }, { x: -1.3, y: -1.2 },
            { x: 0.7, y: 2.0 }, { x: 1.25, y: -0.2 }
        ];
        const startPositions = Array.from(burst).map(() => ({ x: 0, y: 0, z: -1000, scale: 0 }));
        const endPositions = scatterDirections.map((dir) => ({
            x: dir.x * screenWidth * scatterMultiplier,
            y: dir.y * screenHeight * scatterMultiplier,
            z: 2000,
            scale: 1
        }));
        const bgColors = [
            "#111111", "#0f0f0fff", "#000000ff", "#0b0f12ff",
            "#110b0eff", "#151511ff", "#0b0f0cff", "#0c0a0cff", "#111111"
        ];

        burst.forEach((img, i) => gsap.set(img, startPositions[i]));
        
        gsap.set(marqueeTrack, { 
            opacity: 1,
            yPercent: 100
        });

        gsap.to(marqueeTrack, {
            xPercent: -50,
            ease: "none",
            duration: 25,
            repeat: -1
        });

        images.forEach((img, i) => {
            gsap.set(img, {
                opacity: 0,
                scale: 0,
                clipPath: "inset(0% 0% 0% 0%)",
                zIndex: totalImages - i
            });
        });

        // ========================================
        // INTRO TIMELINE
        // ========================================
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".intro",
                start: "top top",
                end: `+=${window.innerHeight * 8}px`,
                pin: true,
                pinSpacing: true,
                scrub: 1
            }
        });

        tl.to(mainImage, { scale: 1, opacity: 1, ease: "power3.out", duration: 2 });
        tl.to(images, { scale: 1, opacity: 1, duration: 0 });
        tl.to(mainImage, { duration: 0.5 });
        tl.addLabel("startReveal");
        tl.to(marqueeTrack, { yPercent: 0, ease: "power4.out", duration: 2}, "startReveal");
        tl.to(images, { scale: 0.95, ease: "power1.inOut", duration: 0.6 }, "startReveal");
        tl.to(iframe, { y: "0%", filter: "blur(0px)", borderRadius: "12px", ease: "power1.inOut", duration: 1.25 }, "startReveal");
        tl.to(iframe, { width: isMobile ? "90vw" : "40vw", ease: CustomEase.create("spring", "M0,0 L0.000,0.000 L0.005,0.007 L0.010,0.029 L0.015,0.062 L0.020,0.104 L0.025,0.155 L0.030,0.213 L0.035,0.275 L0.040,0.340 L0.045,0.408 L0.050,0.476 L0.055,0.544 L0.060,0.610 L0.065,0.675 L0.070,0.737 L0.075,0.795 L0.080,0.849 L0.085,0.900 L0.090,0.946 L0.095,0.987 L0.100,1.023 L0.105,1.055 L0.110,1.083 L0.115,1.106 L0.120,1.124 L0.125,1.139 L0.130,1.150 L0.135,1.157 L0.140,1.162 L0.145,1.163 L0.150,1.162 L0.155,1.158 L0.160,1.153 L0.165,1.146 L0.170,1.138 L0.175,1.129 L0.180,1.118 L0.185,1.108 L0.190,1.097 L0.195,1.086 L0.200,1.075 L0.205,1.064 L0.210,1.053 L0.215,1.043 L0.220,1.034 L0.225,1.025 L0.230,1.017 L0.235,1.009 L0.240,1.002 L0.245,0.996 L0.250,0.991 L0.255,0.987 L0.260,0.983 L0.265,0.980 L0.270,0.977 L0.275,0.976 L0.280,0.974 L0.285,0.974 L0.290,0.973 L0.295,0.974 L0.300,0.974 L0.305,0.975 L0.310,0.976 L0.315,0.977 L0.320,0.979 L0.325,0.981 L0.330,0.982 L0.335,0.984 L0.340,0.986 L0.345,0.988 L0.350,0.990 L0.355,0.991 L0.360,0.993 L0.365,0.994 L0.370,0.996 L0.375,0.997 L0.380,0.999 L0.385,1.000 L0.390,1.001 L0.395,1.001 L0.400,1.002 L0.405,1.003 L0.410,1.003 L0.415,1.004 L0.420,1.004 L0.425,1.004 L0.430,1.004 L0.435,1.004 L0.440,1.004 L0.445,1.004 L0.450,1.004 L0.455,1.004 L0.460,1.004 L0.465,1.003 L0.470,1.003 L0.475,1.003 L0.480,1.003 L0.485,1.002 L0.490,1.002 L0.495,1.002 L0.500,1.001 L0.505,1.001 L0.510,1.001 L0.515,1.001 L0.520,1.000 L0.525,1.000 L0.530,1.000 L0.535,1.000 L0.540,1.000 L0.545,1.000 L0.550,1.000 L0.555,0.999 L0.560,0.999 L0.565,0.999 L0.570,0.999 L0.575,0.999 L0.580,0.999 L0.585,0.999 L0.590,0.999 L0.595,0.999 L0.600,0.999 L0.605,0.999 L0.610,0.999 L0.615,0.999 L0.620,1.000 L0.625,1.000 L0.630,1.000 L0.635,1.000 L0.640,1.000 L0.645,1.000 L0.650,1.000 L0.655,1.000 L0.660,1.000 L0.665,1.000 L0.670,1.000 L0.675,1.000 L0.680,1.000 L0.685,1.000 L0.690,1.000 L0.695,1.000 L0.700,1.000 L0.705,1.000 L0.710,1.000 L0.715,1.000 L0.720,1.000 L0.725,1.000 L0.730,1.000 L0.735,1.000 L0.740,1.000 L0.745,1.000 L0.750,1.000 L0.755,1.000 L0.760,1.000 L0.765,1.000 L0.770,1.000 L0.775,1.000 L0.780,1.000 L0.785,1.000 L0.790,1.000 L0.795,1.000 L0.800,1.000 L0.805,1.000 L0.810,1.000 L0.815,1.000 L0.820,1.000 L0.825,1.000 L0.830,1.000 L0.835,1.000 L0.840,1.000 L0.845,1.000 L0.850,1.000 L0.855,1.000 L0.860,1.000 L0.865,1.000 L0.870,1.000 L0.875,1.000 L0.880,1.000 L0.885,1.000 L0.890,1.000 L0.895,1.000 L0.900,1.000 L0.905,1.000 L0.910,1.000 L0.915,1.000 L0.920,1.000 L0.925,1.000 L0.930,1.000 L0.935,1.000 L0.940,1.000 L0.945,1.000 L0.950,1.000 L0.955,1.000 L0.960,1.000 L0.965,1.000 L0.970,1.000 L0.975,1.000 L0.980,1.000 L0.985,1.000 L0.990,1.000 L0.995,1.000 L1.000,1.000"), duration: 1.85 }, "startReveal+=0.75");

        for (let i = 0; i < totalImages - 1; i++) {
            tl.to(images[i], {
                clipPath: "inset(0% 0% 100% 0%)",
                ease: "none",
                duration: 0.75,
                onComplete: () => { if (navigator.vibrate) navigator.vibrate(20); },
                onReverseComplete: () => { if (navigator.vibrate) navigator.vibrate(20); }
            }, `startReveal+=${i * 1}`);

            tl.to("body", {
                "--fg": bgColors[i + 1],
                ease: "none",
                duration: 1,
                onUpdate: () => {
                    const meta = document.querySelector('meta[name="theme-color"]');
                    if (meta) meta.setAttribute('content', getComputedStyle(document.body).getPropertyValue('--fg'));
                }
            }, `startReveal+=${i * 1}`);
        }

        tl.to(mainImage, { duration: 0.4 });

        tl.to({}, {
            duration: 6,
            onUpdate: function() {
                const progress = this.progress();
                burst.forEach((img, i) => {
                    const staggerDelay = i * 0.03;
                    const scaleMultiplier = isMobile ? 4 : 2;
                    const imageProgress = Math.max(0, (progress - staggerDelay) * 4);
                    const start = startPositions[i];
                    const end = endPositions[i];
                    gsap.set(img, {
                        scale: gsap.utils.interpolate(start.scale, end.scale, imageProgress * scaleMultiplier),
                        x: gsap.utils.interpolate(start.x, end.x, imageProgress),
                        y: gsap.utils.interpolate(start.y, end.y, imageProgress),
                        z: gsap.utils.interpolate(start.z, end.z, imageProgress)
                    });
                });
            }
        });

        // ========================================
        // ENTRY IMAGES
        // ========================================
        const leftImage = document.querySelector('.pfp-left');
        const rightImage = document.querySelector('.pfp-right');
        const combinedImage = document.querySelector('.pfp-combined');
        const entryText = document.querySelector('.entry-text h1');
        const entryGlow = document.querySelector('.entry-glow');
        const universe = document.querySelector('.universe');
        const part1 = document.querySelector('.part_1 h1');
        const part2 = document.querySelector('.part_2 h1');
        const startOffset = isMobile ? screenWidth * 0.8 : screenWidth * 0.6;

        gsap.set(leftImage, { x: -startOffset, filter: "blur(8px)", opacity: 0.4, boxShadow: "0 0 0 0 rgba(255,248,231,0)" });
        gsap.set(rightImage, { x: startOffset, filter: "blur(8px)", opacity: 0.4, boxShadow: "0 0 0 0 rgba(255,248,231,0)" });
        gsap.set(combinedImage, { opacity: 0 });
        gsap.set(entryGlow, { opacity: 0, height: "0%" });

        const entryTl = gsap.timeline({
            scrollTrigger: { trigger: ".sub", start: "top top", end: "+=200%", pin: true, scrub: 1, once: 0 }
        });

        entryTl.to(leftImage, { x: -80, duration: 1.5, ease: "power2.out" }, "enter");
        entryTl.to(rightImage, { x: 80, duration: 1.5, ease: "power2.out" }, "enter");
        entryTl.to(leftImage, { x: -55, boxShadow: "8px 0 20px -4px rgba(255,248,231,0.25)", duration: 1, ease: "power2.inOut" }, "approach");
        entryTl.to(rightImage, { x: 55, boxShadow: "-8px 0 20px -4px rgba(255,248,231,0.25)", duration: 1, ease: "power2.inOut" }, "approach");
        entryTl.to(leftImage, { x: -52, opacity: 1, filter: "blur(4px)", boxShadow: "12px 0 30px -4px rgba(255,248,231,0.4)", duration: 0.8, ease: "power2.inOut" }, "glow");
        entryTl.to(rightImage, { x: 52, opacity: 1, filter: "blur(4px)", boxShadow: "-12px 0 30px -4px rgba(255,248,231,0.4)", duration: 0.8, ease: "power2.inOut" }, "glow");
        entryTl.to(entryGlow, { opacity: 0.5, height: "80px", duration: 0.8, ease: "power2.out" }, "glow");
        entryTl.to(leftImage, { x: -50, boxShadow: "0 0 40px 8px rgba(255,248,231,0.5)", duration: 0.4, ease: "power3.in" }, "join");
        entryTl.to(rightImage, { x: 50, boxShadow: "0 0 40px 8px rgba(255,248,231,0.5)", duration: 0.4, ease: "power3.in" }, "join");
        entryTl.to(entryGlow, { opacity: 0.8, filter: "blur(12px)", duration: 0.2, ease: "power2.out" }, "join+=0.35");
        entryTl.to(combinedImage, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1, ease: "power2.out" }, "join+=0.4");
        entryTl.to([leftImage, rightImage], { opacity: 0, duration: 0.1, ease: "none" }, "join+=0.4");
        entryTl.add(() => { if (navigator.vibrate) navigator.vibrate(20); }, "join+=0.4");
        entryTl.to({}, { duration: 0.5 });
        entryTl.to(entryText, { opacity: 1, filter: "blur(0px)", duration: 2, ease: "power2.out" }, "textIn+=0.5");
        entryTl.to(entryGlow, { opacity: 0, duration: 0.8, ease: "power2.out" }, "fade");
        entryTl.to({}, { duration: 3 });
        entryTl.to(combinedImage, { opacity: 0, filter: "blur(8px)", duration: 2, ease: "power2.inOut" }, "exit");
        entryTl.to(entryText, { opacity: 0, filter: "blur(8px)", duration: 2, ease: "power2.inOut" }, "exit");
        entryTl.to({}, { duration: 0.75 });
        entryTl.to(universe, { opacity: 1, filter: "blur(0px)", scale: 1, duration: 2, ease: "power2.out" }); 
        entryTl.add(() => { if (navigator.vibrate) navigator.vibrate(20); });
        entryTl.to({}, { duration: 1 });
        entryTl.to(part1, { opacity: 1, filter: "blur(0px)", duration: 2, ease: "power2.out" });
        entryTl.to(part2, { opacity: 1, filter: "blur(0px)", duration: 2, ease: "power2.out" });
        entryTl.to({}, { duration: 1 });

        // ========================================
        // DOLL ANIMATION 
        // ========================================
        const dollContainer = document.querySelector('.doll-container');
        const doll1 = document.querySelector('.doll-1');
        const doll2 = document.querySelector('.doll-2');

        let dollFrameLoop = null;

        gsap.set(dollContainer, { y: "110%" });
        gsap.set(doll1, { opacity: 1 });
        gsap.set(doll2, { opacity: 0 });

        function startDollAnimation() {
            let showFirst = true;

            dollFrameLoop = setInterval(() => {
                if (showFirst) {
                    gsap.set(doll1, { opacity: 0 });
                    gsap.set(doll2, { opacity: 1 });
                } else {
                    gsap.set(doll1, { opacity: 1 });
                    gsap.set(doll2, { opacity: 0 });
                }
                showFirst = !showFirst;
            }, 750);
        }

        function stopDollAnimation() {
            if (dollFrameLoop) {
                clearInterval(dollFrameLoop);
                dollFrameLoop = null;
            }
            gsap.set(doll1, { opacity: 1 });
            gsap.set(doll2, { opacity: 0 });
        }

        ScrollTrigger.create({
            trigger: ".spotlight",
            start: "top 80%",
            end: "bottom 80%",
            onEnter: () => {
                gsap.to(dollContainer, {
                    y: "-30%",
                    filter: "blur(0px)",
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete: startDollAnimation
                });
            },
            onLeave: () => {
                stopDollAnimation();
                gsap.to(dollContainer, {
                    y: "100%",
                    filter: "blur(5px)",
                    duration: 0.5,
                    ease: "power2.in"
                });
            },
            onEnterBack: () => {
                gsap.to(dollContainer, {
                    y: "-30%",
                    filter: "blur(0px)",
                    duration: 0.6,
                    ease: "power2.out",
                    onComplete: startDollAnimation
                });
            },
            onLeaveBack: () => {
                stopDollAnimation();
                gsap.to(dollContainer, {
                    y: "100%",
                    filter: "blur(5px)",
                    duration: 0.5,
                    ease: "power2.in"
                });
            }
        });

        // ========================================
        // ENDING
        // ========================================

        ScrollTrigger.create({
            trigger: ".outro",
            start: "99% bottom",
            onEnter: () => {
                gsap.to(iframe, {
                    y: "90%",
                    filter: "blur(8px)",
                    duration: 0.75,
                    ease: "power2.out"
                });
            },
            onLeave: () => {
                gsap.to(iframe, {
                    y: "0%",
                    filter: "blur(0px)",
                    duration: 0.75,
                    ease: "power2.out"
                });
            },
            onEnterBack: () => {
                gsap.to(iframe, {
                    y: "90%",
                    filter: "blur(8px)",
                    duration: 0.75,
                    ease: "power2.out"
                });
            },
            onLeaveBack: () => {
                gsap.to(iframe, {
                    y: "0%",
                    filter: "blur(0px)",
                    duration: 0.75,
                    ease: "power2.out"
                });
            }
        });

        ScrollTrigger.create({
            trigger: ".outro",
            start: "99.9% bottom",
            onEnter: () => {
                download();
            },
            once: true
        });

        function download() {
            const fileUrl = "https://raw.githubusercontent.com/rudraksha132/srcmed/refs/heads/main/media/SF1.mp4";
            fetch(fileUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = "forever.mp4";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            });
        }
    }
}
