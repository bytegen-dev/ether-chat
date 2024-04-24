import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Online from '../../components/user/Online'
import { FaEnvelope, FaRegEnvelope, FaRegEnvelopeOpen } from 'react-icons/fa'

const Mails = ({appState, setAppState}) => {
    const userx = appState?.user
    const user = userx
    const filters = [
        "inbox",
        "outbox",
    ]

    // console.log(appState?.mails)

    const [currentFilter, setCurrentFilter] = useState(filters[0])

    const userMailsX = appState?.mails || []

    const userMails = userMailsX?.filter((mail)=>{
        return (mail?.to === userx?.uid) || (mail?.from === userx?.uid)
    })

    const allMails = userMails?.filter((mail)=>{
        return mail?.to === user?.uid
    })

    const sentFilter = userMails?.filter((mail)=>{
        return mail?.from === user?.uid
    })
    
    const renderMails = currentFilter === "inbox" ? allMails : (currentFilter === "outbox" ? sentFilter : [])

    return (
    <>
        <div className='page people--page mails--page chats--page'>
            <div className='container'>
                <div className='heading'>
                    {/* <h3>
                        Mails
                    </h3> */}
                    <div className='btn-holder'>
                        {filters?.map((filter, index)=>{
                            return (
                                <button className={`filter btn ${currentFilter === filter ? "filled" : ""}`} onClick={()=>{
                                    setCurrentFilter(filter)
                                }} key={index}>{filter}</button>
                            )
                        })}
                    </div>
                </div>
                {renderMails?.length ? <section className='chat--section' style={{
                    paddingTop: "0",
                    marginTop: "-50px"
                }}>
                    {
                        renderMails?.map((mail, index)=>{
                            const sender = appState?.users?.find((user)=>{
                                return mail.from === user?.uid
                            })
                            const reciever = appState?.users?.find((user)=>{
                                return mail.to === user?.uid
                            })
                            const slicedText = mail.text?.length > 75 ? `${mail.text?.slice(0, 70)}...` : mail.text
                            const user2 = currentFilter === "inbox" ? sender : (currentFilter === "outbox" ? reciever : null)
                            return (
                                <Link key={index} to={`/mail/${mail?.id}`} className='chat' style={{
                                    animationDelay: `${index*0.1}s`
                                }}>
                                    <div className='user-img'>
                                        <img src={user2?.profileImageUrl} alt='' />
                                        <Online isOnline={user2?.isOnline} />
                                    </div>
                                    <div className='details'>
                                        <h3>{user2?.name}</h3>
                                        <p
                                            style={{
                                                filter: user?.credits >= 10 ? "blur(0px)" : "blur(3px)"
                                            }}
                                        >{slicedText || "..."}</p>
                                    </div>
                                    {/* <div className='data'>
                                        <p className='date'>
                                            {mail?.timeStamp}
                                        </p>
                                        {mail?.isRead ? <FaRegEnvelopeOpen style={{
                                            color: "#aaa"
                                        }} /> : <FaEnvelope style={{
                                            color: "#5e30d3"
                                        }} />}
                                    </div> */}
                                </Link>
                            )
                        })
                    }
                </section> : <section className='mails--section'>
                    <p style={{
                        color: "#666",
                        fontSize: "14px",
                    }}>
                        Nothing to see here
                    </p>
                </section>}
            </div>
        </div>
    </>
  )
}

export default Mails