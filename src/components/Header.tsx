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
            <div className="top-0 left-0 w-full z-50 bg-n-8/70 backdrop-blur-sm h-18 py-4">
                <div className="container mx-auto flex items-center justify-between px-1">
                    <div className={`text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-red-500 to-red-600 text-[22px] font-semibold font-mono text-left cursor-default `}>
                        Dennis Ai
                    </div>
                    <div className={`items-center justify-center space-x-4 md:space-x-20 sm:space-x-10`}>
                        
                        <button onClick={() => navigate('/', { replace: true, state: { username } })} className="px-4 py-4 text-[15px] font-mono text-white bg-[conic-gradient(from_var(--shimmer-angle),theme(colors.red.900)_0%,theme(colors.red.500)_10%,theme(colors.red.900)_20%)] animate-[shimmer_2.5s_linear_infinite] rounded-[24px]
                            relative hover:text-red-300 duration-500 ease-out
                            after:flex after:absolute after:bg-slate-950 after:inset-[2px] after:rounded-[22px] after:content-[attr(aria-label)]
                            after:items-center after:justify-center "aria-label="HOME">HOME</button>
                        <button onClick={() => navigate('/trade', { replace: true, state: { username } })} className="px-4 py-4 text-[15px] font-mono text-white bg-[conic-gradient(from_var(--shimmer-angle),theme(colors.red.900)_0%,theme(colors.red.500)_10%,theme(colors.red.900)_20%)] animate-[shimmer_2.5s_linear_infinite] rounded-[24px]
                            relative hover:text-red-300 duration-500 ease-out
                            after:flex after:absolute after:bg-slate-950 after:inset-[2px] after:rounded-[22px] after:content-[attr(aria-label)]
                            after:items-center after:justify-center "aria-label="TRADE">TRADE</button>
                        <button onClick={() => navigate('/asset', { replace: true, state: { username } })} className="px-4 py-4 text-[15px] font-mono text-white bg-[conic-gradient(from_var(--shimmer-angle),theme(colors.red.900)_0%,theme(colors.red.500)_10%,theme(colors.red.900)_20%)] animate-[shimmer_2.5s_linear_infinite] rounded-[24px]
                            relative hover:text-red-300 duration-500 ease-out
                            after:flex after:absolute after:bg-slate-950 after:inset-[2px] after:rounded-[22px] after:content-[attr(aria-label)]
                            after:items-center after:justify-center "aria-label="ASSET">ASSET</button>
                        
                    </div>
                    <div className={`items-center text-right flex`}>

                        {
                            username ? (
                                <p className='text-[16px] font-mono mr-3 text-red-600'>{username}</p>

                            ) : (
                                <></>
                            )
                        }

                        <Button px='px-2.5'>
                            {
                                username ? (
                                    <button onClick={() => navigate('/')} className='text-[14px] font-mono text-white link-hover-gradient'>log out</button>
                                ) : (
                                    <Link to="/login" className='text-[14px] font-mono'>Log in</Link>
                                )

                            }
                        </Button>
                        {/* <Button onClick={() => setIsOpen(!isOpen)} className="text-white block text-[15px] sm:hidden" px="px-3">
                            Menu
                        </Button> */}
                    </div>
                    {/* {isOpen && (
                        <div className={`absolute top-full w-full right-0 left-0 transform sm:w-auto bg-n-8/90 transition-all duration-[1000ms] ease-in-out lg:hidden z-50 overflow-hidden`}>
                            <Link to="/" className="text-white py-2 hover:text-red-500 font-mono flex justify-center">Home</Link>
                            <Link to="/trade" className="text-white py-2 hover:text-red-500 font-mono flex justify-center">Trade</Link>
                            <Link to="/trade" className="text-white py-2 hover:text-red-500 font-mono flex justify-center">Asset</Link>
                            <div className="flex items-center justify-center"> 
                                <button className="text-white py-2 hover:text-red-500 font-mono">log in</button>
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
            <ButtonGradient />
        </>
    );
};

export default Header;
