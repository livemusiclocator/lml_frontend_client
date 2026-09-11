import { Link, useNavigationType } from "react-router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

/**
 * Back to wherever you came from, or to the gig list if you arrived here cold -
 * a shared link, or rails serving /acts/:id directly.
 */
const BackLink = ({ className = "" }) => {
  const navigationType = useNavigationType();
  const target = navigationType === "PUSH" ? -1 : ".";

  return (
    <Link
      to={target}
      aria-label="Back"
      className={`flex size-11 items-center justify-center rounded-full ${className}`}
    >
      <ChevronLeftIcon className="size-5" />
    </Link>
  );
};

export default BackLink;
