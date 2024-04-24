import React, { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import ErrorComponent from '../../components/error/ErrorComponent'
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, firestore } from '../../firebaseConfig'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import Footer from '../../components/footer/Footer'
import { FaBoltLightning } from 'react-icons/fa6'

const SignUp = ({appState, setAppState}) => {
    const genders = [
        "dev",
        "trader",
        "hodler",
        "degen",
    ]

    const stages = [
        "details",
        "auth",
    ]

    const [currentStage, setCurrentStage] = useState(stages[0])

    const [ error, setError ] = useState(null)

    const [userInfo, setUserInfo] = useState({
        name: "",
        birthday: "",
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

    const createUserProfileDocument = async (details, user) => {
        try{
            await setDoc(doc(firestore, "users", user?.uid), {
              ...details,
              uid: user?.uid
            });
            navigate('/setup-wizard');
            setAppState((prev)=>{
                return(
                    {
                        ...prev,
                        isLoading: false,
                    }
                )
            })
        } catch(error){
            console.error(error)
            throw error
        }
    };

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setError(null)
        
        const {email, password, name, gender, birthday} = userInfo
        
        const details = {
            email,
            password,
            name,
            gender,
            birthday,
            createdAt: serverTimestamp(),
        }

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
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user
            await createUserProfileDocument(details, user);
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
                        <p className='paragraph paragraph main'>
                            <b style={{fontSize: "inherit"}}>Ether chat</b> is a project made for the ethereum web3 community to discover and communicate with new frens.
                        </p>
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
                                <label htmlFor='check'>
                                    <span>LFG <FaBoltLightning color='red' /> </span>
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
                                        Discord
                                    </label>
                                    <input placeholder={userInfo?.name || "johnwick"} value={userInfo?.email} name='email' onChange={handleChange} type='email' />
                                </div>
                                <div className='inp-holder'>
                                    <label>
                                        Password
                                    </label>
                                    <input placeholder='******' minLength={6} maxLength={10} value={userInfo?.password} name='password' onChange={handleChange} type='password' required />
                                </div>
                                <div className='btn-holder'>
                                    <button className='btn fancy filled hover'>
                                        Connect Wallet
                                    </button>
                                </div>
                            </form>
                            <div className='divider'>
                                <p className='center' style={{
                                    backgroundColor: "transparent",
                                    backdropFilter: "blur(10px)"
                                }}>or</p>
                            </div>
                            <div className='actions'>
                                <button className='btn filled white icon-big outline hover' onClick={(e)=>{
                                    e.preventDefault()
                                    e.stopPropagation()
                                    console.log("Creating acct with google popup")
                                    googleSignIn()
                                }}>
                                    <FaGoogle />
                                    Sign up with Google
                                </button>
                            </div>
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