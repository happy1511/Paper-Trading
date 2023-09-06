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
        updateObject['users/' + auth.currentUser.uid + '/Orders/' + props.orderkey + '/EndingPrice'] = Number(lprice);
        updateObject['users/' + auth.currentUser.uid + '/portfolio/profitorlose'] = Number(profitorlose.profitorlose ? profitorlose.profitorlose : 0) + Number(diff);
        updateObject['users/' + auth.currentUser.uid + '/Orders/' + props.orderkey + '/openOrClose'] = 'close';
        updateObject['users/' + auth.currentUser.uid + '/portfolio/availableMoney'] = Number(profitorlose.availableMoney) + (Number(props.data.TotalBill) + Number(props.data.ProfitLose));
        updateObject['users/' + auth.currentUser.uid + '/portfolio/InvestedAmount'] = Number(profitorlose.InvestedAmount) - Number(props.data.TotalBill);
        updateObject['users/' + auth.currentUser.uid + '/portfolio/positionsPL'] = Number(profitorlose.positionsPL) - Number(diff);
        update(ref(db), updateObject).then((res) => { console.log('completed') }).catch((err) => { console.log(err) })
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
            fetchprice();
            setInterval(() => {
                fetchprice();
            }, 3000);
        }
    }, [])

    useEffect(() => {
        setlprice(responsesymbol?.priceInfo?.lastPrice)
        console.log(lprice)
        if (lprice) {
            console.log(1)
            if (props.data.StartingPrice < lprice) {
                setdiff(props.data.ordertype === 'sell' ? (0 - (props.data?.StartingPrice - lprice)).toFixed(2) : (props.data?.StartingPrice - lprice).toFixed(2))
                onValue(ref(db, 'users/' + auth.currentUser.uid + '/portfolio/positionsPL'), (res) => {
                    setpl(res.val())
                })

            }
            else {
                props.data.ordertype !== 'buy' ? setdiff((props.data?.StartingPrice - lprice).toFixed(2)) : setdiff((lprice - props.data?.StartingPrice).toFixed(2))
            }
            const updateobj = {};
            updateobj['users/' + auth.currentUser.uid + '/Orders/' + props.orderkey + '/ProfitLose'] = Number(diff);
            update(ref(db), updateobj).then((res) => { console.log(res) }).catch((err) => { console.log(err) })
        }
    }, [responsesymbol])
    return (
        <>
            <div className='Orderards'>
                <div className='OrderHistoryCard'>
                    <div className='OrderHistoryCardDiv1'>
                        <h2>{props.data?.Symbol}</h2>
                        <p>Start Price : {props.data?.StartingPrice} {props.data.EndingPrice ? ` | End Price : ${props.data.EndingPrice}` : ''}{lprice ? `| Last Price : ${lprice}` : ''}</p>
                    </div>
                    <div className='inner'>
                        {
                            props.data.EndingPrice === undefined ? <>
                                <div className='OrderHistoryCardDiv1'>
                                    <h3 style={diff > 0 ? { color: 'green' } : { color: 'red' }}>{diff > 0 ? '+' : ''}{diff}</h3>
                                </div>
                            </> : <>
                                <div className='OrderHistoryCardDiv1'>
                                    <h3 style={diff > 0 ? { color: 'green' } : { color: 'red' }}>{Number(props.data?.StartingPrice - props.data.EndingPrice).toFixed(2)}</h3>
                                </div>
                            </>
                        }
                        <div className="OrderHistoryCardDiv2" style={props.data.ordertype === 'buy' ? { backgroundColor: 'darkgreen',color:'white' } : { backgroundColor: 'darkred',color:'white' }}>
                            <p style={{color:'white',fontWeight:'600'}}>{props.data.ordertype}</p>
                        </div>
                    </div>

                </div>
                {props.data.EndingPrice === undefined ? <>
                    <div className="ActiveOrderSellButton" onClick={() => { handleordersell() }}>
                        Sell
                    </div>
                </> : ''}
            </div>
        </>
    )
}

export default ListOfOrdersHistory
