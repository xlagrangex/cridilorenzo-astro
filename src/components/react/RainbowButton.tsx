interface RainbowButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

const rainbowGradient = "linear-gradient(90deg, #2a9d8f, #0d4f46, #5cead8, #134e44, #3bbfad, #0a3d36, #2a9d8f)";

export default function RainbowButton({ children, href, className = "" }: RainbowButtonProps) {
  // Approccio: il wrapper HA il padding di 3px.
  // Lo sfondo del wrapper è composto da:
  // - Il bordo statico scuro
  // - Il rainbow sopra con mask (solo parte bassa)
  // L'inner è il vero bottone scuro.

  const wrapperClasses = `
    group relative inline-flex cursor-pointer
    rounded-[15px] p-[5px] bg-[#15141a]
    transition-transform duration-200
    overflow-visible
    ${className}
  `.trim();

  const content = (
    <>
      {/* Rainbow overlay sul wrapper, mascherato — solo parte bassa che sfuma in alto */}
      <span
        className="absolute inset-0 rounded-[15px] pointer-events-none z-[1]"
        style={{
          background: rainbowGradient,
          backgroundSize: "200% 100%",
          animation: "rainbow-flow 4s linear infinite",
          maskImage: "linear-gradient(to top, black 0%, transparent 35%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 35%)",
        }}
      />

      {/* Inner: il vero bottone scuro */}
      <span className="relative z-[2] flex h-12 items-center gap-2 rounded-[10px] bg-[#15141a] px-6 py-3 text-base font-semibold text-white">
        {children}
      </span>

      {/* Glow rainbow sotto */}
      <span
        className="absolute -bottom-3 left-2 right-2 z-0 h-5 opacity-50 pointer-events-none"
        style={{
          background: rainbowGradient,
          backgroundSize: "200% 100%",
          animation: "rainbow-flow 4s linear infinite",
          filter: "blur(12px)",
        }}
      />
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={wrapperClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={wrapperClasses}>
      {content}
    </button>
  );
}
