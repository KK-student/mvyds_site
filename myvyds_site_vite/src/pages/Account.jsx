import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Account />
  </StrictMode>,
)

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Searchbar from '../components/Searchbar.jsx';
import AISlowDownLink from '../components/AISlowDownLink.jsx';
import VideoCell from '../components/VideoCell.jsx';
import User from '../components/User.jsx';
import { CommentById } from '../components/Comment.jsx';
import AccountPageHeader from '../components/AccountPageHeader.jsx';

import { buildFullURL, getUrlParameters, isEmptyObject, parseJSONTextWithBigInt } from '../misc_functions.js';

// class ViewType {
//   static items = ["VIDEOS", "COMMENTS"];
//   static VIDEOS = ViewType.items[0];
//   static COMMENTS = ViewType.items[1];
//
//   static isValid(input) {
//     return ViewType.items.includes(input);
//   }
// }

function Account() {
  // let [view_type, setViewType] = useState(ViewType.VIDEOS);
  // let [user_data, setUserData] = useState({});
  let urlParams = getUrlParameters();
  let user_id;
  if (urlParams.has("user_id")) {
    user_id = urlParams.get("user_id");
  } else {
    user_id = "USER NOT FOUND";
    //TODO: Redirect to 404 page. 
  }

  let user_id_encoded = encodeURIComponent(user_id);
  let [user_data, setUserData] = useState({});
  let is_user_data_set = !isEmptyObject(user_data);
  if (!is_user_data_set) {
    fetch(buildFullURL(`/user/get_public_info?user_id=${user_id_encoded}`))
      .then((resp) => resp.text())
      .then((text) => setUserData(parseJSONTextWithBigInt(text)));
  }

  return (
    <>
      <AccountPageHeader user_id={user_id} user_data={user_data} />
      <AISlowDownLink />
      <AISlowDownLink />
      <AISlowDownLink />
      <AISlowDownLink />
      <AISlowDownLink />
      <AISlowDownLink />
      <AISlowDownLink />
      <Footer />
    </>
  );
}
