import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Home from './pages/Home';
import DetailView from './pages/DetailView';
import Form from './pages/Form';

const Login = ({ setAuth }) => {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (user === 'admin' && pass === '1234') {
            localStorage.setItem('isAuthenticated', 'true');
            setAuth(true);
            navigate('/');
        } else {
            setError('Неверные учетные данные');
        }
    };

    return (
        <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial' }}>
            <h2>Авторизация</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" placeholder="Логин" value={user} onChange={e => setUser(e.target.value)} style={{ padding: '10px', border: '1px solid silver' }} />
                <input type="password" placeholder="Пароль" value={pass} onChange={e => setPass(e.target.value)} style={{ padding: '10px', border: '1px solid silver' }} />
                <button type="submit" style={{ padding: '12px', backgroundColor: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>Войти</button>
            </form>
        </div>
    );
};

const App = () => {
    const [auth, setAuth] = useState(localStorage.getItem('isAuthenticated') === 'true');

    return (
        <Router>
            <Routes>
                <Route path="/" element={auth ? <Home setAuth={setAuth} /> : <Navigate to="/login" />} />
                <Route path="/items/:id" element={auth ? <DetailView /> : <Navigate to="/login" />} />
                <Route path="/add" element={auth ? <Form /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login setAuth={setAuth} />} />
            </Routes>
        </Router>
    );
};

export default App;