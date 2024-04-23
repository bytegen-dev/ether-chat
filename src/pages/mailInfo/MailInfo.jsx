import React, { useEffect, useState } from 'react'
import { FaCamera, FaCheck, FaCheckDouble, FaChevronLeft, FaEnvelope, FaEyeSlash, FaGift, FaRegGrinWink, FaRegStar, FaRegTimesCircle, FaReply, FaThumbsUp, FaTimes } from 'react-icons/fa'
import { IoAttach, IoCamera, IoChatbubbles, IoCheckmark, IoDownload, IoDownloadOutline, IoInformation, IoInformationCircleOutline, IoSend } from 'react-icons/io5'
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { Link, useNavigate, useParams } from 'react-router-dom'
import Online from '../../components/user/Online'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore, storage } from '../../firebaseConfig';

const MailInfo = ({appState, setAppState}) => {
    const params = useParams()
    const uid = params?.id
    const [user, setUser] = useState(null)
    const [notFound, setNotFound] = useState(false)
    const [userInfo, setUserInfo] = useState({
        heading:"",
        text: "",
    })

    const [attachment, setAttachment] = useState(null)

    const handleChange = (e)=>{
        const {name, value} = e.target
        setUserInfo((prev)=>{
            return ({
                ...prev,
            })
        })
    }

    const handleFIleChange = (e)=>{
        const file = e?.target?.files[0]
        setAttachment(file)
    }

    const navigate = useNavigate()

    useEffect(()=>{
        const thisMail = appState?.mails?.find((mail)=>{
            return mail?.id === uid
        })
        // console.log(thisMail)
        const thisUser = appState?.users?.find((user)=>{
            const checkUser = user?.uid === thisMail?.from
            const isUser = thisMail?.from === appState?.user?.uid
            return !isUser ? checkUser : thisMail?.to === user?.uid
        })
        if(thisUser){
            setUser(thisUser)
            setNotFound(false)
        } else{
            setNotFound(true)
        }

        if(thisMail){
            setUserInfo(thisMail)
        }
    },[appState?.user, uid])

    function downloadFile(url, filename) {
        // Create an anchor element
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename || 'download';
    
        // Append the anchor to the body to make it clickable
        document.body.appendChild(anchor);
    
        // Programmatically click the anchor to trigger the download
        anchor.click();
    
        // Remove the anchor from the document
        document.body.removeChild(anchor);
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
    }

    // console.log(userInfo)

    return (
        <>
            {notFound && <div className='page user--page chat--page'>
                <div className='container'>
                    <p style={{color: "#666", fontSize: "14px", marginTop: "30px"}}>
                        {appState?.mails ? "404 || mail not found" :"Please wait..."}
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
                            <h3 style={{
                                textAlign: "center",
                            }}>You {userInfo?.from === appState?.user?.uid ? "sent" : "recieved"} a mail {userInfo?.from === appState?.user?.uid ? "to" : "from"} <span>{user?.name}</span></h3>
                            <form onSubmit={handleSubmit}>
                                <div className='inp-holder'>
                                    <label>Heading</label>
                                    <input required name='heading' value={userInfo?.heading} placeholder='Your Email Header' onChange={handleChange} />
                                </div>
                                <div className='inp-holder'>
                                    <label>Body</label>
                                    <textarea required name='text' minLength={5} placeholder='Type your Email' value={userInfo?.text} onChange={handleChange} />
                                </div>
                                <div className='btn-holder'>
                                    <button className='btn hover outline' onClick={(e)=>{
                                        e.preventDefault()
                                        downloadFile(userInfo?.attachment, `Attachment-from-${user?.name}-${userInfo?.fileName}`);
                                    }}>
                                        <IoDownloadOutline /> Download File
                                    </button>
                                    {userInfo?.from !== appState?.user?.uid && <button className='btn filled' onClick={(e)=>{
                                        e.preventDefault()
                                        console.log("replys")
                                        navigate(`/send-mail/${userInfo?.from}`)
                                    }}>
                                        Reply <FaReply />
                                    </button>}
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </>}
        </>
    )
}

export default MailInfo