import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Online from '../../components/user/Online'
import { IoImageOutline } from 'react-icons/io5'

const Chats = ({appState, setAppState}) => {
    // const userChats = [
    //     ...appState?.user?.chats
    // ]
    const [currentFilter, setCurrentFilter] = useState("all")

    // const userChats = [
    //     {
    //         user: {...appState?.users[0]},
    //         uid: {...appState?.users[0]?.uid},
    //         messages: [
    //             {
    //                 from: "you",
    //                 to: "axaxa",
    //                 text: "axaxaxaxa",
    //                 timeStamp: "axaxaxasxsac",
    //             },
    //             {
    //                 from: "you",
    //                 to: "axaxa",
    //                 text: "axaxaxaxa",
    //                 timeStamp: "axaxaxasxsac",
    //             },
    //         ],
    //     },
    //     {
    //         user: {...appState?.users[1]},
    //         uid: {...appState?.users[1]?.uid},
    //         messages: [
    //             {
    //                 from: "you",
    //                 to: "axaxa",
    //                 text: "axaxaxaxa",
    //                 timeStamp: "axaxaxasxsac",
    //             },
    //             {
    //                 from: "you",
    //                 to: "axaxa",
    //                 text: "axaxaxaxa",
    //                 timeStamp: "axaxaxasxsac",
    //             },
    //             {
    //                 from: "you",
    //                 to: "axaxa",
    //                 text: "axaxaxaxa",
    //                 timeStamp: "axaxaxasxsac",
    //             },
    //             {
    //                 from: "you",
    //                 to: "axaxa",
    //                 text: "axaxaxaxa",
    //                 timeStamp: "axaxaxasxsac",
    //                 isRead: true,
    //             },
    //         ],
    //     },
    //     {
    //         user: {...appState?.users[2]},
    //         uid: {...appState?.users[2]?.uid},
    //         messages: [
    //             {
    //                 from: "you",
    //                 to: "axaxa",
    //                 text: "axaxaxaxa axaxaxaxa axaxaxaxa axaxaxaxa",
    //                 timeStamp: "axaxaxasxsac",
    //                 isRead: true,
    //             },
    //         ],
    //     },
    // ]
    
    function groupMessagesIntoChats(messages) {
        const chats = {};
        function sortByFirestoreTimestamp(messages) {
            return messages?.sort((a, b) => a?.timestamp?.seconds - b?.timestamp?.seconds);
        }

        const messagesY = sortByFirestoreTimestamp(messages)|| []
        const messagesX = [...messagesY]
        
        messagesX?.forEach(message => {
            // Sort sender and receiver IDs to ensure consistency in key generation
            const participants = [message.from, message.to].sort();
            // Use the sorted IDs as a unique key for each chat
            const chatKey = participants.join("-");
            const participantsY = [...participants?.reverse()]
            const participantsZ = participantsY?.filter((participant)=>{
                return participant !== appState?.user?.uid
            })
      
          // Initialize the chat object if it doesn't exist
          if (!chats[chatKey]) {
            chats[chatKey] = {
              participants: participantsZ,
              messages: [],
            };
          }
      
          // Add the current message to the appropriate chat
          chats[chatKey].messages.push(message);
        });
      
        // Convert the chats object back into an array format, if needed
        return Object.values(chats);
      }
      

    const chatsInitiated = appState?.messages?.map((message)=>{

    }) 
    const chatsx = appState?.messages?.filter((message)=>{
        return (message?.from === appState?.user?.uid) || (message?.to === appState?.user?.uid)
    })

    const chatMessagesX = groupMessagesIntoChats(chatsx);

    const userChats = chatMessagesX

    const allChats = chatMessagesX?.filter((chat)=>{
        return !appState?.user?.archived?.includes(chat?.user?.uid)
    })

    const newFilter = allChats?.filter((chat)=>{
        const messages = chat?.messages
        const messagesLen = chat?.messages?.length
        const lastMessage = messagesLen && messages[messagesLen - 1]
        const user = chat?.user
        return !lastMessage?.isRead
    })

    const archivedFilter = userChats?.filter((chat)=>{
        const user = chat?.user
        return appState?.user?.archived?.includes(user?.uid)
    })

    const renderChatsY = currentFilter === "all" ? allChats : (currentFilter === "new" ? newFilter : (currentFilter === "archived" ? archivedFilter : []))

    const renderChatsZ = renderChatsY ? [...renderChatsY]?.reverse() : []

    const sorted = renderChatsZ?.map((chat)=>{
        const messagesLen = chat?.messages?.length
        const messages = chat?.messages
        const lastMessage = messages[messagesLen - 1]
        const user = appState?.users?.find((user)=>{
            return user?.uid === chat?.participants[0]
        })
        return {
            lastMessage,
            timestamp: lastMessage?.timestamp,
            user,
            messages,
            participants: chat?.participants,
        }
    })

    function sortByFirestoreTimestamp(messages) {
        return messages?.sort((a, b) => a?.timestamp?.seconds - b?.timestamp?.seconds);
    }

    
    const renderChatsReversed = sortByFirestoreTimestamp(sorted)|| []
    const renderChats = [...renderChatsReversed]?.reverse()
    
    return (
    <>
        <div className='page chats--page'>
            <div className='container'>
                <div className='head'>
                    <div className='filters'>
                        <div className={`filter ${currentFilter === "all" ? "active" : ""}`} onClick={()=>{
                            setCurrentFilter("all")
                        }}>
                            All chats
                        </div>
                        {/* <div className={`filter ${currentFilter === "new" ? "active" : ""}`} onClick={()=>{
                            setCurrentFilter("new")
                        }}>
                            New {newFilter?.length > 0 && <span className='dot active'>{newFilter?.length}</span>}
                        </div> */}
                        <div className={`filter ${currentFilter === "archived" ? "active" : ""}`} onClick={()=>{
                            setCurrentFilter("archived")
                        }} style={{
                            opacity: archivedFilter?.length ? "1" : "0.3",
                            pointerEvents: archivedFilter?.length ? "all" : "none",
                        }}>
                            Archived {archivedFilter?.length > 0 && <span style={{
                                backgroundColor: "#0005"
                            }} className='dot'>{archivedFilter?.length}</span>}
                        </div>
                    </div>
                </div>
                <section className='chat--section'>
                    {renderChats?.length ? <>
                        {
                            
                            renderChats?.map((chat, index)=>{
                                const user = appState?.users?.find((user)=>{
                                    return user?.uid === chat?.participants[0]
                                })
                                const messagesLen = chat?.messages?.length
                                const messages = chat?.messages
                                const lastMessage = messages[messagesLen - 1]
                                const message = lastMessage
                                const timestamp = message?.timestamp
                                {/* const timestamp = {seconds: 1711911081, nanoseconds: 949000000}; */}

                                // Convert the Firestore Timestamp object to a JavaScript Date object manually
                                const seconds = timestamp?.seconds || 0
                                const date = new Date(seconds * 1000); // Multiply by 1000 to convert seconds to milliseconds

                                // Formatting the date to a readable string, e.g., "HH:mm"
                                const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                                const lastMessageEdited = lastMessage?.text?.length > 27 ? `${lastMessage?.text?.slice(0, 25)}...` : lastMessage?.text
                                return (
                                    <Link key={index} to={`/chat/${user?.uid}`} className='chat' style={{
                                        animationDelay: `${index*0.1}s`,
                                        display: user ? `flex` : `none`
                                    }}>
                                        <div className='user-img'>
                                            <img src={user?.profileImageUrl} alt='' />
                                            {user?.uid && <Online isOnline={user?.isOnline} uid={user?.uid} />}
                                        </div>
                                        <div className='details'>
                                            <h3>{user?.name}</h3>
                                            <p style={{
                                                display: "flex",
                                                justifyContent: "flex-start",
                                                alignItems: "center",
                                                gap: "10px",
                                            }}>{lastMessageEdited=== "Image" && <IoImageOutline />} {lastMessageEdited || "..."}</p>
                                        </div>
                                        <div className='data'>
                                            <p className='date' style={{
                                                width: "max-content",
                                            }}>
                                                {formattedTime}
                                            </p>
                                            {/* {!lastMessage?.isRead && <span className='dot active' style={{
                                                height: "12px",
                                                width: "12px",
                                                minWidth: "12px",
                                            }}></span>} */}
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </> : <>
                        <p style={{
                            color: "#666",
                            textAlign: "center",
                            fontSize:"14px",
                        }}>
                            Nothing here yet 
                        </p>
                    </>}
                </section>
            </div>
        </div>
    </>
  )
}

export default Chats