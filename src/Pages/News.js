import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import '../Css/NewsPage.css'
import NewsCardNewsPage from '../Components/NewsCardNewsPage'
import Footer from '../Components/Footer'
// import { useActivePill } from '../Components/HomeHook'
const News = () => {
  // const [activePill, setActivePill] = useActivePill('News')
  const [DataNews, setDataNews] = useState([])

  useEffect(() => {
    async function fetchNews() {
      const url = `${process.env.REACT_APP_SERVER_URL}/news`;

      try {
        const response = await fetch("https://newlearnearn.vercel.app/news");
        const result = await response.json();
        // const newsStream = (JSON.parse(result)).data.main.stream;
        setDataNews(result.articles)
      }
      catch (error) {
        console.log(error);
      }
    }
    fetchNews();
  },[])
  return (
    <>
      <Header />
      <div className='NewsPageOuterDiv'>
        {
          DataNews?DataNews.map((data, index) => {
            return (
              <NewsCardNewsPage key={index} data={data}/>
            )
          }): <>
            <div style={{height:'100%',width:'100%',display:'flex',alignItems:'center',color:'white',justifyContent:'center',flexWrap:'wrap'}}>
              <h1>Something Went wrong</h1>
            </div>
          </>
        }
      </div>
      <Footer />
    </>
  )
}

export default News
