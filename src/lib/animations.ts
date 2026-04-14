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
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
  );

  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    if (!el.classList.contains("is-visible")) {
      observer.observe(el);
    }
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
