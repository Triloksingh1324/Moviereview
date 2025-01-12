import React, { useState } from 'react';
import '../css/Filter.css'; 
import { languageMap } from '../utils/Language/languageUtils';
// import { genreMap } from '../utils/genreUtils';


const FilterOptions = ({ setAppliedFilters,genreMap }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);  // For showing filter options
  const [filterOptions, setFilterOptions] = useState({
    genre: '',
    language: '',
    releaseYear: '',
    popularity: ''
  });

  
  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);  // Show/hide filter options
  };

  const applyFilters = () => {
    setAppliedFilters(filterOptions); 
    setFiltersOpen(!filtersOpen);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterOptions((prev) => ({ ...prev, [name]: value }));  // Update the internal state for filters
  };

  return (
    <div className="filterButtonContainer">
      <button className="filterButton" onClick={toggleFilters}>
        Filters
      </button>
      {filtersOpen && (
        <div className="filterOptions">
          <label>
            Genre:
            <select name="genre" value={filterOptions.genre} onChange={handleFilterChange}>
              <option value="">Select Genre</option>
              {Object.keys(genreMap).map((code) => (
                <option key={code} value={genreMap[code]}>
                  {code}
                </option>
              ))}
            </select>
          </label>
          <label>
            Language:
            <select name="language" value={filterOptions.language} onChange={handleFilterChange}>
              <option value="">Select Language</option>
              {Object.keys(languageMap).map((code) => (
                <option key={code} value={code}>
                  {languageMap[code]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Release Date From:
            <input
              type="date"
              name="releaseYear"
              placeholder="Year"
              value={filterOptions.releaseYear}
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Rating:
            <select name="popularity" value={filterOptions.popularity} onChange={handleFilterChange}>
              <option value="">Select Rating</option>
              <option value="lt5">Less than 5</option>
              <option value="gt5">More than 5</option>
              <option value="gt6">More than 6</option>
              <option value="gt7">More than 7</option>
              <option value="gt8">More than 8</option>
              <option value="gt9">More than 9</option>
            </select>
          </label>
          <button onClick={applyFilters} className="applyFilterButton">Apply Filters</button>
        </div>
      )}
    </div>
  );
};

export default FilterOptions;
