import { useState } from "react";

import { parseJSONTextWithBigInt } from '../misc_functions.js';

export default function VideoCell({id}) {
  let [videoBasicInfo, setVideoBasicInfo] = useState(undefined);
  if (videoBasicInfo == undefined) {
    console.log("Fetching video for video with id: " + id);
    let url = "http://127.0.0.1:5999/video/basic_info?v=" + id;
    // fetch(url).then((resp) => {resp.json()}).then((resp_json) => {console.log("State set."); setVideoBasicInfo(resp_json); console.log(resp_json); console.log("New state: " + resp_json)});
    fetch(url).then((response) => response.text()).then((json_data_text) => {
      setVideoBasicInfo(parseJSONTextWithBigInt(json_data_text));
    });
  }
  let title;
  let description;
  if (videoBasicInfo == undefined) {
    let loading_text = "Loading";
    title = loading_text;
    description = loading_text;
  } else {
    title = videoBasicInfo.name;
    description = videoBasicInfo.description;
  }
  return (
    <>
      <div className="video_cell">
        <img src={"http://127.0.0.1:5999/video/thumbnail_image?v=" + id} alt={"Thumbnail image for the video titled \"" + title + "\""} />
        <p className="video_cell_title">{title}</p>
        <p className="video_cell_description">{description}</p>
      </div>
    </>
  );
}
