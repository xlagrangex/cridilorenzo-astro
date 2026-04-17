import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

/**
 * Text highlight on scroll — le parole si "accendono"
 * progressivamente mentre l'utente scrolla.
 */
export function textHighlightOnScroll(
  selector: string,
  options?: {
    color?: string;
    dimColor?: string;
    split?: "words" | "chars";
  }
) {
  const elements = document.querySelectorAll<HTMLElement>(selector);

  elements.forEach((el) => {
    const split = new SplitType(el, {
      types: options?.split ?? "words",
    });

    const targets = options?.split === "chars" ? split.chars : split.words;
    if (!targets) return;

    gsap.set(targets, { color: options?.dimColor ?? "#333333" });

    gsap.to(targets, {
      color: options?.color ?? "#ffffff",
      stagger: 0.05,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "top 20%",
        scrub: true,
      },
    });
  });
}

/**
 * Fade-in dal basso con scroll
 */
export function fadeInUp(selector: string) {
  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    // Reset esplicito prima di animare (fix View Transitions)
    gsap.set(el, { y: 60, opacity: 0 });

    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

/**
 * Stagger entrance — una serie di elementi entra uno dopo l'altro
 */
export function staggerIn(
  selector: string,
  options?: { stagger?: number; trigger?: string; y?: number }
) {
  const elements = gsap.utils.toArray<HTMLElement>(selector);
  if (elements.length === 0) return;
  gsap.set(elements, { y: options?.y ?? 40, opacity: 0 });
  gsap.to(elements, {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: "power3.out",
    stagger: options?.stagger ?? 0.12,
    scrollTrigger: {
      trigger: options?.trigger ?? elements[0],
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });
}

/**
 * Disegna un path SVG progressivamente man mano che l'utente scrolla
 */
export function drawPathOnScroll(
  selector: string,
  options?: { trigger?: string; start?: string; end?: string }
) {
  const paths = document.querySelectorAll<SVGPathElement>(selector);
  paths.forEach((path) => {
    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: options?.trigger ?? path,
        start: options?.start ?? "top 75%",
        end: options?.end ?? "bottom 40%",
        scrub: 0.5,
      },
    });
  });
}

/**
 * Parallax su elemento
 */
export function parallax(selector: string, speed: number = 0.5) {
  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    gsap.to(el, {
      y: () => -speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
