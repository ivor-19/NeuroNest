import HeaderLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface HeaderLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: HeaderLayoutProps) => (
    <HeaderLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        {children}
    </HeaderLayoutTemplate>
);
