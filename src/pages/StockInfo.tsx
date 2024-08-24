import Header from "../components/Header";
import Loading from "../components/Loading";
import BuySellGauge from "../components/BuySellGauge";
import React, { useEffect, useState } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  useMatch,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchStart, fetchSuccess, fetchFailure } from "../slice/aiSlice";
import { fetchAiData } from "../slice/aiservice";
import Thermometer from "../components/Thermometer";

interface Evaluation {
  low: number;
  high: number;
}

const StockInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const priceMatch = useMatch(`/trade/price/${id}`);
  const infoMatch = useMatch(`/trade/info/${id}`);
  const financeMatch = useMatch(`/trade/finance/${id}`);
  const { stockName, ETF } = location.state as {
    stockName: string;
    ETF: boolean;
  };

  const [username, setusername] = useState(
    location.state
      ? (location.state as { username: string }).username
      : undefined
  );
  const [isvip, setisvip] = useState(
    location.state ? (location.state as { isvip: Boolean }).isvip : undefined
  );

  const updateUserInfo = (newUsername: string, newIsVip: boolean) => {
    setusername(newUsername);
    setisvip(newIsVip);
  };

  const dispatch = useDispatch<AppDispatch>();

  const { imageUrl, info, status, error } = useSelector(
    (state: RootState) => state.ai
  );

  const [isExpanded_image, setIsExpanded_image] = useState(false);

  const evaluations = [
    { label: "pb法估價", value: info.pb法估價 },
    { label: "pe法估價", value: info.pe法估價 },
    { label: "ddm法估價", value: info.ddm法估價 },
    { label: "de法估價", value: info.de法估價 },
    { label: "dcf法估價", value: info.dcf法估價 },
    { label: "peg法估價", value: info.peg法估價 },
  ];

  const toggleImage = () => {
    setIsExpanded_image(!isExpanded_image);
  };

  const parseEvaluation = (evalStr: string): Evaluation => {
    const [low, high] = evalStr.split("~").map((v) => parseInt(v, 10));
    return { low, high };
  };

  const handleNavigate = (path: string) => {
    navigate(path, { state: { stockName: stockName, username, isvip, ETF } });
  };

  useEffect(() => {
    if (username) {
      dispatch(fetchStart());
      const params = { query: { id, username } }; // 设置你想发送给后端的参数
      fetchAiData(params)
        .then((data) => {
          dispatch(
            fetchSuccess({
              imageUrl: data.imageBase64,
              info: data.info,
            })
          );
        })
        .catch((error) => {
          dispatch(fetchFailure(error.message));
        });
    }
  }, [dispatch, id]);

  return (
    <div className="bg-container">
      <div className="w-full h-[9%] bg-color-1 text-white">
        <Header
          username={username}
          isvip={isvip}
          onUpdateUserInfo={updateUserInfo}
        ></Header>
        <div className="breathing-divider"></div>
      </div>
      <div className="h-full flex flex-col items-center">
        <div className="w-full">
          <div className="h-12 flex justify-center items-center mt-5">
            {/* Buttons for navigation */}
            <button
              className={`3xl:text-[20px] link-hover-gradient px-1 py-1 rounded mr-4 ${
                priceMatch ? "border-color-3" : ""
              }`}
              onClick={() => handleNavigate(`/trade/price/${id}`)}
            >
              價格
            </button>
            {ETF !== true && (
              <button
                className={`3xl:text-[20px] link-hover-gradient px-1 py-1 rounded mr-4 ${
                  financeMatch ? "border-color-3" : ""
                }`}
                onClick={() => handleNavigate(`/trade/finance/${id}`)}
              >
                財報
              </button>
            )}
            <button
              className={`3xl:text-[20px] link-hover-gradient px-4 py-1 border rounded mr-4 ${
                infoMatch ? "border-color-3" : ""
              }`}
              onClick={() => handleNavigate(`/trade/info/${id}`)}
            >
              分析
            </button>
          </div>
          <div className="breathing-divider "></div>
        </div>
        {status === "succeeded" && imageUrl && username && (
          <>
            <div className="h-[30%] flex w-full">
              <div className="w-1/2">
                <div className="text-white flex flex-col justify-center items-center w-full">
                  <BuySellGauge score={info.評價分數} />
                  <p className="text-[18px] text-center font-extrabold">
                    {info.評價分數}
                  </p>
                  <p className="text-[15px] font-bold text-slate-200 mt-2">
                    AI信心分數:{info.評價分數}
                  </p>
                  <p className="text-[15px] font-bold text-slate-200">
                    準確率: {info.準確率}
                  </p>
                  {info.回測報酬 !== 0 && (
                    <p className="text-[13px] font-bold text-slate-200">
                      回測報酬: {info.回測報酬.toFixed(2)}%
                    </p>
                  )}
                </div>
              </div>
              <div className="w-1/2 overflow-y-auto">
                <div className="">
                  {info.合理價 !== "" && (
                    <p className="text-[17px] font-extrabold text-slate-200 mt-3">
                      合理價:
                      <br /> {info.低合理價} ~{" "}
                      <span className="text-[15px]">{info.合理價}</span> ~{" "}
                      {info.高合理價}
                    </p>
                  )}
                  {info.長期評價 !== "" && (
                    <p className="text-[15px] font-extrabold text-slate-200 my-0.5 whitespace-pre-line">
                      長期評價:
                      <br /> <span className="">{info.長期評價}</span>
                    </p>
                  )}
                  {info.預期年化報酬率 !== "" && (
                    <p className="text-[15px] text-slate-200 font-extrabold">
                      預期年化報酬率: {info.預期年化報酬率}
                    </p>
                  )}
                  {info.現價 !== 0 && (
                    <p className="text-[15px] text-slate-200 my-0.5 font-extrabold">
                      現價: {info.現價}
                    </p>
                  )}
                </div>
                <div className="mt-5">
                  {info.預估eps !== "" && (
                    <p className="text-[15px] text-slate-200 my-0.5">
                      今年預估eps: {info.預估eps}
                    </p>
                  )}
                  {info.淨值 !== "" && (
                    <p className="text-[15px] text-slate-200">
                      淨值: {info.淨值}
                    </p>
                  )}
                  {info.殖利率 !== "" && (
                    <p className="text-[15px] text-slate-200 my-0.5">
                      殖利率: {info.殖利率}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={toggleImage}
                className="text-white rounded w-full border border-slate-500 h-[30px] link-hover-gradient"
              >
                {isExpanded_image ? "收起" : "顯示AI結果圖"}
              </button>
              <div
                className={`transition-all duration-500 ${
                  isExpanded_image ? "max-h-[300px] h-[300px]" : "max-h-0 h-0"
                } overflow-hidden`}
              >
                <img
                  src={`data:image/jpeg;base64,${imageUrl}`}
                  alt="Description"
                  className="w-full h-[300px] sticky z-5"
                />
              </div>
            </div>
            <div className="w-full h-[50vh] flex overflow-y-auto">
              <div className="w-[80%] text-color-5">
                <div className="flex space-x-1 items-center justify-center mt-3 h-[3vh]">
                  <div className="flex items-center">
                    <div className="w-2 h-4 bg-yellow-300 rounded"></div>
                    <span className="text-xs">合理區間</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-4 bg-green-500 rounded"></div>
                    <span className="text-xs">價格便宜</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-4 bg-red-500 rounded"></div>
                    <span className="text-xs">價格過高</span>
                  </div>
                </div>
                <div
                  className={`transition-all duration-500  overflow-hidden `}
                >
                  <div className="space-y-3 mb-1">
                    {evaluations.map((evalItem, index) =>
                      evalItem.value ? (
                        <div key={index} className="my-1 ">
                          <div className="h-[8vh]">
                            <Thermometer
                              key={index}
                              label={evalItem.label}
                              evaluation={parseEvaluation(evalItem.value)}
                              recentPrice={info.現價}
                            />
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
                <div className="h-[20px]"></div>
              </div>
            </div>
          </>
        )}
        {status === "loading" && (
          <div className="flex justify-center mt-10">
            <Loading></Loading>
          </div>
        )}
        {status === "failed" && <p className="text-white">Error: {error}</p>}
        {!username && (
          <p className="text-white text-center text-[30px] mt-20">
            付費解鎖AI診斷+虛擬金功能
          </p>
        )}
      </div>
    </div>
  );
};

export default StockInfo;
