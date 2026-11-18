import { useState } from 'react';

import CommentContainer from './CommentContainer.jsx';

import { buildFullURL, isEmptyObject } from '../misc_functions.js';

export default function Comment({ author, text, creation_time, replies }) {
  let [showReplies, setShowReplies] = useState(false);

  let replies_button = <button className="show-hide-replies-button" type="button" onClick={(e) => {
    e.preventDefault();
    setShowReplies(!showReplies);
  }}>
    {!showReplies ? "Show replies" : "Hide replies"}
  </button>;

  return (
    <>
      <div className="comment">
        <div className="comment-body">
          <img src={buildFullURL("/user/get_user_icon?user_id=" + encodeURIComponent(author))} alt={"User icon for \"" + author + "\""} />
          <div className="comment-text-items">
            <p className="comment-author">{author}</p>
            <p className="comment-text">{text}</p>
          </div>
        </div>
        { !isEmptyObject(replies) ? replies_button : null }
        <CommentContainer comments={showReplies ? replies : {}} />
      </div>
    </>
  );
}
