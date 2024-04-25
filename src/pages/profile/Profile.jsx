import React, { useEffect, useState } from 'react'
import { FaChevronLeft, FaCoins, FaDiscord, FaEdit, FaEyeSlash, FaPencilAlt, FaPlus, FaPlusCircle, FaRegEnvelope, FaRegGrinWink, FaRegStar, FaReply, FaShare, FaThumbsUp } from 'react-icons/fa'
import { IoAddCircleOutline, IoChatbubbles, IoPencil, IoTrash } from 'react-icons/io5'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Online from '../../components/user/Online'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { FaXTwitter } from 'react-icons/fa6'

const Profile = ({appState, setAppState}) => {
    const params = useParams()
    const uid = appState?.user?.uid
    const [user, setUser] = useState(null)
    const users = appState?.allUsers
    const [notFound, setNotFound] = useState(false)
    useEffect(()=>{
        const thisUser = users?.find((user)=>{
            return user?.uid === uid
        })
        if(thisUser){
            setUser(thisUser)
            setNotFound(false)
        } else{
            setNotFound(true)
        }
    },[users])
    const navigate = useNavigate()
    return (
        <>
            {notFound && <div className='page account--page user--page'>
                <div className='container'>
                    <p style={{color: "#666", fontSize: "14px", marginTop: "30px"}}>
                        {!appState?.users ? "404 || not found" : "Please wait"}
                    </p>
                </div>
            </div>}
            {user?.uid && <div className='page account-page user--page'>
                <div className='container'>
                    <div className='head mid'>
                        <Link to={"/account/update"} className='back'>
                            <FaPencilAlt />
                        </Link>
                        <p className='name'>
                            Update
                        </p>
                    </div>
                    <section className='intro'>
                        <div className='big-img account'>
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
                                {user?.bio || `I am ${user?.name}`}
                            </p>
                            <b className='ii'></b>
                        </div>
                        <div className='credits-holder actions'>
                        </div>
                        <div className='actions'>
                            <button>
                                <FaCoins style={{
                                    color: "gold",
                                }} />
                                {user?.tokens > 10 ? <p style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                }}>
                                    <b>{user?.tokens}</b> tokens
                                </p> : <p style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    color: "red",
                                }}>
                                    <b>NO TOKENS LEFT</b>
                                </p>}
                            </button>
                            {user?.likes?.length && <button>
                                <FaThumbsUp />
                                <p>
                                   {user?.likes?.length} Likes
                                </p>
                            </button>}
                            <button onClick={()=>{
                                navigate(`/people`)
                            }}>
                                <FaRegStar />
                                {user?.following ? <p>
                                    <b>{user?.following?.length}</b> Following
                                </p> : <p>
                                    Not Following Anyone
                                </p>}
                            </button>
                            <button onClick={()=>{
                                navigate(`/share`)
                            }}>
                                <FaShare />
                                <p>
                                    Share
                                </p>
                            </button>
                        </div>
                    </section>

                    <section className='photos'>
                        <h3>MY EMAIL <small><i style={{
                            fontWeight: "300",
                            color: "#0003",
                        }}>(private)</i></small></h3>
                        <p style={{
                            color: "#777",
                        }}>
                            {user?.email || "not added yet"}
                        </p>
                    </section>

                    <section className='photos public'>
                        <h3>
                            MY GALLERY
                        </h3>
                        {user?.gallery?.length ? <div className='photos-holder'>
                            {user?.gallery?.map((url, index)=>{
                                return (
                                    <img className='photo' style={{
                                        pointerEvents: "none"
                                    }} src={url} key={index} />
                                )
                            })}
                        </div> : <p style={{
                            color: "#888",
                        }}>
                            nothing here yet
                        </p>}
                    
                    </section>

                    

                    <section className='photos'>
                        <h3><FaXTwitter />.COM</h3>
                        <p style={{
                            color: "#777",
                        }}>
                            {user?.twitter || "not added yet"}
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
                            {user?.discord || "not added yet"}
                        </p>
                    </section>

                    <section className='basics'>
                        <h3>
                            BASIC DETAILS
                        </h3>
                        <div className='basics-holder'>
                            <div className='basic'>
                                <p>
                                    Birthday: <b>{user?.birthday || "not specified"}</b>
                                </p>
                            </div>
                            <div className='basic'>
                                <p>
                                    City: <b>{user?.city || "somewhere"}</b>
                                </p>
                            </div>
                            <div className='basic'>
                                <p>
                                    Identifies as: <b style={{
                                        textTransform: "capitalize",
                                    }}>{user?.gender || "organism"}</b>
                                </p>
                            </div>
                            <div className='basic'>
                                <p>
                                    ETH address: <b style={{
                                        textTransform: "capitalize"
                                    }}>{(`${user?.ethAddress?.slice(0,4)}...${user?.ethAddress?.slice(-3,-1)}`) || "0x...34"}</b>
                                </p>
                            </div>
                        </div>
                    </section>
                    {user?.traits && <section className='basics'>
                        <h3>
                            MY TRAITS
                        </h3>
                        <div className='basics-holder'>
                            {user?.traits?.map((trait, index)=>{
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
                            MY INTERESTS
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

                    {user?.goals?.length > 0 && <section className='basics'>
                        <h3>
                            MY INTERESTS
                        </h3>
                        <div className='basics-holder'>
                            {user?.goals?.map((interest, index)=>{
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

                    {/* <section className='actions-holder' style={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "center",
                    }}>
                        <button className='btn filled hover' style={{
                            background: "#333",
                            fontSize: "14px",
                            width: "fit-content",
                            padding: "10px 20px",
                        }} onClick={()=>{
                            const confirm = window.confirm("Are you sure?")
                            if(confirm){
                                alert("Disconnect your Wallet from this Website")
                            }
                        }}>Logout</button>
                    </section> */}

                </div>
            </div>}
        </>
    )
}

export default Profile