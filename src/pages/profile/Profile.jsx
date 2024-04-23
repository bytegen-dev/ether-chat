import React, { useEffect, useState } from 'react'
import { FaChevronLeft, FaCoins, FaEdit, FaEyeSlash, FaPencilAlt, FaPlus, FaPlusCircle, FaRegEnvelope, FaRegGrinWink, FaRegStar, FaThumbsUp } from 'react-icons/fa'
import { IoAddCircleOutline, IoChatbubbles, IoPencil, IoTrash } from 'react-icons/io5'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Online from '../../components/user/Online'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig'

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
                                {user?.bio}
                            </p>
                            <b className='ii'></b>
                        </div>
                        <div className='credits-holder actions'>
                        </div>
                        <div className='actions'>
                            <button onClick={()=>{
                                navigate("/account/credits")
                            }}>
                                <FaCoins style={{
                                    color: "gold",
                                }} />
                                <p style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                }}>
                                    <b>{user?.credits || 0}</b> credits
                                </p>
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
                        </div>
                    </section>

                    <section className='photos'>
                        <h3>MY EMAIL</h3>
                        <p>
                            {user?.email}
                        </p>
                    </section>

                    <section className='photos public'>
                        <h3>
                            MY PUBLIC PHOTOS
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
                            You haven't added any Public photos yet
                        </p>}
                    
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
                                    City: <b>{user?.location?.city || user?.location?.state || "not specified"}</b>
                                </p>
                            </div>
                            <div className='basic'>
                                <p>
                                    Relationship status: <b>{user?.selectedRelationship || "not specified"}</b>
                                </p>
                            </div>
                            <div className='basic'>
                                <p>
                                    Occupation: <b>{user?.occupation || "not specified"}</b>
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

                    {user?.goals && <section className='basics'>
                        <h3>
                            MY GOALS
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

                    <section className='actions-holder' style={{
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
                                signOut(auth).then(() => {
                                // Sign-out successful.
                                console.log('Logout successful');
                                navigate("/auth/login")
                                }).catch((error) => {
                                // An error happened.
                                console.error('Logout failed', error);
                                });
                            }
                        }}>Logout</button>
                        {/* <Link className='btn filled hover' to={`/delete`} style={{
                            background: "red",
                            fontSize: "14px",
                            width: "fit-content",
                            padding: "10px 20px",
                        }}><IoTrash />Delete My Account</Link> */}
                    </section>

                </div>
            </div>}
        </>
    )
}

export default Profile