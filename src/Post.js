import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db, auth, storage } from "./firebase";
import { Button } from "@material-ui/core";
import firebase from "firebase";

function Post({ postId, username, imgUrl, caption }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({
                 id: doc.id, 
                 comment: doc.data() 
                }))
          );
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts")
    .doc(postId)
    .collection("comments")
    .add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };


//   const removeComent = (id) => {
//     db.collection("posts")
//     .doc(postId)
//     .collection("comments")
//     .doc(id)
//     .delete();
//   };

  return (
    <div className="post">
      <div className="post__header">
        <div className="post__userinfo">
          <Avatar
            className="post__avatar"
            alt={username}
            src="/static/images/avatar/1.jpg"
          />
          <h3 className="post__username">{username}</h3>
        </div>
        <img className="post__image" src={imgUrl} alt="" />
      <h4 className="post__text">
        <strong>{username} </strong>
        {caption}
      </h4>
      </div>
      

      <div className="post__comment">
        <small style={{color:"grey"}}>View all comments</small>
        {comments.map(({ id, comment }) => (
          <div key={id} className="post__commentRow">
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>
            <div>

            {/* {(user.displayName === username ||
                user.displayName === comment.username) && (
                <Button
                  className="post__removeComment"
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => removeComent(id)}
                >
                  Remove COMMENT
                </Button>
              )} */}
            </div>
          </div>
        ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            type="text"
            placeholder="Add a comment"
          />
          <button
            disabled={!comment}
            className={`post__button ${comment && "post__commentActive"} `}
            type="submit"
            onClick={postComment}
          >
            Comment
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
