'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Clock, BarChart3, Settings, Plus, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleSidebarCollapse } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { authService } from '@/infrastructure/firebase/auth';
import { useTranslation } from '@/shared/i18n/useTranslation';
import styles from './Navigation.module.css';

export const Sidebar = () => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { sidebarOpen, isSidebarCollapsed } = useSelector((state: RootState) => state.ui);
    
    const navItems = [
        { icon: LayoutDashboard, label: t.nav.dashboard, href: '/' },
        { icon: CheckSquare, label: t.nav.diet, href: '/diet' },
        { icon: Clock, label: t.nav.timeline, href: '/timeline' },
        { icon: BarChart3, label: t.nav.insights, href: '/insights' },
        { icon: Settings, label: t.nav.settings, href: '/settings' },
    ];

    if (!sidebarOpen) return null;

    return (
        <aside
            className={`sidebar ${isSidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
        >
            <div className={styles.sidebarHeader}>
                {!isSidebarCollapsed && (
                    <h1 className={styles.sidebarLogo}>
                        VitaLog
                    </h1>
                )}
                <button
                    onClick={() => dispatch(toggleSidebarCollapse())}
                    className={styles.sidebarToggle}
                >
                    {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className={styles.sidebarNav}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''} ${isSidebarCollapsed ? styles.collapsed : ''}`}
                        >
                            <div className={styles.navIconWrapper}>
                                <item.icon 
                                    size={20} 
                                    color={isActive ? 'var(--primary)' : 'var(--text-muted)'}
                                />
                            </div>
                            {!isSidebarCollapsed && (
                                <span className={styles.navLabel}>
                                    {item.label}
                                </span>
                            )}

                            {isSidebarCollapsed && (
                                <div className={styles.tooltip}>
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.sidebarFooter}>
                <div className={styles.sidebarStatus}>
                    <p className={styles.statusLabel}>{isSidebarCollapsed ? 'v0.1' : 'Status'}</p>
                    {!isSidebarCollapsed && <p className={styles.statusValue}>v0.1.0 MVP</p>}
                </div>
                <LogoutButton isCollapsed={isSidebarCollapsed} />
            </div>

        </aside>
    );
};

const LogoutButton = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        try {
            await authService.signOut();
            dispatch(logout());
            router.push('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    if (!user) return null;

    return (
        <button
            onClick={handleLogout}
            className={`${styles.logoutButton} ${isCollapsed ? styles.collapsed : ''}`}
            title="Sair"
        >
            <div className={styles.navIconWrapper}>
                <LogOut size={20} color="var(--text-muted)" />
            </div>
            {!isCollapsed && (
                <span className={styles.navLabel}>Sair</span>
            )}
        </button>
    );
};

export const BottomNav = () => {
    const { t } = useTranslation();
    const pathname = usePathname();
    
    const navItems = [
        { icon: LayoutDashboard, label: t.nav.dashboard, href: '/' },
        { icon: CheckSquare, label: t.nav.diet, href: '/diet' },
        { icon: Clock, label: t.nav.timeline, href: '/timeline' },
        { icon: BarChart3, label: t.nav.insights, href: '/insights' },
        { icon: Settings, label: t.nav.settings, href: '/settings' },
    ];

    return (
        <nav className={styles.bottomNavMobile}>
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.bottomNavLink} ${isActive ? styles.bottomNavLinkActive : styles.bottomNavLinkInactive}`}
                    >
                        <item.icon size={20} />
                        <span className={styles.bottomNavLabel}>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export const FloatingActionButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            onClick={onClick}
            className={`btn btn-primary ${styles.floatingActionButton}`}
            aria-label="Quick Log"
        >
            <Plus size={24} />
        </button>
    );
};
