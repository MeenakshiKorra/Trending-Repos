import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const TrendingRepos = () => {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  // Calculate date 10 days ago in YYYY-MM-DD format
  const getDateTenDaysAgo = () => {
    const date = new Date();
    date.setDate(date.getDate() - 10);
    return date.toISOString().split('T')[0];
  };

  const lastRepoElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      const dateFilter = getDateTenDaysAgo();

      try {
        const response = await axios.get(
          `https://api.github.com/search/repositories?q=created:>${dateFilter}&sort=stars&order=desc&page=${page}&per_page=30`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json'
            }
          }
        );

        setRepos(prevRepos => {
          if (page === 1) return response.data.items;
          return [...prevRepos, ...response.data.items];
        });
        
        setHasMore(response.data.items.length > 0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching repos:', error);
        setLoading(false);
      }
    };

    fetchRepos();
  }, [page]);

  return (
    <div className="repos-container">
      {repos.map((repo, index) => (
        <div 
          ref={index === repos.length - 1 ? lastRepoElementRef : null}
          key={repo.id} 
          className="repo-item"
        >
          <div className="repo-header">
            <img 
              src={repo.owner.avatar_url} 
              alt={`${repo.owner.login}'s avatar`} 
              className="owner-avatar"
            />
            <div className="owner-details">
              <h3 className="owner-name">{repo.owner.login}</h3>
              <h2 className="repo-name">{repo.name}</h2>
            </div>
          </div>
          
          <p className="repo-description">{repo.description}</p>
          
          <div className="repo-stats">
            <span className="stars">⭐ {repo.stargazers_count.toLocaleString()}</span>
            <span className="created-date">
              Created on: {new Date(repo.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
      
      {loading && <div className="loading-indicator">Loading more repositories...</div>}
    </div>
  );
};

export default TrendingRepos;