import React from 'react';
import '../../app/globals.css'

const Footer: React.FC = () => {
    return(
        <footer className="footer">
        <div className="footer-text-container">
          <p>&copy; 2024 AIRBNB</p>
          <p>Contact: info@AIRBNB.com</p>
          <p>Address: 1234 Nackademin, Sweden</p>
        </div>
      </footer>
    )
}

export default Footer