import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [username, setusername] = useState(location.state ? (location.state as { username: string }).username : undefined);
  const [isvip, setisvip] = useState(location.state ? (location.state as { isvip: Boolean }).isvip : undefined);

  const updateUserInfo = (newUsername: string, newIsVip: boolean) => {
    setusername(newUsername);
    setisvip(newIsVip);
  };

  return (
    <div className="bg-container">
      <div className="w-full h-[9%] bg-color-1 text-white">
        <Header username={username} isvip={isvip} onUpdateUserInfo={updateUserInfo}></Header>
        <div className="breathing-divider"></div>
      </div>
      <div className="h-[40%]">
        <div className="relative w-[20rem] md:w-[27rem] mx-auto text-left lg:mt-[70px] sm:mt-[120px] lg:ml-10 transition-transform duration-[1200ms] ease-in-out hover:-translate-y-1 3xl:ml-96 3xl:mt-72">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-200 cursor-default text-[38px] mt-10 mb-3">
            DR.Stock財富引擎
          </h1>
          <img
            src="curve.png"
            className="left-0 mb-4 md:w-[350px] lg:w-[500px]"
            height={10}
          />
          <h2 className="cursor-default text-color-5 text-[1.75rem] my-3">
            診斷個股價值、預測股市
          </h2>
          <p className="cursor-default mt-2 text-n-2 text-[1.1rem]">
            找出報酬率潛力股、AI評分短線強弱
          </p>
          <p className="cursor-default my-3 text-n-3">
            提供虛擬金系統，讓你更好管理分析資產
          </p>
        </div>
        <button
          onClick={() =>
            navigate("/pdfview", { replace: true, state: { username, isvip } })
          }
          className="text-[15px] font-mono mt-8 ml-14 border border-color-4 text-color-3 p-2 sticky"
        >
          前往使用教學
        </button>
      </div>
      <div className="text-white">
      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">
          <img
            src="botimg2.png"
            className="top-0 opacity-80 hover:opacity-90 hover:transform hover:scale-[1.1] transition-transform duration-500 rounded-t-full"
            height="200"
            alt="Bot Image"
          />
        </a>
      </div>
    </div>
  );
};

export default Home;
