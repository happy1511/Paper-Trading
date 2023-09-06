import React from 'react'
// import { useActivePill } from '../JS/HomeHook'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import '../Css/About.css'
const About = () => {
  // const [activePill, setActivePill] = useActivePill('About')
  return (
    <>

      <Header />
      <div className='outerabout'>
        <h1>Welcome to LearnToEarn</h1>


        <p>
          Are you ready to embark on a journey through the dynamic world of finance? LearnToEarn is your gateway to the exciting realm of stock markets and trading. Whether you're a seasoned investor or just starting, our platform offers a range of features to empower your financial journey.
        </p>
        <h2>Paper Trading
        </h2>
        <p>Learn, Practice, and Perfect Your Trading Skills
        </p><p>
          LearnToEarn offers a robust paper trading platform where you can simulate real stock market scenarios without risking your hard-earned money. Test your strategies, analyze your performance, and build confidence before diving into live trading.
        </p>
        <h2>Trending Markets</h2>

        <p>Stay Ahead of the Curve
        </p><p>
          Explore the hottest trends in the financial markets. Our platform provides real-time data on trending stocks, cryptocurrencies, commodities, and more. Access valuable insights to make informed trading decisions.
        </p>
        <h2>Live Stock Prices
        </h2>
        <p>Up-to-the-Minute Market Data
        </p>
        <p>
          Stay informed with live stock prices from major exchanges worldwide. Our intuitive charts and graphs make it easy to track your favorite assets and monitor their performance in real time.
        </p>
        <h2>News and Insights
        </h2>
        <p>Stay Informed, Make Informed Decisions
        </p>
        <p>
          Access the latest financial news, expert analysis, and market insights to stay ahead of market developments. Our team of experts curates the most relevant news articles to keep you informed about the factors impacting your investments.
        </p>
        <h2>Educational Resources
        </h2>
        <p>Knowledge is Power*
        </p>
        <p>
          Explore our library of educational resources, including articles, tutorials, and videos. Whether you're a beginner or an experienced trader, we have resources to help you expand your knowledge.
        </p>
        <p>©2023 LearnToEarn. All Copyright Reserved.</p>
      </div>
      <Footer />
    </>
  )
}

export default About
