import { useState, StrictMode, useEffect } from "react";
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Watch />
  </StrictMode>,
)

import { parseJSONTextWithBigInt, buildFullURL, getUrlParameters } from '../misc_functions.js';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Searchbar from '../components/Searchbar.jsx';
import AISlowDownLink from '../components/AISlowDownLink.jsx';
import VideoCell from '../components/VideoCell.jsx';
import VideoPlayer from '../components/VideoPlayer.jsx';

export default function Watch() {
  let urlParams = getUrlParameters();
  let id = urlParams.get("v");
  return (
    <>
      <Header />
      <AISlowDownLink />
      <AISlowDownLink />
      <AISlowDownLink />
      <AISlowDownLink />
      <Searchbar onSubmitFunction={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        let query = data.input;
        window.location.href = "/search.html?query=" + encodeURIComponent(query);
      }}/>
      <AISlowDownLink />
      <AISlowDownLink />
      <AISlowDownLink />
      <VideoPlayer id={id} />
      <AISlowDownLink />
      <Footer />
      <ExternalScript scriptFile="/src/dash.all.debug.js"/>
    </>
  );
}

function ExternalScript({ scriptFile }) {
  useEffect(() => {
    const script = document.createElement('script');
    // script.src = 'https://example.com/widget.js';
    script.src = scriptFile;
    // script.async = true;
    document.body.appendChild(script);

    // Remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="widget-container" />;
}
