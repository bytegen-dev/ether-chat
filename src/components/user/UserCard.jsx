import { doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FaCamera, FaRegStar, FaStar, FaVideo } from 'react-icons/fa'
import { firestore } from '../../firebaseConfig'
import { Link } from 'react-router-dom'
import Online from './Online'

const UserCard = ({user, isBig, index, appState, setAppState}) => {
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
    return (
    <>
        <div className={`user--card hover ${isBig ? "big" : ""}`} style={{
            animationDelay: `${index * 0.15}s`
        }}>
            <div className='top'>
                <button className='favorite-btn hover rotate' disabled={isLoading} onClick={()=>{
                    if(isFavorite){
                        removeFavorite(user?.uid)
                    } else{
                        addFavorite(user?.uid)
                    }
                }}>
                    {!isFavorite ? <FaRegStar /> : <FaStar />}
                </button>
                <img src={user?.profileImageUrl} alt='' width={100} className='img-i' />
                {user?.gallery?.length ? <img src={user?.gallery?.length ? user?.gallery[0] : null} alt='' width={100} className='img-ii' /> : <></>}
                <div className='over'>
                    <div>
                        <FaCamera /> {user?.gallery?.length || "0"}
                    </div>
                    <div>
                        <FaVideo /> {user?.videos?.length || "0"}
                    </div>
                </div>
            </div>
            <div className='bottom'>
                <p>
                    {user?.name?.length > 15 ? `${user?.name?.slice(0,10)}...` : user?.name}
                    <Online isOnline={user?.isOnline} uid={user?.uid} />
                </p>
                <Link to={`/user/${user?.uid}`} className='btn filled small hover bg'>
                    View Profile
                </Link>
            </div>
        </div>
    </>
  )
}

export default UserCard