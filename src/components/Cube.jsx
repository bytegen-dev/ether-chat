import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'

const Cube = ({position, size, color})=>{

    const cubeRef = useRef()
    useFrame(({state, delta}) =>{
      cubeRef.current.rotation.x += delta
    })

    return (
        <mesh ref={cubeRef} position={position}>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}

export default Cube