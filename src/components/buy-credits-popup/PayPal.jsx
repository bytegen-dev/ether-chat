import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef } from 'react'
import { firestore } from '../../firebaseConfig';

export default function PayPal({details, appState, setAppState}) {
    const paypal = useRef()



    useEffect(()=>{
        const addCredits = async(value)=>{
            const userDocRef = doc(firestore, 'users', appState?.user?.uid);
        
            const details = appState?.user
            const prevCredits = details?.credits || "0"
            const prevCreditsInt = parseInt(prevCredits)
            const newCredits = prevCreditsInt + value
        
            const finalDetails = {
              ...details,
              credits: newCredits,
            };
        
            try{
              await updateDoc(userDocRef, finalDetails);
              setAppState((prev) => ({
                  ...prev,
                  isLoadingX: false,
                  user: {
                    ...prev.user,
                    credits: newCredits,
                  }
              }));
            } catch(error){
              console.error(error)
            }
        
          }
        if(details){
            window.paypal.Buttons({
                createOrder: (data, actions, err)=>{
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                description: `${details?.amount} credits purchase by ${appState?.user?.name || "User"}`,
                                amount: {
                                    currency_code: "USD",
                                    value: details?.price,
                                }
                            }
                        ]
                    })
                },
                onApprove: async(data, actions) =>{
                    const order = await (actions.order.capture())
                    addCredits(details?.amount)
                    console.log(order)
                },
                onError: (err) =>{
                    console.log(err)
                }
            }).render(paypal?.current)
        }
    },[details])
    return (
    <div>
        <div ref={paypal}></div>
    </div>
  )
}
