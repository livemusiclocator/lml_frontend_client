import React from 'react';
import lbmfLogo from '../assets/lmllogo.png';

const About = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">About</h1>
      <div className="flex flex-col items-center">
        <img src={lbmfLogo} alt="Live Music Locator logo" className="w-48 h-48 md:w-72 md:h-72 mb-10 object-contain" />
        <p>Live Music Locator is a pilot service that helps you discover all live music events in the City of Yarra, covering every gig across all genres and venues for July, August, and September 2024. Help us make the pilot successful by telling other people about this solution, and we will make it work for all of Victoria.</p>
        <br />
        <p>Our data is verified within 48 hours, ensuring you get accurate and up-to-date info. We’re a not-for-profit partnering with the City of Yarra and the Leaps and Bounds Festival to support local musicians and venues.</p>
        <br />
        <p>Plus, we’ve got a free API for developers to use. So hack on that and roll your own personal gig guide.</p>
        <br />
        <p>For more details, check out <a href="https://www.livemusiclocator.com.au/" className="text-customBlue underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">livemusiclocator.com.au</a> and <a href="https://www.lbmf.com.au/" className="text-customBlue underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">https://www.lbmf.com.au</a>.</p>
      </div>
    </div>
  );
};

export default About;
