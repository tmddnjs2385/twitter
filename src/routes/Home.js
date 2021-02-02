import { dbService, storageService } from "fbase";

import React, { useEffect, useState } from "react";

import { v4 as uuid4 } from "uuid";

import Nweet from "components/Nweet";


const Home = ({ userObj }) => {

    //  console.log("userObj")
    // console.log(userObj);

    const [nweet, setNweet] = useState("");

    const [nweets, setNweets] = useState([]);

    const [attachment, setAttachment] = useState();

    const getNweets = async () => {

        const dbNweets = await dbService.collection("nweets").get();

        dbNweets.forEach((document) => {

            const nweetObject = {

                ...document.data(),
                id: document.id,

            };

            setNweets((prev) => [nweetObject, ...prev]);

        });

        //   console.log(dbNweets);

    }

    useEffect(() => {

        getNweets();

        dbService.collection("nweets").onSnapshot((snapshot) => {

            // console.log("snapshot");
            // console.log(snapshot);

            const nweetArray = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            // console.log(nweetArray);

            setNweets(nweetArray);
        });




    }, [])



    const onSubmit = async (event) => {

        event.preventDefault();

        let attachmentUrl;

        if (attachment !== "") {

            const fileRef = storageService.ref().child(`${userObj.uid}/${uuid4()}`);

            const response = await fileRef.putString(attachment, 'data_url');

            attachmentUrl = await response.ref.getDownloadURL();

            // console.log(response);
        }



        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }

        await dbService.collection("nweets").add(nweetObj);

        setNweet("");

        setAttachment(null);
    }

    const onChange = (event) => {

        const {
            target: { value }
        } = event;

        setNweet(value);

    }

    const onFileChange = (event) => {

        const { target: { files } } = event;

        const theFile = files[0];

        //  console.log(theFile);

        const reader = new FileReader();

        reader.onloadend = (finishedEvent) => {

            //  console.log(finishedEvent);

            const { currentTarget: {
                result
            } } = finishedEvent;

            setAttachment(result);

        }
        reader.readAsDataURL(theFile);
    }

    const onClearAttachment = () => {

        setAttachment(null);

    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="what's on your mind?" maxLength={120} onChange={onChange} value={nweet} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Nweet" />

                {attachment && (<div>
                    <img src={attachment} width="50px" height="50px" alt="" />
                    <button onClick={onClearAttachment}>clear</button>
                </div>)}
            </form>

            <div>
                {nweets.map((nweet) =>

                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />

                )}

            </div>


        </div>
    );

}

export default Home;