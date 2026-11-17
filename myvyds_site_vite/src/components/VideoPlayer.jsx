import { useState, useEffect } from "react";
// import { DashVideo } from '@videojs/react/media/dash-video';
// import { DashVideo } from '@videojs/dash-video';
// import dashjs from 'dashjs';
// import { MediaPlayer } from 'dashjs';
// import { dashjs } from '../dash.all.debug.js';

import VideoCell from './VideoCell.jsx';

import { parseJSONTextWithBigInt, buildFullURL } from '../misc_functions.js';

export default function VideoPlayer({ id }) {
  //Get video information:
  let [videoBasicInfo, setVideoBasicInfo] = useState(undefined);
  if (videoBasicInfo == undefined) {
    console.log("Fetching video data for video with id: " + id);
    let url = buildFullURL("/video/basic_info?v=" + id);
    // fetch(url).then((resp) => {resp.json()}).then((resp_json) => {console.log("State set."); setVideoBasicInfo(resp_json); console.log(resp_json); console.log("New state: " + resp_json)});
    fetch(url).then((response) => response.text()).then((json_data_text) => {
      setVideoBasicInfo(parseJSONTextWithBigInt(json_data_text));
    });
  }
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
  //Build the component: 
  return (
    <>
      <div className="video-player">
        <div className="video-player-header">
          <DashPlayer src={buildFullURL("/video/get_video_file/" + id + "/output.mpd")} />
          <p className="video-player-author">{author}</p>
          <p className="video-player-title">{title}</p>
        </div>
        <p className="video-player-description">{description}</p>
      </div>
    </>
  );
}

function DashPlayer({ src, autoPlay = false, controls = true, ...rest }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const player = dashjs.MediaPlayer().create();
    playerRef.current = player;

    player.initialize(videoRef.current, src, autoPlay);

    // Clean up when the source changes or the component unmounts
    return () => {
      player.reset();
      playerRef.current = null;
    };
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      controls={controls}
      style={{ width: '100%', maxWidth: '960px' }}
      {...rest}
    />
  );
}

