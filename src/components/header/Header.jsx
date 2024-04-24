import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { MdAccountCircle, MdChat, MdContacts, MdMail, MdMailOutline, MdNewspaper, MdOutlineAccountCircle, MdOutlineChat, MdOutlineContacts, MdOutlineNewspaper, MdOutlinePersonSearch, MdPeople, MdPeopleOutline, MdPersonSearch } from "react-icons/md";import { FaArrowRight, FaBars, FaBell, FaChevronDown, FaRegBell, FaRegUser, FaSearch, FaTimes } from "react-icons/fa"
import logoEl from "../../assets/logo-transparent.png"
import { signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { HiMenuAlt3 } from "react-icons/hi";
import { FaGear } from "react-icons/fa6";
import { IoClose } from 'react-icons/io5';
const changedPaths = [
    "/search", "/mail", "/feed", "/people", "/chats", "/account"
]

const Header = ({appState, setAppState}) => {
    const location = useLocation()
    const pathname = location?.pathname
    const [showMenu, setShowMenu] = useState(false)
    const [showMore, setShowMore] = useState(false)
    const navigate = useNavigate()
    const [dropHeader, setDropHeader] = useState(false)
    useEffect(()=>{
        setShowMenu(false)
        setDropHeader(false)
        if(appState?.user?.isProfileCompleted){
            setShowMore(true)
        } else{
            setShowMore(false)
        }
    },[pathname, appState?.isLoggedIn, appState.showWizard])

    const showNewUi = changedPaths?.includes(pathname)
    const hideBottomPaths = ["/chat", "/setup-wizard"]
    const hideBottomPathsExceptions = ["/chats"]
    const hideBottom = hideBottomPaths?.find((path)=>{
        return pathname?.includes(path) && !hideBottomPathsExceptions?.includes(pathname)
    })

    const notifications = appState?.user?.notifications
    const unreadNotifications = notifications?.filter((notifications)=>{
        return (
            !notifications?.isRead
        )
    })

    return (
        <>
            <div className={showMenu ? 'menu show' : 'menu'}>
                <div className='links-holder'>
                    {pathname?.includes("/user") && <p>
                        <Link className='active' onClick={()=>{
                            setShowMenu(false)
                        }}>
                            Profile
                        </Link>
                    </p>}
                    {(showMore || !appState?.isLoggedIn) ? <>
                        {appState?.links?.map((link, index)=>{
                            return (
                                <p key={index}>
                                    <NavLink to={link.to} onClick={()=>{
                                        setShowMenu(false)
                                    }}>
                                        {link.title}
                                    </NavLink>
                                </p>
                            )
                        })}
                    </> : <>
                        <p>
                            <NavLink to={"https://twitter.com/isaacadxbayo"} onClick={()=>{
                                setShowMenu(false)
                            }}>
                                Twitter
                            </NavLink>
                        </p>
                        <p>
                            <NavLink to={"https://github.com/bytegen-dev"} onClick={()=>{
                                setShowMenu(false)
                            }}>
                                Github
                            </NavLink>
                        </p>
                    </>}
                    {appState?.isLoggedIn && <p>
                        <Link style={{
                            fontSize: "14px",
                        }} className={showMore ? "" : "logout"} onClick={()=>{
                            const confirm = window.confirm("Are you sure?")
                            if(confirm){
                                signOut(auth).then(() => {
                                // Sign-out successful.
                                console.log('Logout successful');
                                navigate("/auth/login")
                                }).catch((error) => {
                                // An error happened.
                                console.error('Logout failed', error);
                                });
                            }
                        }}>
                            Logout
                        </Link>
                    </p>}
                </div>
                <div className='bottom'>
                    <p>
                        © 2024 Ether chat™
                    </p>
                </div>
                <div className='hamburger-holder'>
                    <button className={`hamburger ${showMenu ? "show" : ""} hover rotate`} onClick={()=>{
                        setShowMenu(!showMenu)
                    }}>
                        <IoClose />
                    </button>
                </div>
            </div>
            <div className={showMenu ? "backdrop show" : "backdrop"}  onClick={()=>{
                setShowMenu(false)
            }}></div>
            <div className='header'>
                <div className='container' style={{
                    justifyContent: (!showMore || (appState?.isLoggedIn && !appState?.user?.isProfileCompleted)) ? "space-between" : "space-between",
                }}>
                    {(appState?.isLoggedIn && appState?.user?.isProfileCompleted) &&  <div className='hamburger-holder'>
                        <Link to={"/mails"} className='hamburger small'>
                            {pathname === "/mails" ? <FaBell style={{
                                color: "#03A9F4"
                            }} /> : <FaRegBell />}
                            {unreadNotifications?.length ? <div className='dot'></div> : <></>}
                        </Link>
                    </div>}
                    <Link to={"/"} className='logo-el' style={
                        !showMore ? {...{fontSize:  "18px",}} : {
                            color: "#333"
                        }
                    }>
                        <img src={logoEl} />
                        <span>Ether</span> chat™
                        {/* <span>X</span> Universe<small style={{fontSize: "12px", marginLeft: "-9px"}}>™</small> */}
                    </Link>
                    {(showMore || !appState?.isLoggedIn) && <>
                        <div className='links-holder'>
                            {appState?.links?.map((link, index)=>{
                            return (
                                <p key={index}>
                                    <NavLink to={link.to} onClick={()=>{
                                        setShowMenu(false)
                                    }}>
                                        {link.title}
                                    </NavLink>
                                </p>
                            )
                        })}
                        {appState?.isLoggedIn && <div className={`drop-holder ${dropHeader ? "show" : "true"}`}>
                            <p>
                                <Link onClick={()=>{
                                    setDropHeader(!dropHeader)
                                }}>
                                    Settings <FaGear />
                                </Link>
                            </p>
                            <div className='holder'>
                                <p>
                                    <Link to={"/account/update"}>Update Profile</Link>
                                </p>
                                {appState?.isLoggedIn && <p>
                                    <Link onClick={()=>{
                                        const confirm = window.confirm("Are you sure?")
                                        if(confirm){
                                            signOut(auth).then(() => {
                                            // Sign-out successful.
                                            console.log('Logout successful');
                                            navigate("/auth/login")
                                            }).catch((error) => {
                                            // An error happened.
                                            console.error('Logout failed', error);
                                            });
                                        }
                                    }}>
                                        Logout
                                    </Link>
                                </p>}
                            </div>
                        </div>}
                        </div>
                    </>}

                    {showNewUi === "Axax" ? <div className='hamburger-holder'>
                        <NavLink className='hamburger small' to={"/account"}>
                            <FaRegUser />
                        </NavLink>
                    </div> : <>
                        { <div className='hamburger-holder'>
                            <button className={`hamburger ${showMenu ? "show" : ""} small`} onClick={()=>{
                                setShowMenu(true)
                            }}>
                                <HiMenuAlt3 />
                            </button>
                        </div>}
                    </>
                    }
                </div>
            </div>
            {(appState?.isLoggedIn && showMore && !hideBottom) && <div className='menu-bar'>
                <NavLink to={"/search"}>
                    {pathname === "/search" ? <MdPersonSearch /> : <MdOutlinePersonSearch />}
                    <p>
                        Search
                    </p>
                </NavLink>

                <NavLink to={"/chats"}>
                    {pathname === "/chats" ? <MdChat /> : <MdOutlineChat />}
                    <p>
                        Chats
                    </p>
                </NavLink>

                <NavLink to={"/mails"}>
                    {pathname === "/mails" ? <MdMail /> : <MdMailOutline />}
                    <p>
                        Mails
                    </p>
                </NavLink>

                {/* <NavLink to={"/news"}>
                    {pathname === "/news" ? <MdNewspaper /> : <MdOutlineNewspaper />}
                    <p>
                        Newsfeed
                    </p>
                </NavLink> */}

                <NavLink to={"/people"}>
                    {pathname === "/people" ? <MdPeople /> : <MdPeopleOutline />}
                    <p>
                        People
                    </p>
                </NavLink>
                <NavLink to={"/account"}>
                    {!appState?.user?.profileImageUrl ? <>
                        {pathname === "/account" ? <MdAccountCircle /> : <MdOutlineAccountCircle />}
                    </> :
                    <img src={appState?.user?.profileImageUrl} alt='' style={{
                        minWidth: "23px",
                        width: "23px",
                        height: "23px",
                        borderRadius: "1000px",
                        border: "1px solid #0002",
                        objectFit: "cover",
                        background: "#0001",
                    }} />}
                    <p>
                        Account
                    </p>
                </NavLink>
            </div>}
        </>
  )
}

export default Header