import { Button } from '@material-ui/core'
import React, { useState } from 'react';
import {db,storage} from "./firebase"
import firebase from "firebase"
import "./ImageUpload.css"

function ImageUpload({username}) {
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [caption,setCaption] =useState('')


    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }


    const handleUpload=()=>{
        // Upload to firebase
            const uploadTask = storage.ref(`images/${image.name}`).put(image)
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress = Math.round(
                        (snapshot.bytesTransferred/snapshot.totalBytes)*100
                    )
                    setProgress(progress)
                },
                (error)=>{
                    console.log(error)
                    alert(error.message)
                },
                ()=>{
                    // Download the uploaded imge from firebase
                    storage
                    .ref("images").child(image.name).getDownloadURL()
                    .then(url=>{
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption:caption,
                            // getting the url and giving it to the app
                            imgUrl:url,
                            username:username,

                        })

                        setProgress(0)
                        setCaption("")
                        setImage(null)
                    })
                }
            )
    }

    return (
        <div className="imageUpload">
            {/* <p>Upload an Image</p> */}
            <progress className="imageUpload__progress" value={progress} max="100"/>
            <input type="text" className="caption" placeholder="Enter a caption" onChange={e=>setCaption(e.target.value)} value={caption} />
            <input className="browseFile" type="file"  onChange={handleChange}/>
            <Button variant="contained" className="imageUpload__button" onClick={handleUpload}>
                Upload Image
            </Button>
        </div>
    )
}

export default ImageUpload
