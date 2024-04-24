import React from 'react'
import { ThreeDots } from 'react-loader-spinner'

const Loader = ({text, bg}) => {
  return (
    <div className={`loader ${bg ? "bg" : ""}`}>
        <div className='container'>
        <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#03A9F4"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />
        {text && <p>
            {text}
        </p>}
        </div>
    </div>
  )
}

export default Loader