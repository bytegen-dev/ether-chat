import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Online from '../../components/user/Online'
import { FaEnvelope, FaRegEnvelope, FaRegEnvelopeOpen } from 'react-icons/fa'

const Notifications = ({appState, setAppState}) => {
    const mailBox = appState?.user?.mails
    const filters = [
        "inbox",
        "starred",
        "outbox",
        "trash",
    ]

    const [currentFilter, setCurrentFilter] = useState(filters[0])

    const userMails = appState?.user?.notifications

    const allMails = userMails?.filter((chat)=>{
        return !appState?.user?.archived?.includes(chat?.user?.uid)
    })

    const newFilter = allMails?.filter((chat)=>{
        const mails = chat?.mails
        const mailsLen = chat?.mails?.length
        const lastMessage = mails[mailsLen - 1]
        const user = chat?.user
        return !lastMessage?.isRead
    })

    const archivedFilter = userMails?.filter((chat)=>{
        const user = chat?.user
        return appState?.user?.archived?.includes(user?.uid)
    })

    const starredFilter = userMails?.filter((chat)=>{
        const user = chat?.user
        return appState?.user?.starredMails?.includes(user?.uid)
    })

    const trashFilter = userMails?.filter((chat)=>{
        const user = chat?.user
        return appState?.user?.deletedMails?.includes(user?.uid)
    })

    const sentFilter = userMails?.filter((chat)=>{
        const user = chat?.user
        return appState?.user?.outboxMails?.includes(user?.uid)
    })

    const renderMails = currentFilter === "inbox" ? allMails : (currentFilter === "new" ? newFilter : (currentFilter === "archived" ? archivedFilter : (currentFilter === "starred" ? starredFilter : (currentFilter === "outbox" ? sentFilter : (currentFilter === "trash" ? trashFilter : [])))))

    return (
    <>
        <div className='page people--page mails--page chats--page'>
            <div className='container'>
                <div className='heading'>
                    <h3>
                        Notifications
                    </h3>
                </div>
                {renderMails?.length ? <section className='chat--section' style={{
                    paddingTop: "0",
                    marginTop: "-50px"
                }}>
                    {
                        renderMails?.map((chat, index)=>{
                            const user = chat?.user
                            const mailsLen = chat?.mails?.length
                            const mails = chat?.mails
                            const lastMessage = mails[mailsLen - 1]
                            const lastMessageEdited = lastMessage?.text?.length > 27 ? `${lastMessage?.text?.slice(0, 25)}...` : lastMessage?.text
                            return (
                                <Link key={index} to={chat?.action} className='chat' style={{
                                    animationDelay: `${index*0.1}s`
                                }}>
                                    <div className='user-img' style={{
                                        width: "30px",
                                        minWidth: "30px",
                                        height: "30px",
                                        marginRight: "20px",
                                    }}>
                                        <img src={user?.profileImageUrl} alt='' />
                                    </div>
                                    <div className='details'>
                                        {/* <h3>{user?.name}</h3> */}
                                        <p
                                            // style={{
                                                // filter: user?.credits >= 10 ? "blur(0px)" : "blur(3px)"
                                            // }}
                                        >{lastMessageEdited || "..."}</p>
                                    </div>
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

export default Notifications