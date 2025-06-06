import { Head, usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { SharedData, type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeaderLayout from '@/layouts/header-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    const { auth } = usePage<SharedData>().props;
    return (  
        <>
            {auth.user.role === 'admin' ? (
                <AppLayout breadcrumbs={breadcrumbs}>
                    <Head title="Appearance settings" />

                    <SettingsLayout>
                        <div className="space-y-6">
                            <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                            <AppearanceTabs />
                        </div>
                    </SettingsLayout>
                </AppLayout>
            ):(
                <HeaderLayout breadcrumbs={breadcrumbs}>
                    <Head title="Appearance settings"/>
                    <div className='mt-16'></div>
                    <SettingsLayout>
                        <div className="space-y-6">
                            <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                            <AppearanceTabs />
                        </div>
                    </SettingsLayout>
                </HeaderLayout>
            )}
        </>
        
       
    );
}
