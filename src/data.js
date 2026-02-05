const data = {
  profile: {
    name: 'Priyabrata Dutta',
    role: 'Full Stack Developer',
    tagline: 'Technical Lead | AI Enthusiast',
    location: 'Bangalore, India',
    summary:
      'Full Stack Developer with 10+ years in IT and 5.5+ years building end-to-end web applications using React, Node.js, Express, and AWS. Focused on scalable architecture, performance optimization, and leading cross-functional teams to deliver secure, user-focused digital solutions.'
  },
  stats: [
    { label: 'Years of IT Experience', value: '10+' },
    { label: 'Modern Web Experience', value: '5.5+' },
    { label: 'Projects Delivered', value: '100+' }
  ],
  introHighlights: [
    'React and Node.js end-to-end delivery',
    'AWS deployments with CI/CD pipelines',
    'Performance, SEO, and scalability focus',
    'Team leadership and stakeholder alignment'
  ],
  services: [
    {
      title: 'Product Engineering',
      description: 'From MVPs to scale-ready platforms with clean architecture and reliable delivery.'
    },
    {
      title: 'Cloud and DevOps',
      description: 'AWS infrastructure, CI/CD automation, and release strategies built for uptime.'
    },
    {
      title: 'Frontend Systems',
      description: 'Pixel-precise UI with fast load times, accessibility, and SEO-friendly structures.'
    },
    {
      title: 'Technical Leadership',
      description: 'Team mentoring, code reviews, and delivery planning for high-performing teams.'
    }
  ],
  expertiseBars: [
    { label: 'React / Next.js', value: 92 },
    { label: 'Node.js / Express', value: 90 },
    { label: 'AWS / DevOps', value: 82 },
    { label: 'UI/UX + Performance', value: 78 },
    { label: 'Automation + AI', value: 70 }
  ],
  expertiseCards: [
    {
      title: 'End-to-End Ownership',
      points: [
        'Design scalable architecture and data models',
        'Build responsive, accessible UI systems',
        'Ship stable releases with CI/CD automation'
      ]
    },
    {
      title: 'Performance & Security',
      points: [
        'Lazy loading, caching, and core web vitals',
        'Secure API design with monitoring',
        'Reliable AWS-based deployments'
      ]
    },
    {
      title: 'Collaboration & Delivery',
      points: [
        'Lead cross-functional teams in Agile',
        'Translate requirements into milestones',
        'Mentor teams for engineering excellence'
      ]
    }
  ],
  skills: [
    {
      title: 'Frontend',
      items: ['React.js', 'Next.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind']
    },
    {
      title: 'Backend',
      items: ['Node.js', 'Express', 'REST APIs', 'PHP', 'Laravel', 'MySQL']
    },
    {
      title: 'Cloud and DevOps',
      items: ['AWS (EC2, S3, CloudFront)', 'CI/CD Pipelines', 'Docker', 'Git, GitHub']
    },
    {
      title: 'Automation and AI',
      items: ['Generative AI', 'LLM (Beginner)', 'FastAPI (Beginner)', 'N8N', 'Zapier']
    }
  ],
  softSkills: [
    'Team Leadership',
    'Complex Problem Solving',
    'Client Communication',
    'Project Management',
    'Analytical Thinking',
    'Adaptability',
    'Collaboration',
    'Time Management',
    'Strategic Planning'
  ],
  experience: [
    {
      role: 'Technical Lead / Full Stack Developer',
      company: 'Appadd India (P) Ltd',
      location: 'Bangalore, India',
      period: 'Mar 2022 - Present',
      highlights: [
        'Built high-performance web applications using React.js, Next.js, Node.js, and Express.',
        'Designed RESTful APIs and integrated them with dynamic front-end experiences.',
        'Executed AWS-based deployments with a focus on scalability, security, and uptime.',
        'Implemented CI/CD pipelines for automated testing and reliable releases.',
        'Improved performance through optimization, lazy loading, and caching strategies.',
        'Led a team of developers with code reviews, mentoring, and Agile rituals.'
      ]
    },
    {
      role: 'Freelance Full Stack Developer',
      company: 'Graphicx IT',
      location: 'Siliguri, India',
      period: '2020 - 2022',
      highlights: [
        'Delivered 100+ custom websites and web applications using React.js, PHP, and Laravel.',
        'Built responsive, SEO-optimized interfaces with HTML5, CSS3, Tailwind, and JavaScript.',
        'Improved database design and integration with MySQL for security and scalability.',
        'Integrated CMS platforms like WordPress, Joomla, Drupal, and Moodle.',
        'Implemented automation workflows and marketing integrations using Zapier and custom APIs.',
        'Developed a full-featured Laravel web application for a private government body.'
      ]
    },
    {
      role: 'Web Developer / Digital Operations',
      company: 'Uttarbanga Sambad',
      location: 'Siliguri, India',
      period: '2019 - 2020',
      highlights: [
        'Developed and maintained a dynamic news portal with scalable architecture.',
        'Led digital transformation for real-time publishing and media management.',
        'Supervised a 20-member team with workflow automation support.',
        'Managed server optimization and web security measures for data protection.',
        'Oversaw Facebook Live programs and live stream integrations.',
        'Set up ad monetization and analytics platforms for performance tracking.'
      ]
    },
    {
      role: 'Technical Assistant / Web Developer',
      company: 'Surendra Institute of Engineering and Management (SIEM)',
      location: 'Siliguri, India',
      period: '2010 - 2019',
      highlights: [
        'Conducted programming lab sessions in C, C++, Java, VB.NET, and DSA.',
        'Created and maintained the college website and digital marketing campaigns.',
        'Led admission promotion strategies and increased leads and admissions.',
        'Supervised final-year student projects on software design and implementation.',
        'Directed technical workshops on emerging web technologies.',
        'Improved data management and security across labs and digital systems.'
      ]
    }
  ],
  projects: [
    {
      title: 'Performance-First Web Platforms',
      image: '/projects/performance-platform.svg',
      description:
        'Delivered React and Node.js applications with REST APIs, AWS deployments, and performance tuning for scalable delivery.',
      tags: ['React', 'Node.js', 'AWS', 'CI/CD']
    },
    {
      title: 'Digital News Transformation',
      image: '/projects/news-transformation.svg',
      description:
        'Modernized a large news platform with real-time publishing, media management, and monetization analytics.',
      tags: ['Web Platform', 'Analytics', 'Security']
    },
    {
      title: 'Government Web Application',
      image: '/projects/gov-web-app.svg',
      description:
        'Developed a full-featured Laravel web application with secure data handling and custom workflows.',
      tags: ['Laravel', 'MySQL', 'Automation']
    },
    {
      title: 'Education and Admissions Systems',
      image: '/projects/education-admissions.svg',
      description:
        'Built internal platforms, marketing campaigns, and data systems to improve enrollment and outreach.',
      tags: ['EdTech', 'Marketing', 'Automation']
    }
  ],
  education: [
    {
      degree: 'Master of Computer Applications (MCA)',
      institution: 'Siliguri Institute of Technology, Siliguri',
      period: '2022',
      details:
        'Focused on advanced software engineering, web technologies, and cloud computing.'
    },
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'Sikkim Manipal University',
      period: '2011',
      details:
        'Built strong foundations in programming, database management, and software development principles.'
    }
  ],
  certifications: [
    {
      name: 'Cloud Computing (NPTEL)',
      issuer: 'IIT Kharagpur / NPTEL',
      year: '2022',
      detail: 'Score: 69%'
    },
    {
      name: 'AWS Cloud Developer Associate',
      issuer: 'AWS',
      year: 'In Progress',
      detail: ''
    },
    {
      name: 'Full Stack Development and Product Engineering',
      issuer: 'PESTO',
      year: '2024',
      detail: ''
    }
  ],
  contact: {
    phone: '+91 98324 65858 / +91 92392 65858',
    email: 'priyabrata.dutta369@gmail.com',
    location: 'Bangalore, India',
    resumeUrl: '/cv.pdf'
  }
}

export default data
