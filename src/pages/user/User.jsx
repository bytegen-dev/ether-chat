import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FaChevronLeft, FaCopy, FaDiscord, FaEyeSlash, FaGift, FaRegEnvelope, FaRegGrinWink, FaRegStar, FaStar, FaThumbsUp } from 'react-icons/fa'
import { IoChatbubbles } from 'react-icons/io5'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Online from '../../components/user/Online'
import { doc, updateDoc } from 'firebase/firestore'
import { firestore } from '../../firebaseConfig'
import { FaXTwitter } from 'react-icons/fa6'

const User = ({appState, setAppState}) => {
    const params = useParams()
    const uid = params?.uid
    const [user, setUser] = useState(null)
    const [notFound, setNotFound] = useState(false)
    useEffect(()=>{
        const users = appState?.users
        const thisUser = users?.find((user)=>{
            return user?.uid === uid
        })
        if(thisUser){
            setUser(thisUser)
            setNotFound(false)
        } else{
            setNotFound(true)
        }
    },[appState?.users, uid])
    const thisUser = appState?.user
    const [isFavorite, setIsFavorite] = useState(false)
    const followingX = thisUser?.following || []
    const [following, setFollowing ] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(()=>{
        if(followingX){
            setFollowing(followingX)
        } else{
            setFollowing([])
        }
    },[])
    useLayoutEffect(()=>{
        const isFavorite = thisUser?.following?.includes(user?.uid)
        if(isFavorite){
            setIsFavorite(true)
            setFollowing(thisUser?.following)
        } else{
            setIsFavorite(false)
            setFollowing(thisUser?.following)
        }
    }, [thisUser])
    useEffect(()=>{
        const update = async()=>{
            try{
                const details = thisUser
                const userDoc = doc(firestore, 'users', thisUser?.uid);
                await updateDoc(userDoc, {
                    ...details,
                    uid: thisUser?.uid,
                    following,
                });
                setIsLoading(false)
            } catch(error){
                setIsLoading(false)
                console.error(error)
            }
        }
        update()
    },[following])
    // console.log(following)
    const addFavorite = async (uid)=>{
        setIsLoading(true)
        setIsFavorite(true)
        try{
            const newFollowing = [...following, uid]
            setFollowing(newFollowing)
            setAppState((prev)=>{
                return {
                    ...prev,
                    user: {
                        ...prev.user,
                        following: newFollowing
                    }
                }
            })
        } catch(error){
            console.error(error)
        }
    }

    const removeFavorite = async (uid)=>{
        setIsLoading(true)
        setIsFavorite(false)
        const newFollowing = following?.filter((userx)=>{
            return userx !== uid
        })
        setFollowing(newFollowing)
        setAppState((prev)=>{
            return {
                ...prev,
                user: {
                    ...prev.user,
                    following: newFollowing
                }
            }
        })
    }
    const copyToClipBoard = (value)=>{
        navigator.clipboard.writeText(value)
        alert("Copied Successfully")
    }
    const navigate = useNavigate()
    return (
        <>
            {notFound && <div className='page user--page'>
                <div className='container'>
                    <p style={{color: "#666", fontSize: "14px", marginTop: "30px"}}>
                        404 || not found
                    </p>
                </div>
            </div>}
            {user?.uid === appState?.user?.uid? <>
                <Navigate to={"/account"} replace={true} />
            </> : <>
                {user?.uid && <div className='page user--page'>
                    <div className='container'>
                        <div className='head mid'>
                            <Link to={"/search"} className='back'>
                                <FaChevronLeft />
                            </Link>
                            {/* <div className='user-img'>
                                <img src={user?.profileImageUrl} alt='' width={40} />
                                <Online isOnline={user?.isOnline} />
                            </div> */}
                            <p className='name'>
                                Search
                            </p>
                        </div>
                        <section className='intro'>
                            <div className='big-img'>
                                <img src={user?.profileImageUrl} alt='' width={300} />
                                <div className='bottom'>
                                    <p>
                                        {user?.name}
                                    </p>
                                    <Online isOnline={user?.isOnline} uid={user?.uid} />
                                </div>
                            </div>
                            <div className='bio'>
                                <b className='i'></b>
                                <p>
                                    {user?.bio}
                                </p>
                                <b className='ii'></b>
                            </div>
                            <div className='btn-holder'>
                                <Link to={`/chat/${uid}`} className='btn filled'>
                                    <IoChatbubbles />
                                    <p>
                                        Send a message
                                    </p>
                                </Link>
                            </div>
                            <div className='actions'>
                                <button>
                                    <FaGift />
                                    <p>
                                        Gift
                                    </p>
                                </button>
                                <button onClick={()=>{
                                    navigate(`/send-mail/${user?.uid}`)
                                }}>
                                    <FaRegEnvelope />
                                    <p>
                                        Mail
                                    </p>
                                </button>
                                <button  disabled={isLoading} onClick={()=>{
                                    if(isFavorite){
                                        removeFavorite(user?.uid)
                                    } else{
                                        addFavorite(user?.uid)
                                    }
                                }}>
                                    {isFavorite ? <FaStar/> : <FaRegStar />}
                                    <p>
                                        Follow
                                    </p>
                                </button>
                            </div>
                        </section>

                        <section className='photos public'>
                            <h3 style={{
                                textTransform: "uppercase"
                            }}>
                                {user?.name}'S GALLERY
                            </h3>
                            {user?.gallery?.length ? <div className='photos-holder'>
                                {user?.gallery?.map((url, index)=>{
                                    return (
                                        <img src={url} key={index} className='photo' />
                                    )
                                })}
                            </div> : <p style={{
                                color: "#888",
                                marginTop: "10px"
                            }}>
                                nothing here yet
                            </p>}
                        </section>
                        <section className='photos'>
                            <h3><FaXTwitter />.COM</h3>
                            <p style={{
                                color: "#777",
                            }}>
                                {user?.twitter || "nothing here yet"} {user?.twitter && <span style={{
                                    marginLeft: "10px",
                                    color: "#444"
                                }} onClick={()=>{
                                    copyToClipBoard(user?.twitter)
                                }}><FaCopy /></span>}
                            </p>
                        </section>

                        <section className='photos'>
                            <h3 style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                            }}><FaDiscord className='discord' color='#54a' size={20} /> DISCORD ID</h3>
                            <p style={{
                                color: "#777",
                            }}>
                                {user?.discord || "nothing here yet"} {user?.discord && <span style={{
                                    marginLeft: "10px",
                                    color: "#444"
                                }} onClick={()=>{
                                    copyToClipBoard(user?.discord)
                                }}><FaCopy /></span>}
                            </p>
                        </section>
                        <section className='basics'>
                            <h3>
                                BASICS
                            </h3>
                            <div className='basics-holder'>
                                <div className='basic'>
                                    <p>
                                        City: <b>{user?.city || "somewhere"}</b>
                                    </p>
                                </div>
                                <div className='basic'>
                                    <p>
                                        Identifies as: <b style={{
                                            textTransform: "capitalize"
                                        }}>{user?.gender || "something"}</b>
                                    </p>
                                </div>
                                <div className='basic'>
                                    <p>
                                        ETH address: <b style={{
                                            textTransform: "capitalize"
                                        }}>{user?.ethAddress || "*******"}</b>
                                    </p>
                                </div>
                            </div>
                        </section>
                        {user?.goals?.length > 0 && <section className='basics'>
                            <h3>
                                INTERESTS
                            </h3>
                            <div className='basics-holder'>
                                {user?.goals?.map((trait, index)=>{
                                    return (
                                        <div className='basic' key={index}>
                                    <p>
                                        {trait}
                                    </p>
                                </div>
                                    )
                                })}
                            </div>
                        </section>}

                        {user?.interests && <section className='basics'>
                            <h3>
                                INTERESTS
                            </h3>
                            <div className='basics-holder'>
                                {user?.interests?.map((interest, index)=>{
                                    return (
                                        <div className='basic colored' key={index}>
                                    <p>
                                        {interest}
                                    </p>
                                </div>
                                    )
                                })}
                            </div>
                        </section>}

                        {user?.interestedIn && <section className='basics'>
                            <h3>
                                INTERESTED IN
                            </h3>
                            <div className='basics-holder'>
                                {user?.interestedIn?.map((interest, index)=>{
                                    return (
                                        <div className='basic' key={index}>
                                    <p>
                                        {interest}
                                    </p>
                                </div>
                                    )
                                })}
                            </div>
                        </section>}

                        <section className='actions-holder'>
                            {/* <Link className='btn filled' to={`/chat/${user?.uid}`} style={{
                                maxWidth: "200px"
                            }}><IoChatbubbles />Chat now</Link> */}
                            {/* <Link className='btn outline' to={`/chat/${user?.uid}`}>Next profile</Link> */}
                        </section>

                    </div>
                </div>}
            </>}
        </>
    )
}

export default User