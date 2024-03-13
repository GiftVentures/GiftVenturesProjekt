import React, { useState, useEffect } from 'react';
import { Element } from 'react-scroll';
import './About.css'; 
import facebookImage from '../../IMG/facebook.png';
import instagramImage from '../../IMG/instagram.png';
import githubImage from '../../IMG/github.png';
import ricsiImage from '../../IMG/ricsi.png'; 
import koriImage from '../../IMG/kori.jpeg';
import adamImage from '../../IMG/adam.jpg';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const TeamCard = ({ name, position, imageSrc, socialLinks }) => {
    return (
      <div className="about-team-card">
        <div className="card-content">
          <div className="content-box">
            <h2>{name}</h2>
            <p>{position}</p>
            <ul className="social-links">
              {socialLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.link} target="_blank" rel="noopener noreferrer">
                    <img src={link.src} alt={link.alt} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card-image">
          <img src={imageSrc} alt={name} />
        </div>
      </div>
    );
  }

  const NewCard = () => {
    return (
      <Element className={`new-card ${isVisible ? 'visible' : ''}`}>
        <div className={`new-card-content ${isVisible ? 'visible' : ''}`}>
          <h2>Main Title</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pretium nisl ut orci volutpat, vitae maximus nisi semper. Nulla ut aliquet risus. Vestibulum consectetur, urna a luctus luctus, magna magna euismod nisl, sit amet suscipit velit nunc ut nulla. In tincidunt congue sapien, non volutpat turpis vestibulum et. Integer convallis fermentum dolor a mattis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris vulputate massa id dui pharetra tincidunt. Duis finibus nisi ac mattis fermentum. In hac habitasse platea dictumst.
          </p>
        </div>
      </Element>
    );
  } 
  
  const NewCard2 = () => {
    return (
      <Element className={`new-card2 ${isVisible ? 'visible' : ''}`}>
        <div className={`new-card2-content ${isVisible ? 'visible' : ''}`}>
          <h2>Main Title</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pretium nisl ut orci volutpat, vitae maximus nisi semper. Nulla ut aliquet risus. Vestibulum consectetur, urna a luctus luctus, magna magna euismod nisl, sit amet suscipit velit nunc ut nulla. In tincidunt congue sapien, non volutpat turpis vestibulum et. Integer convallis fermentum dolor a mattis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris vulputate massa id dui pharetra tincidunt. Duis finibus nisi ac mattis fermentum. In hac habitasse platea dictumst.
          </p>
        </div>
      </Element>
    );
  } 

  return (
    <div className='about-container'>
      <div className='about-header'>
        <h1>Rólunk</h1>
      </div>
      <div className='about-team-cards'>
        <TeamCard 
          name="Hódi Richárd"
          position="Backend"
          imageSrc={ricsiImage}
          socialLinks={[
            { src: facebookImage, link: 'https://www.facebook.com', alt: 'Facebook' },
            { src: instagramImage, link: 'https://www.instagram.com', alt: 'Instagram' },
            { src: githubImage, link: 'https://github.com', alt: 'GitHub' }
          ]}
        />
        <TeamCard 
          name="Szabó Korinna"
          position="Frontend"
          imageSrc={koriImage}
          socialLinks={[
            { src: facebookImage, link: 'https://www.facebook.com', alt: 'Facebook' },
            { src: instagramImage, link: 'https://www.instagram.com', alt: 'Instagram' },
            { src: githubImage, link: 'https://github.com', alt: 'GitHub' }
          ]}
        />
        <TeamCard 
          name="Briják Ádám"
          position="Dokumentáció"
          imageSrc={adamImage}
          socialLinks={[
            { src: facebookImage, link: 'https://www.facebook.com', alt: 'Facebook' },
            { src: instagramImage, link: 'https://www.instagram.com', alt: 'Instagram' },
            { src: githubImage, link: 'https://github.com', alt: 'GitHub' }
          ]}
        />
      </div>
      <NewCard />
      <NewCard2 />
    </div>
  );
}

export default About;
