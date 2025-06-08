"use client";

import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { CategorySwitcher } from "@/components/category-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { SIDEBAR_MENU_DATA } from "@/app/constants";

type Category = (typeof SIDEBAR_MENU_DATA.categories)[number];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [selectedCategory, setSelectedCategory] = React.useState<Category>(
    SIDEBAR_MENU_DATA.categories[0]
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <CategorySwitcher
          categories={SIDEBAR_MENU_DATA.categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {SIDEBAR_MENU_DATA.menuItems[selectedCategory].map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
