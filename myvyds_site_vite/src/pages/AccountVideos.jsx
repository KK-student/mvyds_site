import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AccountVideos />
  </StrictMode>,
)

import AccountPageHeader from '../components/AccountPageHeader.jsx';
import VideoCell from '../components/VideoCell.jsx';
import Footer from '../components/Footer.jsx';
import AISlowDownLink from '../components/AISlowDownLink.jsx';

import { buildFullURL, getUrlParameters, isEmptyObject, parseJSONTextWithBigInt } from '../misc_functions.js';

function AccountVideos() {
  let urlParameters = getUrlParameters();
  let user_id;
  if (urlParameters.has("user_id")) {
    user_id = urlParameters.get("user_id");
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

  let video_cells = [];
  if (is_user_data_set) {
    for (let video_id of user_data.videos) {
      video_cells.push(<VideoCell key={video_id} id={video_id} />);
    }
  }

  return(
    <>
      <AccountPageHeader user_id={user_id} user_data={user_data} />
      <div className="grid-videos-container">
        {...video_cells}
      </div>
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
