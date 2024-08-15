import React, { useState } from 'react';
import { API_BASE_URL } from '../assets/apiurl';

interface UserInfo {
    id: number;
    username: string;
    email: string;
    vip: boolean;
    vip_code: string;
    expire_date: string;
    isactive: boolean;
}

interface ActivationCodeInfo {
    code: string;
}

const Useradmin: React.FC = () => {
    const [password, setPassword] = useState('');
    const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
    const [activationCodes, setActivationCodes] = useState<ActivationCodeInfo[]>([]);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setUserInfo([]);
        setActivationCodes([]);

        try {
            const response = await fetch(`${API_BASE_URL}/api/useradmin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const result = await response.json();

            if (response.ok) {
                setUserInfo(result.users);
                setActivationCodes(result.codes.map((code: string) => ({ code })));
            } else {
                setError('Invalid password.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch information.');
        }
    };

    const filteredUsers = userInfo.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggleVip = async (id: number) => {
        if (window.confirm("Are you sure you want to toggle VIP status?")) {
            try {
                const updatedUser = userInfo.find(user => user.id === id);
                if (updatedUser) {
                    const newValue = !updatedUser.vip;
                    const username = updatedUser.username;
                    const vip_code = updatedUser.vip_code;
                    const response = await fetch(`${API_BASE_URL}/api/useradmin/vip`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, vip: newValue, vip_code }),
                    });

                    if (response.ok) {
                        setUserInfo(userInfo.map(user =>
                            user.id === id ? { ...user, vip: newValue } : user
                        ));
                    } else {
                        setError('Failed to update VIP status.');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to update VIP status.');
            }
        }
    };

    const handleToggleIsActive = async (id: number) => {
        if (window.confirm("Are you sure you want to toggle Active status?")) {
            try {
                const updatedUser = userInfo.find(user => user.id === id);
                if (updatedUser) {
                    const newValue = !updatedUser.isactive;
                    const username = updatedUser.username;
                    const response = await fetch(`${API_BASE_URL}/api/useradmin/isactive`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, isactive: newValue }),
                    });

                    if (response.ok) {
                        setUserInfo(userInfo.map(user =>
                            user.id === id ? { ...user, isactive: newValue } : user
                        ));
                    } else {
                        setError('Failed to update active status.');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to update active status.');
            }
        }
    };

    return (
        <div className="container mx-auto p-4 text-white bg-black">
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-4">
                    <label className="block text-gray-400">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="bg-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <button type="submit" className="btn w-28 mb-4 text-[18px] mt-3 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300">更新資料</button>
            </form>
            {error && <div className="text-red-500">{error}</div>}
            <div className="flex space-x-4">
                <div className="w-1/3">
                    {activationCodes.length > 0 && (
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Activation Codes</h2>
                            <table className="min-w-full bg-black border border-gray-300 text-slate-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border-b">Code</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activationCodes.map((code, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 border-b">{code.code}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div className="w-2/3">
                    {userInfo.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-gray-400">Search by Username:</label>
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                                className="bg-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                    )}
                    {filteredUsers.length > 0 && (
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-2">User Information</h2>
                            <table className="min-w-full bg-black border border-gray-300 text-slate-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border-b">Username</th>
                                        <th className="px-4 py-2 border-b">Email</th>
                                        <th className="px-4 py-2 border-b">VIP</th>
                                        <th className="px-4 py-2 border-b">VIP Code</th>
                                        <th className="px-4 py-2 border-b">Expire Date</th>
                                        <th className="px-4 py-2 border-b">Is Active</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id}>
                                            <td className="px-4 py-2 border-b">{user.username}</td>
                                            <td className="px-4 py-2 border-b">{user.email}</td>
                                            <td className="px-4 py-2 border-b">
                                                <button
                                                    onClick={() => handleToggleVip(user.id)}
                                                    className={`px-2 py-1 rounded ${user.vip ? 'bg-green-500' : 'bg-red-500'} text-white`}
                                                >
                                                    {user.vip ? 'VIP' : 'Not VIP'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-2 border-b">{user.vip_code}</td>
                                            <td className="px-4 py-2 border-b">{user.expire_date}</td>
                                            <td className="px-4 py-2 border-b">
                                                <button
                                                    onClick={() => handleToggleIsActive(user.id)}
                                                    className={`px-2 py-1 rounded ${user.isactive ? 'bg-green-500' : 'bg-red-500'} text-white`}
                                                >
                                                    {user.isactive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Useradmin;
