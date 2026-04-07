import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "A cosa serve il counseling?",
    answer: "Serve a capire meglio se stessi, affrontare momenti di confusione o blocco, migliorare le relazioni, gestire stress, paure e cambiamenti, e ritrovare una direzione più chiara nella propria vita."
  },
  {
    question: "Perché lavorare sull'interpretazione dei sogni?",
    answer: "I sogni sono un modo attraverso cui il nostro mondo interiore comunica con noi. Aiutano a comprendere emozioni profonde, schemi che si ripetono e risorse nascoste, favorendo una maggiore consapevolezza."
  },
  {
    question: "Come si svolgono gli incontri?",
    answer: "Gli incontri sono colloqui individuali di 45 minuti, basati sull'ascolto, il dialogo e l'esplorazione delle emozioni. Non servono preparazioni particolari: si parte da ciò che stai vivendo in quel momento."
  },
  {
    question: "Gli incontri sono online o in presenza?",
    answer: "Attualmente gli incontri si svolgono online in videochiamata, così puoi partecipare da qualsiasi luogo in cui ti trovi."
  },
  {
    question: "Quanto dura un percorso di counseling?",
    answer: "Non esiste una durata uguale per tutti. Dipende dagli obiettivi e dal momento di vita della persona. Il percorso si costruisce insieme, passo dopo passo."
  },
  {
    question: "Posso interrompere quando voglio?",
    answer: "Sì. Sei libero di interrompere in qualsiasi momento, senza obbligo di motivazione."
  },
  {
    question: "Quanto costa un incontro?",
    answer: "Il primo colloquio conoscitivo è gratuito. Gli incontri successivi hanno un costo di 70 euro."
  },
  {
    question: "Il counselor è tenuto al segreto professionale?",
    answer: "Sì. Gli incontri si svolgono nel pieno rispetto della riservatezza e del codice etico professionale."
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      {faqs.map((faq, i) => (
        <div key={i} className="border-b border-[#43495480]">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between py-5 text-left"
          >
            <h3 className="pr-4 text-lg font-medium text-[#15141a] m-0">
              {faq.question}
            </h3>
            <div className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center">
              {/* Plus / Minus */}
              <span className="absolute h-[2px] w-4 bg-[#15141a] transition-transform duration-300" />
              <span
                className={`absolute h-[2px] w-4 bg-[#15141a] transition-transform duration-300 ${
                  openIndex === i ? "rotate-0" : "rotate-90"
                }`}
              />
            </div>
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: openIndex === i ? "300px" : "0px",
              opacity: openIndex === i ? 1 : 0,
            }}
          >
            <p className="pb-5 text-base leading-[160%] text-[#3e3e3e]">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
