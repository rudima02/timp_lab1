import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchItemById, updateItem, deleteItem } from '../Api';
import Loader from '../components/Loader';
// Добавляем импорты для карты
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

const DetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setLoading(true);
        fetchItemById(id)
            .then(res => {
                setItem(res.data);
                setEditData(res.data);
                setLoading(false);
            })
            .catch(err => {
                if (err.response) {
                    setError(`Ошибка ${err.response.status}: Объект не найден`);
                } else {
                    setError("Ошибка сети: Сервер недоступен");
                }
                setLoading(false);
            });
    }, [id]);

    const validate = () => {
        const newErrors = {};
        if (!editData.name || editData.name.trim() === '') newErrors.name = 'Название обязательно';
        if (!editData.type || editData.type.trim() === '') newErrors.type = 'Укажите тип объекта';
        if (!editData.location || editData.location.trim() === '') newErrors.location = 'Адрес не может быть пустым';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (validate()) { 
            try {
                await updateItem(id, editData);
                setItem(editData);
                setIsEditing(false);
                setErrors({});
            } catch (err) {
                alert(`Ошибка при сохранении данных (Код: ${err.response?.status || 'Сеть'})`);
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Удалить этот объект?")) {
            try {
                await deleteItem(id);
                navigate('/');
            } catch (err) {
                alert(`Ошибка при удалении объекта (Код: ${err.response?.status || 'Сеть'})`);
            }
        }
    };

    if (loading) return <Loader text="Загрузка данных..." />;

    if (error) return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2 style={{ color: 'red' }}>{error}</h2>
            <Link to="/" style={{ fontWeight: 'bold' }}>Вернуться на главную</Link>
        </div>
    );

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '500px', backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid lightgray' }}>
                <h2 style={{ color: 'darkslategray', borderBottom: '2px solid blue', paddingBottom: '10px', marginTop: '0' }}>
                    {isEditing ? 'Редактирование' : item.name}
                </h2>

                <div style={{ marginTop: '20px' }}>
                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label>Название:</label>
                                <input 
                                    value={editData.name} 
                                    onChange={e => setEditData({...editData, name: e.target.value})} 
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errors.name ? '2px solid red' : '1px solid gray' }} 
                                />
                                {errors.name && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.name}</div>}
                            </div>

                            <div>
                                <label>Тип:</label>
                                <input 
                                    value={editData.type} 
                                    onChange={e => setEditData({...editData, type: e.target.value})} 
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errors.type ? '2px solid red' : '1px solid gray' }} 
                                />
                                {errors.type && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.type}</div>}
                            </div>

                            <div>
                                <label>Адрес:</label>
                                <input 
                                    value={editData.location} 
                                    onChange={e => setEditData({...editData, location: e.target.value})} 
                                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: errors.location ? '2px solid red' : '1px solid gray' }} 
                                />
                                {errors.location && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.location}</div>}
                            </div>

                            <label>Статус: 
                                <select 
                                    value={editData.status} 
                                    onChange={e => setEditData({...editData, status: e.target.value})} 
                                    style={{ width: '100%', padding: '8px' }}
                                >
                                    <option value="В норме">В норме</option>
                                    <option value="Требует осмотра">Требует осмотра</option>
                                    <option value="Критическая ошибка">Критическая ошибка</option>
                                </select>
                            </label>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button onClick={handleSave} style={{ backgroundColor: 'green', color: 'white', padding: '12px', border: 'none', flex: '1', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Сохранить</button>
                                <button onClick={() => { setIsEditing(false); setErrors({}); }} style={{ backgroundColor: 'gray', color: 'white', padding: '12px', border: 'none', flex: '1', borderRadius: '5px', cursor: 'pointer' }}>Отмена</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p><strong>Тип:</strong> {item.type}</p>
                            <p><strong>Адрес:</strong> {item.location}</p>
                            <p><strong>Статус:</strong> 
                                <span style={{ color: item.status === 'В норме' ? 'green' : (item.status === 'Требует осмотра' ? 'orange' : 'red'), marginLeft: '10px', fontWeight: 'bold' }}>{item.status}</span>
                            </p>
                            
                            {/* Блок с картой */}
                            {item.coords ? (
                                <div style={{ marginTop: '20px', width: '100%', height: '250px', borderRadius: '8px', overflow: 'hidden', border: '1px solid lightgray' }}>
                                    <YMaps query={{ apikey: '1f34c1cc-ebee-49da-874b-49846a6e7e1e' }}>
                                        <Map 
                                            defaultState={{ center: item.coords, zoom: 15 }} 
                                            width="100%" 
                                            height="100%"
                                        >
                                            <Placemark 
                                                geometry={item.coords} 
                                                properties={{ balloonContent: item.name }} 
                                            />
                                        </Map>
                                    </YMaps>
                                </div>
                            ) : (
                                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'whitesmoke', textAlign: 'center', color: 'gray', borderRadius: '8px' }}>
                                    Координаты для этого объекта не заданы.
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                                <button onClick={() => setIsEditing(true)} style={{ backgroundColor: 'orange', color: 'white', padding: '10px', border: 'none', flex: '1', borderRadius: '5px', cursor: 'pointer' }}>Изменить</button>
                                <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white', padding: '10px', border: 'none', flex: '1', borderRadius: '5px', cursor: 'pointer' }}>Удалить</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '20px' }}>
                <Link to="/" style={{ color: 'blue', textDecoration: 'none', fontWeight: 'bold' }}>Назад к списку</Link>
            </div>
        </div>
    );
};

export default DetailView;