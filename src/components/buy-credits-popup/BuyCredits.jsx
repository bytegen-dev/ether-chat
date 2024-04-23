import { PayPalButtons } from '@paypal/react-paypal-js'
import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { FaCoins } from 'react-icons/fa6'
import { useLocation, useNavigate } from 'react-router-dom'
import PayPal from './PayPal'

const BuyCredits = ({appState,setAppState, createOrder, onApprove}) => {
    const creditTypes = [
        {
            title: "10 credits",
            amount: 10,
            price: 5,
        },
        {
            title: "30 credits",
            amount: 30,
            price: 10,
        },
        {
            title: "50 credits",
            amount: 50,
            price: 20,
        },
    ]
    const location = useLocation()
    const navigate = useNavigate()
    const pathname = location?.pathname
    const [checkout, setCheckout] = useState(false)
    const [details, setDetails] = useState({
        title: "50 credits",
        amount: 50,
        price: 20,
    },)
    return (
    <>
        <div className='backdrop-x'></div>
        <div className='buy-credits'>
            <div className='container'>
                <button className='close-btn' onClick={()=>{
                    setAppState((prev)=>{
                        return ({
                            ...prev,
                            showPay: false,
                        })
                    })
                    if(pathname?.includes("/credits")){
                        navigate("/account", {replace: true})
                    }
                }}>
                    Cancel <FaTimes />
                </button>
                <h2>
                    Purchase Credits
                </h2>
                <small>Current Balance: <b>{appState?.user?.credits} credits</b></small>
                {checkout ? <div className='paypal-holder'>
                    <small>
                        Buy <b>+{details?.amount} credits</b> for <b>${details?.price}</b>
                    </small>
                    <PayPal appState={appState} details={details} />
                </div> : 
                <div className='types-holder'>
                    {
                        creditTypes?.map((type, index)=>{
                            return (
                                <button className='pay-btn' onClick={()=>{
                                    setCheckout(true)
                                    setDetails(type)
                                }} key={index}>
                                    <div className='price'>
                                        ${type?.price}
                                    </div>
                                    <FaCoins />
                                    <p>
                                        +{type?.amount}
                                    </p>
                                    <small>credits</small>
                                </button>
                            )
                        })
                    }
                </div>
                }

            </div>
            {/* <PayPalButtons
                style={{
                    layout: "horizontal",
                }}
                
                createOrder={(data, actions)=>{
                    createOrder(data, actions)
                }}

                onApprove={(data, actions)=>{
                    onApprove(data, actions)
                }}
            /> */}
        </div>
    </>
  )
}

export default BuyCredits