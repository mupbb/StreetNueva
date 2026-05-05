import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://alberto-social-v2.onrender.com/api";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp', 'linkedin', 'threads', 'meta', 'tiktok'
    const [leads, setLeads] = useState([]);
    const [selectedPhone, setSelectedPhone] = useState(null);
    const [messages, setMessages] = useState([]);
    const [linkedinToday, setLinkedinToday] = useState(null);
    const [metaToday, setMetaToday] = useState(null);
    const [tiktokToday, setTiktokToday] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'whatsapp') {
            fetchLeads();
            const interval = setInterval(fetchLeads, 30000);
            return () => clearInterval(interval);
        } else if (activeTab === 'linkedin') {
            fetchLinkedinData();
        } else if (activeTab === 'meta') {
            fetchMetaData();
        } else if (activeTab === 'tiktok') {
            fetchTiktokData();
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
        } catch (err) { console.error(err); }
    };

    const fetchMetaData = async () => {
        try {
            const res = await axios.get(`${API_URL}/meta/today`);
            setMetaToday(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchTiktokData = async () => {
        try {
            const res = await axios.get(`${API_URL}/tiktok/today`);
            setTiktokToday(res.data);
        } catch (err) { console.error(err); }
    };

    const handlePostNow = async (agent) => {
        const endpoint = agent === 'lucero' ? '/linkedin/post-now' : 
                         agent === 'estela' ? '/meta/post-now' : '/social/post-now';
        if (!window.confirm(`¿Seguro que quieres publicar en ${agent}?`)) return;
        try {
            const res = await axios.post(`${API_URL}${endpoint}`);
            if (res.data.success || !res.data.error) {
                alert("🚀 ¡Publicado con éxito!");
            } else {
                alert("❌ Error: " + (res.data.error || "Fallo en la API"));
            }
        } catch (err) { alert("Error de conexión"); }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#050505', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar Principal */}
            <div style={{ width: '80px', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', py: '20px', borderRight: '1px solid #222' }}>
                <div onClick={() => setActiveTab('whatsapp')} style={{ padding: '20px', cursor: 'pointer', opacity: activeTab === 'whatsapp' ? 1 : 0.4, transition: '0.3s', fontSize: '1.5rem' }}>📱</div>
                <div onClick={() => setActiveTab('linkedin')} style={{ padding: '20px', cursor: 'pointer', opacity: activeTab === 'linkedin' ? 1 : 0.4, transition: '0.3s', fontSize: '1.5rem' }}>💼</div>
                <div onClick={() => setActiveTab('meta')} style={{ padding: '20px', cursor: 'pointer', opacity: activeTab === 'meta' ? 1 : 0.4, transition: '0.3s', fontSize: '1.5rem' }}>📸</div>
                <div onClick={() => setActiveTab('tiktok')} style={{ padding: '20px', cursor: 'pointer', opacity: activeTab === 'tiktok' ? 1 : 0.4, transition: '0.3s', fontSize: '1.5rem' }}>🎵</div>
                <div onClick={() => setActiveTab('threads')} style={{ padding: '20px', cursor: 'pointer', opacity: activeTab === 'threads' ? 1 : 0.4, transition: '0.3s', fontSize: '1.5rem' }}>🧵</div>
            </div>

            {activeTab === 'whatsapp' ? (
                <>
                    {/* Lista de Chats (Alberto) */}
                    <div style={{ width: '350px', borderRight: '1px solid #222', overflowY: 'auto', background: '#0a0a0a' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #222' }}>
                            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#ffd700' }}>Alberto (WhatsApp)</h2>
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
            ) : activeTab === 'linkedin' ? (
                <div style={{ flex: 1, overflowY: 'auto', padding: '40px', background: '#0a0a0a' }}>
                    <h1 style={{ color: '#ffd700' }}>Lucero (LinkedIn)</h1>
                    {linkedinToday && (
                        <div style={{ background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #ffd70033' }}>
                            <h2>Día {linkedinToday.day}: {linkedinToday.type}</h2>
                            <pre style={{ background: '#000', padding: '20px', whiteSpace: 'pre-wrap', color: '#eee' }}>{linkedinToday.content}</pre>
                            <button onClick={() => navigator.clipboard.writeText(linkedinToday.content)}>Copiar</button>
                        </div>
                    )}
                </div>
            ) : activeTab === 'meta' ? (
                <div style={{ flex: 1, overflowY: 'auto', padding: '40px', background: '#0a0a0a' }}>
                    <h1 style={{ color: '#1F6AE1' }}>Estela (Meta FB/IG)</h1>
                    {metaToday && (
                        <div style={{ background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #1F6AE133' }}>
                            <h2>Día {metaToday.day}: {metaToday.platform}</h2>
                            <pre style={{ background: '#000', padding: '20px', whiteSpace: 'pre-wrap', color: '#eee' }}>{metaToday.content}</pre>
                            <button onClick={() => handlePostNow('estela')}>Publicar en Facebook</button>
                        </div>
                    )}
                </div>
            ) : activeTab === 'tiktok' ? (
                <div style={{ flex: 1, overflowY: 'auto', padding: '40px', background: '#0a0a0a' }}>
                    <h1 style={{ color: '#ff0050' }}>Valentina (TikTok)</h1>
                    <p style={{ color: '#888' }}>Enciclopedia del Detallado Automotriz</p>
                    {tiktokToday && (
                        <div style={{ background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #ff005033' }}>
                            <h2 style={{ color: '#ff0050' }}>🎬 Video Hoy: {tiktokToday.service}</h2>
                            <h3 style={{ color: '#fff' }}>Gancho (Hook):</h3>
                            <p style={{ background: '#000', padding: '15px', borderRadius: '10px', color: '#ffd700', fontWeight: 'bold' }}>"{tiktokToday.hook}"</p>
                            <h3>Guion de Explicación:</h3>
                            <p style={{ background: '#000', padding: '15px', borderRadius: '10px', color: '#eee' }}>{tiktokToday.body}</p>
                            <h3>Llamado a la acción (CTA):</h3>
                            <p style={{ color: '#ff0050', fontWeight: 'bold' }}>{tiktokToday.cta}</p>
                            <button style={{ background: '#ff0050', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }} onClick={() => navigator.clipboard.writeText(`${tiktokToday.hook}\n\n${tiktokToday.body}\n\n${tiktokToday.cta}`)}>Copiar Guion Completo</button>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ flex: 1, overflowY: 'auto', padding: '40px', background: '#0a0a0a' }}>
                    <h1 style={{ color: '#fff' }}>Threads Agent 🧵</h1>
                    <button onClick={() => handlePostNow('threads')}>Publicar en Threads AHORA</button>
                </div>
            )}
        </div>
    );
}
