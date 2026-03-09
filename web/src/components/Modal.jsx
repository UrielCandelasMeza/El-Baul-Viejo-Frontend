import { useEffect } from "react";
import { MdErrorOutline, MdInfoOutline, MdClose } from "react-icons/md";

/**
 * Modal de notificación tipo toast (esquina inferior derecha).
 *
 * Props:
 *  - type: "error" | "message"
 *  - message: string con el texto a mostrar
 *  - onClose: función para cerrar el modal
 *  - duration: ms antes de cerrarse automáticamente (default 4000, 0 = sin auto-cierre)
 */
function Modal({ type = "message", message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message || duration === 0) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const styles = {
    error: {
      border: "border-l-4 border-l-[#8C3A3A]",
      icon: <MdErrorOutline className="w-5 h-5 text-[#8C3A3A] shrink-0" size={20} />,
      label: "Error",
      labelColor: "text-[#8C3A3A]",
    },
    message: {
      border: "border-l-4 border-l-[#C2A15A]",
      icon: <MdInfoOutline className="w-5 h-5 text-[#C2A15A] shrink-0" size={20} />,
      label: "Mensaje",
      labelColor: "text-[#C2A15A]",
    },
  };

  const current = styles[type] ?? styles.message;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        fixed bottom-6 right-6 z-50 flex items-start gap-3
        bg-[#FDFAF4] shadow-lg rounded-md px-4 py-3 max-w-sm w-full
        ${current.border}
        animate-fade-up
      `}
    >
      {/* Icono */}
      <div className="mt-0.5">{current.icon}</div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${current.labelColor}`} style={{ fontFamily: "'Playfair Display', serif" }}>
          {current.label}
        </p>
        <p className="text-sm text-[#3E2F23] leading-snug break-words" style={{ fontFamily: "'Open Sans', sans-serif" }}>
          {message}
        </p>
      </div>

      {/* Botón cerrar */}
      <button
        onClick={onClose}
        aria-label="Cerrar notificación"
        className="text-[#7A6A5A] hover:text-[#3E2F23] transition-colors cursor-pointer mt-0.5 shrink-0"
      >
        <MdClose size={18} />
      </button>
    </div>
  );
}

export default Modal;

