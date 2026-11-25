import { useState } from 'react';

import CommentContainer from './CommentContainer.jsx';

import { buildFullURL, isEmptyObject, parseJSONTextWithBigInt } from '../misc_functions.js';

export default function Comment({ author, text, creation_time, replies, show_video = false, video_id }) {
  let [showReplies, setShowReplies] = useState(false);

  let replies_button = <button className="show-hide-replies-button" type="button" onClick={(e) => {
    e.preventDefault();
    setShowReplies(!showReplies);
  }}>
    {!showReplies ? "Show replies" : "Hide replies"}
  </button>;

  let [video_data, setVideoData] = useState({});
  let is_video_data_set = !isEmptyObject(video_data);
  if (!is_video_data_set && show_video) {
    fetch(buildFullURL(`/video/basic_info?v=${video_id}`))
      .then((resp) => resp.text())
      .then((text) => setVideoData(parseJSONTextWithBigInt(text)));
  }

  return (
    <>
      <div className="comment">
        <div className="comment-body">
          {author.length != 0 ? <img src={buildFullURL("/user/get_user_icon?user_id=" + encodeURIComponent(author))} alt={"User icon for \"" + author + "\""} /> : null}
          <div className="comment-text-items">
            <p className="comment-author">{author}</p>
            {show_video ? <a className="comment-video-link" href={`/watch.html?v=${video_id}`}>{is_video_data_set ? video_data.name : "Loading..." }</a> : null}
            <p className="comment-text">{text}</p>
          </div>
        </div>
        { !isEmptyObject(replies) ? replies_button : null }
        <CommentContainer comments={showReplies ? replies : {}} show_video={show_video} video_id={video_id} />
      </div>
    </>
  );
}

export function CommentById({ comment_id, show_video = false }) {
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
        <Comment author={author} text={text} creation_time={creation_time} replies={replies} video_id={comment_data.video_id} show_video={show_video}/>
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
