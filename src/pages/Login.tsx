import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 導入 useNavigate
import Header from '../components/Header';
import AnimatedComponent from '../components/AnimatedComponent';
import { API_BASE_URL } from '../assets/apiurl';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [officialCode, setOfficialCode] = useState<string>('');
    const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login'); // 登入、註冊或忘記密碼模式
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateUsernamePassword = (text: string) => {
        const re = /^[a-zA-Z0-9]+$/;
        return re.test(text);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateUsernamePassword(username) || !validateUsernamePassword(password)) {
            alert('Username and Password must be alphanumeric.');
            return;
        }

        if (mode === 'register' && !validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const endpoint = mode === 'login' ? 'login' : mode === 'register' ? 'register' : 'forgotpassword';
        const body = mode === 'login'
            ? { username, password }
            : mode === 'register'
                ? { username, password, email, officialCode }
                : { username };

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();

        if (data.message.includes('successful') || data.message.includes('sent')) { // 成功後行為
            if (mode === 'register') {
                alert(data.message);
                setMode('login'); // 註冊成功後切換到登入模式
            } else if (mode === 'forgot') {
                alert(data.message);
                setMode('login'); // 忘記密碼成功後切換到登入模式
            } else {
                const isvip = false;
                navigate('/', { replace: true, state: { username, isvip} }); // 登入成功後跳轉到首頁
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
                    <div className='bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-20 relative 3xl:scale-150' style={{ boxShadow: '0 0 10px 5px rgba(255, 0, 0, 0.6)' }}>
                        <h2 className="text-xl font-bold text-center mb-6">{mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Forgot Password'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='relative my-5'>
                                <input type="text" placeholder='Username' required value={username} onChange={(e) => setUsername(e.target.value)} className="input block w-72 py-2 pw-0 test-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" />
                            </div>
                            {mode !== 'forgot' && (
                                <>
                                    <div className='relative my-4'>
                                        <input type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} className="input block w-72 py-2 pw-0 test-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" />
                                    </div>
                                    {mode === 'register' && (
                                        <>
                                            <div className='relative my-4'>
                                                <input type="email" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} className="input block w-72 py-2 pw-0 test-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" />
                                            </div>
                                            <div className='relative my-4'>
                                                <input type="text" placeholder='Official Code' required value={officialCode} onChange={(e) => setOfficialCode(e.target.value)} className="input block w-72 py-2 pw-0 test-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-red-600 peer" />
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                            <button type="submit" className="btn w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300">{mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Send'}</button>
                        </form>
                        <div className="flex justify-between">

                            {(mode === 'register' || mode === 'forgot') && (
                                <button className="btn btn-secondary m-2 hover:text-blue-400 duration-300" onClick={() => setMode('login')}>
                                    Back to Login
                                </button>
                            )}
                            {mode === 'login' && (
                                <>
                                    <button className="btn btn-secondary m-2 hover:text-blue-400 duration-300" onClick={() => setMode('register')}>
                                        Click here to Register
                                    </button>
                                    <button className="btn btn-secondary m-2 hover:text-blue-400 duration-300" onClick={() => setMode('forgot')}>
                                        Forgot Password?
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </AnimatedComponent>
        </>
    );
};

export default Login;
