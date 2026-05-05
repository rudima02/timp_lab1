import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const nameRef = useRef(null);
    const typeRef = useRef(null);
    const locationRef = useRef(null);
    const statusRef = useRef(null);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleError = (err) => {
        if (err.response) {
            switch (err.response.status) {
                case 400: setError("Ошибка 400: Неверный запрос к серверу."); break;
                case 404: setError("Ошибка 404: Объект не найден."); break;
                case 500: setError("Ошибка 500: Внутренняя ошибка сервера."); break;
                default: setError(`Ошибка (Код: ${err.response.status})`);
            }
        } else {
            setError("Ошибка сети: Сервер недоступен.");
        }
    };

    useEffect(() => {
        const loadItem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/items/${id}`);
                const data = response.data;
                
                if (nameRef.current) nameRef.current.value = data.name || '';
                if (typeRef.current) typeRef.current.value = data.type || '';
                if (locationRef.current) locationRef.current.value = data.location || '';
                if (statusRef.current) statusRef.current.value = data.status || '';
                
            } catch (err) {
                handleError(err);
            } finally {
                setLoading(false);
            }
        };
        loadItem();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        
        const nameVal = nameRef.current.value.trim();
        const locationVal = locationRef.current.value.trim();
        const typeVal = typeRef.current.value;
        const statusVal = statusRef.current.value;

        if (nameVal.length < 3 || locationVal.length < 3) {
            setError("Ошибка валидации: Название и расположение должны содержать не менее 3 символов.");
            setSaving(false);
            return;
        }

        if (!statusVal || !typeVal) {
            setError("Ошибка валидации: Выберите значения из списков.");
            setSaving(false);
            return;
        }

        const updatedItem = {
            name: nameVal,
            type: typeVal,
            location: locationVal,
            status: statusVal
        };

        try {
            await axios.put(`http://localhost:5000/items/${id}`, updatedItem);
            navigate('/');
        } catch (err) {
            handleError(err);
            setSaving(false);
        }
    };

    if (loading) return <h3 style={{ padding: '30px' }}>Загрузка...</h3>;

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial', maxWidth: '500px', margin: '0 auto' }}>
            <h2>Редактирование (ID: {id})</h2>
            
            {error && <div style={{ padding: '15px', backgroundColor: 'pink', color: 'darkred', marginBottom: '15px' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>Название объекта:
                    <input type="text" ref={nameRef} required style={{ width: '100%', padding: '8px' }} />
                </label>
                
                <label>Тип оборудования:
                    <select ref={typeRef} required style={{ width: '100%', padding: '8px', marginTop: '5px', height: '35px' }}>
                        <option value="">-- Выберите тип --</option>
                        <option value="Подстанция">Подстанция</option>
                        <option value="Трансформатор">Трансформатор</option>
                        <option value="Генератор">Генератор</option>
                        <option value="ЛЭП">ЛЭП</option>
                    </select>
                </label>

                <label>Расположение:
                    <input type="text" ref={locationRef} required style={{ width: '100%', padding: '8px' }} />
                </label>

                <label>Статус:
                    <select ref={statusRef} required style={{ width: '100%', padding: '8px', marginTop: '5px', height: '35px' }}>
                        <option value="">-- Выберите статус --</option>
                        <option value="В норме">В норме</option>
                        <option value="Требует осмотра">Требует осмотра</option>
                        <option value="Критическая ошибка">Критическая ошибка</option>
                        <option value="Отключен">Отключен</option>
                    </select>
                </label>

                <button type="submit" disabled={saving || error?.includes('404')} style={{ padding: '10px', backgroundColor: 'gold', border: 'none' }}>
                    {saving ? 'Обновление...' : 'Обновить данные'}
                </button>
            </form>
            <br/>
            <Link to="/">Отменить и вернуться</Link>
        </div>
    );
};

export default Detail;