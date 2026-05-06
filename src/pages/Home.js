import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchItems } from '../Api';
import Loader from '../components/Loader';

const Home = ({ setAuth }) => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorInfo, setErrorInfo] = useState(null);
    
    const [showPopup, setShowPopup] = useState(true); 
    const [popupPos, setPopupPos] = useState({ top: '10%', left: '70%' });
    const [isVirusActive, setIsVirusActive] = useState(true); 

    useEffect(() => {
        setLoading(true);
        fetchItems()
            .then(res => {
                setItems(res.data);
                setLoading(false);
            })
            .catch(err => {
                setErrorInfo({
                    status: err.response ? err.response.status : '503',
                    message: err.response ? err.response.statusText : 'Сервер недоступен'
                });
                setLoading(false);
            });
    }, []);

    const getRandomPosition = () => {
        if (!isVirusActive) return;

        const randomTop = Math.floor(Math.random() * 60) + '%';
        const randomLeft = Math.floor(Math.random() * 60) + '%';
        setPopupPos({ top: randomTop, left: randomLeft });
        setShowPopup(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        setAuth(false);
        navigate('/login');
    };

    const removeViruses = () => {
        setIsVirusActive(false);
        setShowPopup(false);
    };

    if (loading) return <Loader text="Загрузка реестра..." />;

    if (errorInfo) return (
        <div style={{ padding: '50px', textAlign: 'center', backgroundColor: 'mistyrose', border: '2px solid red', margin: '20px', borderRadius: '10px' }}>
            <h2 style={{ color: 'red' }}>Ошибка запроса</h2>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Код состояния: {errorInfo.status}</p>
            <p>Описание: {errorInfo.message}</p>
            <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', cursor: 'pointer' }}>Попробовать снова</button>
        </div>
    );

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Реестр энергообъектов</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {isVirusActive && (
                        <button 
                            onClick={removeViruses} 
                            style={{ backgroundColor: 'orange', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Убрать вирусы
                        </button>
                    )}
                    <button onClick={handleLogout} style={{ backgroundColor: 'crimson', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>Выход</button>
                </div>
            </div>
            
            <Link to="/add" style={{ display: 'inline-block', margin: '20px 0', padding: '12px 20px', backgroundColor: 'mediumseagreen', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>+ Добавить объект</Link>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>
                {items.map(item => (
                    <div key={item.id} style={{ 
                        padding: '15px 20px', border: '1px solid lightgray', marginBottom: '10px', borderRadius: '8px', 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '600px', backgroundColor: 'white'
                    }}>
                        <div>
                            <strong>{item.name}</strong> –{' '}
                            <span style={{ 
                                fontWeight: 'bold',
                                color: item.status === 'В норме' ? 'seagreen' : item.status === 'Требует осмотра' ? 'orange' : item.status === 'Критическая ошибка' ? 'crimson' : 'dimgray'
                            }}>
                                {item.status}
                            </span>
                        </div>
                        <Link to={`/items/${item.id}`} style={{ color: 'blue', textDecoration: 'underline' }}>Детали</Link>
                    </div>
                ))}
            </div>

            {isVirusActive && showPopup && (
                <div style={{
                    position: 'fixed', top: popupPos.top, left: popupPos.left, backgroundColor: 'white', padding: '15px', borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', transition: 'all 0.4s ease'
                }}>
                    <button 
                        onClick={() => {
                            setShowPopup(false);
                            setTimeout(getRandomPosition, 100);
                        }} 
                        style={{
                            background: 'crimson', border: 'none', borderRadius: '50%', width: '30px', height: '30px',
                            color: 'white', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        ✕
                    </button>
                    <img 
                        src="/max.png" 
                        alt="Полезная информация" 
                        style={{ width: '300px', height: 'auto', borderRadius: '10px' }}
                    />
                </div>
            )}
        </div>
    );
};

export default Home;