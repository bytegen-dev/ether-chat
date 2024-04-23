import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue } from "firebase/database";
import { db, firestore } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Online = ({uid,  isOnline}) => {
  const userId = uid
  return (
    <>
        <div className='online' style={{
            backgroundColor: isOnline ? "green" : "gray",
            height: "7px",
            width: "7px",
            borderRadius: "100px",
        }}></div>
    </>
  )
}

export default Online