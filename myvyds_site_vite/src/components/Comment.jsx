import { useState } from 'react';

import CommentContainer from './CommentContainer.jsx';

import { buildFullURL, isEmptyObject, parseJSONTextWithBigInt } from '../misc_functions.js';

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
          {author.length != 0 ? <img src={buildFullURL("/user/get_user_icon?user_id=" + encodeURIComponent(author))} alt={"User icon for \"" + author + "\""} /> : null}
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

export function CommentById({ comment_id }) {
  let [comment_data, setCommentData] = useState({});
  let is_comment_data_set = !isEmptyObject(comment_data);
  if (!is_comment_data_set) {
    fetch(buildFullURL(`/comment/get_comment?comment_id=${comment_id}`))
      .then((resp) => resp.text())
      .then((text) => setCommentData(parseJSONTextWithBigInt(text)));
  }
  if (is_comment_data_set) {
    let author = comment_data.author;
    let text = comment_data.text;
    let creation_time = comment_data.creation_time;
    let replies = comment_data.replies;
    return (
      <>
        <Comment author={author} text={text} creation_time={creation_time} replies={replies}/>
      </>
    );
  } else {
    return (
      <>
        <Comment author="" text="Loading..." creation_time={0} replies={{}}/>
      </>
    );
  }
}
