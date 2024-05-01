export const saveGig = (gig) => {
  if (!gig) return;

  const savedGigs = JSON.parse(localStorage.getItem("savedGigs")) || [];
  const updatedSavedGigs = [...savedGigs, gig];
  localStorage.setItem("savedGigs", JSON.stringify(updatedSavedGigs));
};

export const unsaveGig = (gig) => {
  if (!gig) return;

  const savedGigs = JSON.parse(localStorage.getItem("savedGigs")) || [];
  const updatedSavedGigs = savedGigs.filter(
    (savedGig) => savedGig.id !== gig.id,
  );
  localStorage.setItem("savedGigs", JSON.stringify(updatedSavedGigs));
};

export const gigIsSaved = (gig) => {
  if (!gig) return;

  const savedGigs = JSON.parse(localStorage.getItem("savedGigs")) || [];
  return savedGigs.some((savedGig) => savedGig.id === gig.id);
};

export const getSavedGigIds = () => {
  return JSON.parse(localStorage.getItem("savedGigs")) || [];
};
