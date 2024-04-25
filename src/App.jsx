import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, set, remove } from "firebase/database";import "./styles/index.scss"
import Header from './components/header/Header'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Loader from './components/loader/Loader'
import SignUp from './pages/auth/SignUp'
import { useAuth } from './context/AuthContext'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, firestore } from './firebaseConfig'
import Wizard from './pages/wizard/Wizard'
import Development from './pages/development/Development'
import Search from './pages/search/Search'
import User from './pages/user/User'
import Chats from './pages/chats/Chats'
import Chat from './pages/chat/Chat'
import Mail from './pages/mail/Mail'
import People from './pages/people/People'
import Mails from './pages/mails/Mails'
import Notifications from './pages/notifications/Notifications'
import Profile from './pages/profile/Profile'
import UpdateProfiie from './pages/update-profile/UpdateProfiie';
import MailInfo from './pages/mailInfo/MailInfo';
import Admin from './pages/admin/Admin';
import { CursorifyProvider } from '@cursorify/react';
import AnimatedCursor from 'react-animated-cursor';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import BuyCredits from './components/buy-credits-popup/BuyCredits';
import Share from './pages/share/Share';
// import { PhingerCursor } from '@cursorify/react';

const notLoggedInLinks = [
  {
    title: "Get Started",
    to: "/"
  },
  {
    title: "Signin",
    to: "/auth/login"
  },
  {
    title: "Github",
    isLink: false,
    to: "https://github.com/bytegen-dev",
  },
  {
    title: "Twitter",
    isLink: true,
    to: "https://x.com/isaacadxbayo",
  },
]

const loggedInLinks = [
  {
    title: "Search",
    to: "/search",
  },
  {
    title: "Chats",
    to: "/chats",
  },
  {
    title: "Account",
    to: "/account",
  },
  {
    title: "Twitter",
    to: "https://x.com/isaacadxbayo",
    isLink:true,
  },
  {
    title: "Github",
    to: "https://github.com/bytegen-dev",
    isLink:true,
  },
]

const userTemplate = {
  isAdmin: false,
  isPremium: false,
  username: "",
  uid: "",
  displayName: "",
  email: "",
  profileImageUrl: "",
  pronouns: "",
  birthday: "",
  gender: "",
  isProvider: false,
  myServices: [],
  friends: [],
  messages: [],
  mails: [],
  gallery: [],
  accountCreated: "",
  accountUpdated: "",
  isDisabled: "",
  isDeleted: "",
  goals: [],
  isSuspended: "",
  isProfileCompleted: false,
  createdAt: null,
  following: [],
  notifications: [],
}

const userTemplateX = {
  isAdmin: false,
  isPremium: false,
  username: "axaxa",
  uid: "axaxaxax",
  displayName: "Ashley",
  email: "axaxjakcda",
  profileImageUrl: "",
  pronouns: "",
  birthday: "",
  gender: "",
  isProvider: false,
  myServices: [],
  friends: [],
  messages: [],
  gallery: [],
  accountCreated: "",
  accountUpdated: "",
  isDisabled: "",
  isDeleted: "",
  goals: [],
  isSuspended: "",
  isProfileCompleted: true,
  createdAt: null,
}

