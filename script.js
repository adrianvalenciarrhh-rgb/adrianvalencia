document.addEventListener("DOMContentLoaded", () => {

    // 1. SCROLL SUAVE (Lenis) — solo desktop
    const isMobile = window.innerWidth < 768 ||
        window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (typeof Lenis !== "undefined" && !isMobile) {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: "vertical",
            smooth: true,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 2. CURSOR (Solo Desktop)
    const cursor = document.getElementById("cursor");
    const hoverElements = document.querySelectorAll("a, button, .hover-trigger");

    if (!isMobile && cursor) {
        document.addEventListener("mousemove", (e) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        });

        hoverElements.forEach((el) => {
            el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
            el.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
        });
    } else if (isMobile) {
        document.body.style.cursor = "auto";
    }

    // 3. ACORDEONES (con aria-expanded; la entrada marcada .open arranca abierta)
    const accordions = document.querySelectorAll(".accordion-trigger");

    function panelOf(trigger) {
        const id = trigger.getAttribute("aria-controls");
        return (id && document.getElementById(id)) || trigger.nextElementSibling;
    }
    function setState(trigger, open) {
        const panel = panelOf(trigger);
        if (!panel) return;
        panel.classList.toggle("open", open);
        trigger.setAttribute("aria-expanded", open ? "true" : "false");
    }

    accordions.forEach((acc) => {
        const panel = panelOf(acc);
        setState(acc, !!(panel && panel.classList.contains("open")));

        acc.addEventListener("click", (ev) => {
            ev.preventDefault();
            const isOpen = panelOf(acc).classList.contains("open");
            // solo cierra las entradas de la MISMA sección (01 / 02 / 03 son independientes)
            const scope = acc.closest("section") || document;
            scope.querySelectorAll(".accordion-trigger").forEach((t) => { if (t !== acc) setState(t, false); });
            setState(acc, !isOpen);
        });
    });

    // 4. NAV SCROLL
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("nav-scrolled");
        } else {
            navbar.classList.remove("nav-scrolled");
        }
    });

    // 5. RELOJ (hora local del visitante)
    function updateTime() {
        const now = new Date();
        const timeEl = document.getElementById("time");
        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        }
    }
    setInterval(updateTime, 1000);
    updateTime();

    // 6. GUIONADO ES (soft hyphens en tiempo de ejecución para el texto justificado).
    //    Muchos navegadores no traen diccionario de guionado para "es", así que
    //    hyphens:auto no hace nada y el justificado abre huecos. El HTML no se toca:
    //    solo se insertan U+00AD en el DOM, en límites de sílaba del español.
    (function hyphenateES() {
        const SHY = "\u00AD";
        const V = "aeiouáéíóúüAEIOUÁÉÍÓÚÜ";
        const INSEP = ["pr","br","tr","dr","cr","gr","fr","pl","bl","cl","gl","fl","ch","ll","rr","kr","kl"];
        const SKIP = new Set(["engineering","prompt","skills","weloveurban","collaborator","content","music"]);
        const isV = (c, next) => V.includes(c) || (c === "y" && !(next && V.includes(next)));
        function syllabify(w) {
            const n = w.length, cuts = [];
            let i = 0;
            // localizar núcleos vocálicos (grupos de vocales seguidas = un núcleo; nunca se cortan)
            const nuclei = [];
            while (i < n) {
                if (isV(w[i], w[i + 1])) { const s = i; while (i < n && isV(w[i], w[i + 1])) i++; nuclei.push([s, i]); }
                else i++;
            }
            for (let k = 0; k < nuclei.length - 1; k++) {
                const a = nuclei[k][1], b = nuclei[k + 1][0];   // consonantes entre núcleos: w[a..b)
                const cons = w.slice(a, b).toLowerCase(), m = cons.length;
                let cut;
                if (m <= 1) cut = a;                                       // V-CV
                else if (m === 2) cut = INSEP.includes(cons) ? a : a + 1;   // VC-CV / V-CCV
                else cut = INSEP.includes(cons.slice(-2)) ? b - 2 : b - 1;  // VCC-CV / VC-CCV
                cuts.push(cut);
            }
            return cuts;
        }
        function hyph(word) {
            if (word.length < 7 || /[A-ZÁÉÍÓÚÑ]/.test(word.slice(1)) || SKIP.has(word.toLowerCase())) return word;
            const cuts = syllabify(word).filter((c) => c >= 3 && word.length - c >= 3);
            if (!cuts.length) return word;
            let out = "", last = 0;
            cuts.forEach((c) => { out += word.slice(last, c) + SHY; last = c; });
            return out + word.slice(last);
        }
        const WORD = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g;
        document.querySelectorAll(".entry-copy, .hero-bio").forEach((el) => {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
            nodes.forEach((t) => { t.nodeValue = t.nodeValue.replace(WORD, hyph); });
        });
    })();
});
