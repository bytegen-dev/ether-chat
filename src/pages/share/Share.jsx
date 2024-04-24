import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaCheck, FaCopy, FaPencilAlt, FaUser, FaUserAlt } from 'react-icons/fa'
import QRCode from 'react-qr-code'
import { Link, useLocation } from 'react-router-dom'

const Share = ({appState}) => {
    const url = `https://ether-chat-xi.vercel.app/user/${appState?.user?.uid}`
    const [copied, setCopied] = useState(false)
    const urlShort = `${url?.slice(0,20)}...`
    const copyToClipBoard = (value)=>{
        navigator.clipboard.writeText(value)
        setCopied(true)
    }
    useEffect(()=>{
        if(copied){
            setTimeout(()=>{
                setCopied(false)
            }, 2000)
        }
    },[copied])
    return (
    <>
        <div className='page edit--page share--page user--page'>
            <div className='container'>
                <div className='head mid'>
                    <Link to={"/account"} replace={true} className='back'>
                        <FaArrowLeft />
                    </Link>
                    <p className='name'>
                        Account
                    </p>
                </div>
                <section style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "0px",
                }}>
                    <h2 style={{
                        paddingTop: "70px",
                        paddingBottom: "10px",
                        borderBottom: "2px solid #0001",
                        textAlign: "center",
                    }}>
                        Share
                    </h2>
                </section>
                <section className='qr-section'>
                    <h3>
                        Scan QR code
                    </h3>
                    <div className='qr-holder'>
                        <QRCode value={url}  />
                    </div>
                </section>
                <section className='link-holder'>
                    <h3>
                        Copy URL
                    </h3>
                    <div className='url-holder'>
                        <p>
                            {urlShort}
                        </p>
                        <button onClick={()=>{
                            if(!copied){
                                copyToClipBoard(url)
                            }
                        }}>
                            {copied ? <FaCheck /> : <FaCopy />}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    </>
  )
}

export default Share