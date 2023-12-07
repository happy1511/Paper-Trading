import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "./Pages/About";
import News from "./Pages/News";
import Portfolio from "./Pages/Portfolio";
import Markets from "./Pages/Markets";
import Login from "./Pages/Login";
import Trending from "./Pages/Trending";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import StockDataWithChart from "./Pages/StockDataWithChart";
import NotFound from "./Pages/NotFound";
import ErrorBoundary from "./Components/ErrorBoundary";
import axios from "axios";

const AppRoutes = () => {
  useEffect(() => {
    axios
      .get("https://www.nseindia.com/api/marketStatus", {
        "User-Agent": "Mozilla/5.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/News" element={<News />} />
        <Route path="/Chart/:Symbol" element={<StockDataWithChart />} />

        <Route path="/TrendingMarkets" element={<Trending />} />
        <Route path="/Portfolio" element={<Portfolio />} />
        {/* <Route path="/Market" element={<Markets />} /> */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
