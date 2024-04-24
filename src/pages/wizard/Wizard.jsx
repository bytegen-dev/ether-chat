import { doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { FaChevronLeft, FaRegImages, FaTrash } from 'react-icons/fa'
import { firestore, storage } from '../../firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'

const stages = [
    {
        title: "Intro",
        id: 0
    },
    {
        title: "What is your goal here",
        id: 1
    },
    {
        title: "What is your goal here",
        id: 2
    },
    {
        title: "What is your goal here",
        id: 3
    },
    {
        title: "What is your goal here",
        id: 4
    },
]

const goalsPossible=[
    "Chatting",
    "Airdrops",
    "Giveaways",
    "Web3 jobs",
    "Gift crypto",
    "Romance 👀",
    "Other"
]

const Wizard = ({appState, setAppState}) => {
    const [currentStage, setCurrentStage] = useState(stages[0])
    const [goals, setGoals] = useState([])

    const [info, setInfo] = useState({
        bio: ""
    })
    const [image, setImage] = useState({
        file: null,
        src: ""
    })

    useEffect(()=>{
        if(appState?.user?.goals){
            setGoals([...appState?.user?.goals])
            setImage({
                file: null,
                src: appState?.user?.profileImageUrl
            })
            setInfo({
                bio: appState?.user?.bio || ""
            })
        }
    }, [appState?.user?.goals])

    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e)=>{
        const {name, value} = e.target
        setInfo((prev)=>{
            return ({
                ...prev,
                [name]: value,
            })
        })
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
          return;
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage({
            file,
            src: reader.result|| ""
          });
        };
        reader.readAsDataURL(file);
        console.clear()
      };

    const addGoal = (goal) => {
        setGoals((prevGoals) => {
            if (prevGoals.includes(goal)) {
                return prevGoals.filter((goalx) => goalx !== goal);
            } else {
                return [...prevGoals, goal];
            }
        });
    };

    const nextStage = ()=>{
        const nextStageDetails = stages[currentStage?.id + 1]
        setCurrentStage(nextStageDetails)
    }
    
    const progress = (<div className='progress'>
        <div className='back' onClick={()=>{
            const prevStage = stages[currentStage?.id - 1]
            setCurrentStage(prevStage)
        }}>
            <FaChevronLeft/>
        </div>
        <div className='bar-holder'>
            <div className='bar'>
                <div className='loaded' style={{
                    width: `${((currentStage?.id + 1.0)/stages?.length)*100}%`,
                }}></div>
            </div>
        </div>
    </div>)
    
    const progressGreen = (<div className='progress'>
        <div className='back'  style={{
            opacity: isLoading ? 0.3 : 1,
            transition: "all 0.5s ease"
        }} disabled={isLoading} onClick={()=>{
            if(isLoading){
                return
            }
            const prevStage = stages[currentStage?.id - 1]
            setCurrentStage(prevStage)
        }}>
            <FaChevronLeft/>
        </div>
        <div className='bar-holder'>
            <div className='bar'>
                <div className='loaded' style={{
                    width: `${((currentStage?.id + 1.0)/stages?.length)*100}%`,
                    backgroundColor: "#34C759",
                }}></div>
            </div>
        </div>
    </div>)

    const navigate = useNavigate()

    const saveChanges = async ({details, file})=>{
        setAppState((prev)=>{
            return ({
                ...prev,
                isLoadingX: true,
            })
        })
        const thisUser = appState?.user
        try{
            let profileImageUrl = thisUser?.profileImageUrl || ""
            if(file){
                const imageRef = ref(storage, `profileImages/${thisUser?.uid}`);
                await uploadBytes(imageRef, file);
                profileImageUrl = await getDownloadURL(imageRef);
            } else{
                profileImageUrl = thisUser?.profileImageUrl || ""
            }

            // console.log(thisUser, profileImageUrl)

            const userDoc = doc(firestore, 'users', thisUser?.uid);
            await updateDoc(userDoc, {
                ...details,
                ...(profileImageUrl && { profileImageUrl, }),
                isProfileCompleted: true,
                uid: thisUser?.uid,
            });
            setAppState((prev)=>{
                return(
                    {
                        ...prev,
                        isLoadingX: false,
                    }
                )
            })
            navigate("/search", {replace: true})
            
        } catch(error){
            setAppState((prev)=>{
                return(
                    {
                        ...prev,
                        isLoadingX: false,
                    }
                )
            })
            console.error(error)
        }
    }

    const updateProfile = ()=>{
        setIsLoading(true)
        const details = {
            ...appState?.user,
            bio: info?.bio,
            goals,
            credits: 500,
            tokens: 3000,
        }
        const file = image?.file
        setTimeout(()=>{
            saveChanges({details, file})
            setIsLoading(false)
            setAppState((prev)=>{
                return ({
                    ...prev,
                    isLoadingX: true,
                })
            })
        }, 2000)
    }

    return (
    <>
        <div className='page wizard--page'>
            {currentStage?.id === 0 && <div className='container'>
                <section className='page--section'>

                </section>
                <div className='big-bg'></div>
                <div className='bottom holder'>
                    <p className='progress'>
                        Stage {currentStage?.id + 1}/{stages?.length}
                    </p>
                    <h2>
                        Welcome to Ether chat™
                    </h2>
                    <p>
                        Please take this guide to complete your profile and assist our algorithm ⚡
                    </p>
                    <div className='btn-holder'>
                        <button className='btn filled hover' onClick={()=>{
                            setCurrentStage(stages[1])
                        }}>
                            Let's do it
                        </button>
                    </div>
                </div>
            </div>}

            {currentStage?.id === 1 && <div className='container x'>
                {progress}
                <div className='instruction-holder'>
                    <h2>
                        What are your interests?
                    </h2>
                    <small style={{
                        border: "1px solid #03A9F422"
                    }}>up to 4 answers</small>
                    <div className='goals'>
                        {goalsPossible.map((goal, index)=>{
                            return (
                                <button className={`goal ${goals?.includes(goal) ? "selected" : ""}`} key={index} onClick={()=>{
                                    addGoal(goal)
                                }} disabled={goals?.length >= 4 && !goals?.includes(goal)}>
                                    {goal}
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className='bottom holder'>
                    {/* <p className='progress'>
                        Part {currentStage?.id}/{stages?.length}
                    </p> */}
                    <div className='btn-holder'>
                        <button className='btn outline hover' onClick={()=>{
                            nextStage()
                        }} style={{
                            maxWidth: "200px",
                            borderColor: "#0004",
                        }}>
                            Skip
                        </button>
                        <button className='btn filled hover'disabled={!goals?.length} onClick={()=>{
                            if(goals?.length){
                                nextStage()
                            }
                        }}>
                            Continue
                        </button>
                    </div>
                </div>
            </div>}

            {currentStage?.id === 2 && <div className='container x'>
                {progress}
                <div className='instruction-holder'>
                    <h2>
                        Brag about yourself a bit
                    </h2>
                    <small style={{
                        color: "#666",
                        backgroundColor: "transparent",
                        padding: "0",
                    }}>
                        E.g. I am a Defi trader. I trade crypto for a Dubai prince 🙂
                    </small>
                    <textarea minLength={5} placeholder='Start typing here' required onChange={handleChange} name='bio' value={info?.bio} maxLength={300}></textarea>
                </div>
                <div className='bottom holder'>
                    {/* <p className='progress'>
                        Part {currentStage?.id}/{stages?.length}
                    </p> */}
                    <div className='btn-holder'>
                        <button className='btn outline hover' onClick={()=>{
                            nextStage()
                        }} style={{
                            maxWidth: "200px",
                            borderColor: "#0004",
                        }}>
                            Skip
                        </button>
                        <button className='btn filled hover'disabled={!info?.bio} onClick={()=>{
                            if(info?.bio?.length){
                                nextStage()
                            }
                        }}>
                            Continue
                        </button>
                    </div>
                </div>
            </div>}

            {currentStage?.id === 3 && <div className='container x'>
                {progress}
                <div className='instruction-holder'>
                    <h2>
                        Let's add an image
                    </h2>
                    <small style={{
                        color: "#666",
                        backgroundColor: "transparent",
                        padding: "0",
                    }}>
                        An NFT or a picture of a $PET you love so much. Anything but nudes ✌
                    </small>

                    <small style={{
                        color: "#0004",
                        fontSize: "12px",
                        backgroundColor: "transparent",
                        padding: "0",
                        fontWeight: "300"
                    }}>
                        <i>
                            (in a future update users will be able to add an NFT directly from their  wallet)
                        </i>
                    </small>
                    <div className='img-adder'>
                        {!image?.src ? <label htmlFor='image-add' className='hover'>
                            <FaRegImages />
                            <p>
                                Upload a picture
                            </p>
                        </label> :
                        <>
                        <button className='del-btn' onClick={()=>{
                            setImage({
                                file: null,
                                src: "",
                            })
                        }}>
                            <FaTrash />
                        </button>
                        <img className='added-img'src={image?.src} alt='' />
                        </>}
                        <input className='file' onChange={handleImageChange} type="file" id='image-add' accept="image/*" style={{
                            display: "none"
                        }} />
                    </div>
                    
                </div>
                <div className='bottom holder'>
                    {/* <p className='progress'>
                        Part {currentStage?.id}/{stages?.length}
                    </p> */}
                    <div className='btn-holder'>
                        <button className='btn outline hover' onClick={()=>{
                            nextStage()
                        }} style={{
                            maxWidth: "200px",
                            borderColor: "#0004",
                        }}>
                            Skip
                        </button>
                        <button className='btn filled hover'disabled={!image?.src} onClick={()=>{
                            if(image?.src){
                                nextStage()
                            }
                        }}>
                            Save & Continue
                        </button>
                    </div>
                </div>
            </div>}

            {currentStage?.id === 4 && <div className='container x'>
                {progressGreen}
                <div className='instruction-holder'>
                    <h2 style={{
                        textAlign: "center"
                    }}>
                        Profile Completed
                    </h2>
                </div>
                <div className='img-holder'>
                </div>
                <div className='bottom holder'>
                    <div className='btn-holder'>
                        <button disabled={isLoading} className='btn filled hover' onClick={updateProfile}>
                            {isLoading ? "Please Wait..." : "Continue"}
                        </button>
                    </div>
                </div>
            </div>}
        </div>
    </>
  )
}

export default Wizard