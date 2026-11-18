import { useState, useEffect } from "react";
import * as shaka from 'shaka-player/dist/shaka-player.ui.js';
import 'shaka-player/dist/controls.css';

import VideoCell from './VideoCell.jsx';

import BodiedScriptTag from './ScriptTag.jsx';

import { parseJSONTextWithBigInt, buildFullURL } from '../misc_functions.js';

export default function VideoPlayer({ id }) {
  //Get video information:
  let [videoBasicInfo, setVideoBasicInfo] = useState(undefined);
  // if (videoBasicInfo == undefined) {
    useEffect(() => {
      console.log("Fetching video data for video with id: " + id);
      let url = buildFullURL("/video/basic_info?v=" + id);
      // fetch(url).then((resp) => {resp.json()}).then((resp_json) => {console.log("State set."); setVideoBasicInfo(resp_json); console.log(resp_json); console.log("New state: " + resp_json)});
      fetch(url).then((response) => response.text()).then((json_data_text) => {
        setVideoBasicInfo(parseJSONTextWithBigInt(json_data_text));
      });
    }, []);
  // }
  let title;
  let description;
  let author;
  if (videoBasicInfo == undefined) {
    let loading_text = "Loading";
    title = loading_text;
    description = loading_text;
    author = loading_text;
  } else {
    title = videoBasicInfo.name;
    description = videoBasicInfo.description;
    author = videoBasicInfo.author;
  }

  const video_source = buildFullURL("/video/get_video_file/" + id + "/output.mpd");
  //Build the component: 
  return (
    <>
      <div className="video-player">
        <div className="video-player-header">
          {/* <video id="video-player-tag" data-dashjs-player controls src={video_source} poster={buildFullURL("/video/thumbnail_image?v=" + id)}/> */}
          <ShakaPlayer src={video_source} thumbnail_image={buildFullURL("/video/thumbnail_image?v=" + id)} />
          <p className="video-player-author">{author}</p>
          <p className="video-player-title">{title}</p>
        </div>
        <p className="video-player-description">{description}</p>
      </div>
    </>
  );
}

function ShakaPlayer({ src, thumbnail_image }) {
  let player_script = `
const manifestUri = \"${src}\";

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
}

async function initPlayer() {
  // Create a Player instance.
  const video = document.getElementById('shaka-video-player');
  const container = document.getElementById('video-container');

  const player = new shaka.Player();
  const ui = new shaka.ui.Overlay(player, container, video);
  await player.attach(video);

  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;

  // Listen for error events.
  player.addEventListener('error', onErrorEvent);

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri);
    // This runs if the asynchronous load is successful.
    console.log('The video has now been loaded!');
  } catch (e) {
    // onError is executed if the asynchronous load fails.
    onError(e);
  }
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}

initApp();
`;
  return (
    <>
      <div id="video-container">
        <video id="shaka-video-player" poster={thumbnail_image} />
      </div>
      <BodiedScriptTag scriptText={player_script} />
    </>
  );
}

