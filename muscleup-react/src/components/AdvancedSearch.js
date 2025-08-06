import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch,
  faFilter,
  faTimes,
  faCalendar, 
  faDumbbell,
  faUtensils,
  faSortUp,
  faSortDown,
  faHistory
} from '@fortawesome/free-solid-svg-icons';// Main Search Container
const SearchContainer = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px ${props => props.theme.colors.shadowLight};
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
`;

// Search Input Section
const SearchInputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 3rem;
  font-size: 1.1rem;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textPrimary};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
    background: ${props => props.theme.colors.surface};
  }

  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const ClearButton = styled(motion.button)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.theme.colors.danger}20;
    color: ${props => props.theme.colors.danger};
  }
`;

// Filter Section
const FilterSection = styled(motion.div)`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const FilterToggle = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => props.theme.colors.primary}20;
  border: 1px solid ${props => props.theme.colors.primary}40;
  color: ${props => props.theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}30;
    transform: translateY(-1px);
  }
`;

const FilterGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textPrimary};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const FilterCheckbox = styled.input`
  margin-right: 0.5rem;
  accent-color: ${props => props.theme.colors.primary};
`;

const FilterDateRange = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 6px;
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.textPrimary};
    font-size: 0.875rem;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
    }
  }
`;

// Results Section
const ResultsSection = styled.div`
  margin-top: 1.5rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ResultsCount = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const SortControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SortButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.textInverse : props.theme.colors.textSecondary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryDark : props.theme.colors.surfaceHover};
    transform: translateY(-1px);
  }
`;

// Search History
const SearchHistory = styled(motion.div)`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const HistoryTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HistoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const HistoryItem = styled(motion.button)`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}20;
    color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
  }
`;

