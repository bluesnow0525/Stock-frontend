import { useNavigate,useLocation } from 'react-router-dom';
// import React from 'react';
import Button from '../components/Button';
import ButtonGradient from '../assets/svg/ButtonGradient';
import AnimatedComponent from '../components/AnimatedComponent';
import Header from '../components/Header';

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state ? (location.state as { username: string }).username : undefined;
  return (
    <><div className='bg-container'>
      <AnimatedComponent y={-100} opacity={0} duration={0.8}>
        <Header username={username}></Header>
      </AnimatedComponent>
      <div className=" text-white container">
        <AnimatedComponent x={-100} opacity={0} duration={0.8} delay={0.8}>
          <div className='relative w-[20rem] md:w-[27rem] mx-auto text-left mt-[120px] ml-10 transition-transform duration-[1200ms] ease-in-out hover:-translate-y-1'>
            <h1 className='cursor-default mb-1 font-semibold text-[2.5rem] leading-[3.25rem] md:text-[2.75rem] md:leading-[3.75rem] lg:text-[3.25rem] lg:leading-[4.0625rem] xl:text-[3.2rem] xl:leading-[4rem]'>
              Dennis 人工智能
            </h1>
            <img
              src="curve.png"
              className="left-0 mb-4 md:w-[350px] lg:w-[500px]"
              height={10}
            />
            <h2 className='cursor-default font-mono text-[1.75rem] leading-[2.5rem] md:text-[1.75rem] md:leading-[2rem] lg:text-[2rem] lg:leading-[2rem] xl:text-[2.3rem] xl:leading-tight'>
              幫你分析財報、預測股市
            </h2>
            <p className="cursor-default body-1 max-w-3xl mt-2 text-n-2 lg:mb-8 lg:text-[1.1rem]">
              提供虛擬金系統，讓你更好管理分析資產
            </p>
          </div>
        </AnimatedComponent>
        <div className="mt-8 ml-10">
          <AnimatedComponent x={0} opacity={0} duration={1.3} delay={1.5}>
            <Button px="px-3">
              <button onClick={() => navigate('/trade', { replace: true, state: { username } })} className='text-[11px] font-mono lg:text-[14px]'>start trade</button>
            </Button>
          </AnimatedComponent>
        </div>
      </div>
      <AnimatedComponent y={0} opacity={0} duration={3} delay={1.5}>
        <img
          src="botimg2.png"
          className="sm:fixed bottom-0 right-0 opacity-80 mb-4 mr-5 lg:mr-10 hover:opacity-90 hover:transform hover:scale-110 transition-transform duration-500 rounded-t-full"
          height={1200}
        />
      </AnimatedComponent>
      
      </div>
      <ButtonGradient />
    </>
  );
};

export default Home;
