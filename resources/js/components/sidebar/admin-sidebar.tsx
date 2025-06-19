// components/sidebar/admin-sidebar.tsx
import * as React from "react";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Mail,
  MessageSquare,
  UserPlus,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link } from "@inertiajs/react";
import AppLogo from "../built-in-shadcn/app-logo";
import { NavUser } from "../built-in-shadcn/nav-user";
import { NavMain } from "../built-in-shadcn/nav-main";

const data = {
  navMain: [
    {
      title: "OVERVIEW",
      items: [
        {
          title: "Dashboard",
          href: "/admin/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "SETUP",
      items: [
        {
          title: "Add Users",
          href: "/admin/manage-users",
          icon: UserPlus,
        },
        {
          title: "Courses & Curriculum",
          href: "/admin/manage-courses",
          icon: BookOpen,
        },
        {
          title: "Subject Modules",
          href: "/admin/manage-subjects",
          icon: Layers,
        },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        {
          title: "Student & Sections",
          href: "/admin/manage-students",
          icon: Users,
        },
        {
          title: "Instructors",
          href: "/admin/manage-instructors",
          icon: GraduationCap,
        },
        {
          title: "Class Schedules",
          href: "#",
          icon: Calendar,
        },
      ],
    },
    {
      title: "OPERATIONS",
      items: [
        {
          title: "Assignments & Quizzes",
          href: "#",
          icon: ClipboardList,
        },
        {
          title: "Messages",
          href: "#",
          icon: MessageSquare,
        },
        {
          title: "Contact Us",
          href: "/admin/contactus",
          icon: Mail,
        },
      ],
    },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <NavMain groups={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
