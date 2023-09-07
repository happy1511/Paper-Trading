import React from 'react'
import { useNavigate } from 'react-router-dom';

const MostActiveTrendingPage = (props) => {
    const navigate = useNavigate()
    const handleClickOnMostActiveCard = (e) => {
        const isin = encodeURIComponent(props.data.meta.isin)
        const symbol = encodeURIComponent(props.data.symbol)
        navigate(`/Chart/${symbol}`)
    }
    return (
        <div className='MostActiveTrendingPageDiv1' onClick={handleClickOnMostActiveCard}>
            <div className='MostActiveTrendingPageimgDiv'>
                <img src={`https://unpkg.com/@extra-isin/logos@1.0.0/data/${props.data?.meta?.isin}.png`} alt="" onError={(e) => {
                    e.target.style.display = 'none'; // Hide the image on error
                }} className='MostActiveTrendingPageimg' />
            </div>
            <h3 className='MostActiveTrendingPageHeaders'>{props.data.symbol} ({props.data.pChange}%)</h3>
            <h4 className='MostActiveTrendingPageHeaders MostActivePrice'><span>{props.data.lastPrice}</span><span className='hh'>{Number(props.data.change).toFixed(2)}{props.data.change > 0 ? <svg width="24px" height="100%" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="green" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg> : <svg width="24px" height="100%" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 6V18M12 18L7 13M12 18L17 13" stroke="#ff4141" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>}</span></h4>
            <h6 className='MostActiveTrendingPageHeaders MostActiveTrendingPageHeadersIndustry'>{props.data.meta?.industry}</h6>
        </div>
    )
}

export default MostActiveTrendingPage
