import React, { useState } from 'react'
import Header from '../Components/Header'
import '../Css/Profile.css'
import { auth, db } from '../utilities/Firebase'
import p1 from '../Img_videos/profile1.png'
import p2 from '../Img_videos/profile2.png'
import p3 from '../Img_videos/profile3.png'
import p4 from '../Img_videos/profile4.png'
import p5 from '../Img_videos/profile5.png'
import p6 from '../Img_videos/profile6.png'
import p7 from '../Img_videos/profile7.png'
import p8 from '../Img_videos/profile8.png'
import { signOut, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { ref, update } from 'firebase/database'
import Login from './Login'
const Profile = () => {
    const navigate = useNavigate()
    const [PictureMenu, setPictureMenu] = useState(false)
    const [HistoryMenu, setHistoryMenu] = useState(true)
    const [SettigMenu, setSettingMenu] = useState(false)
    const [ProfilePhotoUrl, setProfilePhotoUrl] = useState(auth.currentUser?.photoURL)
    const [close, setclose] = useState('visible')
    const [mobilesee, setmobilesee] = useState(false)
    const handleChangePictureEvent = (e) => {
        updateProfile(auth.currentUser, {
            photoURL: e.target.src
        })
        setProfilePhotoUrl(e.target.src)
        console.log(auth.currentUser)
    }

    const handleRightMenu = (e) => {
        if (window.innerWidth < 768) {
            setmobilesee(true)
        }
        console.log(mobilesee)
        if (e === 1) {
            console.log(PictureMenu)
            if (PictureMenu !== true) {
                setPictureMenu(!PictureMenu)
                setHistoryMenu(false)
                setSettingMenu(false)
            }
        }
        else if (e === 2) {
            console.log(PictureMenu)
            if (HistoryMenu !== true) {
                setHistoryMenu(!HistoryMenu)
                setPictureMenu(false)
                setSettingMenu(false)
            }
        }
        else {
            console.log(PictureMenu)
            if (SettigMenu !== true) {
                setSettingMenu(!SettigMenu)
                setPictureMenu(false)
                setHistoryMenu(false)
            }
        }
    }

    const handleLogout = () => {
        signOut(auth).then(() => {
            console.log('signed out successfully')
            navigate("/")
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleclick = (e) => {
        e.preventDefault();
        const updateobj = {}
        updateobj['users/' + auth.currentUser.uid + '/portfolio/availableMoney'] = 1000000;
        updateobj['users/' + auth.currentUser.uid + '/portfolio/profitorlose'] = 0;
        updateobj['users/' + auth.currentUser.uid + '/portfolio/pastTradedAmount'] = 0;
        updateobj['users/' + auth.currentUser.uid + '/portfolio/InvestedAmount'] = 0;
        updateobj['users/' + auth.currentUser.uid + '/portfolio/positionsPL'] = 0;
        updateobj['users/' + auth.currentUser.uid + '/Orders'] = null
        update(ref(db), updateobj).then(() => { console.log(updateobj) }).catch(err => { console.log(err) })
        setclose('flex'); // Display the alert
        setTimeout(() => {
            setclose('none'); // Hide the alert after 2000ms (2 seconds)
        }, 2000);
    }

    const handleclose = () => {
        setclose('none')
    }

    return (

        auth.currentUser ? <>
            <Header />
            <div className="ProfileDivPage" >

                <div className="OuterProfileDiv">
                    <div className={`ProfileLeftMenu ${mobilesee ? 'mobilesee' : ''}`}>
                        <div className="ProfilePhotoProfilePage">
                            <img src={ProfilePhotoUrl} alt="" />
                        </div>

                        <div className="ProfileDetailProfilePage">
                            <p className='ProfileDetailProfilePageP'><pre>hello!   <u style={{ color: "white" }}>{auth.currentUser.displayName}</u></pre></p>
                        </div>
                        <button className='ChangeProfilePictureButton' onClick={() => { handleRightMenu(1) }}>
                            Change Profile Picture
                        </button>
                        <button className='ChangeProfilePictureButton' onClick={() => { handleRightMenu(2) }}>
                            Show History
                        </button>
                        <button className='ChangeProfilePictureButton' onClick={() => { handleRightMenu(3) }}>
                            Settings
                        </button>
                        <button className='ChangeProfilePictureButton' onClick={handleLogout}>
                            Logout
                        </button>

                    </div>
                    <div className={`ProfileRightMenu ${mobilesee ? 'profilesee' : ''}`}>
                        {
                            PictureMenu ? <>
                                <p> <button style={mobilesee ? { display: 'inline' } : { display: 'none' }} className='buttonproileback' onClick={() => setmobilesee(false)}>
                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.9991 19L9.83911 14C9.56672 13.7429 9.34974 13.433 9.20142 13.0891C9.0531 12.7452 8.97656 12.3745 8.97656 12C8.97656 11.6255 9.0531 11.2548 9.20142 10.9109C9.34974 10.567 9.56672 10.2571 9.83911 10L14.9991 5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                </button>Select Profile Picture</p>
                                <div className="ProfilePictureMenuRight">
                                    <div onClick={handleChangePictureEvent}>
                                        <img src={p1} alt="" />
                                    </div>
                                    <div onClick={handleChangePictureEvent}>
                                        <img src={p2} alt="" />
                                    </div>
                                    <div onClick={handleChangePictureEvent}>
                                        <img src={p3} alt="" />
                                    </div>
                                    <div onClick={handleChangePictureEvent}>
                                        <img src={p4} alt="" />
                                    </div>
                                    <div onClick={handleChangePictureEvent}>
                                        <img src={p5} alt="" />
                                    </div>
                                    <div onClick={handleChangePictureEvent}>
                                        <img src={p6} alt="" />
                                    </div>
                                    <div onClick={handleChangePictureEvent}>
                                        <img src={p7} alt="" />
                                    </div>
                                    <div onClick={handleChangePictureEvent}>
                                        <img src={p8} alt="" />
                                    </div>
                                </div>
                            </> : ""
                        }
                        {
                            HistoryMenu ? <>
                                <p><button style={mobilesee ? { display: 'inline' } : { display: 'none' }} className='buttonproileback' onClick={() => setmobilesee(false)}>
                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.9991 19L9.83911 14C9.56672 13.7429 9.34974 13.433 9.20142 13.0891C9.0531 12.7452 8.97656 12.3745 8.97656 12C8.97656 11.6255 9.0531 11.2548 9.20142 10.9109C9.34974 10.567 9.56672 10.2571 9.83911 10L14.9991 5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                </button>List of Previous Orders</p>
                                <div className="HistoryMenuRight">
                                    {/* <ListOfOrdersHistory />
                                    <ListOfOrdersHistory/>
                                    <ListOfOrdersHistory />
                                    <ListOfOrdersHistory/>
                                    <ListOfOrdersHistory />
                                    <ListOfOrdersHistory/>
                                    <ListOfOrdersHistory />
                                    <ListOfOrdersHistory/>
                                    <ListOfOrdersHistory />
                                    <ListOfOrdersHistory/> */}
                                </div>
                            </> : ""
                        }
                        {
                            SettigMenu ? <>
                                <p><button style={mobilesee ? { display: 'inline' } : { display: 'none' }} className='buttonproileback' onClick={() => setmobilesee(false)}>
                                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.9991 19L9.83911 14C9.56672 13.7429 9.34974 13.433 9.20142 13.0891C9.0531 12.7452 8.97656 12.3745 8.97656 12C8.97656 11.6255 9.0531 11.2548 9.20142 10.9109C9.34974 10.567 9.56672 10.2571 9.83911 10L14.9991 5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                </button>Settings</p>
                                <div className="settingsDiv">
                                    <div className="SettingsCard">
                                        <h3>Reset Your Account Data</h3>
                                        <button onClick={handleclick}>Reset</button>
                                        <div className="alert" style={{ display: close }}>
                                            Account Successfully Resetted.
                                            <button onClick={handleclose}>&times;</button>
                                        </div>
                                    </div>
                                </div>
                            </> : ""
                        }
                    </div>
                </div>
            </div>
        </> : <Login />

    )
}

export default Profile
