import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="headroom">
        <div className="container">
          <img src="quk-logo.png" alt="Quidditch UK" className="logo" />
        </div>
      </div>
      <header className="v-header container">
        <div className="fullscreen-video-wrap">
          <video src="video-header.mp4" autoPlay loop muted />
        </div>

        <div className="header-overlay" />
        <div className="header-content">
          <h1>Find your passion.</h1>
          <input type="text" placeholder="Postcode" className="postcode" /> <button type="button">Find Quidditch</button>
        </div>
      </header>

      <div className="section-one container">
        <h2>Latest News</h2>

        <div className="grid">
          <div className="block">
            <div className="img-container">
              <img src="1.jpg" alt="image one" />
            </div>

            <p>This is the latest news for the quidditch uk ...Read More</p>
          </div>

          <div className="block">
            <div className="img-container">
              <img src="2.jpg" alt="image one" />
            </div>

            <p>This is the latest news for the quidditch uk ...Read More</p>
          </div>

          <div className="block">
            <div className="img-container">
              <img src="3.jpg" alt="image one" />
            </div>

            <p>This is the latest news for the quidditch uk ...Read More</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
