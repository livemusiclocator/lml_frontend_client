import { useReducer, useState, useEffect } from "react";
import styled from "tailwind-styled-components";
import DateTimeDisplay from "../components/DateTimeDisplay";
import dayjs from "dayjs";
import { useGigFilterOptions, useActiveGigFilters } from "../hooks/api";

/**
 * WARNING
 *
 * This is a giant hot mess presently - it's partially generated and partly hacked to make it work
 * The UI is really nothing special  - and I am sure it is rendering 100 times more often than is polite.
 *
 * */
const FilterContainer = styled.div`
  w-full
  p-4
  border
  rounded
  shadow
  mb-4
`;

const FilterTag = styled.span`
  inline-flex
  items-center
  px-3
  py-1
  bg-gray-200
  rounded-full
  text-sm
  font-medium
  text-gray-700
  mr-2
  mb-2
  cursor-pointer
  hover:bg-gray-300
  focus:outline-none
  focus:ring-2
  focus:ring-offset-2
  focus:ring-indigo-500
`;

const SelectedTag = styled(FilterTag)`
  bg-indigo-200
  text-indigo-700
  hover:bg-indigo-300
`;

const FilterForm = styled.div`
  w-full
  mt-2
`;

const DateTimeInput = styled.input`
  inline-flex
  items-center
  px-3
  py-1
  bg-gray-200
  rounded-full
  text-sm
  font-medium
  text-gray-700
  mr-2
  mb-2
  cursor-pointer
  focus:outline-none
  focus:ring-2
  focus:ring-offset-2
  focus:ring-indigo-500
`;

function filterReducer(state, action) {
  console.log({ state, action });
  switch (action.type) {
    case "selectTag":
      return {
        ...state,
        tags: [
          ...state.tags.filter(
            (tag) =>
              tag.category !== action.payload.category ||
              tag.value !== action.payload.value,
          ),
          action.payload,
        ],
      };

    case "deselectTag":
      return {
        ...state,
        tags: state.tags.filter(
          (tag) =>
            tag.category !== action.payload.category ||
            tag.value !== action.payload.value,
        ),
      };

    case "setCustomDate":
      return {
        ...state,
        customDate: action.payload,
        dateRange: null, // Clear dateRange
      };

    case "setDateRange":
      return {
        ...state,
        dateRange: action.payload,
        customDate: null, // Clear customDate
      };

    default:
      return state;
  }
}
const GigsFilter = () => {
  const { dateRanges, tags = [] } = useGigFilterOptions();

  const [activeFilters, setActiveFilters] = useActiveGigFilters();
  const [currentFilterState, updateFilterStateNope] = useReducer(
    filterReducer,
    activeFilters,
  );

  const {
    tags: selectedTags,
    customDate,
    dateRange: selectedDateRange,
  } = activeFilters;

  const updateFilterState = (action) => {
    // shhhhhh
    setActiveFilters(filterReducer(activeFilters, action));
  };

  const [showFilters, setShowFilters] = useState(false);
  const selectTag = ({ category, value }) => {
    updateFilterState({ type: "selectTag", payload: { category, value } });
  };

  const deselectTag = ({ category, value }) => {
    updateFilterState({ type: "deselectTag", payload: { category, value } });
  };
  const setDateRange = (dateRange) => {
    updateFilterState({ type: "setDateRange", payload: dateRange });
  };

  const setCustomDate = (customDate) => {
    updateFilterState({ type: "setCustomDate", payload: customDate });
  };

  const toggleShowFilters = () => setShowFilters(!showFilters);

  return (
    <FilterContainer>
      {!showFilters && (
        <div>
          {dateRanges[selectedDateRange] && (
            <SelectedTag>{dateRanges[selectedDateRange].caption}</SelectedTag>
          )}
          {customDate && (
            <SelectedTag>
              <DateTimeDisplay value={customDate} type="numericDate" />
              <span
                aria-hidden="true"
                className="ml-2"
                onClick={() => setCustomDate(null)}
              >
                ×
              </span>
            </SelectedTag>
          )}
          {selectedTags.map(({ category, value }) => (
            <SelectedTag
              key={[category, value]}
              onClick={() => deselectTag({ category, value })}
            >
              {value}
              <span aria-hidden="true" className="ml-2">
                ×
              </span>
            </SelectedTag>
          ))}
        </div>
      )}
      {showFilters && (
        <FilterForm>
          <div className="mt-2">
            <h3 className="text-sm font-medium">When</h3>
            <div className="mt-1 flex flex-row items-baseline">
              {Object.values(dateRanges).map(({ key, caption }) => (
                <FilterTag
                  key={key}
                  onClick={() => setDateRange(key)}
                  className={
                    key === selectedDateRange
                      ? "bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
                      : ""
                  }
                >
                  {caption}
                </FilterTag>
              ))}
              <div>
                <DateTimeInput
                  type="date"
                  id="customDate"
                  className={
                    customDate
                      ? "bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
                      : ""
                  }
                  name="customDate"
                  value={customDate?.format("YYYY-MM-DD") || ""}
                  onChange={(e) => setCustomDate(dayjs(e.target.value))}
                />
              </div>
            </div>
          </div>
          {tags.map(({ category, caption, values }) => (
            <div key={category} className="mt-2">
              <h3 className="text-sm font-medium">{caption}</h3>
              <div className="mt-1">
                {values.map((value) => {
                  const isSelected = !!selectedTags?.find(
                    (tag) => tag.value === value && tag.category === category,
                  );
                  return (
                    <FilterTag
                      key={value}
                      onClick={() =>
                        isSelected
                          ? deselectTag({ value, category })
                          : selectTag({ value, category })
                      }
                      className={
                        isSelected
                          ? "bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
                          : ""
                      }
                    >
                      {value}
                    </FilterTag>
                  );
                })}
              </div>
            </div>
          ))}
        </FilterForm>
      )}
      <button onClick={toggleShowFilters}>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>
    </FilterContainer>
  );
};

export default GigsFilter;
