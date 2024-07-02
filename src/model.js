import {
  sortBy,
  groupBy,
  uniqBy,
  flatMap,
  map,
  filter,
  includes,
} from "lodash-es";

/* tagsy stuff */
export const matchesTags = (tags, targetTags) => {
  return tags.filter(({ id }) => targetTags.includes(id)).length > 0;
};

export const parseTags = (rawValues) => {
  return rawValues?.map((str) => {
    const parts = str.split(/:\s*/);

    if (parts.length === 2) {
      const category = parts[0].trim();
      const value = parts[1].trim();
      return {
        category: parts[0].trim(),
        value: parts[1].trim(),
        id: [category, value].join(":"),
      };
    } else {
      return {
        category: "general",
        value: str.trim(),
        id: ["general", str.trim()].join(":"),
      };
    }
  });
};

/**  gigsy stuff */
export const gigFromApiResponse = ({ tags, ...gig }) => {
  const tagsParsed = parseTags(tags);
  const allTags = groupBy(tagsParsed, "category");
  return {
    ...gig,
    tags: tagsParsed,
    genres: allTags["genre"],
    infoTags: allTags["information"],
  };
};

/** pagey stuff*/
export const pageFromApiResponse = (raw, { date, location }) => {
  const gigs = raw.map(gigFromApiResponse);

  return {
    gigs: sortBy(gigs, "start_timestamp"),
    filters: { date, location },
  };
};

const filterPageByTags = ({ gigs, ...page }, tags) => {
  return { ...page, gigs: gigs.filter((gig) => matchesTags(gig.tags, tags)) };
};
export const filterPagesByTags = (gigPages, allTags, tagFilters) => {
  const allTagIds = map(allTags, "id");
  const validTagFilters = filter(tagFilters, (tag) => includes(allTagIds, tag));
  if (validTagFilters.length > 0) {
    return gigPages?.map((page) => filterPageByTags(page, validTagFilters));
  }
  return gigPages;
};

export const allTagsForPages = (gigPages) => {
  const tags = flatMap(flatMap(gigPages, "gigs"), "tags");
  return tags.reduce((accum, val) => {
    const dupeIndex = accum.findIndex((arrayItem) => arrayItem.id === val.id);

    if (dupeIndex === -1) {
      // Not found, so initialize.
      accum.push({
        count: 1,
        ...val,
      });
    } else {
      // Found, so increment counter.
      accum[dupeIndex].count++;
    }
    return accum;
  }, []);
};
