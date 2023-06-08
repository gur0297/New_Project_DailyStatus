import React, { useEffect, useState } from 'react';
import './HomePage.css';
import { fadeIn, bounce } from 'react-animations';
import { StyleSheet, css } from 'aphrodite';
import gifBackground from '../1.gif';

const HomePage = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Trigger animation after the component mounts
    setShowAnimation(true);
  }, []);

  const styles = StyleSheet.create({
    fadeIn: {
      animationName: fadeIn,
      animationDuration: '3s',
    },
    bounce: {
      animationName: bounce,
      animationDuration: '1s',
      animationIterationCount: 'infinite',
    },
  });

  return (
    <div
      className={`home-page ${css(styles.fadeIn)}`}
      style={{
        backgroundImage: `url(${gifBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        minheight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className={`animation ${showAnimation ? css(styles.bounce) : ''}`}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '20px',
          marginTop: '10px', // Adjust the margin-top to decrease the height from the middle
          maxWidth: '600px', // Set a maximum width for the bouncing text
        }}
      >
        <h1
          style={{
            color: '#ffffff',
            fontSize: '40px',
            textAlign: 'center',
          }}
        >
          Welcome to our 3G Developer Hub
        </h1>
      </div>
    </div>
  );
};

export default HomePage;
