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
      { label: "Case Studies and Reports", to: "/case-studies" },
      { label: "Multimedia", to: "/multimedia" }
    ]
  },
  { label: "News", to: "/news" }
];

export const homepageFallback = {
  heroEyebrow: "EU Erasmus+ Capacity Building in Higher Education",
  heroTitle: "Western Balkans",
  heroSubtitle: "Edu4Migration",
  heroBody:
    "The project enhances the competencies of current and future social workers in Kosovo and Albania so they can better address the unique challenges faced by migrant populations.",
  heroImageUrl: "/assets/Ardiani.jpg",
  stats: [
    { value: "12+", label: "Partner Universities" },
    { value: "5", label: "Countries Involved" },
    { value: "200+", label: "Professionals Trained" },
    { value: "20+", label: "Courses Developed" }
  ],
  focusAreas: [
    {
      title: "Educational reform",
      body: "Bridging the gap in social work programs by integrating migration studies and related coursework into higher education curricula."
    },
    {
      title: "Digital micro-credentials",
      body: "Developing flexible online learning opportunities for practicing professionals who need continuous development."
    },
    {
      title: "Inclusive support",
      body: "Equipping social workers with the knowledge and tools to advocate for migrants and support host communities."
    }
  ],
  partners: [
    { name: "AAB College", country: "Kosovo", logoUrl: "/assets/Partners/Kolegji AAB - No Bg.png" },
    { name: "University of Tirana", country: "Albania", logoUrl: "/assets/Partners/University-of-Tirana-Albania.jpg" },
    { name: "IBC-M", country: "Kosovo", logoUrl: "/assets/Partners/IBC-M.jpg" },
    { name: "Fehmi Agani University", country: "Kosovo", logoUrl: "/assets/Partners/fehmi agani.jpg" }
  ]
};

export const newsFallback = [
  {
    id: 1,
    title: "Global Perspectives on Migration and Social Work Highlighted in Two-Day International Hybrid Student Conference",
    excerpt:
      "The conference took place on March 26-27, 2026, hosted at LOGOS University College in Tirana and AAB College in Prishtina, focusing on migration, resilience, psychosocial support, and inclusive institutional frameworks.",
    content: "Students, researchers, and practitioners explored interdisciplinary responses to migration, with attention to vulnerability, resilience, psychosocial support, and inclusive frameworks.",
    publishedAt: "2026-03-30",
    thumbnailUrl: "/assets/total.jpg",
    imageUrl: "/assets/total.jpg",
    gallery: ["/assets/total.jpg", "/assets/Ardiani.jpg"],
    isPublished: true
  },
  {
    id: 2,
    title: "International Hybrid Student Conference on Social Work and Migration Kicks Off at LOGOS University College in Tirana",
    excerpt:
      "The first day emphasized collaborative and interdisciplinary responses to migration challenges, vulnerability, trauma, resilience, and community-based approaches.",
    content: "The conference opened with presentations and discussion panels across partner institutions.",
    publishedAt: "2026-03-30",
    thumbnailUrl: "/assets/Ardiani.jpg",
    imageUrl: "/assets/Ardiani.jpg",
    isPublished: true
  },
  {
    id: 3,
    title: "Second Day of the International Student Conference on Social Work and Migration Held at AAB College",
    excerpt:
      "The second day in Prishtina focused on children and families in migration contexts, psychological support, educational settings, ethics, and interdisciplinary cooperation.",
    content: "AAB College hosted the second conference day with sessions focused on children, families, psychological support, education, ethics, and cross-sector cooperation.",
    publishedAt: "2026-03-27",
    thumbnailUrl: "/assets/Ardiani.jpg",
    imageUrl: "/assets/Ardiani.jpg",
    isPublished: true
  },
  {
    id: 4,
    title: "Upcoming International Student Conference on Social Work and Migration",
    excerpt:
      "The International Hybrid Student Conference on Social Work and Migration was scheduled for March 26-27, 2026, with Day 1 at LOGOS University College in Tirana and Day 2 at AAB College in Prishtina.",
    content: "The event invited participants to explore structural and policy challenges, psychosocial trauma and resilience, and innovative practices in social services, education, and migration management.",
    publishedAt: "2026-03-26",
    imageUrl: "",
    isPublished: true
  },
  {
    id: 5,
    title: "Call for Abstracts: International Student Conference on Social Work and Migration",
    excerpt:
      "The project invited students from partner institutions to submit abstracts on challenges, resilience, and innovative practices in supporting migrant communities.",
    content: "Themes included structural policy challenges, vulnerability and psychosocial support, resilience strategies, psychology in migration, innovative social services, and professional development in education and ethics.",
    publishedAt: "2026-03-11",
    imageUrl: "",
    isPublished: true
  },
  {
    id: 6,
    title: "IULM University Leads Regional Training to Advance Micro-Credential Courses",
    excerpt:
      "A regional training activity supported trainers and academic staff in designing flexible micro-credential courses across the Western Balkans.",
    content: "The training helped partner universities prepare targeted professional learning pathways.",
    publishedAt: "2025-12-02",
    imageUrl: "",
    isPublished: true
  }
];

