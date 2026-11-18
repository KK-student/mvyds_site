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

function get_all_comments_from_pages(comment_pages) {
  let result = {};
  for (let page of comment_pages) {
    for (let comment_id of Object.keys(page)) {
      result[comment_id] = page[comment_id];
    }
  }

  return result;
}

function exists_more_comments(comment_pages, video_id) {
  let result = true;
  let xhr = new XMLHttpRequest();
  let comment_page_url = buildFullURL("/video/get_comments_page?v=" + video_id + "&page_index=" + comment_pages.length);
  xhr.open("GET", comment_page_url, false);
  xhr.onload = () => {
    if (!(xhr.status >= 200 && xhr.status < 300)) {
      result = false;
    }
  };
  xhr.onerror = () => {
    result = false;
  };
  xhr.send();
  return result;
}

export default function Watch() {
  let urlParams = getUrlParameters();
  let id = urlParams.get("v");

  //Fetch comments:
  let [videoCommentPages, setVideoCommentPages] = useState([]);
  let [wantedNumCommPages, setWantedNumCommPages] = useState(1);
  setTimeout(() => {
    if (videoCommentPages.length >= wantedNumCommPages) {
      return;
    } 
    let videoCommentPagesClone = structuredClone(videoCommentPages);
    let more_available = true;
    let req_error_func = (i) => {
        more_available = false;
        setWantedNumCommPages(i);
    };
    for (let i = videoCommentPagesClone.length; more_available && videoCommentPagesClone.length < wantedNumCommPages; i++) {
      let comment_page_url = buildFullURL("/video/get_comments_page?v=" + id + "&page_index=" + i);
      let xhr = new XMLHttpRequest();
      xhr.open("GET", comment_page_url, false);
      xhr.onload = () => {
        if (!(xhr.status >= 200 && xhr.status < 300)) {
          req_error_func(i);
          return;
        }
        let comment_page = parseJSONTextWithBigInt(xhr.responseText);
        videoCommentPagesClone.push(comment_page);
      };
      xhr.onerror = () => {
        req_error_func(i);
      };
      xhr.send();
    }
    let clone_clone = structuredClone(videoCommentPagesClone);
    setVideoCommentPages(clone_clone);
    console.log("Current number of comment pages: " + videoCommentPagesClone.length);
  });

  let has_more_comments = exists_more_comments(videoCommentPages, id);

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
      <CommentContainer comments={get_all_comments_from_pages(videoCommentPages)} />
      { has_more_comments ? <button type="button" className="get-more-comments-button" onClick={(e) => {
        e.preventDefault();
        console.log("Getting more comments");
        setWantedNumCommPages(wantedNumCommPages + 1);
      }} >More comments</button> : null }
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
