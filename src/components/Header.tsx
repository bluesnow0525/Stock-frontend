import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import ButtonGradient from '../assets/svg/ButtonGradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { toggleVIPStatus } from '../slice/vipSlice';

interface HeaderProp {
    username?: string;
    isvip?: Boolean;
    onUpdateUserInfo?: (username: string, isvip: boolean) => void;
}

const Header: React.FC<HeaderProp> = ({ username, isvip, onUpdateUserInfo }) => {
    const dispatch: AppDispatch = useDispatch();
    const vip = useSelector((state: RootState) => state.vip);

    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [vipCode, setVipCode] = useState<string>('');

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const canceltag = () => {
        alert('請洽管理員bluesnow0525')
    }
    const handleToggleVIP = () => {
        if (username && vipCode) {
            dispatch(toggleVIPStatus({ username, vip_code: vipCode }));
            if(onUpdateUserInfo){
                onUpdateUserInfo(username,vip.vip);
            }
            alert(vip.message);
        } else {
            alert('Please enter your username and VIP code');
        }
    };

    return (
        <>
            <div className="top-0 left-0 w-full z-50 bg-n-8/70 backdrop-blur-sm h-18 py-4 3xl:scale-[1.2] sticky">
                <div className="container mx-auto flex items-center justify-between px-1">
                    <div className={`text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-red-500 to-red-600 sm:text-[22px] font-semibold font-mono text-left cursor-default `}>
                        DR.Stock
                    </div>
                    <div className={`items-center justify-center space-x-4 md:space-x-20 sm:space-x-10`}>

                        <button onClick={() => navigate('/', { replace: true, state: { username, isvip } })} className="px-4 py-4 font-mono text-white bg-[conic-gradient(from_var(--shimmer-angle),theme(colors.red.900)_0%,theme(colors.red.500)_10%,theme(colors.red.900)_20%)] animate-[shimmer_2.5s_linear_infinite] rounded-[24px]
                            relative hover:text-red-300 duration-500 ease-out
                            after:flex after:absolute after:bg-slate-950 after:inset-[2px] after:rounded-[22px] after:content-[attr(aria-label)] text-[10px] sm:text-[15px]
                            after:items-center after:justify-center "aria-label="首頁">首頁</button>
                        <button onClick={() => navigate('/trade', { replace: true, state: { username, isvip } })} className="px-4 py-4 font-mono text-white bg-[conic-gradient(from_var(--shimmer-angle),theme(colors.red.900)_0%,theme(colors.red.500)_10%,theme(colors.red.900)_20%)] animate-[shimmer_2.5s_linear_infinite] rounded-[24px]
                            relative hover:text-red-300 duration-500 ease-out
                            after:flex after:absolute after:bg-slate-950 after:inset-[2px] after:rounded-[22px] after:content-[attr(aria-label)] text-[10px] sm:text-[15px]
                            after:items-center after:justify-center "aria-label="選股票">選股票</button>
                        <button onClick={() => navigate('/asset', { replace: true, state: { username, isvip } })} className="px-4 py-4 font-mono text-white bg-[conic-gradient(from_var(--shimmer-angle),theme(colors.red.900)_0%,theme(colors.red.500)_10%,theme(colors.red.900)_20%)] animate-[shimmer_2.5s_linear_infinite] rounded-[24px]
                            relative hover:text-red-300 duration-500 ease-out
                            after:flex after:absolute after:bg-slate-950 after:inset-[2px] after:rounded-[22px] after:content-[attr(aria-label)] text-[10px] sm:text-[15px]
                            after:items-center after:justify-center "aria-label="虛擬金">虛擬金</button>

                    </div>
                    <div className={`items-center text-right sm:flex`}>

                        {
                            username ? (
                                <div className='relative mr-2'>
                                    <p className='text-[14px] sm:text-[18px] font-mono mr-3 text-red-600 cursor-pointer' onClick={toggleMenu}>
                                        {username}
                                    </p>
                                    <div className={`transition-all ${showMenu ? 'max-h-[50%]' : 'max-h-0'} overflow-hidden`}>
                                        <div className='shadow-md rounded p-1'>
                                            <div>
                                                {isvip ? (
                                                    <button className='border border-red-600 text-white sm:text-[13px] text-[11px] py-1 px-1 rounded' onClick={canceltag}>
                                                        取消VIP
                                                    </button>
                                                ) : (
                                                    <div className='flex flex-col'>
                                                        <input type='text' placeholder='Input field' className='border py-1 px-1 rounded mb-1 sm:text-[13px] text-[11px]' onChange={(e) => setVipCode(e.target.value)} />
                                                        <button className='border border-red-600 text-white sm:text-[13px] text-[11px] py-1 px-1 rounded' onClick={handleToggleVIP}>
                                                            升級VIP
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )
                        }

                        <Button px='px-2.5'>
                            {
                                username ? (
                                    <button onClick={() => navigate('/')} className='text-[10px] sm:text-[14px] font-mono text-white link-hover-gradient'>log out</button>
                                ) : (
                                    <Link to="/login" className='text-[10px] sm:text-[14px] font-mono'>Log in</Link>
                                )

                            }
                        </Button>
                    </div>
                </div>
            </div>
            <ButtonGradient />
        </>
    );
};

export default Header;
