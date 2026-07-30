export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string; // references Lucide icon key
}

export interface Stat {
  value: string;
  label: string;
}

export interface Translation {
  title: string;
  subtitle: string;
  bio: string;
  stats: {
    years: string;
    projects: string;
    clients: string;
    coffee: string;
  };
  sections: {
    skills: string;
    projects: string;
    services: string;
    console: string;
    quickActions: string;
  };
  projects: {
    ecommerce: { title: string; desc: string };
    portfolio: { title: string; desc: string };
    taskApp: { title: string; desc: string };
  };
  servicesList: {
    webDev: { title: string; desc: string };
    design: { title: string; desc: string };
    bugFixes: { title: string; desc: string };
    serverSide: { title: string; desc: string };
    appDev: { title: string; desc: string };
    codeProtection: { title: string; desc: string };
    siteProtection: { title: string; desc: string };
  };
  console: {
    placeholder: string;
    welcome: string;
    helpText: string;
    notFound: string;
    cleared: string;
  };
  buttons: {
    copyEmail: string;
    copied: string;
    email: string;
    telegram: string;
    vk: string;
    donate: string;
    reboot: string;
    themeLight: string;
    themeDark: string;
  };
}
