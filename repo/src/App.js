import React from 'react';
import TrendingRepos from './components/TrendingRepos';
import './styles/TrendingRepos.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Trending GitHub Repositories</h1>
        <p>Most starred repos from the last 10 days</p>
      </header>
      <TrendingRepos />
    </div>
  );
}

export default App;