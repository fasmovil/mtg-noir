import { useState } from 'react';
import CardDisplay from './components/CardDisplay.jsx';
import SearchBar from './components/SearchBar.jsx';
import { searchCard } from './services/cardsApi.js';

function App() {
  const [card, setCard] = useState(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function handleSearch(name) {
    setStatus('loading');
    setMessage('Buscando en el archivo de cartas…');
    setCard(null);

    try {
      const foundCard = await searchCard(name);
      setCard(foundCard);
      setStatus('success');
      setMessage('');
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">ARCANE DATA SYSTEMS // 1987</p>
          <h1>MTG <span>Noir</span></h1>
        </div>
        <p className="header-status"><span /> SYSTEM ONLINE</p>
      </header>

      <SearchBar isLoading={status === 'loading'} onSearch={handleSearch} />

      <section className="result-area">
        {status === 'idle' && <p className="status-message">Introduce el nombre de una carta para consultarla.</p>}
        {status === 'loading' && <p className="status-message loading-message" role="status">{message}</p>}
        {status === 'error' && <p className="status-message error-message" role="alert">{message}</p>}
        {status === 'success' && <CardDisplay card={card} />}
      </section>
    </main>
  );
}

export default App;
