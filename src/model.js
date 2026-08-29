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
    // the api sends "" as well as null for a gig belonging to no series, so
    // everything downstream can just check whether there is one
    series: gig.series || null,
    // todo : use genres and informationTags separately
    informationTags,
    genreTags,
    mapSettings,
    mapVenues,
  };
};

// The map behind the act page, since an act has no location of its own: the
// venues it is playing at soon.
//
// Leaflet halves the span the map covers at every zoom step, and this one is
// roughly 800px of tiles wide, so this is the zoom whose visible span is about
// twice the spread of the pins - near enough to fitting them without teaching
// MapPositioner about bounds. One venue has no spread and lands on 15, the same
// close in view a gig page gets.
const zoomForSpread = (spread) =>
  spread > 0
    ? Math.min(15, Math.max(9, Math.floor(Math.log2(562 / spread))))
    : 15;

const createMapSettingsForVenues = (venues) => {
  const coordinates = venues
    .map((venue) => [Number(venue.latitude), Number(venue.longitude)])
    .filter(([latitude, longitude]) => latitude && longitude);
  if (coordinates.length === 0) {
    return null;
  }
  const latitudes = coordinates.map(([latitude]) => latitude);
  const longitudes = coordinates.map(([, longitude]) => longitude);
  const middle = (values) => (Math.min(...values) + Math.max(...values)) / 2;
  const span = (values) => Math.max(...values) - Math.min(...values);
  const mapCenter = [middle(latitudes), middle(longitudes)];
  // a degree of longitude is narrower than a degree of latitude this far south
  const spread = Math.max(
    span(latitudes),
    span(longitudes) * Math.cos((mapCenter[0] * Math.PI) / 180),
  );

  return { zoom: zoomForSpread(spread), mapCenter };
};

// An act as /acts/:id returns it: the act's own fields, plus the gigs it has
// coming up. Genres arrive as plain strings here rather than the gig endpoint's
// genre_tags, so they get tagged the same way to keep the two shapes alike.
export const actFromApiResponse = (act) => {
  if (!act) {
    return null;
  }
  const genreTags = createTagsFromStrings(act.genres || [], "genre");
  const upcomingGigs = act.upcoming_gigs || [];
  // a gig without a venue is not a map pin, and there is nothing else useful to
  // do with it - the list below still shows it
  const gigsByVenue = groupBy(
    upcomingGigs.filter((gig) => gig.venue),
    (gig) => gig.venue.id,
  );
  const mapVenues = uniqBy(
    upcomingGigs.map((gig) => gig.venue).filter(Boolean),
    "id",
  ).map((venue) => ({
    ...venue,
    // not selected, so clicking the pin filters the gig list down to this venue
    // rather than clearing the filter the way it does from a gig page
    selected: false,
    selectedGigCount: gigsByVenue[venue.id].length,
    showAsActive: true,
  }));

  return {
    ...act,
    genreTags,
    mapSettings: createMapSettingsForVenues(mapVenues),
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
