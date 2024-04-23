import React, { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../../components/footer/Footer'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, firestore } from '../../firebaseConfig'
import ErrorComponent from '../../components/error/ErrorComponent'
import { collection, doc, setDoc } from 'firebase/firestore'

const Login = ({appState, setAppState}) => {
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

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const {email, password} = userInfo
        setAppState((prev)=>{
            return ({
                ...prev,
                isLoading: true
            })
        })
        setError(null);
        
        try {
            // Sign in with email and password
            setAppState((prev)=>{
                return ({
                    ...prev,
                    isLoading: true
                })
            })
            await signInWithEmailAndPassword(auth, email, password);
            setAppState((prev)=>{
                return ({
                    ...prev,
                    isLoading: false
                })
            })
            navigate("/")
            // On successful login, you can redirect the user or do other actions
            console.log('Logged in successfully');
        } catch (error) {
            setAppState((prev)=>{
                return ({
                    ...prev,
                    isLoading: false
                })
            })
            setError(error.message);
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
            <section className='page--section'>
                <div className='login--card'>
                    <h2>Login into LoveWorld</h2>
                    {error && <ErrorComponent error={error} />}
                    <form onSubmit={handleSubmit}>
                        <div className='inp-holder'>
                            <label>
                                Email
                            </label>
                            <input value={userInfo?.email} name='email' onChange={handleChange} placeholder='Your Email' type='email' required />
                        </div>
                        <div className='inp-holder'>
                            <label>
                                Password
                            </label>
                            <input placeholder='Your Password' type='password' required name='password' onChange={handleChange} />
                        </div>
                        {/* <div className='actions-holder'>
                            <Link to={"/forgot-password"}>Forgot your password?</Link>
                        </div> */}
                        <div className='btn-holder'>
                            <button className='btn fancy filled hover'>
                                Log in
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
                        <button className='btn filled white icon-big outline hover' onClick={googleSignIn}>
                            <FaGoogle />
                            Sign In with Google
                        </button>
                    </div>
                </div>
                <div className='float-img'></div>
            </section>
            <Footer />
        </div>
    </div>
  )
}

export default Login