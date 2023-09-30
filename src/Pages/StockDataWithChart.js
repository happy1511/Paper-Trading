import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Css/StockDataWithChart.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ChartR from "../Components/ChartR";
import axios from "axios";
import { Puff } from "react-loader-spinner";
import ErrorPage from "./error";

const StockDataWithChart = () => {
  const { Symbol } = useParams();
  const [Symboldata, setSymboldata] = useState({});
  const [color, setcolor] = useState("");
  const [selectedchart, setselectedchart] = useState(0);
  const [MarketStatus, setMarketStatus] = useState(null);
  const [errormsg, seterrormsg] = useState(false);
  const fetchSymbolData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/equity/${Symbol}`
      );
      setSymboldata(response.data);
    } catch (error) {
      console.log(error);
      seterrormsg(true);
    }
  };
  useEffect(() => {
    Symboldata.priceInfo?.pChange < 0 ? setcolor("red") : setcolor("green");
  }, [Symboldata]);
  const FetchMarketStatus = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}`);
      console.log(response);
      response.data.marketState[0].marketStatus === "Closed" ||
      response.data.marketState[0].marketStatus === "Close"
        ? setMarketStatus(0)
        : setMarketStatus(1);
      console.log("market" + MarketStatus);
    } catch (error) {
      setMarketStatus({});
      console.log(error);
    }
  };
  const handleselectchart = (e) => {
    setselectedchart(e);
  };
  // useEffect(() => {
  //     FetchMarketStatus();
  // })
  useEffect(() => {
    FetchMarketStatus();
    fetchSymbolData();
    const interval = setInterval(() => {
      fetchSymbolData();
    }, 5000);

    return () => {
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, []);
  return Symboldata !== {}  ? (
    <div className="ChartPageOuter">
      <Header />
      <div className="StockDataDivChartPage">
        <div className="SymbolNameDivChartPage">
          {MarketStatus === null ? (
            ""
          ) : (
            <h3 className="MarketStatusHeaderStockPage">
              <div
                className="MarketStatus"
                style={
                  MarketStatus === 0
                    ? { backgroundColor: "red" }
                    : { backgroundColor: "green" }
                }
              ></div>
              {MarketStatus === 0 ? "Market Closed" : "Market Open"}
            </h3>
          )}
          <h1 className="StockDataCompanyNameChartPage">
            {Symboldata.info?.companyName}
          </h1>
          <h2 className="StockDataPriceChartPage">
            <div className="PriceChartPage">
              {Symboldata.priceInfo?.lastPrice}
            </div>
            <div
              className="StockPriceChangeChartPage"
              style={{ backgroundColor: color }}
            >
              {Number.parseFloat(Symboldata.priceInfo?.pChange)
                .toFixed(1)
                .toString()
                .charAt(0) === "-"
                ? "↓ " +
                  Number.parseFloat(Symboldata.priceInfo?.pChange)
                    .toFixed(1)
                    .toString()
                : "↑ " +
                  Number.parseFloat(Symboldata.priceInfo?.pChange)
                    .toFixed(1)
                    .toString()}
            </div>
            <div className="PriceChangeChartPage">
              {Number.parseFloat(Symboldata.priceInfo?.change)
                .toFixed(1)
                .toString()
                .charAt(0) === "-"
                ? Number.parseFloat(Symboldata.priceInfo?.change)
                    .toFixed(1)
                    .toString()
                : "+ " +
                  Number.parseFloat(Symboldata.priceInfo?.change)
                    .toFixed(1)
                    .toString()}
            </div>
          </h2>
        </div>

        <div className="ChartDaySelectDiv">
          <button
            className={`SelectChart ${selectedchart === 0 ? "Selected" : ""}`}
            onClick={() => {
              handleselectchart(0);
            }}
          >
            1 D
          </button>
          <button
            className={`SelectChart ${selectedchart === 1 ? "Selected" : ""}`}
            onClick={() => {
              handleselectchart(1);
            }}
          >
            5 D
          </button>
          <button
            className={`SelectChart ${selectedchart === 2 ? "Selected" : ""}`}
            onClick={() => {
              handleselectchart(2);
            }}
          >
            1 M
          </button>
          <button
            className={`SelectChart ${selectedchart === 3 ? "Selected" : ""}`}
            onClick={() => {
              handleselectchart(3);
            }}
          >
            6 M
          </button>
        </div>
        <div className="ChartDivChartPage">
          <ChartR data={Symbol} scolor={color} historical={selectedchart} />
        </div>
      </div>
      <Footer />
    </div>
  ) : errormsg ? <ErrorPage/> : (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
};

export default StockDataWithChart;
