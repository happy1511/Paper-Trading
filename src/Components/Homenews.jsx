import React from 'react'

const Homenews = (props) => {
    return (
        <a href={props.v.url} className='LinkNews' key={props.index}>
            <div className="CardsN">
                <div className="imgNews">
                    {(props.v?.urlToImage) ? <img src={props.v.urlToImage} alt='' />
                        : ''}
                </div>
                <div className="TitleNews">
                    <p>{props.v?.title}</p>
                    <div className='dateprovider'><p>Provider : {props.v?.source?.name}</p><p>Date:{props.v?.publishedAt}</p></div>
                </div>

            </div>
        </a>
    )
}

export default Homenews
