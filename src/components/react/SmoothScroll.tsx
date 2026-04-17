import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAV_OFFSET = 80;

function scrollToHash(lenis: Lenis, hash: string) {
  if (!hash || hash === "#") return false;
  const el = document.querySelector(hash);
  if (!el) return false;
  lenis.scrollTo(el as HTMLElement, {
    offset: -NAV_OFFSET,
    duration: 1.4,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
  });
  return true;
}

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis();
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;
      const isSamePageHash =
        href.startsWith("#") ||
        (href.startsWith("/") && href.includes("#") &&
          new URL(href, window.location.origin).pathname === window.location.pathname);
      if (!isSamePageHash) return;
      const hash = href.includes("#") ? "#" + href.split("#")[1] : "";
      if (!hash) return;
      if (scrollToHash(lenis, hash)) {
        e.preventDefault();
        history.pushState(null, "", hash);
      }
    };

    document.addEventListener("click", onClick);

    if (window.location.hash) {
      requestAnimationFrame(() => {
        setTimeout(() => scrollToHash(lenis, window.location.hash), 100);
      });
    }

    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
