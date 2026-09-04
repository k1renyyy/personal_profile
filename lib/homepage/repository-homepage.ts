import type {HomepageViewModel} from "./types";

export const repositoryHomepage: HomepageViewModel = {
  marquee: {
    primaryLines: ["Web Dev", "App Dev"],
    secondaryLines: ["UI", "Systems"],
  },
  about: {
    title: "个人介绍",
    label: "About",
    paragraphs: [
      "Full-Stack Developer with a BS in Information Technology, experienced in building scalable web applications using React, TypeScript, Next.js, Laravel, and Node.js. Skilled in RESTful APIs, MySQL, and responsive user interfaces.",
      "Led mobile development for an award-winning real-time flood monitoring system (Best Research Paper 2025). Experienced in full-stack development for enterprise and healthcare applications, building dashboards, analytics, and role-based systems.",
      "Passionate about clean code, problem-solving, and collaboration, with a focus on delivering high-performance, user-centered applications.",
    ],
    photos: [],
  },
  experiences: [
    {id: "company-one", company: "Company One", role: "Role One", dateRange: "20XX — Present", highlights: ["Placeholder achievement describing a representative responsibility.", "Placeholder achievement demonstrating a measurable contribution.", "Placeholder achievement showing collaboration and decision support."]},
    {id: "company-two", company: "Company Two", role: "Role Two With a Longer Title", dateRange: "20XX — 20XX", highlights: ["Placeholder achievement covering research and synthesis.", "Placeholder achievement covering planning and prioritization.", "Placeholder achievement covering delivery and review.", "Placeholder achievement covering an additional outcome."]},
    {id: "company-three", company: "Company Three", role: "Role Three", dateRange: "20XX — 20XX", highlights: ["Placeholder achievement for the third experience.", "Placeholder achievement confirming variable list length."]},
  ],
  experienceTitle: "工作经历",
  experienceLabel: "Experience",
  projects: {
    title: "项目经历",
    label: "Project",
    intro: "Websites where scroll, motion, and interaction feel intentional. The details most teams skip are the details we care about most.",
    items: ["North", "East", "South", "West"].map((direction) => ({
      id: `project-${direction.toLowerCase()}`,
      title: `Project ${direction}`,
      type: "Project type TBD",
      role: "Role TBD",
      summary: `A neutral Project ${direction} placeholder for the future overview and its essential context.`,
      outcomes: ["Outcome placeholder 01", "Outcome placeholder 02", "Outcome placeholder 03"],
      capabilities: ["Capability 01", "Capability 02", "Capability 03"],
    })),
  },
  skillTickerItems: ["React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Express.js", "Python", "PostgreSQL", "MongoDB", "Tailwind CSS", "GSAP", "Three.js", "Git", "Docker", "AWS", "GraphQL", "Redis", "HTML5", "CSS3", "Laravel", "PHP", "MySQL"],
  testimonials: {
    title: "What People Say",
    intro: "Testimonials",
    items: [1, 2, 3, 4].map((number) => ({
      id: `testimonial-${number}`,
      name: `Name Placeholder 0${number}`,
      company: "Company Placeholder",
      content: "Testimonial placeholder — Kiren's verified recommendation will be added here.",
      initials: `0${number}`,
    })),
  },
};
