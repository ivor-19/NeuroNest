import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ groups = [] }: { groups: Array<{title: string, items: NavItem[]}> }) {
    const page = usePage();
    return (
      <>
        {groups.map((group) => (
          <SidebarGroup className="px-2 py-0" key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
               <SidebarMenuButton
                  asChild
                  isActive={page.url.startsWith(item.href)}
                  tooltip={{ children: item.title }}
                  className={`h-10 flex items-center gap-2 px-3 rounded transition-colors ${
                    page.url.startsWith(item.href)
                      ? 'bg-muted text-primary'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <Link href={item.href} prefetch className="w-full h-full flex items-center gap-2">
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>

                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </>
    );
  }
