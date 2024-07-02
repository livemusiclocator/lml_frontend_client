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

/**  gigsy stuff */
export const gigFromApiResponse = ({ information_tags, genre_tags, ...gig }) => {
  let tags = [];
  information_tags.forEach(
    (value) => {
      const tag = value.toLowerCase();
      tags.push({ category: "information", value: tag, id: `information:${tag}`});
    }
  );
  genre_tags.forEach(
    (value) => {
      const tag = value.toLowerCase();
      tags.push({ category: "genre", value: tag, id: `genre:${tag}` });
    }
  );
  const allTags = groupBy(tags, "category");
  return {
    ...gig,
    tags: tags,
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
