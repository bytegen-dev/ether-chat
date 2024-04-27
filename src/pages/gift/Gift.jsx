import React, { useEffect, useState } from 'react'
import { FaCheck, FaCopy, FaDollarSign, FaEthereum } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { IoSwapHorizontal } from 'react-icons/io5'
import { useWalletInfo, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react'

const Gift = ({appState, setAppState}) => {
    const params = useParams()
    const uid = params?.uid
    const [user, setUser] = useState(null)
    const [notFound, setNotFound] = useState(false)
    const [walletAddress, setWalletAddress] = useState(null)

    useEffect(()=>{
        const getMessages = async()=>{
            const usersFilter = appState?.users?.filter((user)=>{
                return user?.uid !== appState?.user?.uid
            })
            const thisUser = usersFilter?.find((user)=>{
                return user?.uid === uid
            })
            if(thisUser){
                const walletaddress = thisUser?.walletAddress
                setUser(thisUser)
                setWalletAddress(walletaddress)
                setNotFound(false)
            } else{
                setNotFound(true)
            }
        }
        getMessages()
    },[appState?.messages, appState?.user, uid])

    const walletAddressSliced = walletAddress ? `${walletAddress?.slice(0, 4)}...${walletAddress?.slice(-3, -1)}` : ""

    const [currency, setCurrency] = useState("USD")

    const [copied, setCopied] = useState(false)

    const copy =() =>{
        if(!copied){
            navigator.clipboard.writeText(walletAddress)
            setCopied(true)
            
            setTimeout(()=>{
                setCopied(false)
            }, 1500)
        }
    }

    const [amount, setAmount] = useState(0)

    const [isSending, setIsSending] = useState(false);
    const [transactionHash, setTransactionHash] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const account = useWeb3ModalAccount()
    const {walletProvider} = useWeb3ModalProvider()
    const {walletInfo} = useWalletInfo()

    useEffect(()=>{
        setAmount(0)
    }, [currency])

    const sendCrypto = async () => {
        alert("Functionality in Development")
    };

    return (
    <>
        {(notFound || !user) ? <>
            ...
        </> : <div className='page gift--page'>
            <div className='container'>
                <div className='heading'>
                    <h2>
                        Gift <span>{user?.name}</span> some ETH
                    </h2>
                    <p>
                        <i>
                            eth sent is non-refundable
                        </i>
                    </p>
                </div>
                <section className='settings'>
                    <h3>
                        Ether chat
                    </h3>
                    <div className='inp-holder'>
                        <label>
                            Amount in <button onClick={()=>{
                                if(currency === "USD"){
                                    setCurrency("ETH")
                                } else{
                                    setCurrency("USD")
                                }
                            }}>{currency} <IoSwapHorizontal /> </button>
                        </label>
                        <div className='inp-hold'>
                            <div className={`currency ${currency === "USD" ? "dollar" : ""}`}>
                                {currency === "USD" ? <>
                                    <FaDollarSign />
                                </> : <>
                                    <FaEthereum />
                                </>}
                            </div>
                            {currency === "USD" ? <input value={amount || ""} placeholder='amount in usd' type='number' name='amount' onChange={(e)=>{
                                setAmount(e.target.value)
                            }} /> : <input placeholder='amount in eth' value={amount || ""} type='number' name='amount' onChange={(e)=>{
                                setAmount(e.target.value)
                            }} />}
                        </div>
                    </div>
                    <button className='fancy btn' disabled={!amount} onClick={sendCrypto}>
                        Send ETH
                    </button>
                </section>
                <section className='settings'>
                    <h3>
                        Send manually
                    </h3>
                    <div className='inp-holder'>
                        <label>
                            Wallet Address
                        </label>
                        <input value={walletAddress} onChange={(e)=>{
                            e.preventDefault()
                        }} />
                    </div>
                    <button className='fancy btn' onClick={copy}>
                        Copy Address {copied ? <FaCheck /> : <FaCopy />}
                    </button>
                </section>
            </div>
        </div>}
    </>
  )
}

export default Gift