import dayjs from "dayjs";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useGigSearchResults } from "@/hooks/api";
import { useGigFilterControls } from "@/hooks/useGigFilterControls";
import Chip from "@/components/new/Chip";

const Section = ({ title, children }) => (
  <section className="flex flex-col gap-2.5">
    <h3 className="text-micro font-semibold tracking-[0.12em] text-ink-muted uppercase">
      {title}
    </h3>
    <div className="flex flex-wrap gap-2">{children}</div>
  </section>
);

const TagSection = ({ title, filterType, options, onToggle }) => {
  if (!options || options.length === 0) {
    return null;
  }
  return (
    <Section title={title}>
      {options.map(({ id, value, caption, gigCount, selected }) => (
        <Chip
          key={id}
          variant={selected ? "active" : "neutral"}
          onClick={() => onToggle(filterType, value)}
          aria-pressed={selected}
        >
          {caption} <span className="opacity-60">{gigCount}</span>
        </Chip>
      ))}
    </Section>
  );
};

/**
 * Everything you can filter by, on one surface. The legacy layout hides all of
 * this behind a "filters" button that collapses to a 48px strip; here it is a
 * full sheet you close when you are done.
 */
const FilterDrawer = ({ onClose }) => {
  const { data, dataLoaded } = useGigSearchResults();
  const controls = useGigFilterControls();

  const filters = data?.filters;
  const gigCount = data?.gigs?.length ?? 0;

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-night">
      <header className="flex items-center justify-between gap-3 border-b border-night-line px-4 py-3">
        <h2 className="text-lead font-bold -tracking-[0.015em]">Filters</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={controls.clearAll}
            className="px-2 py-1 text-mini font-semibold text-ink-muted hover:text-ink"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="-mr-2 flex size-11 items-center justify-center text-ink"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>
      </header>

      <div className="flex grow flex-col gap-6 overflow-y-auto p-4">
        {!dataLoaded && (
          <p className="text-meta text-ink-muted">Loading filters…</p>
        )}

        {filters && (
          <>
            {filters.locations?.length > 1 && (
              <Section title="Where">
                {filters.locations.map(({ id, caption, selected }) => (
                  <Chip
                    key={id}
                    variant={selected ? "active" : "neutral"}
                    onClick={() => controls.setLocation(id)}
                    aria-pressed={selected}
                  >
                    {caption}
                  </Chip>
                ))}
              </Section>
            )}

            <Section title="When">
              {filters.dateRanges?.map(({ id, caption, selected, ui }) => (
                <Chip
                  key={id}
                  variant={selected ? "active" : "neutral"}
                  onClick={() =>
                    controls.setDateRange(
                      id,
                      ui === "datetime"
                        ? (filters.customDate || dayjs()).format("YYYY-MM-DD")
                        : null,
                    )
                  }
                  aria-pressed={selected}
                >
                  {caption}
                </Chip>
              ))}
              {filters.dateRanges?.some(
                (range) => range.selected && range.ui === "datetime",
              ) && (
                <input
                  type="date"
                  aria-label="Choose a date"
                  className="h-8 rounded-full bg-night-chip px-3 text-mini font-medium text-ink-chip"
                  value={(filters.customDate || dayjs()).format("YYYY-MM-DD")}
                  onChange={(event) =>
                    controls.setDateRange("customDate", event.target.value)
                  }
                />
              )}
            </Section>

            <TagSection
              title="Genres"
              filterType="genreTags"
              options={filters.genreTags}
              onToggle={controls.toggle}
            />
            <TagSection
              title="Information"
              filterType="informationTags"
              options={filters.informationTags}
              onToggle={controls.toggle}
            />
            <TagSection
              title="Venues"
              filterType="venues"
              // venues carry a name rather than a caption-and-value pair
              options={filters.venues?.map((venue) => ({
                ...venue,
                value: venue.id,
                caption: venue.name,
              }))}
              onToggle={controls.toggle}
            />
          </>
        )}
      </div>

      <footer className="border-t border-night-line p-4">
        <button
          type="button"
          onClick={onClose}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-lmlpink text-item font-bold text-white"
        >
          Show {gigCount} {gigCount === 1 ? "gig" : "gigs"}
        </button>
      </footer>
    </div>
  );
};

export default FilterDrawer;
