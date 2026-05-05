import React from 'react';

const Loader = ({ text = "Загрузка" }) => (
    <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
        <div style={{
            padding: '40px 60px', border: '1px solid lightgray', borderRadius: '10px',
            backgroundColor: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center'
        }}>
            <h2 style={{ color: 'blue', margin: 0, fontFamily: 'Arial' }}>{text}</h2>
            <p style={{ color: 'gray', marginTop: '10px' }}>Связь с сервером...</p>
        </div>
    </div>
);

export default Loader;