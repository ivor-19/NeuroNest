import { AppContent } from '@/components/built-in-shadcn/app-content';
import { AppHeader } from '@/components/header/app-header';
import { AppShell } from '@/components/built-in-shadcn/app-shell';
import { SharedData, type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import { StudentHeader } from '@/components/header/student-header';
import { InstructorHeader } from '@/components/header/instructor-header';


export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { auth } = usePage<SharedData>().props;
    
    return (
        <AppShell>
            { auth.user.role === 'instructor' ? (
                <InstructorHeader />
            ):(
                <StudentHeader />
            )}
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
