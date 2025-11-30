import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

let socket;

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    socket = io('http://localhost:5001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });
    
    // Listen for leaderboard updates
    socket.on('leaderboard-update', (data) => {
      console.log('Leaderboard update received:', data);
      // Add a small delay to ensure database is updated
      setTimeout(() => {
        fetchLeaderboard();
      }, 500);
    });
    
    // Handle connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });
    
    socket.on('connect_error', (error) => {
      console.log('Socket connection error:', error);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    // Fetch initial leaderboard
    fetchLeaderboard();

    // Clean up socket connection on component unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/leaderboard/top');
      setLeaderboard(response.data.leaderboard || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
    setLoading(false);
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return { icon: 'bi-trophy-fill', color: 'warning', text: '1st' };
      case 1: return { icon: 'bi-award-fill', color: 'secondary', text: '2nd' };
      case 2: return { icon: 'bi-award-fill', color: 'danger', text: '3rd' };
      default: return { icon: 'bi-hash', color: 'dark', text: `${index + 1}th` };
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-primary text-white shadow">
            <div className="card-body py-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h1 className="display-6 fw-bold mb-2">
                    <i className="bi bi-trophy me-3"></i>
                    PrepTrack Leaderboard
                  </h1>
                  <p className="lead mb-0 opacity-75">
                    Top performers across all domains. Keep practicing to climb the ranks! 🚀
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <button 
                    className="btn btn-light btn-lg"
                    onClick={fetchLeaderboard}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <div className="row align-items-center">
            <div className="col">
              <h5 className="mb-0">
                <i className="bi bi-list-ol me-2"></i>
                Top Performers
              </h5>
            </div>
            <div className="col-auto">
              <small className="text-muted">
                {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
              </small>
            </div>
          </div>
        </div>
        
        <div className="card-body p-0">
          {leaderboard.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people display-1 text-muted"></i>
              <h4 className="mt-3 text-muted">No Data Available</h4>
              <p className="text-muted mb-4">
                Be the first to take a test and appear on the leaderboard!
              </p>
              <a href="/aptitude" className="btn btn-primary btn-lg">
                <i className="bi bi-play-circle me-2"></i>
                Take Your First Test
              </a>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '80px' }} className="text-center">Rank</th>
                    <th>Student</th>
                    <th className="text-center">Tests Taken</th>
                    <th className="text-center">Highest Score</th>
                    <th className="text-center">Average</th>
                    <th className="text-center">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((student, index) => {
                    const rank = getRankIcon(index);
                    const averageScore = Math.round(student.averageScore || 0);
                    
                    return (
                      <tr key={index} className={index < 3 ? 'table-warning' : ''}>
                        <td className="text-center">
                          <div className="d-flex align-items-center justify-content-center">
                            <i className={`bi ${rank.icon} text-${rank.color} me-1`}></i>
                            <span className="fw-bold">{index + 1}</span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                 style={{ width: '40px', height: '40px' }}>
                              <i className="bi bi-person-fill text-white"></i>
                            </div>
                            <div>
                              <strong className="d-block">{student.username || 'Anonymous'}</strong>
                              {index < 3 && (
                                <small className="text-muted">{rank.text} Place</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <strong>{student.testsTaken || 0}</strong>
                        </td>
                        <td className="text-center">
                          <strong className="text-primary fs-5">{Math.round(student.highestScore || 0)}</strong>
                        </td>
                        <td className="text-center">
                          <span className={`badge ${
                            averageScore >= 80 ? 'bg-success' :
                            averageScore >= 60 ? 'bg-warning' : 'bg-danger'
                          }`}>
                            {averageScore}%
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="progress" style={{ width: '80px', height: '8px' }}>
                            <div 
                              className={`progress-bar ${
                                averageScore >= 80 ? 'bg-success' :
                                averageScore >= 60 ? 'bg-warning' : 'bg-danger'
                              }`}
                              style={{ width: `${averageScore}%` }}
                            ></div>
                          </div>
                          <small className="text-muted">{averageScore}%</small>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {leaderboard.length > 0 && (
          <div className="card-footer bg-light">
            <div className="row align-items-center">
              <div className="col">
                <small className="text-muted">
                  Showing top {leaderboard.length} performers • Updated {lastUpdated ? lastUpdated.toLocaleString() : 'recently'}
                </small>
              </div>
              <div className="col-auto">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={fetchLeaderboard}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      {leaderboard.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm border-0">
              <div className="card-body">
                <i className="bi bi-people display-6 text-primary mb-2"></i>
                <h3 className="text-primary">{leaderboard.length}</h3>
                <p className="text-muted mb-0">Active Students</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm border-0">
              <div className="card-body">
                <i className="bi bi-check-circle display-6 text-success mb-2"></i>
                <h3 className="text-success">
                  {Math.max(...leaderboard.map(s => s.testsTaken || 0))}
                </h3>
                <p className="text-muted mb-0">Most Tests Taken</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm border-0">
              <div className="card-body">
                <i className="bi bi-star display-6 text-warning mb-2"></i>
                <h3 className="text-warning">
                  {Math.max(...leaderboard.map(s => s.highestScore || 0))}
                </h3>
                <p className="text-muted mb-0">Highest Score</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      {leaderboard.length === 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card bg-light border-0">
              <div className="card-body text-center py-4">
                <h4 className="text-primary">Ready to Join the Leaderboard?</h4>
                <p className="text-muted mb-3">
                  Take your first aptitude test and start climbing the ranks today!
                </p>
                <a href="/aptitude" className="btn btn-primary btn-lg me-2">
                  <i className="bi bi-play-circle me-2"></i>
                  Start Testing
                </a>
                <a href="/register" className="btn btn-outline-primary btn-lg">
                  <i className="bi bi-person-plus me-2"></i>
                  Create Account
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;