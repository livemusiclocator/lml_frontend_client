import {
  Bars3Icon,
  MapIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useGigSearchResults, useCurrentGigFilterSummary } from "@/hooks/api";
import {
  useGigFilterControls,
  PARAM_FOR_FILTER_TYPE,
} from "@/hooks/useGigFilterControls";
import Chip from "@/components/new/Chip";

const ViewButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-mini font-semibold ${
      active ? "bg-ink text-night" : "text-ink-muted"
    }`}
  >
    <Icon className="size-3.5" />
    {label}
  </button>
);

// venues are identified by id in the query string, tags by their value
const paramValueFor = (item) =>
  item.filterType === "venues" ? item.id : item.value;

/**
 * The header over the map: where you are, list or map, and the filters that are
 * on. The chips are the whole point - the legacy layout keeps all of this behind
 * a button, so you cannot see what you have filtered to without opening it.
 */
const Chrome = ({ view, onViewChange, onOpenFilters }) => {
  const { data } = useGigSearchResults();
  const { data: summary } = useCurrentGigFilterSummary();
  const controls = useGigFilterControls();

  const locations = data?.filters?.locations ?? [];
  const selectedLocation = locations.find((location) => location.selected);
  const selectedDateRange = data?.filters?.dateRanges?.find(
    (range) => range.selected,
  );
  const activeFilters = (summary ?? []).filter(
    (item) => PARAM_FOR_FILTER_TYPE[item.filterType],
  );

  return (
    <div className="relative z-30 flex flex-col gap-2.5 border-b border-night-line bg-night-raised/95 px-4 pt-4 pb-3 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        {locations.length > 1 ? (
          <div className="relative flex items-center">
            <select
              aria-label="Choose a location"
              value={selectedLocation?.id ?? ""}
              onChange={(event) => controls.setLocation(event.target.value)}
              className="appearance-none bg-transparent pr-5 text-lead font-bold -tracking-[0.015em] text-ink focus:outline-none"
            >
              {locations.map(({ id, caption }) => (
                <option key={id} value={id}>
                  {caption}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-0 size-4 text-ink-muted" />
          </div>
        ) : (
          <h1 className="text-lead font-bold -tracking-[0.015em]">
            {selectedLocation?.caption ?? "Gigs"}
          </h1>
        )}

        <div
          role="group"
          aria-label="List or map"
          className="flex items-center gap-0.5 rounded-full bg-night-chip p-[3px]"
        >
          <ViewButton
            active={view === "list"}
            onClick={() => onViewChange("list")}
            icon={Bars3Icon}
            label="List"
          />
          <ViewButton
            active={view === "map"}
            onClick={() => onViewChange("map")}
            icon={MapIcon}
            label="Map"
          />
        </div>
      </div>

      <div className="chip-scroller flex items-center gap-2 overflow-x-auto">
        <Chip variant="active" onClick={onOpenFilters}>
          {selectedDateRange?.readonlyCaption ??
            selectedDateRange?.caption ??
            "This Week"}
          <ChevronDownIcon className="size-3" />
        </Chip>

        {activeFilters.map((item) => (
          <Chip
            key={item.id}
            variant="accent"
            onClick={() =>
              controls.remove(item.filterType, paramValueFor(item))
            }
            aria-label={`Remove filter ${item.caption}`}
          >
            {item.caption}
            <XMarkIcon className="size-3" />
          </Chip>
        ))}

        <Chip variant="outline" onClick={onOpenFilters}>
          <AdjustmentsHorizontalIcon className="size-3.5" />
          All
        </Chip>
      </div>
    </div>
  );
};

export default Chrome;
