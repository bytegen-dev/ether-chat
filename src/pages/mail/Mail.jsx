import React, { useEffect, useState } from 'react'
import { FaCamera, FaCheck, FaCheckDouble, FaChevronLeft, FaEnvelope, FaEyeSlash, FaGift, FaRegGrinWink, FaRegStar, FaRegTimesCircle, FaReply, FaThumbsUp, FaTimes } from 'react-icons/fa'
import { IoAttach, IoCamera, IoChatbubbles, IoCheckmark, IoInformation, IoInformationCircleOutline, IoSend } from 'react-icons/io5'
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { Link, useNavigate, useParams } from 'react-router-dom'
import Online from '../../components/user/Online'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseConfig';

const Mail = ({appState, setAppState}) => {
    const params = useParams()
    const uid = params?.uid
    const [user, setUser] = useState(null)
    const [notFound, setNotFound] = useState(false)
    const userChats = appState?.mails || []
    const [userInfo, setUserInfo] = useState({
        heading:"",
        text: ""
    })
    const [attachment, setAttachment] = useState(null)

    const handleChange = (e)=>{
        const {name, value} = e.target
        setUserInfo((prev)=>{
            return ({
                ...prev,
                [name]: value
            })
        })
    }

    const handleFIleChange = (e)=>{
        const file = e?.target?.files[0]
        setAttachment(file)
    }

    const navigate = useNavigate()

    useEffect(()=>{
        const thisUser = appState?.users?.find((user)=>{
            return user?.uid === uid
        })
        if(thisUser){
            setUser(thisUser)
            setNotFound(false)
        } else{
            setNotFound(true)
        }
    },[appState?.user])

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const {heading, text} = userInfo
        const timestamp = serverTimestamp()
        function getCurrentTimestampInSeconds() {
            return Math.floor(Date.now() / 1000);
        }
        const seconds = timestamp?.seconds || getCurrentTimestampInSeconds()
        const storageRef = ref(storage, `attachments/${attachment?.name}-${Date.now()}`);
        
        
        try{
            setAppState((prev)=>{
                return ({
                    ...prev,
                    isLoadingX: true,
                })
            })
            let fileUrl
            if(attachment){
                const snapshot = await uploadBytes(storageRef, attachment);
                fileUrl = await getDownloadURL(snapshot.ref);
            }
            const from = appState?.user?.uid
            const to = uid
            const id = `${from}-${to}-${seconds}`
            const data = {
                from,
                to,
                seconds,
                id,
                heading,
                text,
                timestamp,
                fileName: attachment ? attachment?.name : "" ,
                fileUrl: fileUrl || "",
            }
            const docRef = await addDoc(collection(firestore, "mails"), data);
            navigate("/mails")
            setAppState((prev)=>{
                return ({
                    ...prev,
                    isLoadingX: false,
                })
            })
        } catch (error){
            console.error(error)
        }
    }
    return (
        <>
            {notFound && <div className='page user--page chat--page'>
                <div className='container'>
                    <p style={{color: "#666", fontSize: "14px", marginTop: "30px"}}>
                        {appState?.mails ? "404 || user not found" :"Please wait..."}
                    </p>
                </div>
            </div>}
            {user?.uid && <>

                <div className='page user--page chat--page mail--page'>
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
                                {user?.name} <Online isOnline={!user?.isOnline} />
                            </p>
                        </Link>
                        <section className='chat--section'>
                            <h3>Send an Ether mail to <>{user?.name}</></h3>
                            <form onSubmit={handleSubmit}>
                                <div className='inp-holder'>
                                    <label>Heading</label>
                                    <input required name='heading' value={userInfo?.heading} placeholder={`GM ${user?.name}`} onChange={handleChange} />
                                </div>
                                <div className='inp-holder'>
                                    <label>Body</label>
                                    <textarea required name='text' minLength={5} placeholder={`Start typing...`} value={userInfo?.text} onChange={handleChange} />
                                </div>
                                <div className='attach-files'>
                                    {/* <div className='info'>
                                        <IoInformationCircleOutline />
                                        <p>
                                            Up to 10 files in GIF, JPG and PNG. File size limit: 4 Mb.
                                        </p>
                                    </div> */}
                                    <input type='file' id='attach' onChange={handleFIleChange} />
                                </div>
                                <div className='btn-holder'>
                                    <label htmlFor='attach' className='btn hover outline'>
                                        <IoAttach /> Attach a File
                                    </label>
                                    <button className='btn filled hover' disabled={
                                        !userInfo?.heading || !userInfo?.text
                                    }>
                                        Send mail <FaEnvelope />
                                    </button>
                                </div>
                                <div className='info'>
                                    <p>
                                        Sending an Ether mail costs 100 tokens.
                                    </p>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </>}
        </>
    )
}

export default Mail