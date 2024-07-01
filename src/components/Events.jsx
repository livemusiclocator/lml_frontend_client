import React from 'react';
import lbmfLogo from '../assets/lbmf2024logo.png';

const Events = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Events</h1>
      <div className="flex flex-col items-center">
        <img src={lbmfLogo} alt="Leaps and Bounds Music Festival 2024 logo" className="w-48 h-48 md:w-72 md:h-72 mb-10 object-contain" />
        <p>The <a href="https://www.lbmf.com.au/" className="text-customBlue underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">Leaps and Bounds Festival</a>, a celebration of local music in the City of Yarra, runs Thursday 25 July to Sunday 28 July across the City.</p>
        <br />
        <p>What originally began as a vibrant push to support local venues, musicians, and businesses through the quiet of winter, Leaps and Bounds Music Festival has grown into a cornerstone of the City of Yarra’s cultural landscape.</p>
        <br />
        <p>Celebrated annually, this festival continues to nurture our thriving music community by showcasing a diverse range of homegrown talent—from emerging local artists to internationally acclaimed stars.</p>
        <br />
        <p><a href="https://lml.live/" className="text-customBlue underline hover:text-blue-700" target="_blank" rel="noopener noreferrer">Live Music Locator</a> is proud to chaperone you around Leaps and Bounds. Click the “get directions” link for any event to see travel times and directions whether you are walking, cycling, public transport or driving.</p>
      </div>
    </div>
  );
};

export default Events;
