import Comment from './Comment.jsx';
import { CommentById } from './Comment.jsx';

export default function CommentContainer({ comments, show_video = false, video_id = 0 }) {
  let comments_react = [];
  for (let comment_data_key of Object.keys(comments)) {
    let comment_data = comments[comment_data_key];
    console.log("Comment data: ");
    console.log(comment_data);
    comments_react.push(<Comment {...comment_data} show_video={show_video} video_id={video_id} />);
  }

  return (
    <>
      <div className="comments-container">
        {comments_react}
      </div>
    </>
  );
}

export function CommentContainerByIDs({ comment_ids, show_video = false }) {
  let comments_react = [];
  for (let comment_id of comment_ids) {
    comments_react.push(<CommentById comment_id={comment_id} show_video={show_video} />);
  }

  return (
    <>
      <div className="comments-container">
        {...comments_react}
      </div>
    </>
  );
}
