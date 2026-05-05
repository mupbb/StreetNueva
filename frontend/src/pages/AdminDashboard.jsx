import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://alberto-social-v2.onrender.com/api";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp' o 'linkedin'
    const [leads, setLeads] = useState([]);
    const [selectedPhone, setSelectedPhone] = useState(null);
    const [messages, setMessages] = useState([]);
    const [linkedinToday, setLinkedinToday] = useState(null);
    const [linkedinCalendar, setLinkedinCalendar] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'whatsapp') {
            fetchLeads();
            const interval = setInterval(fetchLeads, 30000);
            return () => clearInterval(interval);
        } else {
            fetchLinkedinData();
        }
    }, [activeTab]);

    useEffect(() => {
        if (selectedPhone && activeTab === 'whatsapp') {
            fetchMessages(selectedPhone);
            const interval = setInterval(() => fetchMessages(selectedPhone), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedPhone, activeTab]);

    const fetchLeads = async () => {
        try {
            const res = await axios.get(`${API_URL}/leads`);
            setLeads(res.data);
            setLoading(false);
        } catch (err) { console.error(err); }
    };

    const fetchMessages = async (phone) => {
        try {
            const res = await axios.get(`${API_URL}/conversations?phone=${phone}`);
            const sorted = res.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            setMessages(sorted);
        } catch (err) { console.error(err); }
    };

    const fetchLinkedinData = async () => {
        try {
            const resToday = await axios.get(`${API_URL}/linkedin/today`);
            setLinkedinToday(resToday.data);
            const resCal = await axios.get(`${API_URL}/linkedin/calendar`);
            setLinkedinCalendar(resCal.data);
        } catch (err) { console.error(err); }
    };

    const handlePostNow = async () => {
        if (!window.confirm("¿Seguro que quieres publicar esto en LinkedIn ahora mismo?")) return;
        try {
            const res = await axios.post(`${API_URL}/linkedin/post-now`);
            if (res.data.success) {
                alert("🚀 ¡Publicado con éxito!");
            } else {
                alert("❌ Error: " + res.data.error);
            }
        } catch (err) { alert("Error de conexión"); }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#050505', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar Principal */}
            <div style={{ width: '80px', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', py: '20px', borderRight: '1px solid #222' }}>
                <div 
                    onClick={() => setActiveTab('whatsapp')}
                    style={{ padding: '15px', cursor: 'pointer', opacity: activeTab === 'whatsapp' ? 1 : 0.4, transition: '0.3s' }}
                >
                    📱
                </div>
                <div 
                    onClick={() => setActiveTab('linkedin')}
                    style={{ padding: '15px', cursor: 'pointer', opacity: activeTab === 'linkedin' ? 1 : 0.4, transition: '0.3s' }}
                >
                    💼
                </div>
            </div>

            {activeTab === 'whatsapp' ? (
                <>
                    {/* Lista de Chats (Alberto) */}
                    <div style={{ width: '350px', borderRight: '1px solid #222', overflowY: 'auto', background: '#0a0a0a' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #222' }}>
                            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#ffd700' }}>Alberto (WhatsApp)</h2>
                            <p style={{ fontSize: '0.75rem', color: '#888' }}>Atención al Cliente AI</p>
                        </div>
                        {loading ? <p style={{ padding: '20px' }}>Cargando...</p> : 
                            leads.map(lead => (
                                <div key={lead.phone} onClick={() => setSelectedPhone(lead.phone)}
                                    style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #111', background: selectedPhone === lead.phone ? '#1a1a1a' : 'transparent' }}>
                                    <div style={{ fontWeight: 'bold' }}>{lead.name || 'Cliente Nuevo'}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#ffd700' }}>{lead.phone}</div>
                                </div>
                            ))
                        }
                    </div>
                    {/* Chat View */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#080808' }}>
                        {selectedPhone ? (
                            <>
                                <div style={{ padding: '20px', borderBottom: '1px solid #222' }}><h3>Chat: {selectedPhone}</h3></div>
                                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {messages.map((m, i) => (
                                        <div key={i} style={{ 
                                            alignSelf: m.role === 'user' ? 'flex-start' : 'flex-end',
                                            padding: '12px 16px', borderRadius: '15px',
                                            background: m.role === 'user' ? '#222' : '#ffd700',
                                            color: m.role === 'user' ? '#fff' : '#000', maxWidth: '70%'
                                        }}>{m.message}</div>
                                    ))}
                                </div>
                            </>
                        ) : <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}><h3>Selecciona un chat</h3></div>}
                    </div>
                </>
            ) : (
                <div style={{ flex: 1, overflowY: 'auto', padding: '40px', background: '#0a0a0a' }}>
                    <h1 style={{ color: '#ffd700', marginBottom: '10px' }}>Lucero (LinkedIn)</h1>
                    <p style={{ color: '#888', marginBottom: '30px' }}>Estrategia de 30 Días - Street Prime Detail</p>
                    
                    {linkedinToday && (
                        <div style={{ background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #ffd70033', marginBottom: '40px' }}>
                            <h2 style={{ color: '#ffd700', marginTop: 0 }}>📅 Post para Hoy (Día {linkedinToday.day})</h2>
                            <p style={{ fontSize: '0.9rem', color: '#888' }}>Visual sugerido: {linkedinToday.visual}</p>
                            <pre style={{ 
                                background: '#000', padding: '20px', borderRadius: '10px', 
                                whiteSpace: 'pre-wrap', color: '#eee', lineHeight: '1.6',
                                border: '1px solid #222'
                            }}>{linkedinToday.content}</pre>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button style={{ 
                                    background: '#ffd700', color: '#000', border: 'none', 
                                    padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold',
                                    cursor: 'pointer'
                                }} onClick={() => navigator.clipboard.writeText(linkedinToday.content)}>Copiar Contenido</button>
                                
                                <button style={{ 
                                    background: '#0077b5', color: '#fff', border: 'none', 
                                    padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold',
                                    cursor: 'pointer'
                                }} onClick={handlePostNow}>🚀 Publicar en LinkedIn</button>
                            </div>
                        </div>
                    )}

                    <h3 style={{ borderBottom: '1px solid #222', paddingBottom: '10px' }}>Calendario Editorial</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
                        {linkedinCalendar.map(p => (
                            <div key={p.day} style={{ background: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #222' }}>
                                <div style={{ color: '#ffd700', fontWeight: 'bold' }}>Día {p.day}</div>
                                <div style={{ fontSize: '0.8rem', color: '#888' }}>{p.type}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
