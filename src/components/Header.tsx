import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { toggleVIPStatus } from "../slice/vipSlice";

interface HeaderProp {
  username?: string;
  isvip?: Boolean;
  onUpdateUserInfo?: (username: string, isvip: boolean) => void;
}

const Header: React.FC<HeaderProp> = ({
  username,
  isvip,
  onUpdateUserInfo,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const vip = useSelector((state: RootState) => state.vip);

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [vipCode, setVipCode] = useState<string>("");

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const canceltag = () => {
    alert("請洽管理員bluesnow0525");
  };
  const handleToggleVIP = () => {
    if (username && vipCode) {
      dispatch(toggleVIPStatus({ username, vip_code: vipCode }));
      if (onUpdateUserInfo) {
        onUpdateUserInfo(username, vip.vip);
      }
      alert(vip.message);
    } else {
      alert("Please enter your username and VIP code");
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-1/5 flex items-center justify-center">
        <p className="">DR.Stock</p>
      </div>
      <div className="w-1/2 flex items-center justify-center space-x-2">
        <button
          onClick={() =>
            navigate("/", { replace: true, state: { username, isvip } })
          }
          className="px-4 py-4 font-mono text-white bg-[conic-gradient(from_var(--shimmer-angle),theme(colors.blue.900)_0%,theme(colors.blue.500)_10%,theme(colors.blue.900)_20%)] animate-[shimmer_2.5s_linear_infinite] rounded-[24px]
                            relative hover:text-blue-300 duration-500 ease-out
                            after:flex after:absolute after:bg-slate-950 after:inset-[2px] after:rounded-[22px] after:content-[attr(aria-label)] text-[10px] sm:text-[15px]
                            after:items-center after:justify-center "
          aria-label="首頁"
        >
          首頁
        </button>
        <button
          onClick={() =>
            navigate("/trade", { replace: true, state: { username, isvip } })
          }
          className="px-4 py-4 font-mono text-white bg-[conic-gradient(from_var(--shimmer-angle),theme(colors.blue.900)_0%,theme(colors.blue.500)_10%,theme(colors.blue.900)_20%)] animate-[shimmer_2.5s_linear_infinite] rounded-[24px]
                            relative hover:text-blue-300 duration-500 ease-out
                            after:flex after:absolute after:bg-slate-950 after:inset-[2px] after:rounded-[22px] after:content-[attr(aria-label)] text-[10px] sm:text-[15px]
                            after:items-center after:justify-center "
          aria-label="選股票"
        >
          選股票
        </button>
        <button
          onClick={() =>
            navigate("/asset", { replace: true, state: { username, isvip } })
          }
          className="px-4 py-4 font-mono text-white bg-[conic-gradient(from_var(--shimmer-angle),theme(colors.blue.900)_0%,theme(colors.blue.500)_10%,theme(colors.blue.900)_20%)] animate-[shimmer_2.5s_linear_infinite] rounded-[24px]
                            relative hover:text-blue-300 duration-500 ease-out
                            after:flex after:absolute after:bg-slate-950 after:inset-[2px] after:rounded-[22px] after:content-[attr(aria-label)] text-[10px] sm:text-[15px]
                            after:items-center after:justify-center "
          aria-label="虛擬金"
        >
          虛擬金
        </button>
      </div>
      <div className="w-[29%] flex items-center justify-center">
        <div className="w-2/3">
          {username ? (
            <div className="mr-2 relative">
              <p
                className="text-[14px] text-right sm:text-[18px] font-mono mr-3 text-color-3 cursor-pointer"
                onClick={toggleMenu}
              >
                {username}
              </p>
              <div
                className={`transition-all ${
                  showMenu ? "max-h-[100px]" : "max-h-0"
                } overflow-hidden duration-200 absolute w-[120%]`}
              >
                <div className="shadow-md rounded p-1">
                  <div>
                    {isvip ? (
                      <button
                        className="border border-color-2 text-white sm:text-[13px] text-[11px] py-1 px-1 rounded"
                        onClick={canceltag}
                      >
                        取消VIP
                      </button>
                    ) : (
                      <div className="flex flex-col">
                        <input
                          type="text"
                          placeholder="Input field"
                          className="border py-0.5 px-1 rounded mb-1 text-[11px]"
                          onChange={(e) => setVipCode(e.target.value)}
                        />
                        <button
                          className="border border-color-2 text-white text-[13px] py-0.5 px-1 rounded"
                          onClick={handleToggleVIP}
                        >
                          升級
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="ml-1 w-1/3">
          {username ? (
            <button
              onClick={() => navigate("/")}
              className="text-[10px] sm:text-[14px] font-mono text-color-5 link-hover-gradient border border-color-3 p-1"
            >
              log out
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-[10px] sm:text-[14px] font-mono text-color-5 link-hover-gradient border border-color-3 p-1"
            >
              log in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
