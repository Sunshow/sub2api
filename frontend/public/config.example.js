// Example runtime configuration for testing custom menu items
// Copy this to config.js and modify for local development testing
window.__CUSTOM_CONFIG__ = {
  customMenuItems: [
    {
      label: "文档中心",
      labelEn: "Documentation",
      url: "https://docs.example.com",
      icon: "book",
      target: "_blank",
      position: "both"
    },
    {
      label: "帮助中心",
      labelEn: "Help Center",
      url: "https://help.example.com",
      icon: "question",
      target: "_blank",
      position: "user"
    },
    {
      label: "管理员手册",
      labelEn: "Admin Manual",
      url: "https://admin.example.com",
      icon: "settings",
      target: "_blank",
      position: "admin"
    },
    {
      label: "社区论坛",
      labelEn: "Community",
      url: "https://community.example.com",
      icon: "home",
      target: "_blank",
      position: "both"
    }
  ]
};
