import React from 'react'
import { FaCcDiscover, FaCcMastercard, FaCcPaypal, FaCcVisa, FaEthereum } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import logoEl from "../../assets/logo-transparent.png"
import { FaBoltLightning } from 'react-icons/fa6'

const Footer = () => {
  return (
    <div className='footer' style={{
        marginBottom: "-100px"
    }}>
        <div className='content'>
            <div className='section i'>
            <div className='logo-el'>
                <img src={logoEl} height={80} />
                Ether chat™
            </div>
                <div className='spacer'></div>
                <div className='sponsors' style={{
                    display: "flex",
                    flexWrap: "wrap",
                    rowGap: "20px",
                }}>
                    <FaEthereum />
                    <FaEthereum />
                    <FaEthereum />
                    <FaEthereum />
                    <FaEthereum />
                    <FaEthereum />
                </div>
            </div>
            <div className='section ii'>
                <div className='head'>
                    <h3>
                        ABOUT <FaBoltLightning color='gold' />
                    </h3>
                </div>
                <div className='links-holder'>
                    <Link to={"https://github.com/"}>My Github</Link>
                    <Link to={"https://twitter.com/isaacadxbayo"}>Twitter</Link>
                    <Link to={"https://linkedin.com/in/bytegen-dev"}>Linkedin</Link>
                    <Link to={"https://isaac-adebayo.vercel.app"}>Website</Link>
                </div>
            </div>
            <div className='section iii'>
                <div className='head'>
                    <h3>
                        MORE PROJECTS
                    </h3>
                </div>
                <div className='links-holder'>
                    <Link to={"/"}>Ether chat</Link>
                    <Link to={"https://cardano-chat.vercel.app"} style={{
                        pointerEvents: "none",
                        opacity: "0.4",
                    }}>Cardano chat</Link>
                    <Link to={"https://cardano-chat.vercel.app"} style={{
                        pointerEvents: "none",
                        opacity: "0.4",
                    }}>Solana chat</Link>
                    <Link to={"https://cnftshirt.io"}>CNFTshirt.io</Link>
                    <Link to={"https://spacebudz.io"}>spacebudz.io</Link>
                    <Link to={"https://solana-is-king.vercel.app"}>$SIK</Link>
                    <Link to={"https://deepsouth.ai"}>Deep South</Link>
                </div>
            </div>
            <div className='section iv'>
                <div className='head'>
                    <h3>
                        Contact
                    </h3>
                </div>
                <div className='links-holder'>
                    <Link to={"t.me/isaac_developer"}>Telegram</Link>
                    <Link to={"https://discord.com"}>Discord</Link>
                </div>
            </div>
            <div className='section v'>
                <div className='head'>
                    <h3>
                        SUPPORT
                    </h3>
                </div>
                <div className='links-holder'>
                    <Link to={"mailto:bytegen@gmail.com"}>bytegen@gmail.com</Link>
                </div>
            </div>
        </div>
        <div className='cprt'>
            © 2024 Etherchat
        </div>
    </div>
  )
}

export default Footer