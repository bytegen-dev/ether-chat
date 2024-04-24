import React, { useEffect, useState } from 'react'
import UserCard from '../../components/user/UserCard'
import { useNavigate } from 'react-router-dom'

const People = ({appState, setAppState}) => {
    const usersx = appState?.users
    const users = usersx?.filter((user)=>{
        return user?.uid !== appState?.user?.uid
    })
    const following = appState?.user?.following
    const followingUsers = following?.map((uid)=>{
        const userWithId = users?.find(userx => userx?.uid === uid)
        return userWithId
    })
    const [isLoading, setIsLoading] = useState(true)
    const filterFollowingUsers = followingUsers?.filter((user)=>{
        return user?.uid
    })
    const [randomUser, setRandomUser] = useState(null)
    useEffect(()=>{
        const getRandomUser = ()=>{
            
            if(users){
                setIsLoading(true)
                const usersLen = users?.length
                const randomNumber = Math.ceil(Math.random()*usersLen)-1
                const randomUser = users[randomNumber]
                if(randomUser){
                    setRandomUser(randomUser)
                }
                setTimeout(()=>{
                    setIsLoading(false)
                },500)
            }
        }
        
        getRandomUser()
    },[])
    
    const getRandomUser = ()=>{
            
        if(users){
            setIsLoading(true)
            const usersLen = users?.length
            const randomNumber = Math.ceil(Math.random()*usersLen)-1
            const randomUser = users[randomNumber]
            if(randomUser){
                setRandomUser(randomUser)
            }
            setTimeout(()=>{
                setIsLoading(false)
            },500)
        }
    }

    const navigate = useNavigate()

    const skipUser = ()=>{
        getRandomUser()
    }
    
    const likeUser = (randomUser)=>{
        const user=randomUser
        navigate(`/chat/${user?.uid}`)
        getRandomUser()
    }

    const [currentTab, setCurrentTab] = useState("random")
    return (
    <>
        <div className='page people--page'>
            <div className='container'>
                <div className='heading'>
                    <div className='btn-holder'>
                        <button className={`btn ${currentTab === "random" ? "filled" : ""}`} onClick={()=>{
                            setCurrentTab("random")
                        }}>
                            Random
                        </button>
                        <button className={`btn ${currentTab === "following" ? "filled" : ""}`} onClick={()=>{
                            setCurrentTab("following")
                        }}>
                            Following
                        </button>
                    </div>
                </div>
                {users?.length ? <>
                    {currentTab === "random" && <>
                        <section className='random--section'>
                            {(isLoading || !randomUser) ? <div className='spinner'></div> : <UserCard appState={appState} user={randomUser} setAppState={setAppState} isBig={true} />}
                            <div className='btn-holder'>
                                <button className='btn outline' onClick={()=>{
                                    skipUser()
                                }}>
                                    Skip
                                </button>
                                <button className='btn filled green' onClick={()=>{
                                    likeUser(randomUser)
                                }}>
                                    Chat
                                </button>
                            </div>
                        </section>
                    </>}
                    {currentTab === "following" && <>
                        <section className='following--section'>
                            <p>
                                You're following <b>{following?.length || 0}</b> people
                            </p>
                            <div className='users-holder'>
                                {
                                    filterFollowingUsers?.map((user, index)=>{
                                        return (
                                            <UserCard appState={appState} index={index} key={index} setAppState={setAppState} user={user} />
                                        )
                                    })
                                }
                            </div>
                        </section>
                    </>}
                </> : <p>
                    ...
                </p>}
            </div>
        </div>
    </>
  )
}

export default People