import { useState, useEffect } from "react";

const navLinks = [
  { label: "Chi sono", href: "#chi-sono" },
  { label: "Servizi", href: "#servizi" },
  { label: "Come funziona", href: "#come-funziona" },
  { label: "Strumenti", href: "#strumenti" },
  { label: "FAQ", href: "#faq" },
  { label: "Contatti", href: "#contact" },
];

const calendarUrl = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0hE4rG_WwpeS2ck-0o1mnjaoGD6FtqZjcZZgwkNXOB7dSspKlguUEIV4RFzX8DBvZz3v8NjktC";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="relative z-[200] flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
        aria-label={open ? "Chiudi menu" : "Apri menu"}
      >
        <span
          className={`block h-[2px] w-6 bg-[#15141a] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "translate-y-[5.5px] rotate-45 !bg-white" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-6 bg-[#15141a] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "-translate-y-[5.5px] -rotate-45 !bg-white" : ""
          }`}
        />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[150] bg-[#17253f]/90 backdrop-blur-xl transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-[160] flex h-full w-full max-w-md flex-col justify-center gap-6 bg-[#17253f] px-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setOpen(false)}
            className="text-3xl font-medium tracking-tight text-white transition-opacity duration-300 hover:opacity-60"
          >
            {link.label}
          </a>
        ))}
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="mt-4 inline-flex items-center justify-center rounded-[15px] bg-[#2a9d8f] px-6 py-4 text-base font-semibold text-white transition-colors duration-300 hover:bg-[#238b7f]"
        >
          Prenota un colloquio gratuito
        </a>
      </div>
    </>
  );
}
