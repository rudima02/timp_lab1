import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import axios from 'axios';

const Form = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [ymaps, setYmaps] = useState(null);
    const [selectedCoords, setSelectedCoords] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        location: '', 
        status: 'В норме',
        coords: '' 
    });

    const getAddress = (coords) => {
        if (!ymaps || !ymaps.geocode) return;

        ymaps.geocode(coords)
            .then((res) => {
                const obj = res.geoObjects.get(0);
                const address = obj ? obj.getAddressLine() : "Адрес не найден";
                setFormData(prev => ({ 
                    ...prev, 
                    location: address,
                    coords: coords.map(c => c.toFixed(6)).join(', ')
                }));
            })
            .catch((err) => {
                console.error("Ошибка Геокодера:", err);
                setFormData(prev => ({ ...prev, location: "Ошибка API (проверьте ключ)" }));
            });
    };

    useEffect(() => {
        if (location.state?.coords && ymaps) {
            setSelectedCoords(location.state.coords);
            getAddress(location.state.coords);
        }
    }, [location, ymaps]);

    const handleMapClick = (e) => {
        const coords = e.get('coords');
        setSelectedCoords(coords);
        setFormData(prev => ({ 
            ...prev, 
            coords: coords.map(c => c.toFixed(6)).join(', ') 
        }));
        getAddress(coords);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const coordsArray = formData.coords.split(',').map(num => parseFloat(num.trim()));
            const newEntry = { 
                ...formData, 
                coords: coordsArray, 
                id: Date.now().toString() 
            };
            await axios.post("http://217.71.129.139:5076/items", newEntry);
            navigate('/');
        } catch (error) {
            alert("Ошибка при сохранении данных");
        }
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
            <Link to="/" style={{ color: 'blue', textDecoration: 'none', fontWeight: 'bold' }}>
                 Назад к списку
            </Link>

            <h2 style={{ color: 'darkslategray', marginTop: '20px' }}>Добавление объекта</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    placeholder="Название" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                    style={{ padding: '10px', border: '1px solid gray', borderRadius: '4px' }}
                />
                
                <input 
                    placeholder="Тип" 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})} 
                    style={{ padding: '10px', border: '1px solid gray', borderRadius: '4px' }}
                />

                {}
                <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    style={{ padding: '10px', border: '1px solid gray', borderRadius: '4px' }}
                >
                    <option value="В норме">В норме</option>
                    <option value="Требует осмотра">Требует осмотра</option>
                    <option value="Критическая ошибка">Критическая ошибка</option>
                </select>

                <input 
                    placeholder="Адрес (выберите на карте)" 
                    value={formData.location} 
                    readOnly 
                    style={{ padding: '10px', backgroundColor: 'whitesmoke', border: '1px solid gray', borderRadius: '4px' }}
                />
                
                <input 
                    placeholder="Координаты" 
                    value={formData.coords} 
                    readOnly 
                    style={{ padding: '10px', backgroundColor: 'whitesmoke', border: '1px solid gray', borderRadius: '4px' }}
                />

                <div style={{ width: '100%', height: '350px', border: '1px solid lightgray', borderRadius: '8px', overflow: 'hidden' }}>
                    <YMaps query={{ apikey: '1f34c1cc-ebee-49da-874b-49846a6e7e1e', load: 'package.full', lang: 'ru_RU' }}>
                        <Map 
                            defaultState={{ center: [54.9924, 82.8315], zoom: 11 }} 
                            width="100%" 
                            height="100%"
                            onClick={handleMapClick}
                            onLoad={(y) => setYmaps(y)}
                            options={{
                                suppressMapOpenBlock: true
                            }}
                            state={selectedCoords ? { center: selectedCoords, zoom: 15 } : undefined}
                            controls={['zoomControl', 'fullscreenControl']}
                        >

                            {selectedCoords && <Placemark geometry={selectedCoords} />}
                        </Map>
                    </YMaps>
                </div>

                <button type="submit" style={{ backgroundColor: 'green', color: 'white', padding: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>
                    Сохранить объект
                </button>
            </form>
        </div>
    );
};

export default Form;