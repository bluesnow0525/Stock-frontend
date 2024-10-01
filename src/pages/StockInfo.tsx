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
import { fetchValueData } from "../slice/valueSlice";
import ValueMethod from "../components/ValueMethod";

const StockInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const priceMatch = useMatch(`/trade/price/${id}`);
  const infoMatch = useMatch(`/trade/info/${id}`);
  const financeMatch = useMatch(`/trade/finance/${id}`);
  const { stockName, ETF, recentPrice } = location.state as {
    stockName: string;
    ETF: boolean;
    recentPrice: number;
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

  const v_info = useSelector((state: RootState) => state.valueData.v_info);
  const v_infoStatus = useSelector(
    (state: RootState) => state.valueData.status
  );

  const [isExpanded_image, setIsExpanded_image] = useState(false);

  const toggleImage = () => {
    setIsExpanded_image(!isExpanded_image);
  };

  const handleNavigate = (path: string) => {
    navigate(path, {
      state: {
        stockName: stockName,
        username: username,
        isvip: isvip,
        ETF: ETF,
        recentPrice: recentPrice,
      },
    });
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

  useEffect(() => {
    if (id) {
      dispatch(fetchValueData({ username, id }));
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
                      回測年報酬: {info.回測報酬.toFixed(2)}%
                    </p>
                  )}
                </div>
              </div>
              {v_infoStatus === "succeeded" && v_info && (
                <div className="w-1/2 overflow-y-auto">
                  <div className="">
                    {v_info.合理價 !== "" && (
                      <p className="text-[17px] font-extrabold text-slate-200 mt-3">
                        合理價:
                        <br /> {v_info.低合理價} ~{" "}
                        <span className="text-[15px]">{v_info.合理價}</span> ~{" "}
                        {v_info.高合理價}
                      </p>
                    )}
                    {v_info.長期評價 !== "" && (
                      <p className="text-[15px] font-extrabold text-slate-200 my-0.5 whitespace-pre-line">
                        長期評價:
                        <br /> <span className="">{v_info.長期評價}</span>
                      </p>
                    )}
                    {v_info.預期年化報酬率 !== "" && (
                      <p className="text-[15px] text-slate-200 font-extrabold">
                        預期年化報酬率: {v_info.預期年化報酬率}
                      </p>
                    )}
                    {recentPrice !== 0 && (
                      <p className="text-[15px] text-slate-200 my-0.5 font-extrabold">
                        現價: {recentPrice}
                      </p>
                    )}
                  </div>
                  <div className="mt-5">
                    {v_info.預估eps !== "" && (
                      <p className="text-[15px] text-slate-200 my-0.5">
                        今年預估eps: {v_info.預估eps}
                      </p>
                    )}
                    {v_info.淨值 !== "" && (
                      <p className="text-[15px] text-slate-200">
                        淨值: {v_info.淨值}
                      </p>
                    )}
                    {v_info.殖利率 !== "" && (
                      <p className="text-[15px] text-slate-200 my-0.5">
                        殖利率: {v_info.殖利率}
                      </p>
                    )}
                  </div>
                </div>
              )}
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
            <div className="w-full h-[50vh] flex overflow-y-auto items-center container">
              {v_infoStatus === "succeeded" && v_info && (
                <ValueMethod v_info={v_info} recentPrice={recentPrice} stock_id={id} />
              )}
              {v_infoStatus === "loading" && <Loading />}
              {/* 列印v_info.成分股 table */}
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
