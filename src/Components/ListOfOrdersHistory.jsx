import React, { useEffect, useState } from "react";
import "../Css/ListOfOrdersHistory.css";
import axios from "axios";
import { onValue, ref, update } from "firebase/database";
import { auth, db } from "../utilities/Firebase";

const ListOfOrdersHistory = (props) => {
  const [lprice, setlprice] = useState(0);
  const [diff, setdiff] = useState(0);
  const [profitorlose, setprofitorlose] = useState(0);
  const [responsesymbol, setresponsesymbol] = useState({});
  const [pl, setpl] = useState(0);
  const [a, seta] = useState(true);
  const [load, setload] = useState(true);
  const fetchFirebaseData = () => {
    return new Promise((resolve, reject) => {
      onValue(
        ref(db, "users/" + auth.currentUser.uid + "/portfolio"),
        (res) => {
          if (res.exists()) {
            resolve(res.val());
          } else {
            reject(new Error("Portfolio data not found"));
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  };
  const handleordersell = async () => {
    try {
      const pll = await fetchFirebaseData();
      const updateObject = {};
      const uendprice = String(Number(lprice).toFixed(2));
      const uposition = String(
        (Number(pll.positionsPL) - Number(diff)).toFixed(2)
      );
      const uinvested = String(
        (Number(pll.InvestedAmount) - Number(props.data.TotalBill)).toFixed(2)
      );
      const upl = String(
        Number(Number(props.data.StartingPrice) - Number(lprice)).toFixed(2)
      );
      const uavailable = String(
        (
          Number(pll.availableMoney) +
          (Number(props.data.TotalBill) + Number(props.data.ProfitLose))
        ).toFixed(2)
      );
      const uprofitlose = String(
        (
          Number(pll.profitorlose ? pll.profitorlose : 0) + Number(diff)
        ).toFixed(2)
      );

      updateObject[
        "users/" +
          auth.currentUser.uid +
          "/Orders/" +
          props.orderkey +
          "/EndingPrice"
      ] = uendprice;
      updateObject[
        "users/" + auth.currentUser.uid + "/Orders/" + props.orderkey + "/PL"
      ] = upl;
      updateObject[
        "users/" + auth.currentUser.uid + "/portfolio/profitorlose"
      ] = uprofitlose;
      updateObject[
        "users/" +
          auth.currentUser.uid +
          "/Orders/" +
          props.orderkey +
          "/openOrClose"
      ] = "close";
      updateObject[
        "users/" + auth.currentUser.uid + "/portfolio/availableMoney"
      ] = uavailable;
      updateObject[
        "users/" + auth.currentUser.uid + "/portfolio/InvestedAmount"
      ] = uinvested;
      updateObject["users/" + auth.currentUser.uid + "/portfolio/positionsPL"] =
        uposition;

      String((parseFloat(pll.positionsPL) - parseFloat(diff)).toFixed(2));
      await update(ref(db), updateObject)
        .then((res) => {
          console.log("completed");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchmarketstatus = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}`);
      seta(res.data.marketState[0].marketStatus !== "Closed");
    } catch (err) {
      console.log(err);
    }
  };

  const fetchprice = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/equity/${props.data.Symbol}`
      );
      const lastprice = res.data;
      setresponsesymbol(lastprice);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    var interval;
    if (props.past === false) {
      fetchprice();
      setload(false);
      if (a === true) {
        interval = setInterval(() => {
          fetchprice();
        }, 3000);
      }
    }
    return () => clearInterval(interval);
  }, []);

  const fetchFirebaseDatapositionpl = () => {
    return new Promise((resolve, reject) => {
      onValue(
        ref(db, "users/" + auth.currentUser.uid + "/portfolio/positionsPL"),
        (res) => {
          if (res.exists()) {
            resolve(res.val());
          } else {
            reject(new Error("Portfolio data not found"));
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  };
  const callonuseeffectchangepositionpl = async () => {
    setlprice(responsesymbol?.priceInfo?.lastPrice);
    if (lprice) {
      if (props.data.StartingPrice < lprice) {
        setdiff(
          props.data.ordertype === "sell"
            ? (props.data?.StartingPrice - lprice).toFixed(2) *
                props.data.Quantity
            : (0 - (props.data?.StartingPrice - lprice)).toFixed(2) *
                props.data.Quantity
        );

        const hh = await fetchFirebaseDatapositionpl();
        setpl(hh);
      } else {
        props.data.ordertype !== "buy"
          ? setdiff(
              (props.data?.StartingPrice - lprice).toFixed(2) *
                props.data.Quantity
            )
          : setdiff(
              (lprice - props.data?.StartingPrice).toFixed(2) *
                props.data.Quantity
            );
      }
      const updateobj = {};
      const uprofitelose = String(Number(diff).toFixed(2));
      updateobj[
        "users/" +
          auth.currentUser.uid +
          "/Orders/" +
          props.orderkey +
          "/ProfitLose"
      ] = uprofitelose;
      await update(ref(db), updateobj)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    callonuseeffectchangepositionpl();
  }, [responsesymbol]);
  useEffect(() => {
    const handlebeforeunload = () => {
      var updatobj = {};
      const upl2 = String(
        Number(Number(props.data.StartingPrice) - Number(lprice)).toFixed(2)
      );
      updatobj[
        "users/" + auth.currentUser.uid + "/Orders/" + props.orderkey + "/PL"
      ] = upl2;
      update(db, updatobj);
    };
    window.addEventListener("beforeunload", handlebeforeunload);
    return window.removeEventListener("beforeunload", handlebeforeunload);
  });
  return (
    // load === true ? <>
    //     <div className='Orderardsloader'>
    //         <Oval
    //             height={30}
    //             width={30}
    //             color="white"
    //             wrapperStyle={{}}
    //             wrapperClass=""
    //             visible={true}
    //             ariaLabel='oval-loading'
    //             secondaryColor="#4fa94d"
    //             strokeWidth={2}
    //             strokeWidthSecondary={2}

    //         />
    //     </div></> :
    <>
      <div className="Orderards">
        <div className="order">
          <div className="OrderHistoryCard">
            <div className="OrderHistoryCardDiv1">
              <h2>
                {props.data?.Symbol}{" "}
                <div
                  className="OrderHistoryCardDiv2"
                  style={
                    props.data.ordertype === "buy"
                      ? { backgroundColor: "darkgreen", color: "white" }
                      : { backgroundColor: "darkred", color: "white" }
                  }
                >
                  <p style={{ color: "white", fontWeight: "600" }}>
                    {props.data.ordertype}
                  </p>
                </div>
              </h2>
            </div>
            <div className="inner">
              {props.data.EndingPrice === undefined ? (
                <>
                  <div className="OrderHistoryCardDiv1">
                    <h3
                      style={diff > 0 ? { color: "green" } : { color: "red" }}
                    >
                      {diff > 0 ? "+" : ""}
                      {diff.toFixed(2)}
                      {diff > 0 ? (
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              d="M12 6V18M12 6L7 11M12 6L17 11"
                              stroke="green"
                              stroke-width="2.4"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>{" "}
                          </g>
                        </svg>
                      ) : (
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              d="M12 6V18M12 18L7 13M12 18L17 13"
                              stroke="red"
                              stroke-width="2.4"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>{" "}
                          </g>
                        </svg>
                      )}
                    </h3>
                  </div>
                </>
              ) : (
                <>
                  <div className="OrderHistoryCardDiv1">
                    <h3
                      style={
                        Number(
                          (props.data?.StartingPrice - props.data.EndingPrice) *
                            props.data.Quantity
                        ).toFixed(2) < 0
                          ? { color: "green" }
                          : { color: "red" }
                      }
                    >
                      {
                        -Number(
                          (props.data?.StartingPrice - props.data.EndingPrice) *
                            props.data.Quantity
                        ).toFixed(2)
                      }
                      {Number(
                        (props.data?.StartingPrice - props.data.EndingPrice) *
                          props.data.Quantity
                      ).toFixed(2) < 0 ? (
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              d="M12 6V18M12 6L7 11M12 6L17 11"
                              stroke="green"
                              stroke-width="2.4"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>{" "}
                          </g>
                        </svg>
                      ) : (
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              d="M12 6V18M12 18L7 13M12 18L17 13"
                              stroke="red"
                              stroke-width="2.4"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>{" "}
                          </g>
                        </svg>
                      )}
                    </h3>
                  </div>
                </>
              )}
              {props.data.EndingPrice === undefined ? (
                <>
                  <div
                    className="ActiveOrderSellButton"
                    onClick={() => {
                      handleordersell();
                    }}
                  >
                    Sell
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="pricebanner">
            <p>
              <div>Start Price : {props.data?.StartingPrice}</div>
              <div>
                {" "}
                {props.data.EndingPrice
                  ? `  End Price : ${props.data.EndingPrice}`
                  : ""}
                {lprice ? ` Last Price : ${lprice}` : ""}{" "}
              </div>
              <div> Quantity : {props.data.Quantity}</div>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListOfOrdersHistory;
