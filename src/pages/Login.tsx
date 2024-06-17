import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 導入 useNavigate
import Header from '../components/Header';
import AnimatedComponent from '../components/AnimatedComponent';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [officialCode, setOfficialCode] = useState<string>('');
    const [mode, setMode] = useState<'login' | 'register'>('login'); // 登入或註冊模式
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const endpoint = mode === 'login' ? 'login' : 'register';
        const body = mode === 'login'
            ? { username, password }
            : { username, password, officialCode };
        const response = await fetch(`http://localhost:5000/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        // alert(data.message);
        if (data.message.includes('successful')) { // 成功後行為
            if (mode === 'register') {
                alert(data.message);
                setMode('login'); // 註冊成功後切換到登入模式
            } else {
                navigate('/', { replace: true, state: { username } }); // 登入成功後跳轉到首頁
            }
        } else {
            alert(data.message);
        }
    };

    return (
        <>
            <AnimatedComponent y={-100} opacity={0} duration={0.8}>
                <Header />
            </AnimatedComponent>
            <AnimatedComponent y={0} opacity={0} duration={1.5} delay={0.8}>
                <div className="text-white sm:h-[85vh] flex justify-center items-center">
                    <div className='bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-20 relative 2xl:scale-150' style={{ boxShadow: '0 0 10px 5px rgba(255, 0, 0, 0.6)' }}>
                        <h2 className="text-xl font-bold text-center mb-6">{mode === 'login' ? 'Login' : 'Register'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='relative my-5'>
                                <input type="text" placeholder='Username' required value={username} onChange={(e) => setUsername(e.target.value)} className="input block w-72 py-2 pw-0 test-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" />
                            </div>
                            <div className='relative my-4'>
                                <input type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} className="input block w-72 py-2 pw-0 test-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" />
                            </div>
                            {mode === 'register' && (
                                <div className='relative my-4'>
                                    <input type="text" placeholder='Official Code' required value={officialCode} onChange={(e) => setOfficialCode(e.target.value)} className="input block w-72 py-2 pw-0 test-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" />
                                </div>
                            )}
                            <button type="submit" className="btn w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300">{mode === 'login' ? 'Login' : 'Register'}</button>
                        </form>
                        <button className="btn btn-secondary m-2 hover:text-blue-400 duration-300" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                            {mode === 'login' ? 'Click here to Register' : 'Click here to Login'}
                        </button>
                    </div>
                </div>
            </AnimatedComponent>
        </>);
};

export default Login;
