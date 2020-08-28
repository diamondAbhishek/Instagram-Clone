import React, { useState, useEffect } from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar"
import { db } from './firebase';
import firebase from 'firebase';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import BookmarkBorderSharpIcon from '@material-ui/icons/BookmarkBorderSharp';
import ShareIcon from '@material-ui/icons/Share';
import MoreHorizSharpIcon from '@material-ui/icons/MoreHorizSharp';
import { CardActions } from '@material-ui/core';

function Post({ postId, user, username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }

        return () => {
            unsubscribe();
        };
    }, [postId])


    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),

        });
        setComment('');
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt="Abhishek"
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
                <div className="post__settings">
                    <IconButton aria-label="settings">
                        <MoreHorizSharpIcon />
                    </IconButton>

                </div>
            </div>

            <img className="post__image" src={imageUrl} alt="" />
            <div className="post__icons">
                <CardActions className="post__cardaction">
                    <IconButton >
                        <FavoriteBorderIcon />
                    </IconButton>

                    <IconButton >
                        <ShareIcon />
                    </IconButton>
                    <IconButton className="post__saveicon">
                        <BookmarkBorderSharpIcon />
                    </IconButton>
                </CardActions>

            </div>
            <h4 className="post__text"> <strong>{username}: </strong>{caption}</h4>


            <div className="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>



            {user && (
                <section className="post__comment">
                    <form className="post__commentBox">
                        <input
                            type="text"
                            className="post__input"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            className="post__button"
                            disabled={!comment}
                            type="submit"
                            onClick={postComment}
                        >
                            Post
                </button>
                    </form>
                </section>

            )}


        </div>
    )
}

export default Post
