import React, { useState } from "react";
import { dbService, storageService } from "fbase";

const Nweet = ({ nweetObj, isOwner }) => {

    // console.log(nweetObj)

    const [editing, setEditing] = useState(false);

    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async () => {

        const ok = window.confirm("Are you sure you want to delete this nweet?");

        console.log(ok);

        if (ok) {

            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            await storageService.refFromURL(nweetObj.attachmentUrl).delete();

        } else {

        }

    }

    const toggleEditing = () => {
        setEditing((prev) => !prev);
    }

    const onChange = (event) => {

        const { target: {

            value

        } } = event;

        setNewNweet(value);

    }

    const onSubmit = async (event) => {

        event.preventDefault();

        await dbService.doc(`nweets/${nweetObj.id}`).update({ text: newNweet });

        setEditing(false);

    }


    return (
        <div>
            {
                editing ? (<form onSubmit={onSubmit}><input placeholder="Edit your text" onChange={onChange} value={newNweet} required /></form>) : (<><h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} alt="" height="250px" width="250px" />}
                    { isOwner && (<>
                        <button onClick={onDeleteClick}>Delete Nweet</button>
                        <button onClick={toggleEditing}>Edit Nweet </button>
                    </>)
                    }</>)
            }
        </div>);




}

export default Nweet;