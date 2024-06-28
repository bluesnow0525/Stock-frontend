import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import ButtonGradient from '../assets/svg/ButtonGradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { toggleVIPStatus } from '../slice/vipSlice';

interface HeaderProp {
    username?: string;
    isvip?: Boolean
}

const Header: React.FC<HeaderProp> = ({ username, isvip }) => {
    // const [isOpen, setIsOpen] = useState<boolean>(false);
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
        } else {
            alert('Please enter your username and VIP code');
        }
    };

    useEffect(() => {
        if (vip.status === 'idle' && vip.message) {
            alert(vip.message);
        }
    }, [vip.status, vip.message]);

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
                                    <p className='text-[14px] sm:text-[16px] font-mono mr-3 text-red-600 cursor-pointer' onClick={toggleMenu}>
                                        {username}
                                    </p>
                                    <div className={`transition-all duration-300 ${showMenu ? 'max-h-screen' : 'max-h-0'} overflow-hidden`}>
                                        <div className='bg-black shadow-md rounded p-4 mt-2'>
                                            <div>
                                                {isvip ? (
                                                    <button className='bg-blue-500 text-white py-2 px-4 rounded mb-2' onClick={canceltag}>
                                                        取消VIP
                                                    </button>
                                                ) : (
                                                    <div className='flex flex-col'>
                                                        <input type='text' placeholder='Input field' className='border py-2 px-4 rounded mb-2' onChange={(e) => setVipCode(e.target.value)} />
                                                        <button className='bg-green-500 text-white py-2 px-4 rounded mb-2' onClick={handleToggleVIP}>
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
