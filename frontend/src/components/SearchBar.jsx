import { useEffect, useId, useRef, useState } from 'react';
import { getCardSuggestions } from '../services/cardsApi.js';

const DEBOUNCE_MS = 300;

function SearchBar({ isLoading, onSearch }) {
  const [name, setName] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionState, setSuggestionState] = useState('idle');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isListClosed, setIsListClosed] = useState(false);
  const listboxId = useId();
  const requestId = useRef(0);

  useEffect(() => {
    const query = name.trim();
    const currentRequest = ++requestId.current;

    if (!query || isListClosed) {
      setSuggestions([]);
      setSuggestionState('idle');
      setActiveIndex(-1);
      return undefined;
    }

    setSuggestions([]);
    setActiveIndex(-1);
    setSuggestionState('loading');
    const timer = setTimeout(async () => {
      try {
        const names = await getCardSuggestions(query);
        if (requestId.current !== currentRequest) return;
        setSuggestions(names);
        setSuggestionState(names.length ? 'available' : 'empty');
      } catch (error) {
        if (requestId.current !== currentRequest) return;
        setSuggestionState('error');
        setValidationMessage((message) => message || '');
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [name, isListClosed]);

  function submitSearch(searchName) {
    const normalizedName = searchName.trim();
    if (!normalizedName) {
      setValidationMessage('Enter a card name to search.');
      return;
    }
    setValidationMessage('');
    setSuggestions([]);
    setSuggestionState('idle');
    setIsListClosed(true);
    onSearch(normalizedName);
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitSearch(name);
  }

  function handleNameChange(event) {
    setName(event.target.value);
    setValidationMessage('');
    setIsListClosed(false);
  }

  function selectSuggestion(suggestion) {
    setName(suggestion);
    submitSearch(suggestion);
  }

  function handleKeyDown(event) {
    if (!suggestions.length) {
      if (event.key === 'Escape') setIsListClosed(true);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((index) => {
        if (index < 0) return direction === 1 ? 0 : suggestions.length - 1;
        return (index + direction + suggestions.length) % suggestions.length;
      });
    }

    if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setSuggestions([]);
      setSuggestionState('idle');
      setActiveIndex(-1);
      setIsListClosed(true);
    }
  }

  const showList = suggestionState === 'available' && !isListClosed;
  const suggestionMessage = suggestionState === 'loading'
    ? 'Loading card names…'
    : suggestionState === 'empty'
      ? 'No matching card names found. You can still search directly.'
      : suggestionState === 'error'
        ? 'Suggestions are unavailable. You can still search directly.'
        : '';

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar-header">
        <label htmlFor="card-name">CARD IDENTIFICATION</label>
        <span>QUERY_01</span>
      </div>
      <div className="search-controls">
        <input
          id="card-name"
          name="name"
          type="search"
          role="combobox"
          value={name}
          onChange={handleNameChange}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Lightning Bolt"
          maxLength="200"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={showList}
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          aria-describedby={validationMessage ? 'card-name-error' : undefined}
          aria-invalid={Boolean(validationMessage)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>{isLoading ? 'Searching…' : 'Search'}</button>
      </div>
      {showList && (
        <ul id={listboxId} className="suggestion-list" role="listbox" aria-label="Card name suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              id={`${listboxId}-option-${index}`}
              key={suggestion}
              className={index === activeIndex ? 'is-active' : undefined}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {suggestionMessage && (
        <p className={`suggestion-message ${suggestionState}`} role={suggestionState === 'error' ? 'alert' : 'status'}>
          {suggestionMessage}
        </p>
      )}
      {validationMessage && <p id="card-name-error" className="validation-message" role="alert">{validationMessage}</p>}
    </form>
  );
}

export default SearchBar;
