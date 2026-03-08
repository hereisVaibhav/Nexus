import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Activity,
    Calendar,
    Mail,
    Shield,
    ArrowLeft,
    TrendingUp,
    Search,
    UserCheck,
    UserMinus,
    Trash2,
    Zap,
    Menu,
    KeyRound,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ExploreMenu from '../components/ExploreMenu';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, activePlans: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [resetModal, setResetModal] = useState({ open: false, userId: null, userName: '' });
    const [resetPwd, setResetPwd] = useState('');
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState('');
    const navigate = useNavigate();
    const { user: authUser, updateUser } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, statsRes] = await Promise.all([
                fetch('http://localhost:5000/admin/users', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }),
                fetch('http://localhost:5000/admin/stats', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                })
            ]);

            if (usersRes.ok && statsRes.ok) {
                const usersData = await usersRes.json();
                const statsData = await statsRes.json();
                setUsers(usersData);
                setStats(statsData);
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (userId, field, value) => {
        let endpoint = '';
        let method = 'PUT';
        let body = {};

        if (field === 'subscription') {
            endpoint = `/subscription`;
            body = { subscription: value };
        } else if (field === 'status') {
            endpoint = `/status`;
            body = { is_active: value };
        } else if (field === 'role') {
            endpoint = `/role`;
            body = { role: value };
        } else if (field === 'delete') {
            endpoint = ``;
            method = 'DELETE';
        }

        try {
            const res = await fetch(`http://localhost:5000/admin/users/${userId}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: method === 'DELETE' ? null : JSON.stringify(body)
            });

            if (res.ok) {
                if (field === 'delete') {
                    setUsers(users.filter(u => u.id !== userId));
                } else {
                    const updatedUsers = users.map(u => {
                        if (u.id === userId) {
                            if (field === 'status') return { ...u, is_active: value };
                            return { ...u, [field]: value };
                        }
                        return u;
                    });
                    setUsers(updatedUsers);

                    // Update current user if editing self
                    if (authUser && authUser.id === userId) {
                        updateUser({ [field]: value });
                    }
                }
            }
        } catch (err) {
            console.error(`Failed to update user ${field}`, err);
        }
    };

    const openResetModal = (user) => {
        setResetModal({ open: true, userId: user.id, userName: user.full_name });
        setResetPwd('');
        setResetError('');
        setResetSuccess('');
    };

    const closeResetModal = () => {
        setResetModal({ open: false, userId: null, userName: '' });
        setResetPwd('');
        setResetError('');
        setResetSuccess('');
    };

    const handleResetPassword = async () => {
        setResetError('');
        setResetSuccess('');

        const hasLetter = /[a-zA-Z]/.test(resetPwd);
        const hasNumberOrSpecial = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(resetPwd);

        if (resetPwd.length < 6 || !hasLetter || !hasNumberOrSpecial) {
            setResetError('Password must be at least 6 characters and include a mix of letters and numbers or special characters.');
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/admin/users/${resetModal.userId}/reset-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ newPassword: resetPwd })
            });

            const data = await res.json();
            if (res.ok) {
                setResetSuccess(`✅ ${data.message} The user can now log in with the new password.`);
                setResetPwd('');
            } else {
                setResetError(data.message || 'Failed to reset password.');
            }
        } catch (err) {
            setResetError('Network error. Please try again.');
        }
    };

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="ai-loader"></div>
            </div>
        );
    }

    return (
        <div className="section-page" style={{ maxWidth: '1300px', margin: '0 auto', padding: '2rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{ background: 'none', border: 'none', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem', fontWeight: '500' }}
                    >
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>
                    <h1 className="section-title" style={{ margin: 0, fontSize: '2.5rem' }}>Admin Control Center</h1>
                    <p className="section-desc">Manage your growing wellness ecosystem from one place.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '1.25rem 1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '1rem', color: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Shield size={24} color="#818cf8" />
                        </div>
                        <div>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>System Access</span>
                            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Root Admin</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="glass-panel"
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '1px solid #e2e8f0',
                            color: '#4a5568'
                        }}
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </div>

            <ExploreMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <StatCard
                    icon={<Users size={28} />}
                    label="Total Registered"
                    value={stats.totalUsers}
                    color="#6366f1"
                    bg="rgba(99, 102, 241, 0.1)"
                />
                <StatCard
                    icon={<Zap size={28} />}
                    label="Active Plans"
                    value={stats.activePlans}
                    color="#10b981"
                    bg="rgba(16, 185, 129, 0.1)"
                />
                <StatCard
                    icon={<Activity size={28} />}
                    label="System Load"
                    value="Stable"
                    color="#f59e0b"
                    bg="rgba(245, 158, 11, 0.1)"
                />
            </div>

            {/* Users Table */}
            <div className="glass-panel" style={{ borderRadius: '28px', border: '1px solid rgba(255,255,255,0.8)', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a', fontWeight: '800' }}>Registered Users</h3>
                        <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>Showing {filteredUsers.length} total users</p>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Find user by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '0.8rem 1rem 0.8rem 3rem',
                                borderRadius: '14px',
                                border: '1px solid #e2e8f0',
                                width: '380px',
                                outline: 'none',
                                fontSize: '1rem',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                            className="search-input"
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                <th style={thStyle}>User Profile</th>
                                <th style={thStyle}>Contact</th>
                                <th style={thStyle}>Joined</th>
                                <th style={thStyle}>Goal</th>
                                <th style={thStyle}>Plan Tier</th>
                                <th style={thStyle}>Access</th>
                                <th style={thStyle}>Status</th>
                                <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} className="table-row">
                                    <td style={{ padding: '1.5rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '12px',
                                                background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1rem',
                                                fontWeight: '700',
                                                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                                            }}>
                                                {user.full_name?.charAt(0)}
                                            </div>
                                            <span style={{ color: '#1e293b', fontWeight: '700', fontSize: '1.05rem' }}>{user.full_name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem' }}>
                                        <div style={{ color: '#64748b', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Mail size={14} />
                                                {user.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem' }}>
                                        <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                                            {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem' }}>
                                        <span style={{
                                            padding: '0.4rem 0.9rem',
                                            borderRadius: '20px',
                                            background: '#f1f5f9',
                                            color: '#475569',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            border: '1px solid #e2e8f0'
                                        }}>
                                            {user.wellness_goal || 'Not set'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem' }}>
                                        <select
                                            value={user.subscription || 'free'}
                                            onChange={(e) => handleUpdateUser(user.id, 'subscription', e.target.value)}
                                            style={{
                                                padding: '0.4rem 0.75rem',
                                                borderRadius: '10px',
                                                border: '1px solid #e2e8f0',
                                                background: user.subscription === 'paid' ? '#ecfdf5' : 'white',
                                                color: user.subscription === 'paid' ? '#059669' : '#64748b',
                                                fontWeight: '700',
                                                fontSize: '0.85rem',
                                                outline: 'none',
                                                cursor: 'pointer',
                                                appearance: 'none',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <option value="free">Free</option>
                                            <option value="paid">Paid</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem' }}>
                                        <select
                                            value={user.role || 'user'}
                                            onChange={(e) => handleUpdateUser(user.id, 'role', e.target.value)}
                                            style={{
                                                padding: '0.4rem 0.75rem',
                                                borderRadius: '10px',
                                                border: '1px solid #e2e8f0',
                                                background: user.role === 'admin' ? '#fff1f2' : '#f1f5f9',
                                                color: user.role === 'admin' ? '#e11d48' : '#64748b',
                                                fontWeight: '700',
                                                fontSize: '0.85rem',
                                                outline: 'none',
                                                cursor: 'pointer',
                                                appearance: 'none',
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem' }}>
                                        <span style={{
                                            padding: '0.4rem 0.9rem',
                                            borderRadius: '20px',
                                            background: user.is_active ? '#ecfdf5' : '#fff1f2',
                                            color: user.is_active ? '#059669' : '#e11d48',
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                                            <button
                                                onClick={() => handleUpdateUser(user.id, 'status', !user.is_active)}
                                                style={{ border: 'none', background: '#f1f5f9', padding: '0.6rem', borderRadius: '10px', color: '#475569', cursor: 'pointer' }}
                                                title={user.is_active ? "Deactivate" : "Activate"}
                                            >
                                                {user.is_active ? <UserMinus size={18} /> : <UserCheck size={18} />}
                                            </button>
                                            <button
                                                onClick={() => openResetModal(user)}
                                                style={{ border: 'none', background: '#eff6ff', padding: '0.6rem', borderRadius: '10px', color: '#3b82f6', cursor: 'pointer' }}
                                                title="Reset Password"
                                            >
                                                <KeyRound size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete ${user.full_name}?`)) {
                                                        handleUpdateUser(user.id, 'delete');
                                                    }
                                                }}
                                                style={{ border: 'none', background: '#fff1f2', padding: '0.6rem', borderRadius: '10px', color: '#e11d48', cursor: 'pointer' }}
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8' }}>
                            <div style={{ marginBottom: '1rem', opacity: 0.3 }}>
                                <Users size={64} style={{ margin: '0 auto' }} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>No users matched your criteria</h3>
                            <p style={{ margin: '0.5rem 0 0' }}>Try adjusting your search terms.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reset Password Modal */}
            {resetModal.open && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, backdropFilter: 'blur(4px)'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            background: 'white', borderRadius: '24px',
                            padding: '2.5rem', width: '100%', maxWidth: '420px',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.18)', position: 'relative'
                        }}
                    >
                        {/* Close */}
                        <button
                            onClick={closeResetModal}
                            style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f1f5f9', border: 'none', borderRadius: '10px', padding: '0.5rem', cursor: 'pointer', color: '#64748b' }}
                        >
                            <X size={18} />
                        </button>

                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                <KeyRound size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>Reset Password</h3>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                                    For: <strong style={{ color: '#1e293b' }}>{resetModal.userName}</strong>
                                </p>
                            </div>
                        </div>

                        {/* Feedback */}
                        {resetError && (
                            <div style={{ background: '#fff1f2', color: '#e11d48', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.875rem', marginBottom: '1rem', border: '1px solid #fecdd3' }}>
                                {resetError}
                            </div>
                        )}
                        {resetSuccess && (
                            <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.875rem', marginBottom: '1rem', border: '1px solid #bbf7d0' }}>
                                {resetSuccess}
                            </div>
                        )}

                        {/* Password Input */}
                        <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.5rem' }}>
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Min. 6 chars — mix letters & numbers"
                            value={resetPwd}
                            onChange={(e) => setResetPwd(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                            style={{
                                width: '100%', padding: '0.85rem 1rem',
                                borderRadius: '12px', border: '1.5px solid #e2e8f0',
                                fontSize: '1rem', outline: 'none',
                                boxSizing: 'border-box', marginBottom: '0.5rem',
                                transition: 'border-color 0.2s'
                            }}
                        />
                        <p style={{ fontSize: '0.76rem', color: '#94a3b8', marginBottom: '1.75rem', marginTop: 0 }}>
                            🔒 At least 6 characters — mix letters, numbers &amp; special characters
                        </p>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={closeResetModal}
                                style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetPassword}
                                style={{ flex: 2, padding: '0.85rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(59,130,246,0.35)' }}
                            >
                                Reset Password
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

// Helper Components
const StatCard = ({ icon, label, value, color, bg }) => (
    <motion.div
        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
        className="glass-panel"
        style={{ padding: '2.5rem', borderRadius: '32px', display: 'flex', alignItems: 'center', gap: '2rem', transition: 'all 0.3s ease' }}
    >
        <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '22px',
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            boxShadow: `0 8px 20px ${color}15`
        }}>
            {icon}
        </div>
        <div>
            <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: '600' }}>{label}</span>
            <h2 style={{ fontSize: '2.25rem', margin: '0.25rem 0 0', color: '#0f172a', fontWeight: '800' }}>{value}</h2>
        </div>
    </motion.div>
);

const thStyle = {
    padding: '1.25rem 1rem',
    color: '#94a3b8',
    fontWeight: '700',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05rem'
};

export default AdminDashboard;

