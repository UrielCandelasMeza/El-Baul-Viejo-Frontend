import { FiCheck, FiX } from "react-icons/fi";

function StatusBadge({ status }) {
  const available = status === "available";
  return (
    <span
      className={`
      inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full
      ${
        available
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-red-50 text-red-700 border border-red-200"
      }
    `}>
      {available ? <FiCheck size={12} /> : <FiX size={12} />}
      {available ? "Disponible" : "Vendido"}
    </span>
  );
}

export default StatusBadge;
