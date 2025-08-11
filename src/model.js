import {
  uniqBy,
  countBy,
  flatten,
  intersection,
  omit,
  flatMap,
  reverse,
  sortBy,
  groupBy,
} from "lodash-es";
import getConfig from "./config";
import { gigIsSaved } from "@/savedGigs";
import { DATE_RANGES } from "./timeStuff";

const createTag = (category, value) => {
  const normalizedValue = value.toLowerCase();
  return {
    category,
    caption: value,
    value: normalizedValue,
    id: `${category}:${normalizedValue}`,
  };
};

const createTagsFromStrings = (tagStrings, category) => {
  return tagStrings
    .filter((value) => value != null && value !== "")
    .map((value) => createTag(category, value));
};

// todo: Inline me
const sortFilterOptionsByCounts = (options) =>
  reverse(sortBy(options, "gigCount"));

const createMapSettings = (latitude, longitude) => {
  if (latitude && longitude) {
    return {
      zoom: 15,
      mapCenter: [latitude, longitude],
    };
  }
  return null;
};

export const gigFromApiResponse = (gig) => {
  if (!gig) {
    // todo: better fallback for when the gig is loading with some useful mapsettings perhaps?
    return null;
  }
  const informationTags = createTagsFromStrings(
    gig?.information_tags || [],
    "information",
  );
  const genreTags = createTagsFromStrings(gig?.genre_tags || [], "genre");
  // testing the icon configuration
  if (import.meta.env.MODE == "development") {
    const config = getConfig();
    if (config.shuffleSeriesAssignments) {
      const choice =
        gig.id.charCodeAt(0) % config.shuffleSeriesAssignments.length;
      gig.series = config.shuffleSeriesAssignments[choice];
    }
  }
  const mapVenues = gig.venue
    ? [
        {
          ...gig.venue,
          selected: true,
          selectedGigCount: 1,
          showAsActive: true,
        },
      ]
    : [];
  const mapSettings = gig.venue
    ? createMapSettings(gig.venue.latitude, gig.venue.longitude)
    : null;
  // todo: validate that gigs actually have venues before accessing venue details
  return {
    ...gig,
    // todo : use genres and informationTags separately
    informationTags,
    genreTags,
    mapSettings,
    mapVenues,
  };
};

const createLocationData = (locationId) => {
  const { allowSelectLocation, allLocations } = getConfig();

  const locations = allLocations
    .map((location) => {
      return { ...location, selected: location.id === locationId };
    })
    // selectable locations are all the locations available to pick, plus the one you picked if you found a secret location from our list like 'sydney'
    .filter(
      (location) =>
        (allowSelectLocation && location.selectable) || location.selected,
    );

  const mapSettings = locations.find((location) => location.selected);

  return { locations, mapSettings };
};

const processDateRanges = (dateRangeId, customDate) => {
  return Object.values(DATE_RANGES).map((range) => ({
    ...range,
    selected: range.id === dateRangeId,
    readonlyCaption:
      range.id === "customDate" && customDate ? customDate.format("L") : null,
  }));
};

const extractTagsWithCounts = (transformedGigs, category, tagField) => {
  const allTags = flatten(transformedGigs.map((gig) => gig[tagField] || []));
  const tagCounts = countBy(allTags, (tag) => tag.value.toLowerCase());

  return sortFilterOptionsByCounts(
    Object.entries(tagCounts).map(([tag, count]) => ({
      ...createTag(category, tag),
      gigCount: count,
    })),
  );
};

/**
 * Transforms raw gig data from API into structured format with counts and metadata
 * @param {RawGig[]} [rawGigs=[]] - Array of raw gig data from API
 * @param {string} requestKey - Identifier for the request
 * @returns {TransformedData} Transformed data with gigs, venues, and tags
 */
export const transformGigData = (rawGigs = [], requestKey) => {
  const transformedGigs = rawGigs.map(gigFromApiResponse);
  // Extract unique venues with gig counts

  // todo: having venues in returned feed here would help us and make feed smaller.

  const gigsByVenue = groupBy(transformedGigs, (gig) => gig.venue.id);

  const venues = sortFilterOptionsByCounts(
    uniqBy(
      transformedGigs.map((gig) => gig.venue),
      "id",
    ).map((venue) => {
      const mapSettings = createMapSettings(venue.latitude, venue.longitude);
      const gigs = gigsByVenue[venue.id] || [];
      return {
        ...venue,
        caption: venue.name,
        gigCount: gigs.length,
        hasSavedGigs: gigs.filter(gigIsSaved).length > 0,
        gigSeries: gigs.map((gig) => gig.series),
        ...(mapSettings && { mapSettings }),
      };
    }),
  );

  const genreTags = extractTagsWithCounts(
    transformedGigs,
    "genre",
    "genreTags",
  );
  const informationTags = extractTagsWithCounts(
    transformedGigs,
    "information",
    "informationTags",
  );

  return {
    gigs: transformedGigs,
    venues,
    genreTags,
    informationTags,
    requestKey,
  };
};

