import React, { useEffect, useState } from 'react';
import '../Css/TrendingStock.css';
import axios from 'axios';

const TrendingMarkets = () => {
    const [Gainers, setGainers] = useState({});
    const [Loosers, setLoosers] = useState({});
    const [allSymbols, setallsymbols] = useState([])


    useEffect(() => {
        const TrendingM = async () => {

            // await axios.get(`${process.env.REACT_APP_SERVER_URL}/getAllSymbols`).then((res) => {
            //     setallsymbols(res.data)
            //     console.log(allSymbols)
            // }).then(async () => {
            //     for (var i = 0; i < allSymbols.length; i++) {
            //         await axios.get(`${process.env.REACT_APP_SERVER_URL}/equity/${allSymbols[i]}`).then((res) => {
            //             if (res.data.priceInfo.pChange >= 0) {
            //                 Gainers.push(res.data)
            //                 setGainers(new Set(Gainers.sort((a, b) => b.priceInfo.pChange - a.priceInfo.pChange)));
            //             }
            //             else {
            //                 Loosers.push(res.data)
            //                 setLoosers(new Set(Loosers.sort((a, b) => a.priceInfo.pChange - b.priceInfo.pChange)));
            //             }
            //         })
            //     }

            // }).catch((Err) => { console.log(Err) })

            // const url = 'http://localhost:3000/api/gainersAndLosers/nifty50'; // Use a relative URL
            // try {
            //     const response = await axios.get(url);
            //     const data = response.data; // Assuming the API returns an object with gainers and losers arrays
            //     console.log(response)
            //     setGainers(data.Gainers);
            //     setLoosers(data.Loosers);
            // } catch (error) {
            //     console.error('Error fetching data:', error);
            // }

            try {
                const allsymboldata = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getAllSymbols`)
                const allsymboldata1 = allsymboldata.data
                setallsymbols(allsymboldata1)
                console.log(allsymboldata1)
                var newgainers = {}
                var newLoosers = {}
                for (var i = 0; i < allSymbols.length; i++) {
                    try {
                        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/equity/${allSymbols[i]}`)
                        const resdata = response.data
                        if (resdata.priceInfo.pChange >= 0) {
                            newgainers[allSymbols[i]] = resdata
                        }
                        else {
                            newLoosers[allSymbols[i]] = resdata
                        }
                    } catch (error) { console.log(error) }
                    console.log(newLoosers)
                    console.log(newgainers)
                }
                setGainers(newgainers)
                setLoosers(newLoosers)
            } catch (error) { console.log(error) }

        };
        TrendingM(); // Fetch data immediately when component mounts
        const interval = setInterval(() => {
            TrendingM()
        }, 5000);
        // const interval = setInterval(() => {
        //     TrendingM(); // Fetch data every 3 seconds
        // }, 3000);
        return () => {
            clearInterval(interval); // Clean up interval on component unmount
        };
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
                        Object.keys(Gainers).length >= 10 ?

                            (Object.keys(Gainers).slice(0, 10)).map((data) => (

                                <li key={Gainers[data].symbol}> {/* Added a key prop to the list items */}
                                    <div className="logoS">
                                        <img src={`https://unpkg.com/@extra-isin/logos@1.0.0/data/${Gainers[data]?.info?.isin}.png`} alt='' onError={(e) => {
                                            e.target.style.display = 'none'; // Hide the image on error
                                        }} />
                                    </div>
                                    <div className="NameS">{Gainers[data].info.symbol}</div>
                                    <div className="PriceS">
                                        <div className="equitychange"> </div>
                                        <div className="CurrentPrice">{Gainers[data].priceInfo.lastPrice}</div>
                                        <div className="GainPrice">+{Number(Gainers[data].priceInfo.pChange).toFixed(2)}%</div>
                                    </div>
                                </li>

                            ))
                            : ''

                    }
                </ul>
            </div>
            <div className="Loosers">
                <ul className="Gul">
                    <li>
                        <h4>Nifty 50 Losers</h4>
                    </li>
                    {Object.keys(Gainers).length >= 10 ?
                        (Object.keys(Loosers).slice(0, 10)).map((data) => (
                            <li key={Loosers[data].symbol}> {/* Added a key prop to the list items */}
                                <div className="logoS">
                                    <img src={`https://unpkg.com/@extra-isin/logos@1.0.0/data/${Loosers[data]?.info?.isin}.png`} alt='' onError={(e) => {
                                        e.target.style.display = 'none';
                                    }} />
                                </div>
                                <div className="NameS">{Loosers[data].info.symbol}</div>
                                <div className="PriceS"><div className="equitychange"></div>
                                    <div className="CurrentPrice">{Loosers[data].priceInfo.lastPrice}</div>
                                    <div className="Looseprice">{Number(Loosers[data].priceInfo.pChange).toFixed(2)}%</div></div>
                            </li>
                        )) : ''
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
