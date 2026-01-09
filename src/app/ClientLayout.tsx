'use client';

import { ReduxProvider } from "@/presentation/store/provider";
import { Sidebar, BottomNav, FloatingActionButton } from "@/presentation/components/layout/Navigation";
import { QuickLogModal } from "@/presentation/features/quick-log/QuickLogModal";
import { AuthGuard } from "@/presentation/components/auth/AuthGuard";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFoodEntry } from "@/presentation/store/slices/foodEntriesSlice";
import { RootState } from "@/presentation/store/store";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    return (
        <ReduxProvider>
            {isLoginPage ? (
                children
            ) : (
                <AuthGuard>
                    <LayoutContent isQuickLogOpen={isQuickLogOpen} setIsQuickLogOpen={setIsQuickLogOpen}>
                        {children}
                    </LayoutContent>
                </AuthGuard>
            )}
        </ReduxProvider>
    );
}

function LayoutContent({
    children,
    isQuickLogOpen,
    setIsQuickLogOpen
}: {
    children: React.ReactNode;
    isQuickLogOpen: boolean;
    setIsQuickLogOpen: (val: boolean) => void;
}) {
    const { isSidebarCollapsed } = useSelector((state: RootState) => state.ui);

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main
                className="main-content"
                style={{
                    flex: 1,
                    padding: 'var(--space-8)',
                    marginLeft: isSidebarCollapsed ? '80px' : '240px',
                    transition: 'margin-left var(--transition-normal)',
                    paddingBottom: '80px'
                }}
            >
                <div className="container max-w-4xl">
                    {children}
                </div>
            </main>
            <FloatingActionButton onClick={() => setIsQuickLogOpen(true)} />
            <BottomNav />
            <LayoutModalManager isOpen={isQuickLogOpen} onClose={() => setIsQuickLogOpen(false)} />
        </div>
    );
}

function LayoutModalManager({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const dispatch = useDispatch();
    return (
        <QuickLogModal
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={(entry) => dispatch(addFoodEntry(entry))}
        />
    );
}
