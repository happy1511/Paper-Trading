import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Css/Tpage.css";
import axios from "axios";
import { mostactive } from "../modules/FetchingAxios";

const TrendingMarketPage = () => {
  const [Indices, setIndices] = useState([]);
  const [AllIndicesStock, setAllIndicesStock] = useState({});
  // useEffect(() => {
  //     axios.get('/api/allIndices').then((response) => {
  //         setIndices((response.data).map((ele) => { ele.indexSymbol }))
  //     }).catch((error) => { console.log(error) })
  // }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const url = "http://localhost:3000/api/mostActive/nifty%2050";
      mostactive("nifty 50")
        .then((res) => {
          setAllIndicesStock({ ...AllIndicesStock, ["Nifty 50"]: res });
        })
        .catch((error) => {
          console.log(error);
        });
    }, 1000);

    return clearInterval(interval);
  }, []);
  return (
    <>
      <div style={{ backgroundColor: "black" }}>
        <Header />
        <div className="Div1Tp">
          <div className="Div2OTp"></div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TrendingMarketPage;
