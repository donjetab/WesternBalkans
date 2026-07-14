export const navItems = [
  { label: "Home", to: "/" },
  {
    label: "About",
    items: [
      { label: "Project Overview", to: "/overview" },
      { label: "Project Partners", to: "/partners" },
      { label: "Management Structure", to: "/management" },
      { label: "Objectives and Target Groups", to: "/objectives" },
      { label: "Expected Outcomes", to: "/outcomes" }
    ]
  },
  {
    label: "Activities",
    items: [
      { label: "Work Packages", to: "/work-packages" },
      { label: "Deliverables", to: "/deliverables" },
      { label: "Milestones", to: "/milestones" },
      { label: "Events", to: "/events" },
      { label: "Courses", to: "/courses" }
    ]
  },
  {
    label: "Resources",
    items: [
      { label: "Project Documents", to: "/documents" },
      { label: "Downloadable Documents", to: "/downloads" },
      { label: "Case Studies and Reports", to: "/case-studies" }
    ]
  },
  { label: "News", to: "/news" }
];
