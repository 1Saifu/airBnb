import '../../app/globals.css'
import React from 'react';

const Hero: React.FC = () => {
    return(
        <div className="hero">
            <img
                src="/images/frames-for-your-heart-2d4lAQAlbDA-unsplash.jpg" 
                alt="Hero"
            />
            <div className="button-container">
                <a href="/properties" className="book-button">Book Your Home</a>
            </div>
        </div>
    )
}

export default Hero;