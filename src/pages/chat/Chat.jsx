import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FaArrowDown, FaCamera, FaCheck, FaCheckDouble, FaChevronLeft, FaEdit, FaEyeSlash, FaGift, FaPencilAlt, FaRegGrinWink, FaRegStar, FaRegTimesCircle, FaReply, FaThumbsUp, FaTimes, FaTrash, FaTrashAlt } from 'react-icons/fa'
import { IoChatbubbles, IoCheckmark, IoImageOutline, IoInformation, IoSend } from 'react-icons/io5'
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { Link, useParams } from 'react-router-dom'
import Online from '../../components/user/Online'
import { firestore, storage } from '../../firebaseConfig';
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Chat = ({appState, setAppState, fetchAllMessages}) => {
    const params = useParams()
    const uid = params?.uid
    const [user, setUser] = useState(null)
    const [chat, setChat] = useState()
    const [notFound, setNotFound] = useState(false)
    const [replying, setReplying] = useState(null)
    
    // Usage
    const appRef = useRef(null)
    const scrollToBottom =()=>{
        appRef?.current?.scrollTo(0, appRef?.current?.scrollHeight);
    }

    useLayoutEffect(()=>{
        if(appRef?.current){
            scrollToBottom()
        }
    },[appState?.user, uid])
    
    useEffect(()=>{
        const chatMessagesX = appState?.messages?.filter((message)=>{
            return (message?.from === appState?.user?.uid && message?.to === uid) || (message?.to === appState?.user?.uid && message?.from === uid)
        })
        async function sortByFirestoreTimestamp(messages) {
            return messages?.sort((a, b) => a?.timestamp?.seconds - b?.timestamp?.seconds);
        }
        const getMessages = async()=>{
            const chatMessages = await sortByFirestoreTimestamp(chatMessagesX);
            const thisUser = appState?.users?.find((user)=>{
                return user?.uid === uid
            })
            if(thisUser){
                setUser(thisUser)
            } else{
                setNotFound(true)
            }
            if(chatMessages){
                setChat({
                    messages: [...chatMessages],
                    uid: user?.uid,
                    user: thisUser,
                })
            } else{
            }
        }
        getMessages()
    },[appState?.messages, appState?.user, uid])

    const [message,  setMessage] = useState(null)
    const [file,  setFile] = useState(null)
    const [src,  setSrc] = useState(null)
    const [sending,  setSending] = useState(false)
    const [addPhoto,  setAddPhoto] = useState(false)
    const handleImageChange = (e)=>{
        setAddPhoto(true)
        const file = e.target?.files[0]
        setFile(file)

        let reader = new FileReader();

        reader.onloadend = () => {
        setSrc(reader.result);
        }

        if (file) {
        reader.readAsDataURL(file);
        }
    }

    async function sendMessage({fromUserId, toUserId, text, isReply, replyToMessageId}) {
        setSending(true)
        const date = new Date()
        const hour = date?.getHours()
        const minutes = date?.getMinutes()
        const timestamp = serverTimestamp()
        function getCurrentTimestampInSeconds() {
            return Math.floor(Date.now() / 1000);
        }
        const seconds = timestamp?.seconds || getCurrentTimestampInSeconds()
        const data = {
            from: fromUserId,
            to: toUserId,
            text: text,
            hour,
            minutes,
            seconds,
            timestamp, // Firestore uses serverTimestamp, but this is for demonstration
            type: "text",
            isReply: isReply,
            date,
            replyToMessageId: replyToMessageId,
          }
        try{
            const docRef = await addDoc(collection(firestore, "messages"), data);
              console.log("Message sent with ID: ", docRef.id);
              fetchAllMessages()
              setSending(false)
              setMessage("")
              setReplying(null)
              scrollToBottom()
            } catch(error){
                setSending(false)
                console.error(error)
        }
    }
    
    async function sendImageMessage({fromUserId, toUserId, imageFile, isReply, replyToMessageId}) {
        setSending(true); // Assuming setSending is a useState setter to indicate the sending status
      
        // Upload the image to Firebase Storage first
        const storageRef = ref(storage, `messages/${imageFile.name}-${Date.now()}`);
        try {
          // Upload the file to Firebase Storage
          const snapshot = await uploadBytes(storageRef, imageFile);
          const imageUrl = await getDownloadURL(snapshot.ref); // Get the URL of the uploaded file
      
          // Prepare the data to be saved in Firestore, including the image URL
          const date = new Date();
          const hour = date.getHours();
          const minutes = date.getMinutes();
          const data = {
            from: fromUserId,
            to: toUserId,
            hour,
            minutes,
            timestamp: serverTimestamp(),
            type: "image",
            imageUrl, // Include the image URL in the Firestore document
            isReply,
            text: "Image",
            date,
            replyToMessageId,
          };
      
          // Add the document to Firestore
          const docRef = await addDoc(collection(firestore, "messages"), data);
          console.log("Message sent with ID: ", docRef.id);
      
          // Assuming these are useState setters to reset the UI state after sending
          fetchAllMessages();
          setSending(false);
          setMessage(""); 
          setFile(null); 
          setAddPhoto(false); 
          setSrc(null); 
          setReplying(null); 
          scrollToBottom(); 
        } catch (error) {
          setSending(false);
          console.error(error);
        }
      }
    
    //   chat

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const fromUserId = appState?.user?.uid
        const toUserId = uid
        const text = message
        const isReply = replying?.text || false
        const replyToMessageId= replying?.id || ""
        setSending(true)

        if(!file && !addPhoto){
            sendMessage({
                fromUserId,
                toUserId,
                text,
                isReply,
                replyToMessageId,
            })
        } else{
            const imageFile = file
            sendImageMessage({
                fromUserId,
                toUserId,
                imageFile,
                isReply,
                replyToMessageId,
            })
        }
    }

    async function deleteMessage(messageId) {
        const confirm = window.confirm("Are you Sure?")
        if(confirm){
            try {
              await deleteDoc(doc(firestore, "messages", messageId));
            } catch (error) {
              console.error("Error deleting message: ", error);
            }
        }
      }

      const [isVisible, setIsVisible] = useState(false);


  // Function to check whether the user is at the bottom of the page
  const checkScrollBottom = () => {
    const scrollHeight = appRef?.current?.scrollHeight
    const offsetHeight = appRef?.current?.offsetHeight
    const scrollTop = appRef?.current?.scrollTop
    const isBottom = scrollTop >= scrollHeight - (offsetHeight + 100)
    setIsVisible(!isBottom);
  };

  useLayoutEffect(() => {
    // Check whether to show the button when the component mounts
    checkScrollBottom();

    // Add event listeners for scroll and resize events
    appRef?.current?.addEventListener('scroll', checkScrollBottom);
    window.addEventListener('resize', checkScrollBottom);

    // Cleanup function to remove the event listeners
    return () => {
      appRef?.current?.removeEventListener('scroll', checkScrollBottom);
      window.removeEventListener('resize', checkScrollBottom);
    };
  }, [appRef?.current]);

    return (
        <>
            {notFound && <div className='page user--page chat--page' ref={appRef}>
                <div className='container'>
                    <p style={{color: "#666", fontSize: "14px", marginTop: "30px"}}>
                        404 || chat not found
                    </p>
                </div>
            </div>}
            {user?.uid && <>
                {replying && <div className='replying' style={{
                    position: "fixed",
                    bottom: "90px",
                    zIndex: "40",
                    gap: "10px",
                    border: "1px solid #0002",
                    borderRadius: "100px",
                    backgroundColor: "#fffd",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px 10px",
                    paddingRight: "20px",
                    backdropFilter: "blur(10px)"
                }}>
                    <FaReply style={{
                        color: "#0004",
                        width: "30px",
                        height: "30px",
                        padding: "7px",
                        borderRadius: "1000px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "1px solid #0004",
                    }} />
                    <p style={{
                        fontSize: "12px",
                        color: "#333",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        {replying?.text === "Image" && <IoImageOutline />}{replying?.text}
                    </p>
                    <FaRegTimesCircle className='rotate hover' style={{
                        position: "absolute",
                        top: "-4px",
                        right: "4px",
                        color: "red",
                        backgroundColor: "#fff",
                        boxShadow: "0px 0px 0px 1px #f003",
                        background: "#fff",
                        backdropFilter: "blur(10px)",
                        cursor: "pointer",
                        borderRadius: "1000px",
                        width: "20px",
                        height: "20px",
                        padding: "2px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }} onClick={()=>{
                        setReplying(null)
                    }} />
                </div>}
                <div className='message-bar menu-bar' style={{
                    overflow: "hidden",
                    alignItems: "stretch"
                }}>
                    {!file ? <button className='action' style={{
                        opacity: replying ? "0.5": "1",
                        marginLeft: (replying || message) ? "-100px" : "0"
                    }} disabled={replying || message} onClick={()=>{
                        setAddPhoto(!addPhoto)
                        setFile(null)
                        setSrc(null)
                    }}>
                        {!addPhoto ? <FaCamera /> : <FaTimes />}
                    </button> :
                    <button className='action' style={{
                        opacity: replying ? "0.5": "1",
                        marginLeft: (replying || message) ? "-100px" : "0"
                    }} disabled={replying || message} onClick={()=>{
                        setFile(null)
                        setSrc(null)
                    }}>
                        {!addPhoto ? <FaCamera /> : <FaTrashAlt style={{
                                position: "relative",
                            }} />}
                    </button>}
                    <button className='action'  style={{
                        opacity: replying ? "0.5": "1",
                        display: "none",
                    }} disabled={replying || message} >
                        <FaGift />
                    </button>
                    <form onSubmit={(e)=>{
                        if(!sending){
                            handleSubmit(e)
                        }
                    }}  style={{
                            minHeight: "40px"
                        }}>
                        {!addPhoto ? <input disabled={sending} value={message} onChange={(e)=>{
                            setMessage(e.target.value)
                        }} type='text' maxLength={300} required placeholder='Type your message' />:
                        <>
                        {file ? <label style={{
                            width: "100%",
                        }}>
                            <img src={src} alt='' style={{
                                height:"200px",
                                width: "100%",
                                borderRadius: "10px",
                            }} />
                        </label> : <label style={{
                            width: "100%",
                            padding: "10px 15px",
                            fontSize: "14px",
                            height: "40px",
                            border: "1px solid #0003",
                            borderRadius: "1000px",
                            fontWeight: "500",
                            cursor: "pointer"
                        }} htmlFor='image-inp'>
                            Choose an image
                        </label>}
                        
                        <input style={{
                            minHeight: "100%",
                            height: "40px",
                            display: "none",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "10px 15px",
                        }} type="file" accept='image/*' id='image-inp' onChange={handleImageChange} />
                        </>}
                        <>
                            {addPhoto ? 
                            <>
                                {file && <button>
                                    {sending ? <div className='spinner small white'></div> :<IoSend />}
                                </button>}
                            </>
                            : <button>
                                {sending ? <div className='spinner small white'></div> :<IoSend />}
                            </button>}
                        </>
                    </form>
                </div>
                {(isVisible && !replying) && (
                    <button onClick={scrollToBottom} className='scroll-bottom'>
                        <FaArrowDown />
                    </button>
                )}
                <div className='page user--page chat--page' ref={appRef}>
                    <div className='container'>
                        <Link Link to={`/user/${user?.uid}`} className='head'>
                            <div className='back' style={{
                                backgroundImage: `url(${user?.profileImageUrl})`,
                                backgroundSize: "cover",
                            }}>
                                {/* <IoInformation /> */}
                            </div>
                            <p className='name' style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "10px",
                                color: "#555",
                                textDecoration: "none"
                            }}>
                                {user?.name} 
                                <Online isOnline={user?.isOnline} uid={user?.uid} />
                            </p>
                        </Link>
                        <section className='chat--section'>
                            {
                                chat?.messages?.map((message, index)=>{
                                    const id = message?.id
                                    const text = message?.text
                                    const details = {
                                        id,
                                        text: text?.length < 25 ? text : `${text?.slice(0, 24)}...`
                                    }
                                    const indexPlus = index + 1
                                    const timestamp = message?.timestamp
                                    {/* const timestamp = {seconds: 1711911081, nanoseconds: 949000000}; */}

                                    // Convert the Firestore Timestamp object to a JavaScript Date object manually
                                    const seconds = message?.seconds || timestamp?.seconds || 0
                                    const date = new Date(seconds * 1000);

                                    const formattedTime = date?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                                    const totalMessages = chat?.messages?.length
                                    const prevmessage = index > 0 ? chat[index - 1] : null
                                    const nextmessage = (indexPlus !== totalMessages) ? chat[indexPlus] : null
                                    const fromThisUser = message?.from === appState?.user?.uid
                                    const getDetails = ()=>{
                                        {/* console.log(message) */}
                                    }
                                    return (
                                        <div key={index} className={`message-holder ${fromThisUser ? "right" : ""} ${prevmessage ? "" : "is-first"} ${nextmessage ? "" : "is-last"} ${id ? "" : "is-sending right"}`}>
                                            {!seconds ? <></> : <button className={`message has-reply ${message?.type === "image" ? "image" : ""}`} onClick={getDetails} style={{
                                                display: seconds ? "flex" : "none",
                                            }}>
                                                {!id && <div className='spinner'></div>}
                                                {message?.isReply && <div className='reply'>
                                                    {message?.isReply === "Image"&& <IoImageOutline />} {message?.isReply || "..."}
                                                </div>}
                                                {message?.type === "image" && <img src={message.imageUrl} alt='' />}
                                                {message?.type === "text" && <p>
                                                    {message?.text}
                                                </p>}
                                                <div className='details'>
                                                    <p className='time'>{formattedTime || "00"}</p>
                                                    <div className='status'>
                                                        {id ? <IoCheckmarkDoneSharp /> : <IoCheckmark />} 
                                                    </div>
                                                    <div className=' actions' onClick={()=>{
                                                        setReplying(details)
                                                        setFile(null)
                                                        setAddPhoto(false)
                                                        setSrc(null)
                                                    }}>
                                                        <FaReply />
                                                    </div>
                                                    <div className=' actions ii' onClick={()=>{
                                                        setFile(null)
                                                        setAddPhoto(false)
                                                        setSrc(null)
                                                        deleteMessage(message?.id)
                                                    }}>
                                                        <FaTrashAlt />
                                                    </div>
                                                </div>
                                            </button>}
                                        </div>
                                    )
                                })
                            }
                        </section>
                        {
                            chat?.messages?.length < 1 && <p style={{
                                width: "100%",
                                textAlign: "center",
                                marginTop: "40px",
                                padding: "20px 20px",
                                fontSize: "12px",
                                color: "#0009",
                                backdropFilter: "blur(1px)",
                                borderRadius: "20px",
                                background: "#0000000a",
                                maxWidth: "300px",
                                border: "1px solid #0001"
                            }}> 
                                Messages sent on <b>The Love Universe</b> are end-to-end encrypted
                            </p>
                        }

                    </div>
                </div>
            </>}
        </>
    )
}

export default Chat