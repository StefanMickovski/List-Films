import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import translations from './translations';  // Import translations from the new file

// Define the GraphQL query to fetch films with additional information
const GET_FILMS = gql`
  query GetFilms {
    allFilms {
      films {
        episodeID
        title
        director
        releaseDate
        producers
      }
    }
  }
`;

function App() {
  // Language state
  const [language, setLanguage] = useState('en');  // Default language is English

  const { loading, error, data } = useQuery(GET_FILMS);

  // States for sorting, filtering, and pagination
  const [sortBy, setSortBy] = useState('title');  // Default sorting by Title
  const [filterDirector, setFilterDirector] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const filmsPerPage = 5;  // Number of films per page

  // Format the release date to "Month Day, Year"
  const formatReleaseDate = (releaseDate) => {
    const date = new Date(releaseDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Handling loading and error states
  if (loading) return <div className="loading">{translations[language].loading}</div>;
  if (error) return <div className="error">{translations[language].error} {error.message}</div>;

  // Filter films by director and release year
  let filteredFilms = data.allFilms.films;

  if (filterDirector) {
    filteredFilms = filteredFilms.filter(film =>
      film.director.toLowerCase().includes(filterDirector.toLowerCase())
    );
  }

  if (filterYear) {
    filteredFilms = filteredFilms.filter(film =>
      new Date(film.releaseDate).getFullYear().toString() === filterYear
    );
  }

  // Sort films by Title or Release Date
  filteredFilms.sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'releaseDate') {
      return new Date(a.releaseDate) - new Date(b.releaseDate);
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastFilm = currentPage * filmsPerPage;
  const indexOfFirstFilm = indexOfLastFilm - filmsPerPage;
  const currentFilms = filteredFilms.slice(indexOfFirstFilm, indexOfLastFilm);
  const totalPages = Math.ceil(filteredFilms.length / filmsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Language selection handler
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="container">
      <h1>Star Wars Films</h1>

      {/* Language Selection */}
      <footer>
        <div className="language-selector">
          <button onClick={() => changeLanguage('en')} className="language-button">
            {translations[language].switchToEnglish}
          </button>
          <button onClick={() => changeLanguage('de')} className="language-button">
            {translations[language].switchToGerman}
          </button>
          <button onClick={() => changeLanguage('mk')} className="language-button">
            {translations[language].switchToMacedonian}
          </button>
        </div>
      </footer>

      {/* Filter by Director */}
      <div className="filter">
        <label>{translations[language].filterByDirector} </label>
        <input
          type="text"
          value={filterDirector}
          onChange={(e) => setFilterDirector(e.target.value)}
        />
      </div>

      {/* Filter by Release Year */}
      <div className="filter">
        <label>{translations[language].filterByYear} </label>
        <input
          type="text"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        />
      </div>

      {/* Sort by */}
      <div className="sort">
        <label>{translations[language].sortBy} </label>
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="title">{translations[language].sortByTitle}</option>
          <option value="releaseDate">{translations[language].sortByReleaseDate}</option>
        </select>
      </div>

      {/* Display Films */}
      <ul className="film-list">
        {currentFilms.map((film) => (
          <li key={film.episodeID} className="film-item">
            <h2>{film.title} (Episode {film.episodeID})</h2>
            <p><strong>{translations[language].director}:</strong> {film.director}</p>
            <p><strong>{translations[language].releaseDate}:</strong> {formatReleaseDate(film.releaseDate)}</p>
            <p><strong>{translations[language].producers}:</strong> {film.producers.join(', ')}</p>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          {translations[language].previous}
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          {translations[language].next}
        </button>
      </div>
    </div>
  );
}

export default App;
