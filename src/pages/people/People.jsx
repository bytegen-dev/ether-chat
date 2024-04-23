import React, { useEffect, useState } from 'react'
import UserCard from '../../components/user/UserCard'

const People = ({appState, setAppState}) => {
    const users = appState?.users
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

    const skipUser = ()=>{
        getRandomUser()
    }
    
    const likeUser = (randomUser)=>{
        const user=randomUser
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
                                Like
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
            </div>
        </div>
    </>
  )
}

export default People