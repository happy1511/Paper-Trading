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
        const response = await fetch(url);
        const result = await response.json();
        // const newsStream = (JSON.parse(result)).data.main.stream;
        setDataNews(result.articles)
      }
      catch (error) {
        console.error(error);
      }
    }
    fetchNews();
  },[])
  return (
    <>
      <Header />
      <div className='NewsPageOuterDiv'>
        {
          DataNews.map((data, index) => {
            return (
              <NewsCardNewsPage key={index} data={data}/>
            )
          })
        }
      </div>
      <Footer />
    </>
  )
}

export default News
