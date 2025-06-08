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
            url: "/visualize/data-structures/array",
          },
          {
            title: "Linked List",
            url: "/visualize/data-structures/linked-list",
          },
          {
            title: "Stack",
            url: "/visualize/data-structures/stack",
          },
          {
            title: "Queue",
            url: "/visualize/data-structures/queue",
          },
        ],
      },
      {
        title: "Non-Linear Data Structures",
        items: [
          {
            title: "Tree",
            url: "/visualize/data-structures/tree",
          },
          {
            title: "Graph",
            url: "/visualize/data-structures/graph",
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
