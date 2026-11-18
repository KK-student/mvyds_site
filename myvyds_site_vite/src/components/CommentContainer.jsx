import Comment from './Comment.jsx';

export default function CommentContainer({ comments }) {
  let comments_react = [];
  for (let comment_data_key of Object.keys(comments)) {
    let comment_data = comments[comment_data_key];
    console.log("comment_data: ");
    console.log(comment_data);
    comments_react.push(<Comment {...comment_data}/>);
  }

  return (
    <>
      <div className="comments-container">
        {comments_react}
      </div>
    </>
  );
}
