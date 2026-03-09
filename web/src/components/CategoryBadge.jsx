function CategoryBadge({ name }) {
  return (
    <span
      className="
      border border-bronze text-bronze text-xs font-medium
      px-3 py-1 rounded-full
      transition-all duration-200
      hover:bg-bronze hover:text-white cursor-default
    ">
      {name}
    </span>
  );
}

export default CategoryBadge;
