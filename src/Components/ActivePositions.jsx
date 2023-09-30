import React, { useEffect, useState } from 'react'
import '../Css/AcivePositions.css'
import ListOfOrdersHistory from './ListOfOrdersHistory';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/core';
import '../Css/AddStock.css'
import axios from 'axios';
import { onValue, push, ref, set, update } from 'firebase/database';
import { auth, db } from '../utilities/Firebase';
import { Puff } from 'react-loader-spinner';
const ActivePositions = () => {
    const [SymbolInput, setSymbolInput] = useState('')
    const [Price, setPrice] = useState(0)
    const [TotalBill, setTotalBill] = useState(0)
    const [Quantity, setQuantity] = useState('')
    const [MoneyObj, setMoneyObj] = useState(0)
    const [ErrorMsg, setErrorMsg] = useState('')
    const [ordertype, setordertype] = useState('')
    const [Orders, setorders] = useState()
    const [founded, setfounded] = useState([])
    const splideOptions = {
        arrows: false,
        pagination: false,
        type: '',
        gap: 10,
        perMove: 1,
        direction: 'ttb',
        height: '100%',
        wheel: true,
    };
    const handleAddstock = () => {
        setPrice(0)
        setTotalBill(0)
        setQuantity('')
        setSymbolInput()
        setErrorMsg('')
        setAddStock(!AddStock)
    }

    const [AddStock, setAddStock] = useState(0)

    const filterinput = () => {
        const allSymbols = localStorage.getItem('AllSymbols').split(',');
        if (allSymbols && SymbolInput) {
            const filteredSymbols = allSymbols.filter(
                options => options.toLowerCase().includes(SymbolInput.toLowerCase())
            );
            setfounded(filteredSymbols)
        }
    }


    const fetchpriceselected = (Selecteditem) => {
        const url = `${process.env.REACT_APP_SERVER_URL}/equity/${Selecteditem}`
        axios.get(url).then((res) => {
            console.log(res)
            setPrice(res.data.priceInfo.lastPrice)
        }).catch((err) => console.log(err))
    }

    const handleSymbolSelection = (Selecteditem) => {
        console.log(Selecteditem)
        setSymbolInput(Selecteditem);
        setfounded([])
        fetchpriceselected(Selecteditem);
    }

    const handleQuantityChange = (e) => {
        if (/^\d*$/.test(e.target.value) && e.target.value !== '0') {
            if (e.target.value >= 0) {
                if (Number(MoneyObj.availableMoney) >= (Price * e.target.value).toFixed(2)) {
                    setQuantity(e.target.value)
                    setErrorMsg('')
                    setTotalBill((Price * e.target.value).toFixed(2))
                }
                else {
                    setErrorMsg('Available Money is Insufficient for your order.')
                }
            }
            else {
                setQuantity(0)
                setTotalBill((Price * e.target.value).toFixed(2))
            }
        }

    }
    const fetchFirebaseDatamoney = () => {
        return new Promise((resolve, reject) => {
            onValue(ref(db, 'users/' + auth.currentUser.uid + '/portfolio'), (res) => {
                if (res.exists()) {
                    resolve(res.val());
                } else {
                    reject(new Error('Portfolio data not found'));
                }
            }, (error) => {
                reject(error);
            });
        });
    };

    const fetchingmoneyobj = async () => {
        const moneyobjvalue = await fetchFirebaseDatamoney();
        setMoneyObj(moneyobjvalue)
        console.log(moneyobjvalue)
    }


    useEffect(() => {
        fetchingmoneyobj();
        const Interval = setInterval(() => {
            fetchingmoneyobj();
        }, 1000);
       return (
        clearInterval(Interval)
       )
    }, [])

    const handleSubmit = async (e) => {

        if (ordertype !== '') {
            e.preventDefault();
            const orderobject = {
                Symbol: String(SymbolInput),
                Quantity: String(Quantity),
                TotalBill: String(TotalBill),
                ProfitLose: '0',
                StartingPrice: String(Price),
                EndingPrice: null,
                openOrClose: 'open',
                ordertype: String(ordertype),
                timestamp: Date.now().toString()
            }
            console.log(orderobject)
            set(push(ref(db, 'users/' + auth.currentUser.uid + '/Orders')), orderobject)
            const updateobj = {};
            const uam = String((Number(MoneyObj.availableMoney) - Number(TotalBill)).toFixed(2));
            const uia = String((Number(MoneyObj.InvestedAmount) + Number(TotalBill)).toFixed(2));
            const upta = String((Number(MoneyObj.pastTradedAmount) + Number(TotalBill)).toFixed(2));
            updateobj['users/' + auth.currentUser.uid + '/portfolio/pastTradedAmount'] = upta;
            updateobj['users/' + auth.currentUser.uid + '/portfolio/InvestedAmount'] = uia;
            updateobj['users/' + auth.currentUser.uid + '/portfolio/availableMoney'] = uam;
            await update(ref(db), updateobj).then((res) => { console.log('updated') }).catch((err) => { console.log(err) })
            setAddStock(0)
            fetchorders();
            setSymbolInput('')
            setPrice(0)
        }
        else {
            e.preventDefault();
            setErrorMsg('select order type.')
        }
    }

    const fetchorders = () => {
        onValue(ref(db, 'users/' + auth.currentUser.uid + '/Orders'), (res) => {
            setorders(res.val())
        })
    }

    useEffect(() => {
        console.log(SymbolInput)
    }, [SymbolInput])

    const handleordertype = (e) => {
        e.preventDefault();
        setordertype(e.target.value)
    }

    const handleSymolInput = (e) => {
        e.preventDefault();
        setSymbolInput(e.target.value)
        filterinput();
        if (!e.target.value) {
            setPrice(0)
        }
        window.addEventListener('click', handlelicksymbol)
        console.log(SymbolInput)
    }

    const handlelicksymbol = (e) => {
        if (e.srcElement.id !== "searchitem") {
            setfounded([])
            window.removeEventListener('click', handlelicksymbol)
            setSymbolInput('')
        }
        else {
            window.removeEventListener('click', handlelicksymbol)
        }
    }

    useEffect(() => {
        setTotalBill((Price * Quantity).toFixed(2))
    }, [Price])

    useEffect(() => {
        fetchorders();
    }, [])
    const fetchFirebaseDataorders = () => {
        return new Promise((resolve, reject) => {
            onValue(ref(db, 'users/' + auth.currentUser.uid + '/Orders'), (res) => {

                resolve(res.val());
            }, (error) => {
                reject(error);
            });
        });
    };

    const updatePositionPL = async () => {
        const od = await fetchFirebaseDataorders()
        if (od) {
            var totalPL = 0
            Object.keys(od).map((res) => {
                const orderd = od[res]
                if (orderd.openOrClose === "open") {
                    totalPL = totalPL + orderd.ProfitLose
                }
            })

            const updateobj2 = {}
            const upositionpl = String(Number((totalPL)).toFixed(2))
            updateobj2['users/' + auth.currentUser.uid + '/portfolio/positionsPL'] = upositionpl
           await update(ref(db), updateobj2).catch(err => { })
        }
    }
    useEffect(() => {
        updatePositionPL();
        const Interval = setInterval(() => {
            updatePositionPL();
        }, 3000);
        return (
            clearInterval(Interval)
        )
    })
    const handleAddstockNew = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}`)
            if (response.data.marketState[0].marketStatus === "Open") {
                setPrice(0)
                setTotalBill(0)
                setQuantity('')
                setSymbolInput()
                setErrorMsg('')
                setAddStock(!AddStock)
            }
            else {
                alert('Market Closed')
            }
        } catch (err) {
            console.log(err)
            alert('something Went Wrong')
        }
    }

    return (
        MoneyObj !== 0 ?
            <div className='ActivePositionsJSXOuter'>
                {
                    AddStock ? <>
                        <div className="AddStockOuter">
                            <div className="AddStockHeader">
                                <div className="BackIconAddStock" onClick={handleAddstock}><svg fill="white" width="20px" height="20px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M222.927 580.115l301.354 328.512c24.354 28.708 20.825 71.724-7.883 96.078s-71.724 20.825-96.078-7.883L19.576 559.963a67.846 67.846 0 01-13.784-20.022 68.03 68.03 0 01-5.977-29.488l.001-.063a68.343 68.343 0 017.265-29.134 68.28 68.28 0 011.384-2.6 67.59 67.59 0 0110.102-13.687L429.966 21.113c25.592-27.611 68.721-29.247 96.331-3.656s29.247 68.721 3.656 96.331L224.088 443.784h730.46c37.647 0 68.166 30.519 68.166 68.166s-30.519 68.166-68.166 68.166H222.927z"></path></g></svg></div>
                                <h1>Create</h1>
                            </div>
                            <div className="AddStockBody">
                                <div className="SearchAddstock">
                                    <input type="text" value={SymbolInput} onChange={handleSymolInput} id='searchitem' placeholder='Search & Select Stock By StockSymbol' />
                                    <div className="SearchedFilter">
                                        {
                                            founded.length > 2 ? founded.map((data, index) => {
                                                return (
                                                    <div className="FoundedPill" key={index} onClick={() => handleSymbolSelection(data)} id='searchitem'>
                                                        {data}
                                                    </div>
                                                )
                                            }) : ''
                                        }
                                    </div>
                                </div>

                                <form action="">
                                    <div className="BuySellButtonDiv">
                                        <div className="two">
                                            <div className="PositionsInvested1">
                                                <h3 className='PositionsPLH3'>₹{MoneyObj.availableMoney}</h3>
                                                <p className='PositionsPLHP'>Available Cash</p>
                                            </div>

                                            <div style={{ marginLeft: '20px' }} className="PositionsInvested1">
                                                <h3 className='PositionsPLH3'>₹{Price}</h3>
                                                <p className='PositionsPLHP'>Stock Price</p>
                                            </div>

                                            <div style={{ marginLeft: '20px' }} className="PositionsInvested1">
                                                <h3 className='PositionsPLH3'>₹{TotalBill}</h3>
                                                <p className='PositionsPLHP'>Total Bill</p>
                                            </div>
                                        </div>
                                        <div className="one">
                                            <button className={`BuyButton ${ordertype === 'buy' ? 'activeordertypebuy' : ''}`} value={'buy'} onClick={handleordertype}>Buy</button>
                                            <button className={`SellButton  ${ordertype === 'sell' ? 'activeordertypesell' : ''}`} value={'sell'} onClick={handleordertype}>Sell</button>
                                        </div>

                                    </div>
                                    <div className="InputQuantity">
                                        Quantity<br />
                                        <input type="text" name="" id="" placeholder='Enter Quantity' value={Quantity} disabled={Price === 0} onChange={handleQuantityChange} />
                                    </div>
                                    <div className="ErrorDiv" style={{ color: 'red' }}>
                                        {ErrorMsg}
                                    </div>
                                    <div className="SubmitButtonAddStock">
                                        <button type='submit' disabled={Quantity === ''} onClick={handleSubmit}>Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </> : <>

                        <div className="ActivePositionsJSXHeader">
                            <h2>Positions</h2>
                            <button className='ActivePositionsJSXHeaderButton' onClick={handleAddstockNew}>+ New Trade</button>
                        </div>
                        <div className="ActivePositionsJSXMoneyBanner">
                            <div className="PositionsPL">
                                <h3 className='PositionsPLH3'>₹{Number(MoneyObj.positionsPL)}</h3>
                                <p className='PositionsPLHP'>Positios P&L</p>
                            </div>
                            <div className="PositionsInvested">
                                <div className="PositionsInvested1">
                                    <h3 className='PositionsPLH3'>₹{Number(MoneyObj.availableMoney).toFixed(2)}</h3>
                                    <p className='PositionsPLHP'>Available Cash</p>
                                </div>
                                <div className="PositionsInvested2">
                                    <h3 className='PositionsPLH3'>₹{MoneyObj.pastTradedAmount}</h3>
                                    <p className='PositionsPLHP'>Past Traded Amount</p>
                                </div>
                                <div className="PositionsInvested3">
                                    <h3 className='PositionsPLH3'>₹{Number(MoneyObj.InvestedAmount).toFixed(2)}</h3>
                                    <p className='PositionsPLHP'>Invested Amount</p>
                                </div>

                            </div>
                        </div>
                        <div className="OpenOrdersDiv">
                            {
                                Orders ? <>
                                    <Splide options={splideOptions}>
                                        {Object.keys(Orders).map((data, index) => {
                                            const t = Orders[data].EndingPrice;
                                            if (t === undefined) {
                                                return (
                                                    <SplideSlide key={index}>
                                                        <ListOfOrdersHistory data={Orders[data]} past={false} orderkey={data} />
                                                    </SplideSlide>
                                                );// Skip rendering
                                            } else {
                                                return null
                                            }
                                        })}
                                        {/* <SplideSlide>
                                    <ListOfOrdersHistory />
                                </SplideSlide>
                                <SplideSlide>
                                    <ListOfOrdersHistory />
                                </SplideSlide>
                                <SplideSlide>
                                    <ListOfOrdersHistory />
                                </SplideSlide>
                                <SplideSlide>
                                    <ListOfOrdersHistory />
                                </SplideSlide>
                                <SplideSlide>
                                    <ListOfOrdersHistory />
                                </SplideSlide>
                                <SplideSlide>
                                    <ListOfOrdersHistory />
                                </SplideSlide>
                                <SplideSlide>
                                    <ListOfOrdersHistory />
                                </SplideSlide>
                                <SplideSlide>
                                    <ListOfOrdersHistory />
                                </SplideSlide> */}
                                    </Splide>
                                </> : <><h1>No orders</h1></>
                            }
                        </div></>
                }
            </div> : <>
                <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
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

export default ActivePositions
