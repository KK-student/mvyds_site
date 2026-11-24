import { useState } from 'react';

import { buildFullURL, isEmptyObject, parseJSONTextWithBigInt } from '../misc_functions.js';

export default function User({ user_id }) {
  let user_id_encoded = encodeURIComponent(user_id);
  // let [user_info, setUserInfo] = useState({});
  // let is_user_info_set = !isEmptyObject(user_info);
  // console.log("is_user_info_set: ");
  // console.log(is_user_info_set);
  // if (!is_user_info_set) {
  //   fetch(buildFullURL(`/user/get_public_info?user_id=${user_id_encoded}`))
  //     .then((resp) => resp.text())
  //     .then((text) => {
  //       setUserInfo(parseJSONTextWithBigInt(text));
  //     });
  // }
  
  return (
    <>
      <div className="user-container">
        <img src={buildFullURL(`/user/get_user_icon?user_id=${user_id_encoded}`)} />
        <p>{user_id}</p>
      </div>
    </>
  );
}
