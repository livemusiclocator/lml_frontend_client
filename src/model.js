import {
  sortBy,
  uniqBy,
  flatMap,
  map,
  filter,
  includes,
  countBy,
} from "lodash-es";

const TAG_CATEGORIES = {
  INFORMATION: "information",
  GENRE: "genre",
};

/* Tag utilities */

const createTag = (category, value) => {
  const normalizedValue = value.toLowerCase();
  return {
    category,
    value: normalizedValue,
    id: `${category}:${normalizedValue}`,
  };
};

const createTagsFromStrings = (tagStrings, category) => {
  return tagStrings.map((value) => createTag(category, value));
};

export const matchesTags = (tags, targetTags) => {
  return tags.some(({ id }) => targetTags.includes(id));
};

/* Gig transformations */

export const gigFromApiResponse = ({
  information_tags = [],
  genre_tags = [],
  ...gig
}) => {
  const informationTags = createTagsFromStrings(
    information_tags,
    TAG_CATEGORIES.INFORMATION,
  );
  const genreTags = createTagsFromStrings(genre_tags, TAG_CATEGORIES.GENRE);

  const allTags = [...informationTags, ...genreTags];

  return {
    ...gig,
    tags: allTags,
    genres: genreTags,
    infoTags: informationTags,
  };
};

/* Page transformations */

export const pageFromApiResponse = (raw, { dates, location }) => {
  const gigs = raw.map(gigFromApiResponse);

  return {
    gigs: sortBy(gigs, "start_timestamp"),
    filters: {
      date: dates[0],
      dates,
      location,
    },
  };
};

const validateFilters = (filters, allValues) => {
  const allTagIds = map(allValues ?? [], "id");
  return filter(filters ?? [], (tag) => includes(allTagIds, tag));
};

export const filterGigsByTags = (gigs, allTags, tagFilters) => {
  const validTagFilters = validateFilters(tagFilters, allTags);

  if (validTagFilters.length === 0) {
    return gigs;
  }

  return gigs.filter((gig) => matchesTags(gig.tags, validTagFilters));
};

export const filterGigsByVenues = (gigs, allVenues, venueIds) => {
  const validVenueIds = validateFilters(venueIds, allVenues);
  if (validVenueIds.length === 0) {
    return gigs;
  }
  return gigs.filter((gig) => validVenueIds.includes(gig.venue.id));
};

/* Aggregation utilities */

const aggregateItemsById = (items, transform) => {
  // Count occurrences of each ID
  const countsByIds = countBy(items, "id");

  // Get unique items by ID and add count
  const uniqueItems = uniqBy(items, "id");

  return uniqueItems.map((item) => ({
    ...transform(item),
    count: countsByIds[item.id],
  }));
};

export const allTagsForPage = (gigPage) => {
  const allTags = flatMap(gigPage.gigs, "tags");

  return aggregateItemsById(allTags, (tag) => ({
    count: 1,
    ...tag,
  }));
};

export const allVenuesForPage = (gigPage) => {
  const allVenues = map(gigPage.gigs, "venue");

  return aggregateItemsById(allVenues, (venue) => ({
    count: 1,
    caption: venue.name,
    ...venue,
  }));
};

export const allTagsForPages = (gigPages) => {
  const allTags = flatMap(flatMap(gigPages, "gigs"), "tags");

  return aggregateItemsById(allTags, (tag) => ({
    count: 1,
    ...tag,
  }));
};

export const allVenuesForPages = (gigPages) => {
  const allVenues = map(flatMap(gigPages, "gigs"), "venue");

  return aggregateItemsById(allVenues, (venue) => ({
    count: 1,
    caption: venue.name,
    ...venue,
  }));
};
