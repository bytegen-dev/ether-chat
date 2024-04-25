import React, { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import ErrorComponent from '../../components/error/ErrorComponent'
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, firestore } from '../../firebaseConfig'
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import Footer from '../../components/footer/Footer'
import { FaBoltLightning, FaXTwitter } from 'react-icons/fa6'
import ethImg from "../../assets/ether-ii.png"

const SignUp = ({appState, setAppState}) => {
    const genders = [
        "human",
        "bot",
    ]

    const stages = [
        "details",
        "auth",
    ]

    const [currentStage, setCurrentStage] = useState(stages[0])

    const [ error, setError ] = useState(null)

    const [userInfo, setUserInfo] = useState({
        name: "",
        birthday: "2004-09-14",
        gender: "",
        email: "",
        password: "",
    })

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

    const handleDetailsSubmit = (e)=>{
        e.preventDefault()
        setError(null)
        if(userInfo?.gender){
            setCurrentStage(stages[1])
        } else{
            setError("Select a Gender to continue")
        }
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
        //   alert('Failed to connect wallet. Please try again.');
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
                isLoading: true,
            })
        })
        
        try {
            setAppState((prev)=>{
                return(
                    {
                        ...prev,
                        isLoading: true,
                    }
                )
            })
            const walletAddress = await handleConnectWallet();
            if(walletAddress){
                setAppState((prev)=>{
                    return ({
                        ...prev,
                        walletAddress,
                    })
                });
                const userDoc = doc(firestore, 'users', walletAddress);
                const docSnap = await getDoc(userDoc);
                const userData = docSnap.data()
            
                if (userData) {
                    setAppState((prev)=>{
                        return ({
                            ...prev,
                            isLoggedIn: true,
                            user: userData,
                            isLoading: false,
                            walletAddress,
                        })
                    });
                    navigate('/', {
                        replace: true
                    });
                } else {
                    await createUserProfileDocument(details, walletAddress);
                }
            } else{
                setAppState((prev)=>{
                    return(
                        {
                            ...prev,
                            isLoading: false,
                        }
                    )
                })
                setError("Wallet not found")
            }
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
    <>
        <div className='page auth--page'>
            <div className='container'>
                <section className='page--section heading'>
                    <div className='left'>
                        <h1 className='title_main'>
                            Connect with your ETH buddies
                        </h1>
                        {/* <p className='paragraph paragraph main'>
                            <b style={{fontSize: "inherit"}}>Ether chat</b> is a project made for the ethereum web3 community to discover and communicate with new frens.
                        </p> */}
                        {error && <ErrorComponent error={error} />}
                        {currentStage === stages[0] && <div className='signup--card'>
                        <form onSubmit={handleDetailsSubmit}>
                            <div className='inp-holder'>
                                <div>
                                    <label>
                                        I identify as
                                    </label>
                                    <div className='select-holder'>
                                        {genders?.map((gender, index)=>{
                                            return (
                                                <div className={`select hover ${(userInfo?.gender === gender) ? "active" : ""}`} key={index} onClick={()=>{
                                                    setUserInfo((prev)=>{
                                                        return ({
                                                            ...prev,
                                                            gender,
                                                        })
                                                    })
                                                }} style={{
                                                    textTransform: "capitalize",
                                                    cursor: "pointer",
                                                }}>
                                                    {gender}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className='inp-holder --long'>
                                <div>
                                    <label>
                                        My nickname is
                                    </label>
                                    <div className='select-holder'>
                                        <input required type="text" name='name' placeholder='JohnWick the Great' onChange={handleChange} value={userInfo.value} />
                                    </div>
                                </div>
                                <div>
                                    <label>
                                        My birthday <i style={{
                                            fontWeight: "300",
                                            fontSize: "12px",
                                            color: "#0008"
                                        }}>(private)</i>
                                    </label>
                                    <div className='select-holder'>
                                        <input required type="date" name='birthday' onChange={handleChange} value={userInfo.birthday} />
                                    </div>
                                </div>
                            </div>

                            <div className='inp-holder check'>
                                <input id='check' type="checkbox" required />
                                <label htmlFor='check' style={{
                                    marginTop: "5px"
                                }}>
                                    <span>LFG ⚡</span>
                                     {/* <Link to={"/terms"}>
                                        Report 
                                    </Link> */}
                                </label>
                            </div>

                            <div className='btn-holder'>
                                <button className='btn fancy hover'>
                                    Proceed
                                </button>
                            </div>
                        </form>
                        </div>}
                        {currentStage === stages[1] && <div className='login--card'>
                            <form onSubmit={handleSubmit}>
                                <div className='inp-holder'>
                                    <label>
                                        <FaXTwitter />.com <i style={{
                                            fontSize: "14px",
                                            fontWeight: "300",
                                            color: "#0003"
                                        }}>(optional)</i>
                                    </label>
                                    <input placeholder={"Twitter username"} value={userInfo?.twitter} name='twitter' onChange={handleChange} />
                                </div>
                                <div className='divider'>
                                <p className='center' style={{
                                    backgroundColor: "transparent",
                                    backdropFilter: "blur(10px)"
                                }}><img src={ethImg} width={40} /></p>
                                </div>
                                <div className='btn-holder'>
                                    <button className='btn fancy filled hover'>
                                        Connect Wallet
                                    </button>
                                </div>
                            </form>
                            
                        </div>}
                        <div className='pagination-holder'>
                            {stages?.map((stage, index)=>{
                                return(
                                    <div className={`pagination-btn ${currentStage === stage ? "active" : ""}`} key={index} onClick={()=>{
                                        if(index === 0){
                                            setCurrentStage(stage)
                                        }
                                    }}>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='right'>
                        <div className='float-img'></div>
                    </div>
                </section>
                <Footer />
            </div>
        </div>
    </>
  )
}

export default SignUp