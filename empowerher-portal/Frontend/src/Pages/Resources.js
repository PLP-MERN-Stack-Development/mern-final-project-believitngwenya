import React, { useState, useEffect } from 'react';
import { resourcesAPI } from './services/api';
import ResourceCard from '../components/Resources/ResourceCard';
import FilterSidebar from '../components/Resources/FilterSidebar';
import './Resources.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    level: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    loadResources();
  }, [filters, pagination.page]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await resourcesAPI.getAll({
        ...filters,
        page: pagination.page,
        limit: 12
      });
      setResources(response.data.resources);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages,
        total: response.data.total
      }));
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading) {
    return <div className="loading">Loading resources...</div>;
  }

  return (
    <div className="resources-page">
      <div className="container">
        <div className="resources-header">
          <h1>Educational Resources</h1>
          <p>Discover resources to support your personal and professional growth</p>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search resources..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="resources-layout">
          <FilterSidebar 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          <div className="resources-content">
            <div className="resources-grid">
              {resources.map(resource => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>

            {resources.length === 0 && (
              <div className="no-resources">
                <h3>No resources found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </button>
                
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;