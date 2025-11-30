import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    college: '',
    graduationYear: '',
    domain: 'Programming'
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await register(formData);
    
    if (result.success) {
      navigate('/login', { 
        state: { message: 'Registration successful! Please login to continue.' } 
      });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow border-0">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="bi bi-person-plus display-4 text-primary"></i>
                <h3 className="card-title text-primary mt-3">Join PrepTrack</h3>
                <p className="text-muted">Create your account to start your preparation journey</p>
              </div>
              
              {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                  {error}
                  <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Username *</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-at"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        minLength="3"
                        placeholder="Choose a username"
                      />
                    </div>
                    <small className="text-muted">This will be your unique identifier</small>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name *</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Password *</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-key"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      placeholder="Create a strong password"
                    />
                  </div>
                  <small className="text-muted">Minimum 6 characters required</small>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">College/University</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-building"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        placeholder="Your college name"
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Graduation Year</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-calendar"></i>
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleChange}
                        min={currentYear}
                        max={currentYear + 5}
                        placeholder={currentYear}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Primary Domain of Interest</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-bullseye"></i>
                    </span>
                    <select
                      className="form-select"
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                    >
                      <option value="Programming">Programming & Coding</option>
                      <option value="Quantitative">Quantitative Aptitude</option>
                      <option value="Logical">Logical Reasoning</option>
                    </select>
                  </div>
                  <small className="text-muted">This will help us personalize your learning path</small>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 btn-lg py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Create Account
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;