import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { useState } from "react";

function Carousel({ photos }) {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setActive((i) => (i + 1) % photos.length);

  return (
    <div className="flex gap-4">
      {/* Thumbnails — columna izquierda */}
      {photos.length > 1 && (
        <div className="flex flex-col gap-2.5">
          {photos.map((ph, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`
                w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0
                transition-all duration-200 cursor-pointer
                ${
                  i === active
                    ? "border-gold shadow-[0_0_0_2px_rgba(194,161,90,0.3)]"
                    : "border-border hover:border-bronze"
                }
              `}>
              <img src={ph} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Imagen principal */}
      <div className="relative flex-1 rounded-2xl overflow-hidden bg-ivory-dark aspect-[4/3]">
        <img
          key={active}
          src={photos[active]}
          alt="Foto de la pieza"
          className="w-full h-full object-cover animate-[fadeIn_0.3s_ease]"
        />

        {/* Controles prev / next */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm
                flex items-center justify-center
                text-dark border border-border
                hover:bg-white transition-all duration-200
                shadow-md cursor-pointer
              ">
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm
                flex items-center justify-center
                text-dark border border-border
                hover:bg-white transition-all duration-200
                shadow-md cursor-pointer
              ">
              <FiChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`
                    rounded-full transition-all duration-200 cursor-pointer border-none
                    ${
                      i === active
                        ? "w-5 h-2 bg-gold"
                        : "w-2 h-2 bg-white/60 hover:bg-white/90"
                    }
                  `}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default Carousel;
