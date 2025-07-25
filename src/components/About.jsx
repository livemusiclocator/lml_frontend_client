import React from "react";
import lmlLogo from "../assets/lmllogo.png";
import { getHeading, getPartners } from "../getLocation";

const teamMembers = [
  { name: "01.Ekka", role: "Hip Hop Artist, Social Media Coordinator, Entrepreneur" },
  { name: "Aron Lebani", role: "Tech Volunteer" },
  { name: "Ben Eldridge", role: "Tech Volunteer" },
  { name: "Craig Kelly", role: "Graphic Designer, Bassist" },
  { name: "Dr Ned Letcher", role: "Data Scientist" },
  { name: "Eugene Tang", role: "Tech Leader" },
  { name: "Frederic Robert", role: "PHD Astrophysicist" },
  { name: "Jen Smith", role: "Tech Leader, Piano Accordionist" },
  { name: "Joe Sustaric", role: "Tech Leader" },
  { name: "Johnny Cussen", role: "Tech Volunteer" },
  { name: "Karen Stewart", role: "Venue Relations" },
  { name: "Lilly Ryan", role: "Cyber Security Advisor, RRR 'byte into it' Presenter" },
  { name: "Luca Cave", role: "Tech Leader" },
  { name: "Mark Pirie", role: "Gig Researcher" },
  { name: "Paige Mulholland", role: "National Media Relations Advisor, Ukeleleist" },
  { name: "Patrick Quinlan", role: "Data Scientist, Guitarist" },
  { name: "Paul Ellis", role: "Pro Bono Legal" },
  { name: "Peter Bodin", role: "Gig Researcher" },
  { name: "Phil Hickey", role: "Graphic Designer" },
  { name: "Richard Turton", role: "Photography" },
  { name: "Sharon Irish", role: "Gig Researcher & UX Specialist" },
  { name: "Stefan Schutt", role: "Gig Researcher" },
  { name: "Tom Sulston", role: "Technologist, Social Impact Specialist, Mandolinist" },
  { name: "Travis Winters", role: "Tech Leader, Blues Guitarist" },
];

const keyMembers = [
  { name: "Martin Paten", role: "Chief Operating Officer" },
  { name: "Mark Ryall", role: "Chief Technology Officer" },
  { name: "Nick Thorpe", role: "Chief Product Officer" },
];

const About = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">About</h1>
      <div className="flex flex-col items-center">
        <img
          src={lmlLogo}
          alt="Live Music Locator logo"
          className="w-48 h-48 md:w-72 md:h-72 mb-10 object-contain"
        />
        <p>{getHeading()}</p>
        <br />
        <p>
          Our data is verified within 48 hours, ensuring you get accurate and up-to-date info.
        </p>
        <br />
        <p>{getPartners()}</p>
        <br />
        <p>
          Plus, we’ve got a free API for developers to use. So hack on that and
          roll your own personal gig guide. Or if you’d like to join us, you can volunteer!
        </p>
        <br />
        <p>
          For more details, check out <a
            href="https://www.livemusiclocator.com.au/"
            className="text-customBlue underline hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            livemusiclocator.com.au
          </a>
          .
        </p>
        <br />
        <p>
          You can contact us at <a
            href="mailto:gigs@livemusiclocator.com.au"
            className="text-customBlue underline hover:text-blue-700"
          >
            gigs@livemusiclocator.com.au
          </a>
          !
        </p>
        <br />
        <br />
        <p>
          This experience is brought to you by the passion and expertise of our wonderful volunteer team.
        </p>
        <br />
        <div>
          {teamMembers.map((member, index) => (
            <div
              className="flex flex-col md:flex-row justify-between mb-2"
              key={index}
            >
              <div className="font-semibold md:w-1/3">{member.name}</div>
              <div className="md:w-2/3">{member.role}</div>
            </div>
          ))}
          <br />
          <br />
          <div className="mb-2">
            <b>Live Music Locator - Directors</b>
          </div>
          <div className="mb-20">
            {keyMembers.map((member, index) => (
              <div
                className="flex flex-col md:flex-row justify-between mb-2"
                key={index}
              >
                <div className="font-semibold md:w-1/3">{member.name}</div>
                <div className="md:w-2/3">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
