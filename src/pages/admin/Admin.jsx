import React, { useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaMinus, FaPlus, FaSearch } from 'react-icons/fa'
import { IoAdd, IoRefresh } from 'react-icons/io5'

const Admin = ({appState, setAppState}) => {
    const filters = [
        "users",
        "messages",
        "mails",
        "site status",
    ]
    const [scale, setScale] = useState(1)
    const users = appState?.users
    const messages = appState?.messages
    const mails = appState?.mails
    const [currentFilter, setCurrentFilter] = useState(filters[0])
    const [search, setSearch] = useState("")
    const visibleUsers = users?.filter((user)=>{
        const name = user?.name?.toLowerCase()
        const email = user?.email?.toLowerCase()
        const occupation = user?.occupation?.toLowerCase()
        const country = user?.location?.country?.toLowerCase()
        const city = user?.location?.city?.toLowerCase()
        const searchLower = search?.toLowerCase()

        return name?.includes(searchLower) || email?.includes(searchLower) || occupation?.includes(searchLower) || country?.includes(searchLower) || city?.includes(searchLower)
    })
    const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 100;
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 100;
    }
  };
    return (
    <div className='admin--page admin admin'>
        <div className='controls'>
            <button onClick={()=>{
                window.location.reload()
                location.reload()
            }}>
                <IoRefresh />
            </button>
            <button onClick={()=>{
                setScale(scale >= 0.9 ? scale - 0.1 : scale)
            }}>
                <FaMinus />
            </button>
            <button onClick={()=>{
                setScale(scale <= 2 ? scale + 0.1 : scale)
            }}>
                <IoAdd />
            </button>
        </div>
        <div className='container'>
            <h2>
                The Love Universe
            </h2>
            <p>
                Admin Dashboard
            </p>
            <div className='filters-holder' style={{
                display: "none",
            }}>
                {
                    filters?.map((filter)=>{
                        return (
                            <button className={`filter-btn ${currentFilter === filter ? "active" : ""}`} onClick={()=>{
                                setCurrentFilter(filter)
                            }}>
                                {filter}
                            </button>
                        )
                    })
                }
            </div>
            <div className='search'>
                <input value={search} onChange={(e)=>{
                    setSearch(e.target.value)
                }} name='search' placeholder={`Search ${currentFilter}`} type='search' />
                <button>
                    <FaSearch />
                </button>
            </div>
            {users?.length ? <>
                {currentFilter === "users" && <div className='data' ref={containerRef} style={{
                    fontSize: `${16*scale}px`
                }}>
                    <div className='head row'>
                        <div className='item'>
                            <p>
                                #
                            </p>
                        </div>
                        <div className='item'>
                            <p>
                                Name
                            </p>
                        </div>
                        <div className='item'>
                            <p>
                                Email
                            </p>
                        </div>
                        <div className='item'>
                            <p>
                                Bio
                            </p>
                        </div>
                        <div className='item'>
                            <p>
                                Birthday
                            </p>
                        </div>
                        <div className='item'>
                            <p>
                                Occupation
                            </p>
                        </div>
                        <div className='item'>
                            <p>
                                Credits
                            </p>
                        </div>
                        <div className='item'>
                            <p>
                                isOnline
                            </p>
                        </div>
                        <div className='item'>
                            <p>
                                Messages Sent
                            </p>
                        </div>
                        <div className='item'>
                            <p>
                                Messages Recieved
                            </p>
                        </div>
                        <div className='item'>
                            <p>
                                isDisabled
                            </p>
                        </div>
                        <div className='item'>
                            <p>
                                Following
                            </p>
                        </div>
                    </div>
                    {
                        visibleUsers?.map((user, index)=>{
                            const messagesSent = messages?.filter((message)=>{
                                return message?.from === user?.uid
                            })
                            const messagesRecieved = messages?.filter((message)=>{
                                return message?.to === user?.uid
                            })
                            return (
                                <div className='row'>
                                    <div className='item'>
                                        <p>
                                            {index + 1}
                                        </p>
                                    </div>
                                    <div className='item'>
                                        <p>
                                            {user?.name || "not-specified"}
                                        </p>
                                    </div>
                                    <div className='item'>
                                        <p>
                                            {user?.email || "not-specified"}
                                        </p>
                                    </div>
                                    <div className='item'>
                                        <p>
                                            {user?.bio || "not-specified"}
                                        </p>
                                    </div>
                                    <div className='item'>
                                        <p>
                                            {user?.birthday || "not specified"}
                                        </p>
                                    </div>
                                    <div className='item'>
                                        <p>
                                            {user?.occupation || "not specified"}
                                        </p>
                                    </div>
                                    <div className='item'>
                                        <p>
                                            {user?.credits || 0}
                                        </p>
                                    </div>
                                    <div className='item'>
                                        <p>
                                            {user?.isOnline ? "True" : "False"}
                                        </p>
                                    </div>
                                    <div className='item'>
                                        <p>
                                            {messagesSent?.length || "none"}
                                        </p>
                                    </div>
                                    <div className='item'>
                                        <p>
                                            {messagesRecieved?.length || "none"}
                                        </p>
                                    </div>
                                    <div className='item'>
                                        <p>
                                            {user?.following?.length || "none"}
                                        </p>
                                    </div>
                                    <div className='item'>
                                        <p>
                                            {user?.isDisabled ? "True" : "False"}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>}
                <div className='scroll'>
                    <button onClick={scrollLeft}>
                        <FaChevronLeft />
                    </button>
                    <button onClick={scrollRight}>
                        <FaChevronRight />
                    </button>
                </div>
            </> : <div className='spinner' style={{
                marginTop: "50px",
                width: "40px",
                height: "40px",
            }}></div>}
        </div>
    </div>
  )
}

export default Admin