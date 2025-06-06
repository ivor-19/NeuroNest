import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { SharedData, type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import { StudentSidebar } from '@/components/sidebar/student-sidebar';
import { usePage } from '@inertiajs/react';
import { TeacherSidebar } from '@/components/sidebar/teacher-sidebar';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { auth } = usePage<SharedData>().props;
    
    return (
        <AppShell variant="sidebar">
            {auth.user.role === 'admin' ? (
                <AppSidebar />
            ):(
                <div>Unauthorized access</div>
            )}
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
