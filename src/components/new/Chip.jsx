// The one pill shape the new layout uses - filter chips, tags, badges. Kept in
// one place so a chip in the header and a chip on a gig page cannot drift apart.

const BASE =
  "inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-mini transition-colors";

const VARIANTS = {
  // a filter that is on
  active: "bg-lmlpink text-white font-semibold",
  // an accent-tinted chip that is not itself a control: genres, counts
  accent:
    "bg-lmlpink/15 border border-lmlpink/35 text-lmlpink-light font-semibold",
  // a filter that is off, or a plain informational tag
  neutral: "bg-night-chip text-ink-chip font-medium hover:bg-night-line",
  // a control that opens something else
  outline:
    "border border-night-line text-ink-muted font-semibold hover:text-ink",
};

const Chip = ({ variant = "neutral", className = "", children, ...props }) => {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;

  // a chip with a click handler is a button; without one it is just a label
  if (props.onClick || props.type) {
    return (
      <button type="button" className={`${classes} cursor-pointer`} {...props}>
        {children}
      </button>
    );
  }
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Chip;
