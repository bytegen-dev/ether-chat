import React, { useLayoutEffect, useRef } from 'react'

const ErrorComponent = ({error}) => {
    const errorRef = useRef(null)
    useLayoutEffect(()=>{
        errorRef?.current?.scrollIntoView()
    },[])
    return (
    <>
        <p className='error'>
            <div className='error-mock' ref={errorRef}></div>
            {error}
        </p>
    </>
  )
}

export default ErrorComponent