export const projectPartners = [
  {
    name: "Kolegji AAB",
    country: "Kosovo",
    role: "Coordinator",
    logoUrl: "/assets/Partners/Kolegji AAB - No Bg.png",
    websiteUrl: "https://aab-edu.net/"
  },
  {
    name: "International Business College Mitrovica",
    country: "Kosovo",
    role: "Partner",
    logoUrl: "/assets/Partners/IBC-M.jpg",
    websiteUrl: "https://www.ibcmitrovica.eu/"
  },
  {
    name: "Universiteti Fehmi Agani Gjakove",
    country: "Kosovo",
    role: "Partner",
    logoUrl: "/assets/Partners/fehmi agani.jpg",
    websiteUrl: "https://uni-gjk.org/"
  },
  {
    name: "University of Tirana",
    country: "Albania",
    role: "Partner",
    logoUrl: "/assets/Partners/University-of-Tirana-Albania.jpg",
    websiteUrl: "https://unitir.edu.al/"
  },
  {
    name: "Barleti University",
    country: "Albania",
    role: "Partner",
    logoUrl: "/assets/Partners/Barleti University (Albania).jpg",
    websiteUrl: "https://umb.edu.al/"
  },
  {
    name: "Logos University College",
    country: "Albania",
    role: "Partner",
    logoUrl: "/assets/Partners/Logos University College (Albania).jpg",
    websiteUrl: "https://kulogos.edu.al/"
  },
  {
    name: "Institute for Research, Education, and Social Development",
    country: "Kosovo",
    role: "Partner",
    logoUrl: "/assets/Partners/ireds.jpg",
    websiteUrl: "https://ireds.org/"
  },
  {
    name: "UCL University College",
    country: "Denmark",
    role: "EU Partner",
    logoUrl: "/assets/Partners/UCL.jpg",
    websiteUrl: "https://www.ucl.dk/"
  },
  {
    name: "Fachhochschule Salzburg",
    country: "Austria",
    role: "EU Partner",
    logoUrl: "/assets/Partners/Fachhochschule-Salzburg-Austria.jpg",
    websiteUrl: "https://www.fh-salzburg.ac.at/"
  },
  {
    name: "IULM University",
    country: "Italy",
    role: "EU Partner",
    logoUrl: "/assets/Partners/IULM-University-Italy.jpg",
    websiteUrl: "https://www.iulm.it/"
  }
];

