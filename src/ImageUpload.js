import React from 'react'
import { useState } from 'react'
import { Button } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from 'firebase'
import './ImageUpload.css'
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

function ImageUpload({ username }) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    const [open, setOpen] = useState(false);


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                        setOpen(true);
                    });
            }
        )
    }

    return (
        <div>
            <div className="imageupload">
                <LinearProgressWithLabel value={progress} />
                {/* <progress className="imageupload__progress" value={progress} max="100" /> */}
                <input type="text" className="imageupload__caption" placeholder="Enter a caption..." onChange={event => setCaption(event.target.value)} value={caption} />
                <input type="file" id="icon-button-file" className="imageupload__file" onChange={handleChange} />
                <label htmlFor="icon-button-file" className="text-center">
                    <IconButton className="imageupload__picture" color="primary" aria-label="upload picture" component="span">
                        <PhotoCamera />
                    </IconButton>
                </label>
                <Button variant="contained" color="primary" component="span" onClick={handleUpload}>Upload</Button>
            </div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} className="imageupload__snackbar">
                <Alert onClose={handleClose} severity="success">
                    Image Uploaded successfully!
            </Alert>
            </Snackbar>
        </div>
    )
}

export default ImageUpload
