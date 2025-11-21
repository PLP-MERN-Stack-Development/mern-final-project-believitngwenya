import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  const stats = [
    { number: '500+', label: 'Resources Available' },
    { number: '150+', label: 'Expert Mentors' },
    { number: '200+', label: 'Job Opportunities' },
    { number: '10k+', label: 'Women Empowered' }
  ];

  const categories = [
    {
      icon: '💼',
      title: 'Career Development',
      description: 'Advance your career with our resources and guidance'
    },
    {
      icon: '🎓',
      title: 'Education & Scholarships',
      description: 'Find educational opportunities and financial support'
    },
    {
      icon: '❤️',
      title: 'Health & Wellness',
      description: 'Resources for physical and mental well-being'
    },
    {
      icon: '⚖️',
      title: 'Legal Rights',
      description: 'Know your rights and get legal support'
    },
    {
      icon: '🚀',
      title: 'Entrepreneurship',
      description: 'Start and grow your business with our tools'
    },
    {
      icon: '👑',
      title: 'Leadership',
      description: 'Develop leadership skills and make an impact'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>EmpowerHer Connect</h1>
          <p className="hero-subtitle">
            Your gateway to resources, mentorship, and opportunities for women's empowerment
          </p>
          <p className="hero-description">
            Join a supportive community dedicated to helping women achieve their personal 
            and professional goals through access to education, mentorship, and career opportunities.
          </p>
          <div className="hero-actions">
            {!user ? (
              <>
                <Link to="/register" className="btn btn-primary">
                  Join Our Community
                </Link>
                <Link to="/resources" className="btn btn-secondary">
                  Explore Resources
                </Link>
              </>
            ) : (
              <>
                <Link to="/resources" className="btn btn-primary">
                  Browse Resources
                </Link>
                <Link to="/mentors" className="btn btn-secondary">
                  Find a Mentor
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Explore Our Resources</h2>
          <p className="section-subtitle">
            Discover resources across various categories to support your journey
          </p>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <Link to={`/resources?category=${category.title.toLowerCase().replace(' & ', '-').replace(' ', '-')}`} className="category-link">
                  Explore →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>
              Join thousands of women who have transformed their lives through 
              our platform. Whether you're looking for resources, mentorship, 
              or career opportunities, we're here to support you.
            </p>
            {!user && (
              <Link to="/register" className="btn btn-large">
                Create Your Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;