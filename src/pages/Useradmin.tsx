import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../assets/apiurl';

interface UserInfo {
    id: number;
    username: string;
    email: string;
    age: number;
}

interface ActivationCodeInfo {
    code: string;
    isActive: boolean;
}

const App: React.FC = () => {
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
                setActivationCodes(result.codes);
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

    return (
        <div className="container mx-auto p-4">
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>
            {error && <div className="text-red-500">{error}</div>}
            {userInfo.length > 0 && (
                <div className="mb-4">
                    <label className="block text-gray-700">Search by Username:</label>
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
            )}
            {filteredUsers.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">User Information</h2>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">Username</th>
                                <th className="px-4 py-2 border-b">Email</th>
                                <th className="px-4 py-2 border-b">Age</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-4 py-2 border-b">{user.username}</td>
                                    <td className="px-4 py-2 border-b">{user.email}</td>
                                    <td className="px-4 py-2 border-b">{user.age}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {activationCodes.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Activation Codes</h2>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">Code</th>
                                <th className="px-4 py-2 border-b">Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activationCodes.map((code, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 border-b">{code.code}</td>
                                    <td className="px-4 py-2 border-b">{code.isActive ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default App;
