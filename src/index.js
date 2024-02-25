import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root')); // Use createRoot from react-dom/client

root.render(
  <Router>
    <App />
  </Router>
);
