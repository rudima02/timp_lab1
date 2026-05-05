import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Form = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', type: '', location: '', status: 'В норме' });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Введите название';
        if (!formData.location.trim()) newErrors.location = 'Введите адрес';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const newObject = { ...formData, id: Date.now().toString() };
                await axios.post("http://localhost:5000/items", newObject);
                navigate('/');
            } catch (err) {
                alert("Ошибка при сохранении объекта на сервере");
            }
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '450px', 
                backgroundColor: 'white', 
                padding: '30px', 
                borderRadius: '15px', 
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)', 
                border: '1px solid lightgray' 
            }}>
                <h2 style={{ color: 'darkslategray', borderBottom: '2px solid blue', paddingBottom: '10px', marginTop: '0', textAlign: 'center' }}>
                    Новый энергообъект
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    
                    <div>
                        <input 
                            placeholder="Название" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '5px', border: errors.name ? '2px solid red' : '1px solid silver' }} 
                        />
                        {errors.name && <div style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{errors.name}</div>}
                    </div>

                    <div>
                        <input 
                            placeholder="Тип" 
                            value={formData.type} 
                            onChange={e => setFormData({...formData, type: e.target.value})} 
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '5px', border: '1px solid silver' }} 
                        />
                    </div>

                    <div>
                        <input 
                            placeholder="Адрес" 
                            value={formData.location} 
                            onChange={e => setFormData({...formData, location: e.target.value})} 
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '5px', border: errors.location ? '2px solid red' : '1px solid silver' }} 
                        />
                        {errors.location && <div style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{errors.location}</div>}
                    </div>

                    <select 
                        value={formData.status} 
                        onChange={e => setFormData({...formData, status: e.target.value})} 
                        style={{ width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '5px', border: '1px solid silver', backgroundColor: 'whitesmoke' }}
                    >
                        <option value="В норме">В норме</option>
                        <option value="Требует осмотра">Требует осмотра</option>
                        <option value="Критическая ошибка">Критическая ошибка</option>
                    </select>

                    <button type="submit" style={{ width: '100%', boxSizing: 'border-box', padding: '12px', backgroundColor: 'mediumseagreen', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                        Сохранить объект
                    </button>
                    
                    <Link to="/" style={{ textAlign: 'center', color: 'gray', marginTop: '5px' }}>Отмена</Link>
                </form>
            </div>
        </div>
    );
};

export default Form;