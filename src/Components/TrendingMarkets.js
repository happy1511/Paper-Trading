import React, { useEffect, useState } from 'react';
import '../Css/TrendingStock.css';
import axios from 'axios';

const TrendingMarkets = () => {
    const [Gainers, setGainers] = useState([]);
    const [Loosers, setLoosers] = useState([]);
    // const [allSymbols, setallsymbols] = useState([])
    const TrendingM = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/gainersandLoosers/Nifty 50`)
            setGainers(response.data.gainers)
            setLoosers(response.data.losers)
        } catch (error) { console.log(error) }
    }

    useEffect(() => {
      
        TrendingM();

        const interval = setInterval(() => {
            TrendingM();
        }, 5000);
        return (
            clearInterval(interval)
        )
    }, []);
    return (
        <>
            <div className='Gainers'>
                <ul className="Gul">
                    <li>
                        <h4>
                            Nifty 50 Gainers
                        </h4>
                    </li>
                    {
                        Gainers.length!==0?
                        (Gainers.slice(0, 10)).map((data) => (
                            <li key={data.symbol}> {/* Added a key prop to the list items */}
                                <div className="logoS">
                                    <img src={`https://unpkg.com/@extra-isin/logos@1.0.0/data/${data?.meta?.isin}.png`} alt='' onError={(e) => {
                                        e.target.style.display = 'none'; // Hide the image on error
                                    }} />
                                </div>
                                <div className="NameS">{data.symbol}</div>
                                <div className="PriceS">
                                    <div className="equitychange"> </div>
                                    <div className="CurrentPrice">{data.lastPrice}</div>
                                    <div className="GainPrice">+{data.pChange}%</div>
                                </div>
                            </li>

                        )): <> 
                             <li style={{display:'block'}}><h1 style={{textAlign:'center'}}>No Gainers</h1></li>
                        </>
                    }
                </ul>
            </div>
            <div className="Loosers">
                <ul className="Gul">
                    <li>
                        <h4>Nifty 50 Losers</h4>
                    </li>
                    {   Loosers.length !== 0?
                       (Loosers.slice(0, 10)).map((data) => (
                        <li key={data.symbol}> {/* Added a key prop to the list items */}
                            <div className="logoS">
                                <img src={`https://unpkg.com/@extra-isin/logos@1.0.0/data/${data?.meta?.isin}.png`} alt='' onError={(e) => {
                                    e.target.style.display = 'none'; // Hide the image on error
                                }} />
                            </div>
                            <div className="NameS">{data.symbol}</div>
                            <div className="PriceS">
                                <div className="equitychange"> </div>
                                <div className="CurrentPrice">{data.lastPrice}</div>
                                <div className="Looseprice">{data.pChange}%</div>
                            </div>
                        </li>

                    )):<> 
                    <li style={{display:'block'}}><h1 style={{textAlign:'center'}}>No Loosers</h1></li>
               </>
                    }
                </ul>
            </div>
            <a href="/TrendingMarkets" className='ButtonTrendingMarketLink'>
                <div className="ButtonTrendingMarket">
                    Trending Markets
                </div>
            </a>
        </>
    );
};

export default TrendingMarkets;