// todo: refactor to take in a field name not a function and use lodash-es funcs to manage this
const createFieldMatcher = (selectedValues, extractorFn) => {
  if (selectedValues.length === 0) {
    return () => true; // No filter applied, everything matches
  }

  const selectedSet = new Set(selectedValues);

  return (gig) => {
    const gigValues = extractorFn(gig);
    return gigValues.some((value) => selectedSet.has(value));
  };
};

const createFilterMatchers = (criteria) => {
  return {
    venue: createFieldMatcher(criteria.venueIds, (gig) => [gig.venue.id]),

    genre: createFieldMatcher(criteria.genreTags, (gig) =>
      gig.genreTags.map((tag) => tag.value.toLowerCase()),
    ),

    information: createFieldMatcher(criteria.informationTags, (gig) =>
      gig.informationTags.map((tag) => tag.value.toLowerCase()),
    ),
  };
};

const applyGigFilters = (gigs, criteria) => {
  const matchers = createFilterMatchers(criteria);

  return gigs.map((gig) => {
    const venueMatch = matchers.venue(gig);
    const genreMatch = matchers.genre(gig);
    const infoMatch = matchers.information(gig);

    return {
      ...gig,
      isVisible: venueMatch && genreMatch && infoMatch,
    };
  });
};

export const applyFilters = (transformedData, searchParams) => {
  const {
    gigs = [],
    venues = [],
    genreTags = [],
    informationTags = [],
  } = transformedData || {};

  const {
    venueIds: selectedVenueIds = [],
    genreTagIds: selectedGenreTags = [],
    informationTagIds: selectedInfoTags = [],
    locationId = null,
    dateRangeId = null,
    customDate = null,
  } = searchParams || {};

  // Filter selected values to only include those that exist in the data
  const validVenueIds = intersection(
    selectedVenueIds,
    venues.map((v) => v.id),
  );
  const validGenreTags = intersection(
    selectedGenreTags.map((tag) => tag.toLowerCase()),
    genreTags.map((tag) => tag.value),
  );
  const validInfoTags = intersection(
    selectedInfoTags.map((tag) => tag.toLowerCase()),
    informationTags.map((tag) => tag.value),
  );

  // Create filter criteria object
  const filterCriteria = {
    venueIds: validVenueIds,
    genreTags: validGenreTags,
    informationTags: validInfoTags,
  };

  // Process locations and map settings
  const { locations, mapSettings } = createLocationData(locationId);

  // Process date ranges
  const dateRanges = processDateRanges(dateRangeId, customDate);

  const updatedGigs = applyGigFilters(gigs, filterCriteria);

  const visibleGigs = updatedGigs.filter((gig) => gig.isVisible);

  const venueSelectedCounts = countBy(visibleGigs, (gig) => gig.venue.id);

  const visibleGenreTags = visibleGigs.flatMap((gig) =>
    gig.genreTags.map((tag) => tag.value.toLowerCase()),
  );
  const genreSelectedCounts = countBy(visibleGenreTags);

  const visibleInfoTags = visibleGigs.flatMap((gig) =>
    gig.informationTags.map((tag) => tag.value.toLowerCase()),
  );
  const infoSelectedCounts = countBy(visibleInfoTags);

  // Update venues with selected flag and selectedGigCount
  const updatedVenues = venues.map((venue) => ({
    ...venue,
    selected: filterCriteria.venueIds.includes(venue.id),
    selectedGigCount: venueSelectedCounts[venue.id] || 0,
  }));

  // Update genre tags with selected flag and selectedGigCount
  const updatedGenreTags = genreTags.map((tag) => ({
    ...tag,
    selected: filterCriteria.genreTags.includes(tag.value),
    selectedGigCount: genreSelectedCounts[tag.value] || 0,
  }));

  // Update information tags with selected flag and selectedGigCount
  const updatedInfoTags = informationTags.map((tag) => ({
    ...tag,
    selected: filterCriteria.informationTags.includes(tag.value),
    selectedGigCount: infoSelectedCounts[tag.value] || 0,
  }));

  const filters = {
    venues: updatedVenues,
    genreTags: updatedGenreTags,
    informationTags: updatedInfoTags,
    locations,
    dateRanges,
    customDate,
  };

  const mapVenues = updatedVenues.map((venue) => ({
    ...venue,
    showAsActive:
      venue.selectedGigCount > 0 || filterCriteria.venueIds.includes(venue.id),
  }));

  return {
    allGigs: updatedGigs,
    gigs: visibleGigs,
    filters,
    mapSettings,
    mapVenues,
  };
};

const FILTER_SUMMARY_SORT_ORDER = {
  locations: 1,
  venues: 2,
  dateRanges: 3,
};

export const toFilterSummary = (filteredData) => {
  const filterOptions = omit(filteredData, ["customDate"]);
  return sortBy(
    flatMap(Object.entries(filterOptions), ([filterType, options]) => {
      if (options) {
        let selected = options
          .filter((option) => option.selected)
          .map((option) => ({
            ...option,
            caption: option.readonlyCaption || option.caption,
            filterType,
            sortOrder: FILTER_SUMMARY_SORT_ORDER[filterType] || 100,
          }));
        return selected;
      }
      return [];
    }),
  );
};
