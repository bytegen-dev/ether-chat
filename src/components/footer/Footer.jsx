import React from 'react'
import { FaCcDiscover, FaCcMastercard, FaCcPaypal, FaCcVisa } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import logoEl from "../../assets/logo-transparent.png"

const Footer = () => {
  return (
    <div className='footer'>
        <div className='content'>
            <div className='section i'>
            <div className='logo-el'>
                <img src={logoEl} height={80} />
                LoveWorld™
            </div>
                <div className='spacer'></div>
                <div className='sponsors'>
                    <FaCcVisa />
                    <FaCcMastercard />
                    <FaCcPaypal />
                    <FaCcDiscover />
                </div>
            </div>
            <div className='section ii'>
                <div className='head'>
                    <h3>
                        ABOUT
                    </h3>
                </div>
                <div className='links-holder'>
                    <Link to={"/about"}>About us</Link>
                    <Link to={"/about"}>Community Guidelines</Link>
                    <Link to={"/about"}>Online Dispute Resolution</Link>
                    <Link to={"/about"}>FAQ</Link>
                </div>
            </div>
            <div className='section iii'>
                <div className='head'>
                    <h3>
                        LEGAL TERMS
                    </h3>
                </div>
                <div className='links-holder'>
                    <Link to={"/about"}>Terms of use</Link>
                    <Link to={"/about"}>Payment, Auto top-up and Refund Policy</Link>
                    <Link to={"/about"}>Disclosures & Disclaimers</Link>
                    <Link to={"/about"}>Anti-Scam Policy</Link>
                </div>
            </div>
            <div className='section iv'>
                <div className='head'>
                    <h3>
                        PRIVACY POLICY
                    </h3>
                </div>
                <div className='links-holder'>
                    <Link to={"/about"}>Privacy policy</Link>
                    <Link to={"/about"}>Cookie Policy</Link>
                </div>
            </div>
            <div className='section v'>
                <div className='head'>
                    <h3>
                        SUPPORT
                    </h3>
                </div>
                <div className='links-holder'>
                    <Link to={"/about"}>support@loveworld.com</Link>
                    <Link to={"/about"}>Unsubscribe</Link>
                </div>
            </div>
        </div>
        <div className='cprt'>
            © 2024 TheLoveUniverse.com
        </div>
    </div>
  )
}

export default Footer