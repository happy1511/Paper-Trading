import React, { useEffect, useState } from 'react'
import '../Css/ListOfOrdersHistory.css'
import axios from 'axios'
import { onValue, ref, update } from 'firebase/database'
import { auth, db } from '../utilities/Firebase'
const ListOfOrdersHistory = (props) => {
    const [lprice, setlprice] = useState(0)
    const [diff, setdiff] = useState(0)
    const [profitorlose, setprofitorlose] = useState(0)
    const [responsesymbol, setresponsesymbol] = useState({})
    const [pl, setpl] = useState(0)
    const handleordersell = () => {
        onValue(ref(db, 'users/' + auth.currentUser.uid + '/portfolio'), (res) => {
            setprofitorlose(res.val())
        })

        const updateObject = {};
        updateObject['users/' + auth.currentUser.uid + '/Orders/' + props.orderkey + '/EndingPrice'] = Number(lprice).toFixed(2);
        updateObject['users/' + auth.currentUser.uid + '/Orders/' + props.orderkey + '/PL'] = Number(Number(props.data.StartingPrice) - Number(lprice)).toFixed(2);
        updateObject['users/' + auth.currentUser.uid + '/portfolio/profitorlose'] = (Number(profitorlose.profitorlose ? profitorlose.profitorlose : 0) + Number(diff)).toFixed(2);
        updateObject['users/' + auth.currentUser.uid + '/Orders/' + props.orderkey + '/openOrClose'] = 'close';
        updateObject['users/' + auth.currentUser.uid + '/portfolio/availableMoney'] = (Number(profitorlose.availableMoney) + (Number(props.data.TotalBill) + Number(props.data.ProfitLose)));
        updateObject['users/' + auth.currentUser.uid + '/portfolio/InvestedAmount'] = (Number(profitorlose.InvestedAmount) - Number(props.data.TotalBill));
        updateObject['users/' + auth.currentUser.uid + '/portfolio/positionsPL'] = (Number(profitorlose.positionsPL) - Number(diff)).toFixed(2);
        update(ref(db), updateObject).then((res) => { console.log('completed') }).catch((err) => { console.log(err) })
    }

    const fetchmarketstatus = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}`)
            return res.data.marketState[0].marketStatus !== "Closed"
        } catch (err) {
            console.log(err)
            return 2
        }
    }

    const fetchprice = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/equity/${props.data.Symbol}`);
            const lastprice = res.data
            setresponsesymbol(lastprice)
        } catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        if (props.past === false) {
            const a = fetchmarketstatus();
            fetchprice();
            if (a === true) {
                setInterval(() => {
                    fetchprice();

                }, 3000);
            }
        }
        console.log(props.data)
    }, [])

    useEffect(() => {
        setlprice(responsesymbol?.priceInfo?.lastPrice)
        console.log(lprice)
        if (lprice) {
            console.log(1)
            if (props.data.StartingPrice < lprice) {
                setdiff(props.data.ordertype === 'sell' ? (((props.data?.StartingPrice - lprice)).toFixed(2)) * props.data.Quantity : ((0 - (props.data?.StartingPrice - lprice)).toFixed(2)) * props.data.Quantity)
                onValue(ref(db, 'users/' + auth.currentUser.uid + '/portfolio/positionsPL'), (res) => {
                    setpl(res.val())
                })

            }
            else {
                props.data.ordertype !== 'buy' ? setdiff(((props.data?.StartingPrice - lprice).toFixed(2)) * props.data.Quantity) : setdiff(((lprice - props.data?.StartingPrice).toFixed(2)) * props.data.Quantity)
            }
            const updateobj = {};
            updateobj['users/' + auth.currentUser.uid + '/Orders/' + props.orderkey + '/ProfitLose'] = Number(diff);
            update(ref(db), updateobj).then((res) => { console.log(res) }).catch((err) => { console.log(err) })
        }
    }, [responsesymbol])
    useEffect(()=>{
        const handlebeforeunload = () => {
            var updatobj = {}
            updatobj['users/' + auth.currentUser.uid + '/Orders/' + props.orderkey + '/PL'] = Number(Number(props.data.StartingPrice) - Number(lprice)).toFixed(2);
            update(db,updatobj)
        }
        window.addEventListener('beforeunload',handlebeforeunload)
        return(
            window.removeEventListener('beforeunload',handlebeforeunload)
        )
    })
    return (
        <>
            <div className='Orderards'>
                <div className='order'>
                    <div className='OrderHistoryCard'>
                        <div className='OrderHistoryCardDiv1'>
                            <h2>{props.data?.Symbol} <div className="OrderHistoryCardDiv2" style={props.data.ordertype === 'buy' ? { backgroundColor: 'darkgreen', color: 'white' } : { backgroundColor: 'darkred', color: 'white' }}>
                                <p style={{ color: 'white', fontWeight: '600' }}>{props.data.ordertype}</p>
                            </div></h2>
                        </div>
                        <div className='inner'>
                            {
                                props.data.EndingPrice === undefined ? <>
                                    <div className='OrderHistoryCardDiv1'>
                                        <h3 style={diff > 0 ? { color: 'darkgreen' } : { color: '#ff4141' }}>{diff > 0 ? '+' : ''}{(diff)}{diff > 0 ? <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="#013220" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg> : <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 6V18M12 18L7 13M12 18L17 13" stroke="#ff4141" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>}</h3>
                                    </div>
                                </> : <>
                                    <div className='OrderHistoryCardDiv1'>
                                        <h3 style={diff > 0 ? { color: 'darkgreen' } : { color: '#ff4141' }}>{Number(props.data?.StartingPrice - props.data.EndingPrice).toFixed(2)}</h3>
                                    </div>
                                </>
                            }
                            {props.data.EndingPrice === undefined ? <>
                                <div className="ActiveOrderSellButton" onClick={() => { handleordersell() }}>
                                    Sell
                                </div>
                            </> : ''}
                        </div>

                    </div>
                    <div className='pricebanner'>
                        <p><div>Start Price : {props.data?.StartingPrice}</div><div> {props.data.EndingPrice ? `  End Price : ${props.data.EndingPrice}` : ''}{lprice ? ` Last Price : ${lprice}` : ''} </div><div> Quantity : {props.data.Quantity}</div></p>

                    </div>

                </div>
            </div>
        </>
    )
}

export default ListOfOrdersHistory
