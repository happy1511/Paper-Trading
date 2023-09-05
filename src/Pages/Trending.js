import React, { useEffect, useState } from 'react'
import '../Css/Trending.css'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import AllIndicesCard from '../Components/AllIndicesCard'
import axios from 'axios'
import MostActiveTrendingPage from '../Components/MostActiveTrendingPage'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/core';
import { useNavigate } from 'react-router-dom'
import { Puff } from 'react-loader-spinner'

const Trending = () => {
  const [selectedindices, setselectedindices] = useState('nifty 50')
  const [Allindices, setAllindices] = useState([])
  const [selectedIndicesTopGL, setselectedIndicesTopGL] = useState('nifty 50')
  const [byVolume, setbyVolume] = useState([])
  const [byValue, setbyValue] = useState([])
  const [gainers, setgainers] = useState([])
  const [Loosers, setLoosers] = useState([])
  const [focus, setfocus] = useState(false)
  const [allsym, setallsym] = useState([])
  const [filtered, setfiltered] = useState([])
  const [searching,setsearching] = useState('')
  const splideOptions = {
    // Or 'loop' depending on your use case
    arrows: false,
    pagination: false,
    type: '',
    wheel: true,
    perPage: calculateCardsPerPage()

  };
  function calculateCardsPerPage(screenWidth = window.innerWidth) {
    const cardWidth = 250; // Set your card width in pixels
    const gap = 0; // Set any gap/margin between cards

    // Calculate the number of cards that can fit on the screen
    return Math.floor(screenWidth / (cardWidth + gap));
  }
  const fetchindices = () => {
    const url = `${process.env.REACT_APP_SERVER_URL}/Allindices`
    axios.get(url).then((res) => {
      setAllindices(res.data.data)
      setselectedindices(res.data.data[0].indexSymbol)
    }).catch((err) => {
      console.error(err)
    })
  }
  const fetchselected = () => {
    const url = ` ${process.env.REACT_APP_SERVER_URL}/mostactive/${selectedindices.toLowerCase()}`
    axios.get(url).then((res) => {
      setbyVolume(res.data.byVolume)
      setbyValue(res.data.byValue)
    }).catch((err) => {
      console.error(err)
    })
  }

  const fetchGL = () => {
    const surl = `${process.env.REACT_APP_SERVER_URL}/gainersandLoosers/${selectedIndicesTopGL.toLowerCase()}`
    axios.get(surl).then((res) => {
      setgainers(res.data.gainers)
      setLoosers(res.data.losers)
    }).catch((err) => {
      console.error(err)
    })
  }
  const handleindiceschange = (e) => {
    setselectedindices(e.target.value)
  }
  const handleindiceschangeTopGL = (e) => {
    setselectedIndicesTopGL(e.target.value)
  }
  useEffect(() => {
    fetchindices();
    fetchselected();
    fetchGL();

    setInterval(() => {
      fetchselected();
      fetchGL();
    }, 5000)
  }, [])

  useEffect(() => {
    setallsym(localStorage.getItem('AllSymbols').split(','))
  })

  useEffect(() => {
    fetchselected();
  }, [selectedindices])

  useEffect(() => {
    fetchGL();
  }, [selectedIndicesTopGL])
  useEffect(() => {
    fetchindices();
  }, [])

  const handleSearchbar = (e) => {
    setsearching(e.target.value)
    setfocus(true)
    window.addEventListener('click', handleClick)
    if (e.target.value !== '') {
      setfiltered(allsym.filter(option => option.toLowerCase().includes(e.target.value.toLowerCase())))
    }
    else {
      setfiltered([])
    }
  }

  const handleClick = (e) => {
    if (e.srcElement.id !== "searchingitem") {
      setfocus(false)
      setfiltered([])
      window.removeEventListener('click', handleClick)
      setsearching('')
    }
  }

  return (
    (Allindices.length !==0 && gainers.length !==0 && Loosers.length !==0 && allsym.length !==0 && byValue.length !== 0 && byVolume.length !==0)?
    <>
      <Header />
      <div className="OuterTrendingPage">
        <div className={`SearchIconTrendingPage ${focus ? 'focusedborderradius' : ''}`}>
          <svg viewBox="0 0 30 25" height='30px' width='30px' fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
          <input type="text" value={searching} onChange={handleSearchbar} id='searchingitem' onFocus={handleSearchbar} className='SearchbarInputTag' />
          <div className='hiddenfilterbar' style={focus?{display:'block'}:{display:'none'}}>
            <ul>
              {
                filtered.map((data) => {
                  return <a href={`/Chart/${data}`}><li id='searchingitem' >{data}</li></a>
                })
              }
            </ul>
          </div>
        </div>
        <h2 className='TrendingPageHeaders'>All Indices</h2>
        <div className="AllIndicesDiv">
          <Splide options={splideOptions}>

            {Allindices.map((data, index) => (
              <SplideSlide key={index}>
                {/* Log a message to check if the slide is being rendered */}
                <AllIndicesCard data={data} />
              </SplideSlide>
            ))}

          </Splide>
        </div>
        <h2 className='TrendingPageHeaders'>Most Active Stocks</h2>
        <select name="" id="" className='optionIndices' onChange={handleindiceschange}>
          {Allindices.map((data) => {
            return (
              <option value={data.indexSymbol}>{data.indexSymbol}</option>
            )
          })}
        </select>
        <h3 className='TrendingPageHeaders'>By Volume</h3>
        <div className="MostActiveDiv">
          <Splide options={splideOptions}>

            {

              (byVolume).map((data, index) => {
                return (
                  <>
                    <SplideSlide key={index}>
                      <MostActiveTrendingPage key={index} data={data} />
                    </SplideSlide >
                  </>
                )
              })

            }
          </Splide>
        </div>
        <h3 className='TrendingPageHeaders'>By Value</h3>
        <div className="MostActiveDiv">
          <Splide options={splideOptions}>

            {
              (byValue).map((data, index) => {
                return (
                  <>
                    <SplideSlide key={index}>
                      <MostActiveTrendingPage key={index} data={data} />
                    </SplideSlide>
                  </>
                )
              })
            }
          </Splide>
        </div>
        <h2 className='TrendingPageHeaders'>Top Gainers & Loosers</h2>

        <select name="" id="" className='optionIndices' onChange={handleindiceschangeTopGL}>
          {Allindices.map((data) => {
            return (
              <option value={data.indexSymbol}>{data.indexSymbol}</option>
            )
          })}
        </select>
        <h3 className='TrendingPageHeaders'>Top Gainers</h3>
        <div className="MostActiveDiv">
          <Splide options={splideOptions}>

            {
              (gainers).map((data, index) => {
                return (
                  <>
                    <SplideSlide key={index}>
                      <MostActiveTrendingPage key={index} data={data} />
                    </SplideSlide>
                  </>
                )
              })
            }
          </Splide>
        </div>
        <h3 className='TrendingPageHeaders'>Top Loosers</h3>
        <div className="MostActiveDiv">
          <Splide options={splideOptions}>

            {
              (Loosers).map((data, index) => {
                return (
                  <>
                    <SplideSlide key={index}>
                      <MostActiveTrendingPage key={index} data={data} />
                    </SplideSlide>
                  </>
                )
              })
            }
          </Splide>
        </div>

      </div >
      <Footer />
    </>: <>
        <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center' }}>
          <Puff
            height="50px"
            width="50px"
            radius={1}
            color="blue"
            ariaLabel="puff-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      </>
  )
}

export default Trending
