import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://alberto-social-v2.onrender.com/api";

export default function AdminDashboard() {
    const [leads, setLeads] = useState([]);
    const [selectedPhone, setSelectedPhone] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
        const interval = setInterval(fetchLeads, 30000); // Refrescar leads cada 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedPhone) {
            fetchMessages(selectedPhone);
            const interval = setInterval(() => fetchMessages(selectedPhone), 5000); // Refrescar chat cada 5s
            return () => clearInterval(interval);
        }
    }, [selectedPhone]);

    const fetchLeads = async () => {
        try {
            const res = await axios.get(`${API_URL}/leads`);
            setLeads(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching leads", err);
        }
    };

    const fetchMessages = async (phone) => {
        try {
            const res = await axios.get(`${API_URL}/conversations?phone=${phone}`);
            // Ordenar por fecha para el chat
            const sorted = res.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            setMessages(sorted);
        } catch (err) {
            console.error("Error fetching messages", err);
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar: Lista de Clientes */}
            <div style={{ width: '350px', borderRight: '1px solid #333', overflowY: 'auto', background: '#111' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#ffd700' }}>Alberto Admin</h2>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Monitoreo en tiempo real</p>
                </div>
                {loading ? <p style={{ padding: '20px' }}>Cargando clientes...</p> : 
                    leads.map(lead => (
                        <div 
                            key={lead.phone} 
                            onClick={() => setSelectedPhone(lead.phone)}
                            style={{ 
                                padding: '15px 20px', 
                                cursor: 'pointer', 
                                borderBottom: '1px solid #222',
                                background: selectedPhone === lead.phone ? '#222' : 'transparent',
                                transition: '0.2s'
                            }}
                        >
                            <div style={{ fontWeight: 'bold' }}>{lead.name || 'Cliente Nuevo'}</div>
                            <div style={{ fontSize: '0.85rem', color: '#888' }}>{lead.phone}</div>
                            <div style={{ fontSize: '0.7rem', marginTop: '5px', color: '#ffd700' }}>{lead.status || 'PROSPECTO'}</div>
                        </div>
                    ))
                }
            </div>

            {/* Main: Chat View */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedPhone ? (
                    <>
                        <div style={{ padding: '20px', background: '#111', borderBottom: '1px solid #333' }}>
                            <h3 style={{ margin: 0 }}>Conversación con {selectedPhone}</h3>
                        </div>
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {messages.map((m, i) => (
                                <div 
                                    key={i} 
                                    style={{ 
                                        alignSelf: m.role === 'user' ? 'flex-start' : 'flex-end',
                                        maxWidth: '70%',
                                        padding: '12px 16px',
                                        borderRadius: '15px',
                                        background: m.role === 'user' ? '#333' : '#ffd700',
                                        color: m.role === 'user' ? '#fff' : '#000',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.4'
                                    }}
                                >
                                    {m.message}
                                    <div style={{ fontSize: '0.65rem', marginTop: '5px', opacity: 0.7, textAlign: 'right' }}>
                                        {new Date(m.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                        <h3>Selecciona un cliente para ver el chat</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
