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
import { CommentContainerByIDs } from '../components/CommentContainer.jsx';

import { buildFullURL, getUrlParameters, isEmptyObject, parseJSONTextWithBigInt } from '../misc_functions.js';

function Account() {
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

  console.log("User comments: ");
  console.log(user_data.comments);

  return (
    <>
      <AccountPageHeader user_id={user_id} user_data={user_data} />
      <CommentContainerByIDs comment_ids={is_user_data_set ? user_data.comments : []} show_video={true} />
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