const App = () => {
  const location = useLocation()
  const pathname = location.pathname

  const { currentUser } = useAuth();

  const navigate = useNavigate()

  const [appState, setAppState] = useState({
    isLoading: false,
    isLoadingX: false,
    isBigLoading: true,
    isLoggedIn: false,
    user: userTemplate,
    userTemplate,
    siteDetails: {
      title: "Ether chat",
    },
    users: [
    ],
    mails: [],
    messages: [],
    links: [],
    showPay: false,
  })

  useEffect(()=>{
    if(appState.isLoggedIn){
      function trackUserConnectionStatus(userId) {
        const database = getDatabase();
        const userStatusDatabaseRef = ref(database, '/status/' + userId);
      
        const connectedRef = ref(database, '.info/connected');
        onValue(connectedRef, (snapshot) => {
          if (snapshot.val() === false) {
            // If we lose network then remove this user from the list
            return;
          };
      
          // If connected, use the 'onDisconnect()' method to set the user as 'offline' upon disconnection
          onDisconnect(userStatusDatabaseRef).set({ online: false }).then(() => {
            // Set the user's status to online
            set(userStatusDatabaseRef, { online: true });
          });
        });
      }

      const fetchUserProfile = async () => {
        try{
          const userDoc = doc(firestore, 'users', appState?.walletAddress);
          const docSnap = await getDoc(userDoc);
          
          if (docSnap.exists()) {
            const details = docSnap.data()
            setAppState((prev)=>{
              return ({
                ...prev,
                user: {
                  ...userTemplate,
                  ...details,
                  uid: appState?.walletAddress,
                }
              })
            });
  
            if(details?.isProfileCompleted){
              setAppState((prev)=>{
                return (
                  {
                    ...prev,
                    showWizard: false,
                    isBigLoading: false,
                  }
                )
              })
            } else{
              setAppState((prev)=>{
                return (
                  {
                    ...prev,
                    showWizard: true,
                    isBigLoading: false,
                  }
                )
              })
            }
          } else {
            console.log('No such document!');
            setAppState((prev)=>{
              return ({
                ...prev,
                links: [
                  ...loggedInLinks,
                ],
                showWizard: false,
                isBigLoading: false,
              })
            })
          }
        } catch (error){
          setAppState((prev)=>{
            return ({
              ...prev,
              links: [
                ...loggedInLinks,
              ],
              showWizard: false,
              isBigLoading: false,
            })
          })
        }
      };

      fetchUserProfile()

      setAppState((prev)=>{
        return ({
          ...prev,
          links: [
            ...loggedInLinks,
          ],
        })
      })
    } else{
      setAppState((prev)=>{
        return ({
          ...prev,
          links: [
            ...notLoggedInLinks
          ],
          user: userTemplate,
        })
      })
    }
  },[appState.isLoggedIn, pathname])

  const userId = appState?.user?.uid
    
    useEffect(()=>{
      setTimeout(()=>{
        setAppState((prev)=>{
          return ({
            ...prev,
            isLoading: false,
          })
        })
      }, 900)
  },[pathname])

  useEffect(() => {
    
  }, []);

  useEffect(() => {
    const checkWalletConnected = async () => {
      if (window.ethereum && window.ethereum.isConnected()) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];

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
                              isBigLoading: false,
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
  
      const handleSubmit = async ()=>{
          try {
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
                              isBigLoading: false,
                              walletAddress,
                            })
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
                  setError("Install Metamask")
              }
          } catch (error) {
              console.error(error);
              setAppState((prev)=>{
                  return(
                      {
                          ...prev,
                          isBigLoading: false,
                      }
                  )
              })
          }
      }

      if(walletAddress){
        handleSubmit()
      }
      }
    };

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setAppState((prev)=>{
          return ({
            ...prev,
            isLoggedIn: false,
            user: userTemplate,
          })
        })
        navigate("/auth/login", {replace: true})
      } else {
        checkWalletConnected();
      }
    };

    checkWalletConnected();

    window.ethereum.on('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  useEffect(() => {

    const q = query(collection(firestore, "messages")); // Adjust "messages" if your collection has a different name

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppState((prev)=>{
        return ({
          ...prev,
          messages: messagesArray
        })
      });
    }, 
    (error) => {
      console.error("Error fetching messages: ", error);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {

    const q = query(collection(firestore, "mails")); // Adjust "mails" if your collection has a different name

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const mailsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppState((prev)=>{
        return ({
          ...prev,
          mails: mailsArray
        })
      });
    }, 
    (error) => {
      console.error("Error fetching mails: ", error);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  
  }, []);

  const fetchUsers = async () => {
    const usersCollectionRef = collection(firestore, 'users');
    const querySnapshot = await getDocs(usersCollectionRef);
    const usersArray = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id,
      }));

      const usersFilter = usersArray?.filter((user)=>{
        return !user?.isAdmin
      })

    setAppState(prev => ({
      ...prev,
      users: usersFilter,
      allUsers: usersArray
    }));
  };

  