export const pagesFallback = {
  overview: {
    eyebrow: "About",
    title: "Project Overview",
    intro: "The WB-Edu4Migration project is funded by the EU under Erasmus+ Capacity Building in Higher Education, Strand 1.",
    sections: [
      { title: "Skills gap in migration support", body: "The project addresses a critical skills gap among social workers in Kosovo and Albania regarding migrant populations. This gap limits social workers' ability to effectively assist migrants." },
      { title: "Curriculum and training response", body: "Educational institutions have not yet fully integrated migration-related coursework into social work programs. The project responds by reforming curricula, developing digital micro-credential courses, and implementing capacity-building activities." },
      { title: "Inclusive environment for migrants", body: "These efforts aim to create a more inclusive and supportive environment for migrants and help social workers better advocate for their needs." }
    ]
  },
  partners: {
    eyebrow: "Consortium",
    title: "Project Partners",
    intro: "Academic institutions and organizations from Kosovo, Albania, Denmark, Austria, and Italy.",
    sections: projectPartners.map((partner) => ({
      title: partner.name,
      body: `${partner.role}, ${partner.country}.`
    }))
  },
  management: {
    eyebrow: "Structure",
    title: "Project Management Structure",
    intro: "The project is coordinated by Kolegji AAB, with partner institutions contributing to specific work packages.",
    sections: [
      { title: "Coordination", body: "Kolegji AAB coordinates the project and supports alignment between partner institutions, work packages, timelines, and project-level reporting." },
      { title: "Partner responsibilities", body: "Each partner institution contributes to specific work packages and activities, ensuring that curriculum development, micro-credential design, quality assurance, and dissemination are shared across the consortium." },
      { title: "Management team", body: "A project management team oversees operations, monitors progress, and supports effective communication across partners." }
    ]
  },
  objectives: {
    eyebrow: "Objectives",
    title: "Objectives and Target Groups",
    intro: "The project aims to improve the competencies of social workers and students in Kosovo and Albania so they can provide better support to migrant populations.",
    sections: [
      { title: "Target groups", body: "The primary target groups are social work students, current social workers, and educators involved in social sciences and psychology programs at partner institutions." },
      { title: "O1 - Curriculum guidelines", body: "Create a set of guidelines for integrating topics related to migration into existing curricula." },
      { title: "O2 - Revised curricula", body: "Revise and enrich curricula in social sciences and psychology faculties at partner educational institutions to incorporate migration-related topics." },
      { title: "O3 - Micro-credential courses", body: "Develop and pilot digital short micro-credential courses for practicing social workers, focused on specialized knowledge and skills for addressing migrant needs and challenges." },
      { title: "O4 - Capacity building", body: "Provide capacity-building initiatives for educators and trainers involved in curriculum enhancement and micro-credential course design." }
    ]
  },
  outcomes: {
    eyebrow: "Impact",
    title: "Expected Outcomes",
    intro: "The expected outcomes focus on stronger curricula, flexible professional learning, and better migration support practice.",
    sections: [
      { title: "Revised curricula", body: "Curricula incorporating migration topics across relevant higher-education programs." },
      { title: "Micro-credential courses", body: "Development and implementation of digital short courses for practitioners." },
      { title: "Cultural competence", body: "Enhanced cultural competence among social workers working with migrant populations." },
      { title: "Educator capacity", body: "More capacity-building opportunities for educators and trainers." },
      { title: "Societal impact", body: "Positive social impacts through better integration and support for migrants." }
    ]
  },
  documents: {
    eyebrow: "Resources",
    title: "Project Documents List",
    intro: "The live document area is prepared for project reports, plans, guidelines, and public outputs.",
    sections: [
      { title: "Project management documents", body: "Management structures, management plan, signed partnership agreement, and kick-off meeting report." },
      { title: "Quality and dissemination documents", body: "Quality assurance terms of reference, quality assurance plan, dissemination plan, exploitation plan, sustainability plan, and project quality reports." },
      { title: "Learning and curriculum documents", body: "Needs assessment reports, micro-credential guidelines, training programs, case study book, and curriculum revision reports." }
    ]
  },
  courses: {
    eyebrow: "Learning",
    title: "Courses",
    intro: "The courses page on the live site is reserved for the project's digital micro-credential learning offer.",
    sections: [
      { title: "Micro-credential focus", body: "Courses will support practicing social workers with specialized knowledge and skills for responding to the needs and challenges faced by migrants." },
      { title: "Flexible online learning", body: "The project emphasizes digital short courses that can support continuous professional development for current practitioners." },
      { title: "Academic staff preparation", body: "Training materials and Training of Trainers activities support educators in designing and piloting course content." }
    ]
  },
  "work-packages": {
    eyebrow: "Activities",
    title: "Work Packages",
    intro: "The project activities are organized into work packages covering management, needs analysis, curriculum development, micro-credentials, quality, and dissemination.",
    sections: [
      { title: "WP1 - Project management", body: "Establish management structures, partnership agreements, coordination routines, meetings, and project reporting." },
      { title: "WP2 - Needs analysis and guidelines", body: "Identify migration-related challenges and opportunities, organize practitioner engagement, and prepare guidelines for micro-credential development and implementation." },
      { title: "WP3 - Curriculum enhancement", body: "Develop case studies on migration topics and revise curricula and courses based on project findings and feedback." },
      { title: "WP4 - Micro-credential course development", body: "Prepare training programs and materials for academic staff, design micro-credential courses, and pilot their implementation." },
      { title: "WP5 - Quality assurance", body: "Create quality assurance structures, monitor implementation, prepare mid-term and final quality reports, and support external evaluation." },
      { title: "WP6 - Dissemination and sustainability", body: "Plan dissemination, exploitation, and sustainability activities and organize final dissemination conferences." }
    ]
  },
  deliverables: {
    eyebrow: "Outputs",
    title: "Deliverables",
    intro: "Deliverables from the live project list, organized as a public output catalog.",
    sections: [
      { title: "D1.4 - Signed Partnership Agreement", body: "Due 30.11.2024." },
      { title: "D1.1 - Project Management Structures and Project Management Plan", body: "Due 31.12.2024." },
      { title: "D5.1 - Terms of Reference of the Quality Assurance Committee and Quality Assurance Plan", body: "Due 31.12.2024." },
      { title: "D6.1 - Dissemination, Exploitation, and Sustainability Plan", body: "Due 31.12.2024." },
      { title: "D1.2 - Kick-off meeting report", body: "Due 31.01.2025." },
      { title: "D2.3 - Guidelines for Micro-Credential Development and Implementation in Kosovo and Albania", body: "Due 30.06.2025." },
      { title: "D4.1 - Training Program and Materials for Academic Staff", body: "Due 30.06.2025." },
      { title: "D1.3 - ToT Program and Materials for Micro Credentials in Social Care Migration-Related Topics", body: "Due 31.10.2025." },
      { title: "D5.3 - Mid-term project report", body: "Due 30.04.2026." },
      { title: "D3.2 - Mid-Term Project Quality Report", body: "Due 30.04.2026." },
      { title: "D2.2 - Book of Case Studies on Migration Topics", body: "Due 31.10.2026." },
      { title: "D4.2 - Report on the Development and Pilot Implementation of Micro Credential Courses", body: "Due 30.06.2027." },
      { title: "D3.3 - Report on Curriculum and Course Revisions and Feedback", body: "Due 31.08.2027." },
      { title: "D5.2 - Final Project Quality Report", body: "Due 31.10.2027." },
      { title: "D5.4 - External Evaluation Report", body: "Due 31.10.2027." },
      { title: "D6.2 - Final Dissemination Conference Report", body: "Due 31.10.2027." }
    ]
  },
  milestones: {
    eyebrow: "Timeline",
    title: "Milestones",
    intro: "Eight project milestones structure implementation from management setup to curriculum revision.",
    sections: [
      { title: "M1 - Project Management Structures and Project Management Plan", body: "Management structures and planning documents established." },
      { title: "M2 - Kick-off meeting report", body: "Kick-off meeting documented and reported." },
      { title: "M3 - Needs Assessment Reports", body: "Needs Assessment Reports on Migration Challenges and Opportunities in Kosovo and Albania." },
      { title: "M4 - Micro-credential guidelines", body: "Guidelines for Micro-Credential Development and Implementation in Kosovo and Albania." },
      { title: "M5 - Book of Case Studies", body: "Book of Case Studies on Migration Topics." },
      { title: "M6 - Practitioner engagement report", body: "Report on Roundtable Discussions and Practitioner Days." },
      { title: "M7 - Micro-credential implementation report", body: "Report on the Development and Pilot Implementation of Micro Credential Courses." },
      { title: "M8 - Curriculum revision report", body: "Report on Curriculum and Course Revisions and Feedback." }
    ]
  },
  events: {
    eyebrow: "Activities",
    title: "Events",
    intro: "Workshops, practitioners' days, roundtables, trainings, and dissemination conferences.",
    sections: [
      { title: "E1.1 - Kick-off Meeting", body: "Workshop in Prishtina, Kosovo. 3 days, 30 attendees. Establish project structures, discuss the management plan, and outline work packages." },
      { title: "E2.1 - Practitioners' Day in Austria", body: "Event in Salzburg, Austria. 2 days, 15 attendees. Discuss international practices, skills gaps, and educational needs related to migration services." },
      { title: "E2.2 - Practitioners' Day in Kosovo", body: "Event in Prishtina, Kosovo. 1 day, 50 attendees. Identify common challenges in migration services and training needs for social workers." },
      { title: "E2.3 - Practitioners' Day in Albania", body: "Event in Tirana, Albania. 1 day, 50 attendees. Discuss professional challenges and training opportunities in migration services." },
      { title: "E2.4 - Roundtable Discussion in Kosovo", body: "Event in Prishtina, Kosovo. 1 day, 35 attendees. Discuss the migration situation, identified skills gaps, and micro-credential guidelines." },
      { title: "E2.5 - Roundtable Discussion in Albania", body: "Event in Tirana, Albania. 1 day, 35 attendees. Assess the migration situation and discuss implementation of micro-credentials." },
      { title: "E3.1 - Training of Trainers in Denmark", body: "Training in Odense, Denmark. 3 days, 12 attendees. Focus on case study development and project/problem-based learning methodologies." },
      { title: "E3.2 - Training of Trainers in Kosovo", body: "Training in Prishtina, Mitrovica, and Gjakova. 3 days, 30 attendees. Train academic staff on case-study development and PBL methodology." },
      { title: "E3.3 - Training of Trainers in Albania", body: "Training in Tirana, Albania. 3 days, 30 attendees. Support academic staff in applying case-study and PBL methods." },
      { title: "E4.1 - ToT in Kosovo (Micro-Credential Courses)", body: "Training in Prishtina, Kosovo. 2 days, 30 attendees. Train academic staff to design and implement micro-credential courses." },
      { title: "E4.2 - ToT in Albania (Micro-Credential Courses)", body: "Training in Tirana, Albania. 2 days, 30 attendees. Equip Albanian universities to create targeted micro-credential learning modules." },
      { title: "E6.1 - Final Dissemination Conference in Kosovo", body: "Conference in Prishtina, Kosovo. 1 day, 50 attendees. Present results, lessons learned, and future sustainability." },
      { title: "E6.2 - Final Dissemination Conference in Albania", body: "Conference in Tirana, Albania. 1 day, 50 attendees. Present project results and discuss future application in the region." }
    ]
  },
  updates: {
    eyebrow: "Updates",
    title: "Project Updates",
    intro: "The live project-updates page is reserved for ongoing implementation updates.",
    sections: [
      { title: "Training and project activity", body: "Project updates are also surfaced through the News page, including training activities, conferences, calls, and student events." },
      { title: "Admin-managed updates", body: "Use the admin panel to publish new updates without editing code." }
    ]
  },
  downloads: {
    eyebrow: "Resources",
    title: "Downloadable Documents",
    intro: "The downloadable documents section is ready for public files and project outputs.",
    sections: [
      { title: "Available document types", body: "Reports, plans, guidelines, training materials, case studies, and dissemination outputs can be listed here." },
      { title: "Admin-managed resources", body: "Files can be uploaded through the media library and referenced from the frontend content." }
    ]
  },
  "case-studies": {
    eyebrow: "Resources",
    title: "Case Studies and Reports",
    intro: "This section is prepared for migration-focused case studies and project reports.",
    sections: [
      { title: "Case study book", body: "The project includes a Book of Case Studies on Migration Topics as a planned deliverable." },
      { title: "Reports", body: "Needs assessment reports, practitioner-day reports, roundtable reports, and curriculum feedback reports can be collected here." }
    ]
  },
  multimedia: {
    eyebrow: "Resources",
    title: "Multimedia",
    intro: "The live multimedia page is reserved for project photos, videos, and visual material.",
    sections: [
      { title: "Project media", body: "Use this space for event galleries, training photos, conference media, and partner communication material." },
      { title: "Media references", body: "Images uploaded through the admin panel can be referenced in news and homepage content." }
    ]
  }
};
