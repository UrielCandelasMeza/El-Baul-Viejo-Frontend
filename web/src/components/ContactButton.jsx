function ContactButton({ href, icon, label, colorClass }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-2
        border-2 ${colorClass} rounded-lg px-5 py-2.5
        text-sm font-semibold font-sans
        transition-all duration-200
        hover:shadow-md
      `}>
      {icon}
      {label}
    </a>
  );
}
export default ContactButton;