useEffect(() => {
  const updateUserOnline = async (userId, updates) => {
    // Ensure that we have a valid userId and the user is logged in before attempting to update
    if (userId && appState?.isLoggedIn) {
      const userRef = doc(firestore, "users", userId);
      try {
        await updateDoc(userRef, updates);
      } catch (error) {
        console.error("Error updating profile: ", error);
      }
    } else {
      // console.log("User ID is missing or user is not logged in.");
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      updateUserOnline(userId, { isOnline: true });
      fetchUsers()
    } else {
      updateUserOnline(userId, { isOnline: false });
      fetchUsers()
    }
  };

  // Add visibility change event listener
  document.addEventListener("visibilitychange", handleVisibilityChange);
  handleVisibilityChange()

  // Remove event listener on cleanup
  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
// If `userId` or `appState.isLoggedIn` can change, include them in the dependency array.
// Otherwise, leave the dependency array empty.
}, [userId, appState?.isLoggedIn, pathname]);

  const fetchAllMessages = ()=>{
  }

  const addCredits = async()=>{
    const userDocRef = doc(firestore, 'users', appState?.user?.uid);

    const details = appState?.user
    const prevCredits = details?.credits || "0"
    const prevCreditsInt = parseInt(prevCredits)
    const newCredits = prevCreditsInt + 50

    const finalDetails = {
      ...details,
      credits: newCredits,
    };

    try{
      await updateDoc(userDocRef, finalDetails);
      setAppState((prev) => ({
          ...prev,
          isLoadingX: false,
      }));
    } catch(error){
      console.error(error)
    }

  }
  
  return (
    <>
        {/* <AnimatedCursor
          innerSize={8}
          outerSize={50}
          color='94, 48, 211'
          outerAlpha={0.1}
          innerScale={0.7}
          outerScale={2}
        /> */}
        {appState?.showPay && <BuyCredits appState={appState} setAppState={setAppState} />}
        <div className='App'>
          <>
            {appState?.isBigLoading ? <Loader bg={true} text={"Just a moment we're getting things ready..."} />
            : <>
              {appState?.isLoading ? <Loader /> : <>{appState?.isLoadingX && <Loader text={"Processing details..."} />}</>}
            </>}
          </>
          <Header appState={appState} setAppState={setAppState} />
          <Routes>
            
            <Route path='/' element={appState?.isLoggedIn ?
            <>
              {appState?.user?.isProfileCompleted ? <><Navigate to={"/search"} /></> : <Wizard appState={appState} setAppState={setAppState} />}
            </>
            
            : <SignUp appState={appState} setAppState={setAppState} />} />

            <Route path='/search' element={appState?.isLoggedIn ?
            <>
              {appState?.user?.isProfileCompleted ? <><Search appState={appState} setAppState={setAppState} /></> : <Wizard appState={appState} setAppState={setAppState} />}
            </>
            
            : <SignUp appState={appState} setAppState={setAppState} />} />

            <Route path='/user/:uid' element={appState?.isLoggedIn ? <User appState={appState} setAppState={setAppState} /> : <Login appState={appState} setAppState={setAppState} />} />
            
            <Route path='/account' element={appState?.isLoggedIn ? <Profile appState={appState} setAppState={setAppState} /> : <Login appState={appState} setAppState={setAppState} />} />
            
            <Route path='/share' element={appState?.isLoggedIn ? <Share appState={appState} setAppState={setAppState} /> : <Login appState={appState} setAppState={setAppState} />} />

            <Route path='/account/credits' element={appState?.isLoggedIn ? <>
              <Profile appState={appState} setAppState={setAppState} />
              <BuyCredits appState={appState} setAppState={setAppState} />
            </> : <Login appState={appState} setAppState={setAppState} />} />
            
            <Route path='/account/update' element={appState?.isLoggedIn ? <UpdateProfiie appState={appState} setAppState={setAppState} /> : <Login appState={appState} setAppState={setAppState} />} />

            <Route path='/chat/:uid' element={appState?.isLoggedIn ? <Chat fetchAllMessages={fetchAllMessages} appState={appState} setAppState={setAppState} /> : <Login appState={appState} setAppState={setAppState} />} />
            
            <Route path='/mail/:id' element={appState?.isLoggedIn ? <MailInfo appState={appState} setAppState={setAppState} /> : <Login appState={appState} setAppState={setAppState} />} />
            
            <Route path='/send-mail/:uid' element={appState?.isLoggedIn ? <Mail appState={appState} setAppState={setAppState} /> : <Login appState={appState} setAppState={setAppState} />} />
            
            <Route path='/people' element={appState?.isLoggedIn ? <People appState={appState} setAppState={setAppState} /> : <Login appState={appState} setAppState={setAppState} />} />
            
            <Route path='/chats' element={appState?.isLoggedIn ? <Chats appState={appState} setAppState={setAppState} /> : <Login appState={appState} setAppState={setAppState} />} />
            
            <Route path='/mails' element={appState?.isLoggedIn ? <Mails appState={appState} setAppState={setAppState} /> : <Login appState={appState} setAppState={setAppState} />} />

            <Route path='/notifications' element={appState?.isLoggedIn ? <Notifications appState={appState} setAppState={setAppState} /> : <Login appState={appState} setAppState={setAppState} />} />

            <Route path='/setup-wizard' element={appState?.isLoggedIn ?
            <>
              {appState?.user?.isProfileCompleted ? <><Wizard appState={appState} setAppState={setAppState} /></> : <Wizard appState={appState} setAppState={setAppState} />}
            </>
            
            : <SignUp appState={appState} setAppState={setAppState} />} />

            <Route path='/auth/signup' element={<SignUp appState={appState} setAppState={setAppState} />} />

            <Route path='/auth/login' element={<Login appState={appState} setAppState={setAppState} />} />
              
            <Route path='/admin' element={appState?.user?.isAdmin ? <Admin appState={appState} setAppState={setAppState} /> : <div className='page'>
              <div className='container' style={{
                marginTop: "70px",
              }}>
                <p>
                  401 | Restricted Access
                </p>
              </div>
            </div>} />
            
            <Route path='/*' element={<Development />} />
          </Routes>
        </div>
    </>
  )
}

export default App