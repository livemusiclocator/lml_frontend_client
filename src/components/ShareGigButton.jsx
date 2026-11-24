import { useEffect, useRef, useState } from "react";
import { CheckIcon, LinkIcon } from "@heroicons/react/24/outline";

// Copies the gig's lml.live short link - the api gives each gig one - falling
// back to the page's own address for a gig that somehow came without it.
const ShareGigButton = ({ gig, className = "", iconClassName = "size-6" }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);

  const copyLink = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(
        gig.short_url ?? window.location.href,
      );
    } catch {
      return; // no clipboard (an insecure page, or permission refused): nothing to say
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  const label = copied ? "Link copied" : "Copy link to this gig";
  return (
    <button
      type="button"
      onClick={copyLink}
      className={className}
      title={label}
      aria-label={label}
    >
      {copied ? (
        <CheckIcon className={iconClassName} />
      ) : (
        <LinkIcon className={iconClassName} />
      )}
      <span role="status" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
    </button>
  );
};

export default ShareGigButton;
