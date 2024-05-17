import { useState, useRef } from "react";
import tw from "tailwind-styled-components";
import dayjs from "dayjs";
import {
  useGigFilterOptions,
  useActiveGigFilterOptions,
} from "../hooks/filters";
import { Form, useSubmit } from "react-router-dom";
const FilterContainer = tw.div`
  w-full
  min-width-sm
  border
  rounded
  shadow

transition-[max-height]

flex
flex-col
${(p) => (p.$expanded ? "max-h-80" : "max-h-12")}
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
hover:text-indigo-700
hover:bg-indigo-300
transition-colors
${(p) => (p.$selected ? "bg-indigo-200 text-indigo-700" : "bg-gray-200 text-gray-700")}
has-[:checked]:bg-indigo-200
has-[:checked]:text-indigo-700
has-[:checked]:hover:bg-indigo-300

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
bg-gray-800 hover:bg-gray-900 text-white font-medium p-1 rounded text-xs
`;

const GigFiltersSummary = ({ showFilterForm }) => {
  const filters = useActiveGigFilterOptions();
  return (
    <div>
      {filters.map(({ id, caption }) => (
        <Badge
          className="text-xs"
          $selected={true}
          onClick={() => showFilterForm()}
          key={id}
        >
          <span className="px-4 text-nowrap">{caption}</span>
        </Badge>
      ))}
    </div>
  );
};

const GigFiltersForm = () => {
  const { dateRanges, tagCategories, customDate } = useGigFilterOptions();

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
      <div className="mb-2 px-4 min bg-white overflow-hidden flex-1  min-h-0">
        <h2 className="font-semibold text-sm text-center">Filters</h2>
        <Form
          method="get"
          onChange={(event) => {
            if (event.currentTarget.checkValidity()) {
              submit(event.currentTarget);
            }
          }}
        >
          <h3 className="text-sm font-medium">When</h3>
          <div className="flex flex-row items-baseline w-full flex-wrap justify-start gap-2">
            {Object.values(dateRanges).map(({ id, caption, selected, ui }) => (
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
            ))}
            {tagCategories.map(({ id, caption, values }) => (
              <div key={id}>
                <h3 className="text-sm font-medium">{caption}</h3>
                <div className="mt-1 flex flex-row items-baseline w-full flex-wrap justify-start gap-2">
                  {values.map(({ value, id, selected }) => {
                    return (
                      <BadgeControl
                        key={id}
                        value={id}
                        defaultChecked={selected}
                        groupName="tags"
                        inputType="checkbox"
                      >
                        <span className="px-4 text-nowrap">{value}</span>
                      </BadgeControl>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Form>
      </div>
    </>
  );
};

const GigFilters = () => {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <div className="h-20 z-50">
      <FilterContainer $expanded={showFilters}>
        {showFilters && <GigFiltersForm />}
        <div className="flex justify-between items-start p-1">
          <div>
            {!showFilters && (
              <GigFiltersSummary showFilterForm={() => setShowFilters(true)} />
            )}
          </div>
          <FilterToggleButton onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "close" : "filters"}
          </FilterToggleButton>
        </div>
      </FilterContainer>
    </div>
  );
};

export default GigFilters;
