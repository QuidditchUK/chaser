import React from 'react';
import get from 'just-safe-get';

const HeroVideoWithCTA = (rawData) => {
  const data = {
    title: get(rawData, 'primary.slug'),
    cta_text: get(rawData, 'primary.cta_text'),
    cta_url: get(rawData, 'primary.cta_url'),
    video: get(rawData, 'primary.video_url.url'),
  };

  return (
    <header className="v-header container">
      <div className="fullscreen-video-wrap">
        <video src={data.video} autoPlay loop muted />
      </div>

      <div className="header-content">
        <h1>{data.title}</h1>
        <input type="text" placeholder="Postcode" className="postcode" /> <button type="button">{data.cta_text}</button>
      </div>
    </header>
  );
};

export default HeroVideoWithCTA;
