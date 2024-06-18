// import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import ButtonGradient from '../assets/svg/ButtonGradient';

interface HeaderProp {
    username?: string;
}
const Header: React.FC<HeaderProp> = ({ username }) => {
    // const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    return (
        <>
            <div className="top-0 left-0 w-full z-50 bg-n-8/70 backdrop-blur-sm h-18 py-4 3xl:scale-[1.2] sticky">
                <div className="container mx-auto flex items-center justify-between px-1">
                    <div className={`text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-red-500 to-red-600 sm:text-[22px] font-semibold font-mono text-left cursor-default `}>
                        DR.Stock
                    </div>
                    <div className={`items-center justify-center space-x-4 md:space-x-20 sm:space-x-10`}>
                        
                        <button onClick={() => navigate('/', { replace: true, state: { username } })} className="px-4 py-4 font-mono text-white bg-[conic-gradient(from_var(--shimmer-angle),theme(colors.red.900)_0%,theme(colors.red.500)_10%,theme(colors.red.900)_20%)] animate-[shimmer_2.5s_linear_infinite] rounded-[24px]
                            relative hover:text-red-300 duration-500 ease-out
                            after:flex after:absolute after:bg-slate-950 after:inset-[2px] after:rounded-[22px] after:content-[attr(aria-label)] text-[10px] sm:text-[15px]
                            after:items-center after:justify-center "aria-label="首頁">首頁</button>
                        <button onClick={() => navigate('/trade', { replace: true, state: { username } })} className="px-4 py-4 font-mono text-white bg-[conic-gradient(from_var(--shimmer-angle),theme(colors.red.900)_0%,theme(colors.red.500)_10%,theme(colors.red.900)_20%)] animate-[shimmer_2.5s_linear_infinite] rounded-[24px]
                            relative hover:text-red-300 duration-500 ease-out
                            after:flex after:absolute after:bg-slate-950 after:inset-[2px] after:rounded-[22px] after:content-[attr(aria-label)] text-[10px] sm:text-[15px]
                            after:items-center after:justify-center "aria-label="選股票">選股票</button>
                        <button onClick={() => navigate('/asset', { replace: true, state: { username } })} className="px-4 py-4 font-mono text-white bg-[conic-gradient(from_var(--shimmer-angle),theme(colors.red.900)_0%,theme(colors.red.500)_10%,theme(colors.red.900)_20%)] animate-[shimmer_2.5s_linear_infinite] rounded-[24px]
                            relative hover:text-red-300 duration-500 ease-out
                            after:flex after:absolute after:bg-slate-950 after:inset-[2px] after:rounded-[22px] after:content-[attr(aria-label)] text-[10px] sm:text-[15px]
                            after:items-center after:justify-center "aria-label="虛擬金">虛擬金</button>
                        
                    </div>
                    <div className={`items-center text-right sm:flex`}>

                        {
                            username ? (
                                <p className='text-[14px] sm:text-[16px] font-mono mr-3 text-red-600'>{username}</p>

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
