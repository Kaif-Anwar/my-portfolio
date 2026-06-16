import type { Experience, Project, Profile, SkillGroup } from "@/lib/types/project";

export const PROFILE: Profile = {
  name: "Kaif Anwar",
  title: "Software Engineer | AI/ML & Full-Stack",
  location: "Islamabad, Pakistan",
  email: "kaifanwer101@gmail.com",
  phone: "+92 302 4730032",
  linkedin: "https://linkedin.com/in/kaif-anwar-1199132a7",
  github: "https://github.com/Kaif-Anwar",
  education: {
    degree: "Bachelor of Science in Software Engineering",
    school: "FAST National University of Computer and Emerging Sciences (NUCES), Islamabad",
    expected: "Spring 2026",
  },
  bio: "Software engineering student at FAST-NUCES with hands-on experience across AI/ML systems, MERN full-stack applications, and interactive 3D simulations. I build production-minded software — from RAG pipelines and agentic code generation to secure voting platforms and Unity safety simulations.",
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Languages",
    items: ["JavaScript", "Python", "C++", "Java", "C#", "SQL"],
  },
  {
    category: "AI / ML",
    items: ["LLMs", "RAG Pipelines", "Prompt Engineering", "NLP", "PyTorch", "TensorFlow", "LangGraph"],
  },
  {
    category: "Frontend",
    items: ["React.js", "Redux", "HTML5", "CSS3", "Bootstrap", "Responsive Design"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "Flask", "RESTful APIs", "Microservices"],
  },
  {
    category: "Databases",
    items: ["MongoDB", "PostgreSQL", "SQL Server", "FAISS"],
  },
  {
    category: "DevOps & Tools",
    items: ["Docker", "Git", "GitHub", "Postman", "VS Code", "Agile/Scrum"],
  },
];

export const EXPERIENCES: Experience[] = [
  {
    title: "Executive Member",
    organization: "Software Engineering Society (SES), FAST-NUCES",
    period: "2024 – 2025",
    bullets: [
      "Planned and ran technical workshops, hackathons, and industry seminars to strengthen the engineering community.",
      "Coordinated with faculty and external speakers to bring practical, industry-relevant content to students.",
    ],
  },
];

export const CONTACT_CONTENT = {
  heading: "Let's build something",
  message:
    "Open to internships, collaborations, and interesting engineering challenges in AI/ML and full-stack development.",
};

export const SEED_PROJECTS: Omit<Project, "id" | "created_at" | "updated_at">[] = [
  {
    title: "Online Voting System Pakistan",
    slug: "online-voting-system-pakistan",
    short_description:
      "Secure digital voting portal modelled on Pakistan's National Assembly structure with RBAC and CNIC verification.",
    long_description:
      "Built a secure digital voting portal modelled on Pakistan's National Assembly structure, handling complex seat-to-polling-station relationships across multiple regions. Designed a three-tier RBAC system (Super Admin, Admin, Voter) with Redux managing global state. Enforced one-vote-per-person logic via CNIC verification and tightened MongoDB schemas to eliminate duplicate voter records.",
    tech_stack: ["MERN Stack", "Redux", "REST API", "MongoDB"],
    github_url: null,
    live_url: null,
    featured: true,
    sort_order: 1,
    status: "published",
    images: [],
    video_url: null,
    start_date: "2026-01-01",
    end_date: null,
  },
  {
    title: "Iterative AI Code Generation Engine",
    slug: "iterative-ai-code-generation-engine",
    short_description:
      "Agentic Generate–Evaluate–Refine loop that autonomously improves LLM-generated code across iterations.",
    long_description:
      "Architected an AI backend using microservices, deploying each service in a dedicated Docker container. Wrote a Flask REST API that handles async client requests and routes them to third-party LLM providers. Implemented a Generate–Evaluate–Refine loop that lets the system self-correct code output across configurable iterations without manual input.",
    tech_stack: ["Python", "Flask", "LangGraph", "Docker", "Google Gemini API"],
    github_url: null,
    live_url: null,
    featured: true,
    sort_order: 2,
    status: "published",
    images: [],
    video_url: null,
    start_date: "2025-09-01",
    end_date: "2025-12-01",
  },
  {
    title: "FYP Handbook Assistant",
    slug: "fyp-handbook-assistant",
    short_description:
      "RAG system that returns page-cited answers from university policy documents using Sentence-BERT and FAISS.",
    long_description:
      "Built a RAG system that encodes university policy documents into a FAISS vector store using Sentence-BERT embeddings. Chunked and indexed the FYP Handbook so queries return page-cited answers rather than vague summaries. Includes a PDF ingestion pipeline for parsing, chunking, and indexing documents.",
    tech_stack: ["Python", "Sentence-BERT", "FAISS", "RAG"],
    github_url: null,
    live_url: null,
    featured: true,
    sort_order: 3,
    status: "published",
    images: [],
    video_url: null,
    start_date: "2025-09-01",
    end_date: "2025-12-01",
  },
  {
    title: "FinTech: Roman Urdu SMS Fraud Detection",
    slug: "roman-urdu-sms-fraud-detection",
    short_description:
      "End-to-end NLP pipeline to detect fraudulent messages in Roman Urdu — a low-resource language.",
    long_description:
      "Designed an end-to-end NLP pipeline to detect fraudulent messages in Roman Urdu with no existing public dataset. Synthesized and cleaned a 30,000-message corpus, then trained and benchmarked multiple classifiers. Handled script inconsistencies and code-switching noise specific to Pakistani SMS data.",
    tech_stack: ["Python", "NLP", "Pandas", "Scikit-learn"],
    github_url: null,
    live_url: null,
    featured: false,
    sort_order: 4,
    status: "published",
    images: [],
    video_url: null,
    start_date: "2026-01-01",
    end_date: null,
  },
  {
    title: "FaultLine: Earthquake Safety Simulation",
    slug: "faultline-earthquake-safety-simulation",
    short_description:
      "3D Unity simulation teaching earthquake survival across preparedness, real-time mechanics, and rescue modules.",
    long_description:
      "Building a 3D simulation to teach earthquake survival across three modules: preparedness drills, real-time physics-based mechanics, and post-disaster rescue scenarios. Implements C# state machines, physics-based environmental interactions, and dynamic HUD elements.",
    tech_stack: ["Unity", "C#"],
    github_url: null,
    live_url: null,
    featured: false,
    sort_order: 5,
    status: "published",
    images: [],
    video_url: null,
    start_date: "2025-01-01",
    end_date: null,
  },
];

export function seedProjectsWithIds(): Project[] {
  return SEED_PROJECTS.map((project, index) => ({
    ...project,
    id: `seed-${index + 1}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}
