import { useState } from 'react';

function SearchBar({ isLoading, onSearch }) {
  const [name, setName] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const normalizedName = name.trim();

    if (!normalizedName) {
      setValidationMessage('Enter a card name to search.');
      return;
    }

    setValidationMessage('');
    onSearch(normalizedName);
  }

  function handleNameChange(event) {
    setName(event.target.value);
    setValidationMessage('');
  }

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
          value={name}
          onChange={handleNameChange}
          placeholder="e.g. Lightning Bolt"
          maxLength="200"
          aria-describedby={validationMessage ? 'card-name-error' : undefined}
          aria-invalid={Boolean(validationMessage)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching…' : 'Search'}
        </button>
      </div>
      {validationMessage && (
        <p id="card-name-error" className="validation-message" role="alert">
          {validationMessage}
        </p>
      )}
    </form>
  );
}

export default SearchBar;
