import { useState } from "react";
import styled from "tailwind-styled-components";
import DateTimeDisplay from "../components/DateTimeDisplay";
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

const TagButton = styled.button`
  inline-flex
  items-center
  px-2
  py-1
  border
  border-transparent
  text-sm
  font-medium
  rounded-full
  shadow-sm
  text-white
  bg-indigo-600
  hover:bg-indigo-700
  focus:outline-none
  focus:ring-2
  focus:ring-offset-2
  focus:ring-indigo-500
`;

const ItemList = styled.ul`
  w-full
  mt-4
  list-disc
  list-inside
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

const GigsFilter = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedWhenTag, setSelectedWhenTag] = useState(null);
  const [customDateTime, setCustomDateTime] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const tags = {
    When: ["Today", "Tomorrow", "This Week", "This Weekend", "Next Week"],
    Genre: ["Action", "Comedy", "Drama"],
    Price: ["Free", "$0 - $10", "$10 - $20"],
    Series: ["Series 1", "Series 2", "Series 3"],
  };

  const toggleTag = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag],
    );
  };

  const toggleWhenTag = (tag) => {
    setSelectedWhenTag(tag === selectedWhenTag ? null : tag);
    if (tag !== "Custom Date") {
      setCustomDateTime("");
    }
  };

  const handleCustomDateTimeChange = (e) => {
    setCustomDateTime(e.target.value);
    setSelectedWhenTag("Custom Date");
  };

  const toggleShowFilters = () => setShowFilters(!showFilters);

  return (
    <main className="max-w-3xl mx-auto w-full">
      <FilterContainer>
        <h2 className="text-lg font-medium">Filter by:</h2>
        <div>
          {selectedWhenTag && selectedWhenTag !== "Custom Date" && (
            <SelectedTag onClick={() => toggleWhenTag(selectedWhenTag)}>
              {selectedWhenTag}{" "}
              <span aria-hidden="true" className="ml-2">
                ×
              </span>
            </SelectedTag>
          )}
          {customDateTime && (
            <SelectedTag onClick={() => setCustomDateTime("")}>
              <DateTimeDisplay value={customDateTime} type="numericDate" />
              <span aria-hidden="true" className="ml-2">
                ×
              </span>
            </SelectedTag>
          )}
          {selectedTags.map((tag) => (
            <SelectedTag key={tag} onClick={() => toggleTag(tag)}>
              {tag}{" "}
              <span aria-hidden="true" className="ml-2">
                ×
              </span>
            </SelectedTag>
          ))}
        </div>
        <TagButton onClick={toggleShowFilters}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </TagButton>
        {showFilters && (
          <FilterForm>
            {Object.entries(tags).map(([category, tags]) => (
              <div key={category} className="mt-2">
                <h3 className="text-sm font-medium">{category}</h3>
                <div className="mt-1">
                  {tags.map((tag) => (
                    <FilterTag
                      key={tag}
                      onClick={() =>
                        category === "When"
                          ? toggleWhenTag(tag)
                          : toggleTag(tag)
                      }
                      className={
                        (category === "When" && tag === selectedWhenTag) ||
                        (category !== "When" && selectedTags.includes(tag))
                          ? "bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
                          : ""
                      }
                    >
                      {tag}
                    </FilterTag>
                  ))}
                  {category === "When" && (
                    <div className="mt-2 flex gap-2 flex-row items-baseline">
                      <label
                        className="text-sm font-medium"
                        htmlFor="customDateTime"
                      >
                        Custom Date:
                      </label>
                      <DateTimeInput
                        type="date"
                        id="customDateTime"
                        name="customDateTime"
                        value={customDateTime}
                        onChange={handleCustomDateTimeChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </FilterForm>
        )}
      </FilterContainer>
      <ItemList>
        {/* Example items, replace with your actual data */}
        {["Item 1", "Item 2", "Item 3"].map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ItemList>
    </main>
  );
};

export default GigsFilter;
