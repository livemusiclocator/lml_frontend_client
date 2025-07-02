import { useState, useRef } from "react";
import tw from "tailwind-styled-components";
import dayjs from "dayjs";
import {
  useGigFilterOptions,
  useActiveGigFilterOptions,
} from "../hooks/filters";
import { Form, useSubmit } from "react-router";

const FilterContainer = tw.div`
  w-full
  min-width-sm
  border
  border-gray-200
  rounded
  shadow
  transition-[max-height]
  flex
  flex-col
  ${(p) => (p.$expanded ? "" : "max-h-12")}
  bg-white
  overflow-none
`;

const DateInput = tw.input`
peer
  items-center
  disabled:hidden
  rounded-full
  text-sm
  font-medium
  text-gray-700
  cursor-pointer
mx-2
invalid:ring-2
invalid:ring-red-500
invalid:ring-offset-2
  focus:outline-none
  focus:ring-2
  focus:ring-offset-2
  focus:ring-indigo-500
`;

const Badge = tw.div`
inline-flex
justify-center
min-w-min
py-1
text-xs
text-nowrap
font-medium
cursor-pointer
rounded-full
text-gray-700
bg-gray-200
transition-colors
${(p) =>
  p.$selected ? "bg-indigo-200 text-indigo-700" : "bg-gray-200 text-gray-700"}
has-checked:bg-indigo-200
has-checked:text-indigo-700
has-checked:hover:bg-indigo-300
`;

const BadgeControl = ({
  value,
  groupName,
  inputType,
  defaultChecked,
  children,
  className,
  onChange,
  onClick,
}) => {
  return (
    <Badge
      htmlFor={`toggle-${value}`}
      className={`${className} relative overflow-hidden`}
      $as="label"
      onClick={onClick}
    >
      <input
        type={inputType}
        className="absolute h-4 w-4 -left-4 -top-4 "
        defaultChecked={defaultChecked}
        name={groupName}
        value={value}
        id={`toggle-${value}`}
        onChange={onChange}
      />
      {children}
    </Badge>
  );
};

const FilterToggleButton = tw.button`
bg-gray-800
hover:bg-gray-900
text-white
font-medium p-1
rounded
text-xs
`;

const GigFiltersSummary = ({ showFilterForm }) => {
  const filters = useActiveGigFilterOptions();
  return (
    <div className="flex flex-wrap" style={{ maxHeight: "24px" }}>
      {filters.map(({ id, caption, count }) => {
        let description = caption;
        if (count) {
          description = `${caption} (${count})`;
        }
        return (
          <Badge
            className="text-xs"
            $selected={true}
            onClick={() => showFilterForm()}
            key={id}
          >
            <span className="px-4 text-nowrap">{description}</span>
          </Badge>
        );
      })}
    </div>
  );
};

const GigFiltersForm = () => {
  const { dateRanges, tagCategories, customDate, allVenues, allLocations } =
    useGigFilterOptions();
  const selectedLocation = allLocations.find((location) => location.selected);
  const submit = useSubmit();

  const customDateInput = useRef();
  const onDateRangeSelected = (e) => {
    if (!customDateInput.current) {
      return;
    }
    const id = e.target.value;
    if (id == "customDate") {
      customDateInput.current.disabled = false;
      customDateInput.current.focus();
    } else {
      customDateInput.current.disabled = true;
    }
  };

  return (
    <>
      <div
        className="mb-2 px-4 min bg-white overflow-scroll flex-1 min-h-0"
        style={{ maxHeight: "50vh" }}
      >
        <h2 className="font-semibold text-sm text-center">Filters</h2>
        <Form
          method="get"
          onChange={(event) => {
            if (event.currentTarget.checkValidity()) {
              submit(event.currentTarget);
            }
          }}
        >
          <div className="flex flex-col ">
            {allLocations && allLocations.length > 0 && (
              <>
                <h3 className="text-sm font-medium">Where</h3>
                <div className="flex flex-row items-baseline  flex-wrap justify-start gap-1">
                  <select
                    name="location"
                    defaultValue={selectedLocation?.id}
                    className="text-xs p-1 text-center rounded-full transition-colors bg-indigo-200 text-indigo-700 hover:bg-indigo-300 font-medium "
                  >
                    {allLocations.map(({ caption, id }) => {
                      return (
                        <option value={id} key={`gig-filter-location${id}`}>
                          {caption}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </>
            )}

            <h3 className="text-sm font-medium">When</h3>
            <div className="flex flex-row items-baseline flex-wrap justify-start gap-1">
              {Object.values(dateRanges).map(
                ({ id, caption, selected, ui }) => (
                  <BadgeControl
                    key={id}
                    groupName="dateRange"
                    inputType="radio"
                    value={id}
                    defaultChecked={selected}
                    onChange={onDateRangeSelected}
                    caption={caption}
                  >
                    {ui == "datetime" && (
                      <DateInput
                        type="date"
                        key={id}
                        ref={customDateInput}
                        required={true}
                        className="peer datetime"
                        id="customDate"
                        disabled={!selected}
                        name="customDate"
                        onFocus={(e) => {
                          e.target.showPicker();
                        }}
                        defaultValue={
                          (customDate || dayjs())?.format("YYYY-MM-DD") || ""
                        }
                      />
                    )}
                    {/**  todo: this better.  */}
                    <span className="px-4 text-nowrap peer-[.datetime]:hidden peer-[.datetime]:peer-disabled:inline">
                      {caption}
                    </span>
                  </BadgeControl>
                ),
              )}
            </div>
            {tagCategories.map(({ id, caption, values }) => (
              <>
                <h3 key={id} className="text-sm font-medium">
                  {caption}
                </h3>
                <div
                  key={`div-${id}`}
                  className="flex flex-row items-baseline  flex-wrap justify-start gap-1"
                >
                  {values.map(({ value, id, selected, count }) => {
                    return (
                      <BadgeControl
                        key={id}
                        value={id}
                        defaultChecked={selected}
                        groupName="tags"
                        inputType="checkbox"
                      >
                        <span className="px-4 text-nowrap">
                          {value} ({count})
                        </span>
                      </BadgeControl>
                    );
                  })}
                </div>
              </>
            ))}

            {allVenues && allVenues.length > 0 && (
              <>
                <h3 className="text-sm font-medium">Venues</h3>
                <div className="flex flex-row items-baseline  flex-wrap justify-start gap-1">
                  {allVenues.map(({ name, id, selected, count }) => {
                    return (
                      <BadgeControl
                        key={id}
                        value={id}
                        defaultChecked={selected}
                        groupName="venues"
                        inputType="checkbox"
                      >
                        <span className="px-4 text-nowrap">
                          {name} ({count})
                        </span>
                      </BadgeControl>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </Form>
      </div>
    </>
  );
};

const GigFilters = () => {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <FilterContainer $expanded={showFilters}>
      {showFilters && <GigFiltersForm />}
      <div className="flex justify-between items-start p-1">
        <div style={{ overflow: "hidden" }}>
          {!showFilters && (
            <GigFiltersSummary showFilterForm={() => setShowFilters(true)} />
          )}
        </div>
        <FilterToggleButton
          onClick={() => setShowFilters(!showFilters)}
          style={{ marginLeft: "1rem" }}
        >
          {showFilters ? "close" : "filters"}
        </FilterToggleButton>
      </div>
    </FilterContainer>
  );
};

export default GigFilters;