// Advanced Search Component
export const AdvancedSearch = ({ 
  data = [], 
  onResults, 
  placeholder = "Search everything...",
  searchKeys = ['name', 'description', 'tags'],
  enableHistory = true,
  enableFilters = true,
  filterOptions = {},
  sortOptions = []
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchHistory, setSearchHistory] = useState([]);

  // Load search history from localStorage
  useEffect(() => {
    if (enableHistory) {
      const history = localStorage.getItem('muscleup-search-history');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    }
  }, [enableHistory]);

  // Save search to history
  const saveToHistory = useCallback((searchQuery) => {
    if (!enableHistory || !searchQuery.trim()) return;
    
    const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('muscleup-search-history', JSON.stringify(newHistory));
  }, [searchHistory, enableHistory]);

  // Fuse.js configuration and instance
  const fuse = useMemo(() => {
    const fuseOptions = {
      keys: searchKeys,
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      shouldSort: true,
      findAllMatches: true,
      ignoreLocation: true,
      useExtendedSearch: true
    };
    return new Fuse(data, fuseOptions);
  }, [data, searchKeys]);

  // Search function
  const performSearch = useCallback((searchQuery, currentFilters = {}) => {
    let results = [];

    if (searchQuery.trim()) {
      // Perform fuzzy search
      const fuseResults = fuse.search(searchQuery);
      results = fuseResults.map(result => ({
        ...result.item,
        _searchScore: result.score,
        _matches: result.matches
      }));
      saveToHistory(searchQuery);
    } else {
      // No search query, return all data
      results = data.map(item => ({ ...item, _searchScore: 0 }));
    }

    // Apply filters
    results = results.filter(item => {
      return Object.entries(currentFilters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        
        if (key === 'dateRange') {
          if (!value.from && !value.to) return true;
          const itemDate = new Date(item.date || item.createdAt);
          if (value.from && itemDate < new Date(value.from)) return false;
          if (value.to && itemDate > new Date(value.to)) return false;
          return true;
        }
        
        if (Array.isArray(value)) {
          return value.some(v => 
            item[key]?.toString().toLowerCase().includes(v.toLowerCase())
          );
        }
        
        return item[key]?.toString().toLowerCase().includes(value.toLowerCase());
      });
    });

    // Apply sorting
    if (sortBy !== 'relevance') {
      results.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    onResults?.(results);
  }, [fuse, data, saveToHistory, sortBy, sortOrder, onResults]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    performSearch(newQuery, filters);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    performSearch(query, newFilters);
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setFilters({});
    performSearch('', {});
  };

  // Handle history item click
  const handleHistoryClick = useCallback((historyQuery) => {
    setQuery(historyQuery);
    performSearch(historyQuery, filters);
  }, [performSearch, filters]);

  // Effect to perform initial search
  useEffect(() => {
    performSearch(query, filters);
  }, [sortBy, sortOrder, performSearch, query, filters]);  return (
    <SearchContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Search Input */}
      <SearchInputContainer>
        <SearchIcon>
          <FontAwesomeIcon icon={faSearch} />
        </SearchIcon>
        <SearchInput
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder={placeholder}
        />
        <AnimatePresence>
          {query && (
            <ClearButton
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={clearSearch}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </ClearButton>
          )}
        </AnimatePresence>
      </SearchInputContainer>

      {/* Search History */}
      {enableHistory && searchHistory.length > 0 && !query && (
        <SearchHistory
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <HistoryTitle>
            <FontAwesomeIcon icon={faHistory} />
            Recent searches
          </HistoryTitle>
          <HistoryList>
            {searchHistory.map((item, index) => (
              <HistoryItem
                key={index}
                onClick={() => handleHistoryClick(item)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </HistoryItem>
            ))}
          </HistoryList>
        </SearchHistory>
      )}

      {/* Filters */}
      {enableFilters && (
        <FilterSection>
          <FilterHeader>
            <FilterToggle
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FontAwesomeIcon icon={faFilter} />
              Filters
              <motion.div
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.div>
            </FilterToggle>
          </FilterHeader>

          <AnimatePresence>
            {showFilters && (
              <FilterGrid
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Category Filter */}
                {filterOptions.categories && (
                  <FilterGroup>
                    <FilterLabel>
                      <FontAwesomeIcon icon={faDumbbell} />
                      Category
                    </FilterLabel>
                    <FilterSelect
                      value={filters.category || 'all'}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      {filterOptions.categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </FilterSelect>
                  </FilterGroup>
                )}

                {/* Date Range Filter */}
                {filterOptions.dateRange && (
                  <FilterGroup>
                    <FilterLabel>
                      <FontAwesomeIcon icon={faCalendar} />
                      Date Range
                    </FilterLabel>
                    <FilterDateRange>
                      <input
                        type="date"
                        value={filters.dateRange?.from || ''}
                        onChange={(e) => handleFilterChange('dateRange', {
                          ...filters.dateRange,
                          from: e.target.value
                        })}
                      />
                      <span>to</span>
                      <input
                        type="date"
                        value={filters.dateRange?.to || ''}
                        onChange={(e) => handleFilterChange('dateRange', {
                          ...filters.dateRange,
                          to: e.target.value
                        })}
                      />
                    </FilterDateRange>
                  </FilterGroup>
                )}

                {/* Custom Filters */}
                {filterOptions.custom && filterOptions.custom.map(customFilter => (
                  <FilterGroup key={customFilter.key}>
                    <FilterLabel>
                      <FontAwesomeIcon icon={customFilter.icon || faFilter} />
                      {customFilter.label}
                    </FilterLabel>
                    {customFilter.type === 'select' && (
                      <FilterSelect
                        value={filters[customFilter.key] || 'all'}
                        onChange={(e) => handleFilterChange(customFilter.key, e.target.value)}
                      >
                        <option value="all">All {customFilter.label}</option>
                        {customFilter.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </FilterSelect>
                    )}
                    {customFilter.type === 'checkbox' && (
                      <div>
                        {customFilter.options.map(option => (
                          <label key={option.value} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <FilterCheckbox
                              type="checkbox"
                              checked={filters[customFilter.key]?.includes(option.value) || false}
                              onChange={(e) => {
                                const currentValues = filters[customFilter.key] || [];
                                const newValues = e.target.checked
                                  ? [...currentValues, option.value]
                                  : currentValues.filter(v => v !== option.value);
                                handleFilterChange(customFilter.key, newValues);
                              }}
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </FilterGroup>
                ))}
              </FilterGrid>
            )}
          </AnimatePresence>
        </FilterSection>
      )}

      {/* Sort Controls */}
      {sortOptions.length > 0 && (
        <ResultsSection>
          <ResultsHeader>
            <ResultsCount>
              {/* This will be updated by parent component */}
            </ResultsCount>
            <SortControls>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Sort by:
              </span>
              {sortOptions.map(option => (
                <SortButton
                  key={option.key}
                  active={sortBy === option.key}
                  onClick={() => handleSortChange(option.key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.label}
                  {sortBy === option.key && (
                    <FontAwesomeIcon 
                      icon={sortOrder === 'asc' ? faSortUp : faSortDown} 
                    />
                  )}
                </SortButton>
              ))}
            </SortControls>
          </ResultsHeader>
        </ResultsSection>
      )}
    </SearchContainer>
  );
};

// Preset Search Configurations
export const WorkoutSearch = ({ workouts, onResults }) => (
  <AdvancedSearch
    data={workouts}
    onResults={onResults}
    placeholder="Search workouts, exercises, muscle groups..."
    searchKeys={['name', 'exercises', 'muscleGroups', 'notes', 'tags']}
    filterOptions={{
      categories: [
        { value: 'strength', label: 'Strength Training' },
        { value: 'cardio', label: 'Cardio' },
        { value: 'flexibility', label: 'Flexibility' },
        { value: 'sports', label: 'Sports' }
      ],
      dateRange: true,
      custom: [
        {
          key: 'difficulty',
          label: 'Difficulty',
          icon: faDumbbell,
          type: 'select',
          options: [
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' }
          ]
        },
        {
          key: 'muscleGroups',
          label: 'Muscle Groups',
          icon: faDumbbell,
          type: 'checkbox',
          options: [
            { value: 'chest', label: 'Chest' },
            { value: 'back', label: 'Back' },
            { value: 'legs', label: 'Legs' },
            { value: 'arms', label: 'Arms' },
            { value: 'core', label: 'Core' },
            { value: 'shoulders', label: 'Shoulders' }
          ]
        }
      ]
    }}
    sortOptions={[
      { key: 'relevance', label: 'Relevance' },
      { key: 'date', label: 'Date' },
      { key: 'name', label: 'Name' },
      { key: 'duration', label: 'Duration' },
      { key: 'difficulty', label: 'Difficulty' }
    ]}
  />
);

export const MealSearch = ({ meals, onResults }) => (
  <AdvancedSearch
    data={meals}
    onResults={onResults}
    placeholder="Search meals, ingredients, recipes..."
    searchKeys={['name', 'ingredients', 'recipe', 'tags', 'cuisine']}
    filterOptions={{
      categories: [
        { value: 'breakfast', label: 'Breakfast' },
        { value: 'lunch', label: 'Lunch' },
        { value: 'dinner', label: 'Dinner' },
        { value: 'snack', label: 'Snack' }
      ],
      dateRange: true,
      custom: [
        {
          key: 'dietType',
          label: 'Diet Type',
          icon: faUtensils,
          type: 'checkbox',
          options: [
            { value: 'vegetarian', label: 'Vegetarian' },
            { value: 'vegan', label: 'Vegan' },
            { value: 'keto', label: 'Keto' },
            { value: 'paleo', label: 'Paleo' },
            { value: 'gluten-free', label: 'Gluten Free' }
          ]
        }
      ]
    }}
    sortOptions={[
      { key: 'relevance', label: 'Relevance' },
      { key: 'date', label: 'Date' },
      { key: 'name', label: 'Name' },
      { key: 'calories', label: 'Calories' },
      { key: 'protein', label: 'Protein' }
    ]}
  />
);

export default AdvancedSearch;
