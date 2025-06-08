interface MenuItem {
  title: string;
  url: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

interface SidebarMenuData {
  categories: string[];
  menuItems: Record<string, MenuGroup[]>;
}

export const SIDEBAR_MENU_DATA: SidebarMenuData = {
  categories: ["Data Structures", "Algorithms", "Problems"],
  menuItems: {
    "Data Structures": [
      {
        title: "Linear Data Structures",
        items: [
          {
            title: "Array",
            url: "#",
          },
          {
            title: "Linked List",
            url: "#",
          },
          {
            title: "Stack",
            url: "#",
          },
          {
            title: "Queue",
            url: "#",
          },
        ],
      },
      {
        title: "Non-Linear Data Structures",
        items: [
          {
            title: "Tree",
            url: "#",
          },
          {
            title: "Graph",
            url: "#",
          },
        ],
      },
    ],
    Algorithms: [
      {
        title: "Basic Algorithms",
        items: [
          {
            title: "Sorting",
            url: "#",
          },
          {
            title: "Searching",
            url: "#",
          },
        ],
      },
    ],
    Problems: [
      {
        title: "Practice Platforms",
        items: [
          {
            title: "LeetCode",
            url: "#",
          },
          {
            title: "HackerRank",
            url: "#",
          },
        ],
      },
    ],
  },
};
