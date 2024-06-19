import React from 'react';
import lbmfLogo from '../assets/lmllogo.png';

const teamMembers = [
  { name: "Lily Ryan", role: "RRR “byte into it” Presenter" },
  { name: "Dr Ned Letcher", role: "Data Scientist and Piano Accordion" },
  { name: "Jen Smith", role: "Tech Leader, Accordion" },
  { name: "Travis Winters", role: "Long Time Tech Leader and Blues guitarist" },
  { name: "Joe Sustaric", role: "Tech Leader" },
  { name: "Frederic Robert", role: "PHD Astrophysicist" },
  { name: "Eugene Tang", role: "Tech Leader" },
  { name: "Craig Kelly", role: "Bassist and Designer" },
  { name: "01.Ekka", role: "Hip Hop Artist and Entrepreneur" },
  { name: "Paige Mulholland", role: "National Media Relations Advisor, Ukelele" },
  { name: "Tom Sulston", role: "Technologist and Social Impact Specialist, Mandolin" },
  { name: "Patrick Quinlan", role:	"Data Scientist, Guitars" },
  { name: "Phil Hickey", role: "Designer" },
  { name: "Luca Cave", role: "Tech Leader" }
];

const keyMembers = [
  { name: 'Mark Ryall', role: 'CTO' },
  { name: 'Martin Paten', role: 'COO' },
  { name: 'Nick Thorpe', role: 'CPO' }
];

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
        <br/>
        <p>You can contact us at <a href="mailto:gigs@livemusiclocator.com.au" className="text-customBlue underline hover:text-blue-700">gigs@livemusiclocator.com.au</a>!</p>
        <br /><br />
        <p>This experience is brought to you by the passion and expertise of our wonderful volunteer team.</p>
        <br/>
        <div>
          {teamMembers.map((member, index) => (
            <div className="flex flex-col md:flex-row justify-between mb-2" key={index}>
              <div className="font-semibold md:w-1/3">{member.name}</div>
              <div className="md:w-2/3">{member.role}</div>
            </div>
          ))}
          <br /><br />
          {keyMembers.map((member, index) => (
            <div className="flex flex-col md:flex-row justify-between mb-2" key={index}>
              <div className="md:w-1/3">{member.role}</div>
              <div className="font-semibold md:w-2/3">{member.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
