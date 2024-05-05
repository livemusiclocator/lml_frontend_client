import { useState } from "react";
import { gigIsSaved, saveGig, unsaveGig } from "../savedGigs";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
const SaveGigButton = ({ gig }) => {
  const [gigSaved, setGigSaved] = useState(gigIsSaved(gig));

  const toggleGigSaved = (e) => {
    e.preventDefault();
    if (gigSaved) {
      unsaveGig(gig);
      setGigSaved(false);
    } else {
      saveGig(gig);
      setGigSaved(true);
    }
  };
  const buttonTitle = gigSaved ? "Remove from favourites" : "Add to favourites";
  return (
    <button
      onClick={toggleGigSaved}
      className="text-yellow-300"
      title={buttonTitle}
    >
      {gigSaved ? (
        <StarIconSolid className="size-6" />
      ) : (
        <StarIconOutline className="size-6" />
      )}
    </button>
  );
};

export default SaveGigButton;
