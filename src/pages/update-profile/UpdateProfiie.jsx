import React, { useEffect, useState } from 'react'
import { FaArrowRight, FaCamera, FaChevronCircleDown, FaChevronCircleUp, FaChevronDown, FaChevronLeft, FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Select from 'react-select';
import { Country, State, City } from 'country-state-city'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firestore, storage } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { FaAngleDown, FaXTwitter } from 'react-icons/fa6';

const UpdateProfiie = ({appState, setAppState}) => {
    const navigate = useNavigate()
    const user = appState?.user
    const [userInfo, setUserInfo] = useState({})
    const handleChange = (e)=>{
        const {name, value} = e.target
        setUserInfo((prev)=>{
            return ({
                ...prev,
                [name]: value,
            })
        })
    }
    const [file,  setFile] = useState(null)
    const [src,  setSrc] = useState(null)
    const [hasSet, setHasSet] = useState(false)
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)

  const relationshipTypes = [
    {label: "single", value: "single"},
    {label: "married", value: "married"},
    {label: "complicated", value: "complicated"},
    {label: "divorced", value: "divorced"},
    {label: "others", value: "others"},
    {label: "rather not say",value:"rather not say"},
  ]

  const [selectedRelationship, setSelectedRelationship] = useState(relationshipTypes[0])

  useEffect(() => {
    const loadCountries = () => {
      setCountries(Country.getAllCountries().map(({ isoCode, name }) => ({ value: isoCode, label: name })));
    };
    loadCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry ) {
      setStates(State.getStatesOfCountry(selectedCountry?.value).map(({ isoCode, name }) => ({ value: isoCode, label: name })));
      if(hasSet){
        setSelectedState(null); // Reset state selection when country changes
      }
    }
  }, [selectedCountry, hasSet]);
  
  useEffect(() => {
    if (selectedState) {
      setCities(City.getCitiesOfState(selectedCountry.value, selectedState.value).map(({ name }) => ({ value: name, label: name })));
      setSelectedCity(null); // Reset city selection when state changes
      if(hasSet){
        setSelectedCity(null); // Reset state selection when country changes
      }
    }
  }, [selectedState, selectedCountry, hasSet]);

    const handleImageChange = (e)=>{
        const file = e.target.files[0]
        const name = e.target.name

        setFile(file)

        let reader = new FileReader();

        reader.onloadend = () => {
        setSrc(reader.result);
        }

        if (file) {
        reader.readAsDataURL(file);
        }
    }

    const [gallery, setGallery] = useState([{
        file: null,
        src: ""
    }])

    const handleImageAdd = (e)=>{
        const file = e.target.files[0]
        const name = e.target.name
        let reader = new FileReader();

        reader.onloadend = () => {
            const src = reader.result;
            setGallery((prev)=>{
                return ([
                    ...prev,
                    {
                        file,
                        src
                    }
                ])
            })
        }

        if (file) {
        reader.readAsDataURL(file);
        }


    }

    useEffect(()=>{
        if(user?.uid){
            setUserInfo((prev)=>{
                return ({
                    ...prev,
                    ...user,
                })
            })
            if(user?.profileImageUrl){
                setSrc(user?.profileImageUrl)
            }
            if(user?.gallery){
                const galleryMap = user?.gallery?.map((src)=>{
                    return ({
                        file: null,
                        src,
                    })
                })
                setGallery(galleryMap)
            }
        }
    },[])

    const [error, setError] = useState(null)
    const [dropOptional, setDropOptional] = useState(false)


    const handleSubmit = async(e)=>{
        e.preventDefault()
        setError(null)
        const details = {
            ...userInfo,
            selectedRelationship: selectedRelationship?.value,
            location: {
                country: selectedCountry?.label || "",
                state: selectedState?.label || "",
                city: selectedCity?.label || "",
            },
        }

        console.clear()

        const profileImageFile = file
        setAppState((prev)=>{
            return ({
                ...prev,
                isLoadingX: true,
            })
        })
        try {
            // Assuming you have a 'users' collection and the document ID matches the user's ID
            const userDocRef = doc(firestore, 'users', userInfo.uid);

            let profileImageUrl = appState?.user?.profileImageUrl
    
            if (profileImageFile) {
                // Create a reference to the file location
                const fileRef = ref(storage, `profileImages/${userInfo.uid}`);
                // Upload file
                await uploadBytes(fileRef, profileImageFile);
                // Get file URL
                const photoURL = await getDownloadURL(fileRef);
                // Update details with profile image URL
                profileImageUrl = photoURL;
            }

            let newGallery = appState?.user?.gallery

            if (gallery) {
                const galleryUpdated = gallery.map(item => ({
                    file: item.file ? item.file : null,
                    src: item.file ? null : item.src,
                }));
            
                const galleryFiles = galleryUpdated.filter(item => item.file);
                const gallerySrcs = galleryUpdated.filter(item => item.src);
            
                const uploadPromises = galleryFiles.map(async (item) => {
                    const fileRef = ref(storage, `gallery/${userInfo.uid}/${item.file.name}`);
                    await uploadBytes(fileRef, item.file);
                    return getDownloadURL(fileRef);
                });
            
                Promise.all(uploadPromises).then(async (downloadURLs) => {
                    const newGallery = [
                        ...downloadURLs,
                        ...gallerySrcs.map(item => item.src),
                    ];
            
                    const finalDetails = {
                        ...details,
                        profileImageUrl, // Assuming this is defined elsewhere correctly
                        gallery: newGallery,
                    };
            
                    // Make sure this runs after newGallery is prepared
                    await updateDoc(userDocRef, finalDetails);
                    console.log(finalDetails)
                    setAppState((prev) => ({
                        ...prev,
                        isLoadingX: false,
                    }));
                    navigate("/account")

            
                }).catch(error => {
                    console.error("Error uploading gallery images: ", error);
                    // Consider handling the error state in your app state as well
                    setAppState((prev) => ({
                        ...prev,
                        isLoadingX: false,
                        error: "Failed to update gallery images.",
                    }));
                });
            
            } else {
                // Handle the case where there is no gallery, assuming updates still need to be made
                const finalDetails = {
                    ...details,
                    profileImageUrl, // Make sure this is correctly defined elsewhere
                    // Handle newGallery or other fields as needed
                };
            
                await updateDoc(userDocRef, finalDetails);
                setAppState((prev) => ({
                    ...prev,
                    isLoadingX: false,
                }));
            }
            

            // const finalDetails = {
            //     ...details,
            //     profileImageUrl,
            //     newGallery,
            // }
    
            // // Update Firestore document
            // await updateDoc(userDocRef, finalDetails);
            // setAppState((prev)=>{
            //     return ({
            //         ...prev,
            //         isLoadingX: false,
            //     })
            // })

            // navigate("/account")
            
            // console.log('Profile updated successfully!:', finalDetails);
        } catch (error) {
            setAppState((prev)=>{
                return ({
                    ...prev,
                    isLoadingX: false,
                })
            })
            setError(error)
            console.error('Error updating profile:', error);
        }
    
    }

    return (
    <>
        <div className='page user--page edit--page'>
            <div className='container'>
                <div className='head mid'>
                    <button onClick={()=>{
                        const confirm = window.confirm("Any unsaved changes will be discarded")
                        if(confirm){
                            navigate("/account", {replace: true})
                        }
                    }} className='back'>
                        <FaChevronLeft />
                    </button>
                    <p className='name'>
                        Back
                    </p>
                </div>
                <section style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <h3 style={{
                        paddingTop: "70px",
                        paddingBottom: "10px",
                        borderBottom: "2px solid #0001",
                        textAlign: "center"
                    }}>
                        Update Profile
                    </h3>
                </section>
                <section className='form--section'>
                    {user?.profileImageUrl ? <div className='profile-img'>
                        {user?.profileImageUrl && <div className={`img-holder ${file ? "disabled" : ""}`}>
                            <img src={user?.profileImageUrl} width={100} />
                            <label htmlFor='new-img'>
                                <FaPencilAlt />
                            </label>
                        </div>}
                        {file && <FaArrowRight />}
                        {file && <div className='img-holder'>
                            <img src={src} width={100} />
                            <button onClick={()=>{
                                setSrc(null)
                                setFile(null)
                            }}>
                                <FaTrashAlt />
                            </button>
                        </div>}
                    </div> : <div className='profile-img'>
                        <div className='img-holder'>
                            {!file ? <img src={"https://cdn-icons-png.flaticon.com/128/1144/1144760.png"} alt='' />
                            : <img src={src} alt='' />}
                            {!file ? <label htmlFor='new-img'>
                                <FaCamera />
                            </label> :
                            <button onClick={()=>{
                                setSrc(null)
                                setFile(null)
                            }}>
                                <FaTrashAlt />
                            </button>}
                            {!file && <p>
                                Add an Image
                            </p>}
                        </div>
                    </div>}
                    <div className='input-files'>
                        <input type="file" accept='image/*' id='new-img' onChange={handleImageChange} />
                        <input type="file" accept='image/*' id='new-photo' onChange={handleImageAdd} />
                    </div>
                    <form className='form' onSubmit={handleSubmit}>
                        <section>
                            <h3>
                                BASIC DETAILS
                            </h3>
                            <div className='inp-holder'>
                                <label>
                                    Display Name
                                </label>
                                <input placeholder='Janette' value={userInfo?.name} onChange={handleChange} name='name' />
                            </div>
                            <div className='inp-holder'>
                                <label>
                                    ABOUT ME
                                </label>
                                <input type='bio' placeholder='I hodl crypto' value={userInfo?.bio} onChange={handleChange} name='bio' />
                            </div>
                            <div className='inp-holder'>
                                <label>
                                    DISCORD ID
                                </label>
                                <input type='discord' placeholder={`${userInfo.name}`} value={userInfo?.discord} onChange={handleChange} name='discord' />
                            </div>
                            <div className='inp-holder'>
                                <label>
                                    <FaXTwitter />.com
                                </label>
                                <input type='twitter' placeholder={`https://x.com/${userInfo?.name}`} value={userInfo?.twitter} onChange={handleChange} name='twitter' />
                            </div>
                            <div className='inp-holder'>
                                <label>
                                    BIRTHDAY
                                </label>
                                <input type='date' placeholder='Date of Birth' value={userInfo?.birthday} onChange={handleChange} name='birthday' />
                            </div>
                            <div className='inp-holder'>
                                <label>
                                    IDENTIFY AS
                                </label>
                                <input type='text' placeholder='Superhero' value={userInfo?.gender} onChange={handleChange} name='gender' />
                            </div>
                            <div className='inp-holder'>
                                <label>LOCATION</label>
                                <input type='text' placeholder='The Moon' value={userInfo?.city} onChange={handleChange} name='city' />
                            </div>
                        </section>
                        <section>
                            <h3>
                                MY GALLERY <span style={{
                                    marginLeft: "20px",
                                    padding: "4px 10px",
                                    background: "#0001",
                                    borderRadius: "20px",
                                    border: "1px solid #0004",
                                    fontSize: "14px",
                                }}>{gallery?.length}/3</span>
                            </h3>
                            <div className='input-holder img-btn'>
                            </div>
                            {gallery?.length ? <div className='photos-holder'>
                                {
                                    gallery?.map((item, index)=>{
                                        const src = item.src
                                        return (
                                            <img onClick={()=>{
                                                const galleryNew = gallery?.filter((item, indexx)=>{
                                                    return index !== indexx
                                                })
                                                setGallery(galleryNew)
                                            }} className='photo' key={index} src={src} />
                                        )
                                    })
                                }
                            </div> : <p style={{
                                color: "#555"
                            }}>
                                Nothing here yet
                            </p>}
                            <div className='btn-holder' style={{
                                display: "flex",
                                gap: "10px",
                            }}>
                                {gallery?.length < 3 && <label htmlFor='new-photo' className='btn filled small' style={{
                                    maxWidth: "200px",
                                }}>
                                    Add a Photo
                                </label>}
                                {gallery?.length > 0 && <div className='btn outline small' style={{
                                    maxWidth: "200px",
                                }} onClick={()=>{
                                    setGallery([])
                                }}>
                                    Clear
                                </div>}
                            </div>
                        </section>
                        <section>
                            <h3 style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                width: "fit-content"
                            }} onClick={()=>{
                                setDropOptional(!dropOptional)
                            }}>OPTIONAL {dropOptional ? <FaChevronCircleUp color='#777' /> : <FaChevronCircleDown color='#777' />}</h3>
                            {dropOptional ? <>
                                <div className='inp-holder'>
                                    <label>BTC address</label>
                                    <input type='text' placeholder='btc only!' value={userInfo?.btcAddress} onChange={handleChange} name='btcAddress' />
                                </div>
                                <div className='inp-holder'>
                                    <label>USDT address</label>
                                    <input type='text' placeholder='usdt only!' value={userInfo?.btcAddress} onChange={handleChange} name='btcAddress' />
                                </div>
                            </> : <p style={{
                                color: "#777"
                            }}>
                                proceed with caution. lol
                            </p>}
                        </section>
                        {error && <p className='error' style={{
                            width:"fit-content"
                        }}>
                            <b>Error: </b>{error?.message}
                        </p>}
                        <section>
                            <div className='btn-holder'>
                                <button className='btn fancy filled'>
                                    Save Changes
                                </button>
                            </div>
                        </section>
                    </form>
                </section>
            </div>
        </div>
    </>
  )
}

export default UpdateProfiie