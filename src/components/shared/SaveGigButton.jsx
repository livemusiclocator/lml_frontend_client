import { useState } from "react";
import { gigIsSaved, saveGig, unsaveGig } from "@/savedGigs";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
// className/iconClassName default to what the legacy layout has always used, so
// the new layout can size and colour the star without forking the component
const SaveGigButton = ({
  gig,
  className = "text-yellow-300",
  iconClassName = "size-6",
}) => {
  const [gigSaved, setGigSaved] = useState(gigIsSaved(gig));

  const toggleGigSaved = (e) => {
    e.stopPropagation();
    if (gigSaved) {
      unsaveGig(gig);
      setGigSaved(false);
    } else {
      saveGig(gig);
      setGigSaved(true);
    }
    return false;
  };
  const buttonTitle = gigSaved ? "Remove from favourites" : "Add to favourites";
  return (
    <button onClick={toggleGigSaved} className={className} title={buttonTitle}>
      {gigSaved ? (
        <StarIconSolid className={iconClassName} />
      ) : (
        <StarIconOutline className={iconClassName} />
      )}
    </button>
  );
};

export default SaveGigButton;
