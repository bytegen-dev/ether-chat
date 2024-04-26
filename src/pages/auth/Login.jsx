import React, { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../../components/footer/Footer'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, firestore } from '../../firebaseConfig'
import ErrorComponent from '../../components/error/ErrorComponent'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import ethImg from "../../assets/ether-ii.png"

const Login = ({appState, connectWallet, setAppState}) => {
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: "",
    })

    const [ error, setError ] = useState(null)

    const handleChange = (e)=>{
        const {name, value} = e.target
        setError(null)
        
        setUserInfo((prev)=>{
            return ({
                ...prev,
                [name]: value,
            })
        })
    }

    async function checkUserProfileExistsByEmail(email) {
        const profilesRef = collection(firestore, "users");
        const q = query(profilesRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
      
        return !querySnapshot.empty; // Returns true if a profile exists, false otherwise
    }

    const navigate = useNavigate()

    const createUserProfileDocument = async (details, walletAddress) => {
        try{
            const res = await setDoc(doc(firestore, "users", walletAddress), {
              ...details,
              uid: walletAddress,
              walletAddress,
              ethAddress: walletAddress,
            });
            console.log(walletAddress)
            console.log(res)
            // navigate('/setup-wizard');
            if(res){
                setAppState((prev)=>{
                    return(
                        {
                            ...prev,
                            isLoading: false,
                            isLoggedIn: true,
                            user: {
                                ...details,
                                uid: walletAddress,
                                walletAddress,
                            },
                        }
                    )
                })
            }
        } catch(error){
            console.error(error)
            throw error
        }
    };

    const handleConnectWallet = async () => {
        if (!window.ethereum) {
          return;
        }
    
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const walletAddress = accounts[0];
    
          return walletAddress
        } catch (error) {
          console.error('Error connecting wallet:', error);
        }
    };

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setError(null)
        
        // const {email, password, name, gender, birthday} = userInfo
        
        const details = userInfo

        setAppState((prev)=>{
            return ({
                ...prev,
                isLoading: false,
            })
        })
        
        try {
            connectWallet();
        } catch (error) {
            console.error(error);
            setAppState((prev)=>{
                return(
                    {
                        ...prev,
                        isLoading: false,
                    }
                )
            })
            setError(error.message)
        }
    }

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
          const result = await signInWithPopup(auth, provider);
          console.clear()  
          if (result?._tokenResponse?.isNewUser) {
            await setDoc(doc(firestore, "users", result.user.uid), {
              email: result.user.email,
              name: result.user.displayName,
              profileImageUrl: result.user.photoURL,
              uid: result.user.uid,
              phoneNo: result.user.phoneNumber,
            });
            navigate("/");
        } else{
              navigate("/");

          }
        } catch (error) {
          // Update UI based on error
          setError(error?.message);
          setAppState(prev => ({
            ...prev,
            isLoading: false
          }));
        }
      };
      
      // Main function to initiate Google Sign-In
      const googleSignIn = async () => {
        setError(null);
        setAppState(prev => ({
          ...prev,
          isLoading: true,
        }));
        try {
          await handleGoogleSignIn();
        } catch (error) {
          setAppState(prev => ({
            ...prev,
            isLoading: false
          }));
          setError(error?.message);
          console.error(error);
        }
      };

    return (
    <div className='page login--page auth--page'>
        <div className='container '>
            <section className='page--section' style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <div className='login--card' style={{
                    maxWidth: "500px"
                }}>
                    <h2 style={{
                        textAlign: "center",
                        marginBottom: "20px",
                    }}>Continue to Ether chat</h2>
                    {error && <ErrorComponent error={error} />}
                    <form onSubmit={handleSubmit}>
                        <div className='divider'>
                            <p className='center' style={{
                                backgroundColor: "transparent",
                                backdropFilter: "blur(10px)"
                            }}><img src={ethImg} width={"30px"} /></p>
                        </div>
                        <div className='btn-holder'>
                            <button className='btn fancy filled hover'>
                                Connect Wallet
                            </button>
                        </div>
                    </form>
                    {/* 
                    <div className='actions'>
                        <button className='btn filled white icon-big outline hover' onClick={googleSignIn}>
                            <FaGoogle />
                            Sign In with Google
                        </button>
                    </div> */}
                </div>
                {/* <div className='float-img'></div> */}
            </section>
            <Footer />
        </div>
    </div>
  )
}

export default Login