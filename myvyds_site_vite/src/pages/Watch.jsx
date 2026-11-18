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
import CommentContainer from '../components/CommentContainer.jsx';

export default function Watch() {
  let urlParams = getUrlParameters();
  let id = urlParams.get("v");

  //Fetch comments:
  //TODO: Add support for fetching not just the first page of comments, but multiple pages and catch exceptions if there are no comments for the video. 
  let [videoComments, setVideoComments] = useState({});
  let [fetchedComments, setFetchedComments] = useState(false);
  useEffect(() => {
    if (!fetchedComments) {
      fetch(buildFullURL("/video/get_comments_page?v=" + id + "&page_index=0")).then((resp) => resp.text()).then((text) => {
        console.log("get_comments_page results: ");
        console.log(text);
        setVideoComments(parseJSONTextWithBigInt(text));
      });
      setFetchedComments(true);
    }
  });

  //Build the component: 
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
      <CommentContainer comments={videoComments} />
      <Footer />
    </>
  );
}

function ExternalScript({ scriptFile }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = scriptFile;
    document.body.appendChild(script);

    // Remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="widget-container" />;
}
