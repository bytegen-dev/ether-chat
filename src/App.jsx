import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, set, remove } from "firebase/database";import "./styles/index.scss"
import Header from './components/header/Header'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Loader from './components/loader/Loader'
import SignUp from './pages/auth/SignUp'
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc } from 'firebase/firestore'
import { firestore } from './firebaseConfig'
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
import BuyCredits from './components/buy-credits-popup/BuyCredits';
import Share from './pages/share/Share';

import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react'

const projectId = import.meta.env.VITE_REACT_APP_WEB3MODAL_PROJECT_ID

const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

const metadata = {
  name: 'Eth chat',
  description: 'Ethers chat Dapp',
  url: 'https://ether-chat.vercel.app',
  icons: ['https://ether-chat.vercel.app/logo.png']
}

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: '...',
  defaultChainId: 1,
})

createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true
})

const notLoggedInLinks = [
  {
    title: "Get started",
    to: "/"
  },
  {
    title: "Github",
    isLink: false,
    to: "https://github.com/bytegen-dev",
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
  walletAddress: "",
  ethAddress: "",
}

const App = () => {
  const location = useLocation()
  const pathname = location.pathname

  const { open } = useWeb3Modal()


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

  const connectWallet = async ()=>{
    try{
      open()
    } catch(error){
      throw(error)
    }
  }

  const { isConnected, address } = useWeb3ModalAccount()

  useEffect(()=>{
    if(appState.isLoggedIn){
      localStorage?.setItem("was-logged-in", true)
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

  const createUserProfileDocument = async (walletAddress) => {
    try{
        const slicedWalletAddress = `${walletAddress?.slice(0, 4)}...${walletAddress?.slice(-2, -1)}`
        await setDoc(doc(firestore, "users", walletAddress), {
          uid: walletAddress,
          walletAddress,
          ethAddress: walletAddress,
          name: `Guest ${slicedWalletAddress}`,
          profileImageUrl: "https://ether-chat-xi.vercel.app/logo.png"
        });
        if(walletAddress){
            setAppState((prev)=>{
                return(
                    {
                        ...prev,
                        isLoading: false,
                        isLoggedIn: true,
                        user: {
                          uid: walletAddress,
                          walletAddress,
                          name: `Guest ${slicedWalletAddress}`
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

const userId = appState?.user?.uid || appState?.walletAddress


useEffect(()=>{
  if(isConnected){
    setAppState((prev)=>{
      return ({
        ...prev,
        isLoading: true,
      })
    })
    const walletAddress = address
    const fireMe = async()=>{
      try{
        setAppState((prev)=>{
            return ({
                ...prev,
                walletAddress,
                isLoading: true,
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
            if(location?.pathname?.includes("/auth/login")){
              navigate('/', {
                replace: true
              });
            } else if(location?.pathname?.includes("/get-started")){
              navigate('/', {
                replace: true
              });
            }
        } else {
          await createUserProfileDocument(walletAddress);
        }
      } catch(error){
        console.error(error)
      }
    }
    if(walletAddress){
      fireMe()
    }
  } else{
    const goOff = async()=>{
      const userRef = doc(firestore, "users", userId);
      try {
        await updateDoc(userRef, {isOnline: false});
      } catch (error) {
        console.error("Error updating profile: ", error);
      }
    }
    if(appState?.isLoggedIn){
      goOff()
      setTimeout(()=>{
        setAppState((prev)=>{
          return ({
            ...prev,
            user: userTemplate,
            isLoggedIn: false,
            isLoading: false,
          })
        })
      }, 500)
    }
  }
}, [isConnected, address])

    
    useEffect(()=>{
      setAppState((prev)=>{
        return ({
          ...prev,
          isLoading: false,
        })
      })
  },[pathname])

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
      allUsers: usersArray,
      isBigLoading: false,
    }));
  };

  
useEffect(() => {
  const updateUserOnline = async (userId, updates) => {
    if (userId && appState?.isLoggedIn) {
      const userRef = doc(firestore, "users", userId);
      try {
        await updateDoc(userRef, updates);
      } catch (error) {
        console.error("Error updating profile: ", error);
      }
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

  document.addEventListener("visibilitychange", handleVisibilityChange);
  handleVisibilityChange()

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [userId, appState?.isLoggedIn, pathname]);

  const fetchAllMessages = ()=>{
  }
  
  return (
    <>
        
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
            
            : <Login connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />

            <Route path='/search' element={appState?.isLoggedIn ?
            <>
              {appState?.user?.isProfileCompleted ? <><Search appState={appState} setAppState={setAppState} /></> : <Wizard appState={appState} setAppState={setAppState} />}
            </>
            
            : <SignUp connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />

            <Route path='/user/:uid' element={appState?.isLoggedIn ? <User appState={appState} setAppState={setAppState} /> : <Login connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />
            
            <Route path='/account' element={appState?.isLoggedIn ? <Profile appState={appState} setAppState={setAppState} /> : <Login connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />
            
            <Route path='/share' element={appState?.isLoggedIn ? <Share appState={appState} setAppState={setAppState} /> : <Login connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />
            
            <Route path='/account/update' element={appState?.isLoggedIn ? <UpdateProfiie appState={appState} setAppState={setAppState} /> : <Login connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />

            <Route path='/chat/:uid' element={appState?.isLoggedIn ? <Chat fetchAllMessages={fetchAllMessages} appState={appState} setAppState={setAppState} /> : <Login connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />
            
            <Route path='/mail/:id' element={appState?.isLoggedIn ? <MailInfo appState={appState} setAppState={setAppState} /> : <Login connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />
            
            <Route path='/send-mail/:uid' element={appState?.isLoggedIn ? <Mail appState={appState} setAppState={setAppState} /> : <Login connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />
            
            <Route path='/people' element={appState?.isLoggedIn ? <People appState={appState} setAppState={setAppState} /> : <Login connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />
            
            <Route path='/chats' element={appState?.isLoggedIn ? <Chats appState={appState} setAppState={setAppState} /> : <Login connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />
            
            <Route path='/mails' element={appState?.isLoggedIn ? <Mails appState={appState} setAppState={setAppState} /> : <Login connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />

            <Route path='/notifications' element={appState?.isLoggedIn ? <Notifications appState={appState} setAppState={setAppState} /> : <Login connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />

            <Route path='/setup-wizard' element={appState?.isLoggedIn ?
            <>
              {appState?.user?.isProfileCompleted ? <><Wizard appState={appState} setAppState={setAppState} /></> : <Wizard appState={appState} setAppState={setAppState} />}
            </>
            
            : <SignUp connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />

            {/* <Route path='/auth/get-started' element={<SignUp connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} /> */}

            <Route path='/auth/login' element={<Login connectWallet={connectWallet} appState={appState} setAppState={setAppState} />} />
              
            <Route path='/*' element={<div className='page'>
              <div className='container' style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems:"center"
              }}>
                <h2 style={{
                  marginTop: "20px",
                }}>
                  404 | Page not found
                </h2>
              </div>
            </div>} />
          </Routes>
        </div>
    </>
  )
}

export default App