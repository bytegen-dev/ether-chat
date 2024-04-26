import { doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { firestore } from '../../firebaseConfig'
import eth2 from "../../assets/ether-ii.png"
import { FaTimes } from 'react-icons/fa'
import { IoFilter } from "react-icons/io5";
import UserCard from '../../components/user/UserCard'
import { FaFaceSmile } from 'react-icons/fa6'
import ethImg from "../../assets/ether-ii.png"

const Search = ({appState, setAppState}) => {
    const user = appState?.user

    const filters = [
        "all",
        "online",
        "following",
    ]

    const searchFilters = [
        "web3 jobs",
        "memes",
        "groups",
        "people",
    ]

    const [searchFilter, setSearchFilter] = useState(null)

    const usersx = appState?.users
    const users = usersx?.filter((userx)=>{
        return userx?.uid !== user?.uid
    })

    const [currentFilter, setCurrentFilter] = useState(filters[0])

    const [showFreeCredits, setShowFreeCredits] = useState(false)
    const closeFreeCredits = async()=>{
        setShowFreeCredits(false)
        const thisUser = appState?.user
        try{
            const userDoc = doc(firestore, 'users', thisUser?.uid);
            await updateDoc(userDoc, {
                ...thisUser,
                uid: thisUser?.uid,
                hasAcceptedFreeCredits: true,
            });
            setAppState((prev)=>{
                return(
                    {
                        ...prev,
                        user: {
                            ...appState?.user,
                            hasAcceptedFreeCredits: true,
                        },
                    }
                )
            })
        } catch(error){
            console.error(error)
        }
    }

    useEffect(()=>{
        const hasAcceptedFreeCredits = user?.hasAcceptedFreeCredits
        if(hasAcceptedFreeCredits){
            setShowFreeCredits(false)
        } else{
            setShowFreeCredits(true)
        }
    },[user])

    const [searchInput, setSearchInput] = useState("")

    useEffect(()=>{
        setSearchInput("")
    },[searchFilter])

    const thisUser = appState?.user

    const visibleUsers = users?.filter((user)=>{
        if(currentFilter === "all"){
            return user
        } else if(currentFilter === "online"){
            return user?.isOnline
        } else if(currentFilter === "following"){
            return thisUser?.following?.includes(user?.uid)
        }
        return user
    })
    return (
    <>
        {showFreeCredits && <div className='backdrop-container'>
            <div className='card'>
                {/* <button className='close-btn rotate hover' onClick={closeFreeCredits}>
                    <FaTimes />
                </button> */}
                <img className='circle' src={eth2} alt='' />
                <h2>
                    Welcome
                </h2>
                <p>
                    Here are 3000 <span> $CHATGEN</span> tokens to get you started. You'll need tokens to create new Chats or Groups 🙂
                </p>
                <i style={{
                    fontSize: "12px",
                    fontWeight: "300",
                    color: "#0006"
                }}>
                    (Tokens prevent spamming hopefully and without spamming our free servers can last as long as possible)
                </i>
                <div className='btn-holder'>
                    <button className='btn fancy hover' onClick={closeFreeCredits}>
                        Okay
                    </button>
                </div>
            </div>
        </div>}
        <div className='page search--page'>
            <div className='container'>
                <section className='top--section'>
                    <div className='title-holder'>
                        <h3>
                            Search
                        </h3>
                        <p>
                            search the servers for Memes, job roles, groups and random people 🙂
                        </p>
                    </div>

                    <div className='search-bar'>
                        <form onSubmit={(e)=>{
                            e.preventDefault()
                        }}>
                            <input type='search' disabled={!searchFilter} name='Search' value={searchInput} onChange={(e)=>{
                                setSearchInput(e.target.value)
                            }} placeholder={`${!searchFilter ? "Select a filter" : ""} ${searchFilter === "memes" ? "Explore random memes" : ""}${searchFilter === "web3 jobs" ? "e.g Solidity developer" : ""}${searchFilter === "groups" ? "Defi traders connect" : ""}${searchFilter === "people" ? "Search by name or eth address" : ""}`} />
                        </form>
                        <div className='drop-filter'>
                            {searchFilters?.map((filter, index)=>{
                                return (
                                    <button key={index} className={`filter ${searchFilter === filter ? "active" : ""}`} onClick={()=>{
                                        setSearchFilter(filter)
                                    }}>
                                        {filter}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </section>
                {!searchFilter && <>
                    <div className='eth-image'>
                        <img src={ethImg} alt='' />
                    </div>
                </>}
                {searchFilter === "memes" && <>
                    <section className='users--section render--section'>
                        <h3>
                            Memes 😎
                        </h3>
                        <p className='dim'>
                            nothing here yet
                        </p>
                    </section>
                
                </>}
                {searchFilter === "groups" && <>
                    <section className='users--section render--section'>
                        <h3>
                            Groups 👥
                        </h3>
                        <p className='dim'>
                            nothing here yet
                        </p>
                    </section>
                
                </>}
                {searchFilter === "web3 jobs" && <>
                    <section className='users--section render--section'>
                        <h3>
                            Web3.0 jobs 🚀
                        </h3>
                        <p className='dim'>
                            nothing here yet
                        </p>
                    </section>
                
                </>}
                {searchFilter === "people" && <>
                    <section className='users--section render--section'>
                        <h3>
                            People 👤
                        </h3>
                        <div className='space-btwn'>
                            <div className='filter-holder'>
                                {filters?.map((filter, index)=>{
                                    return (
                                        <button key={index} className={`filter ${currentFilter === filter ? "active" : ""}`} onClick={()=>{
                                            setCurrentFilter(filter)
                                        }}>
                                            {filter}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                        <div className='users-holder'>
                            {visibleUsers?.map((user, index)=>{
                                return (
                                    <UserCard index={index} user={user} key={index} appState={appState} setAppState={setAppState} />
                                )
                            })}
                        </div>
                    </section>
                </>}
            </div>
        </div>
    </>
  )
}

export default Search