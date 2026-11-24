import { StrictMode, useState } from 'react';

import Header from './Header.jsx';
import Searchbar from './Searchbar.jsx';
import AISlowDownLink from './AISlowDownLink.jsx';
import VideoCell from './VideoCell.jsx';
import User from './User.jsx';
import { CommentById } from './Comment.jsx';

import { buildFullURL, isEmptyObject, parseJSONTextWithBigInt } from '../misc_functions.js';

export default function AccountPageHeader({ user_id, user_data }) {
  // let [user_data, setUserData] = useState({});
  let is_user_data_set = !isEmptyObject(user_data);
  let loading_text = "Loading...";
  let user_id_encoded = encodeURIComponent(user_id);

  // if (!is_user_data_set) {
  //   fetch(buildFullURL(`/user/get_public_info?user_id=${user_id_encoded}`))
  //     .then((resp) => resp.text())
  //     .then((text) => {
  //       console.log("Received data: ");
  //       console.log(text);
  //       setUserData(parseJSONTextWithBigInt(text))
  //     });
  // }

  let description;
  let time_created;
  if (is_user_data_set) {
    description = user_data.description;
    time_created = new Date(user_data.time_created * 1000);
  } else {
    description = loading_text;
    time_created = new Date(0);
  }
  return (
    <>
      <Header />
      <AISlowDownLink />
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
      <img src={buildFullURL("/user/get_user_icon?user_id=" + encodeURIComponent(user_id))} alt={`Channel background image for ${user_id}`} /> {/*TODO: Change this to the user's channel background image!*/}
      <div className="header-line" />
      <User user_id={user_id} />
      <div className="account-header-user-desc">
        <h2>Description: </h2>
        <p>{description}</p>
        <p>Time created: {time_created.toString()}</p>
      </div>
      <div className="account-page-nav-links">
        <a href={"/account/videos.html?user_id=" + user_id_encoded}>Videos</a>
        <a href={"/account/comments.html?user_id=" + user_id_encoded}>Comments</a>
        <a href={"/account/playlists.html?user_id=" + user_id_encoded}>Playlists</a>
        <a href={"/account.html?user_id=" + user_id_encoded}>User Home</a>
      </div>
    </>
  );
}
