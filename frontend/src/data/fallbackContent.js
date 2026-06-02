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
    content:
      "The International Hybrid Student Conference on Social Work and Migration - \"Challenges, Resilience, and Innovative Practices in Supporting Migrant Communities\" took place on March 26-27, 2026, as part of the Edu4Migration project, hosted at LOGOS University College in Tirana and AAB College in Prishtina.\n\n" +
      "The conference brought together students, academics, and professionals to discuss key issues in migration and social work. Over the two days, sessions focused on structural and policy challenges, the need for more inclusive institutional frameworks, and psychosocial support for individuals and communities affected by migration.\n\n" +
      "Discussions emphasized resilience and community-based approaches, strengthening local capacities, and promoting sustainable support systems for migrant populations. Particular attention was given to the psychological dimension of migration, including mental health, emotional well-being, acculturative stress, and barriers to reporting gender-based violence.\n\n" +
      "Students and researchers presented studies and innovative practices, fostering international cooperation and interdisciplinary dialogue. The conference served as a vital platform for exchanging ideas, experiences, and sustainable solutions in the field of migration and social work.",
    publishedAt: "2026-03-30",
    thumbnailUrl: "/uploads/News/2026.03.30 - Global Perspectives/3.jpg",
    imageUrl: "/uploads/News/2026.03.30 - Global Perspectives/3.jpg",
    gallery: ["/uploads/News/2026.03.30 - Global Perspectives/2.png", 
      "/uploads/News/2026.03.30 - Global Perspectives/3.jpg",
      "/uploads/News/2026.03.30 - Global Perspectives/4.jpg",
      "/uploads/News/2026.03.30 - Global Perspectives/5.png",],
    isPublished: true
  },
  {
    id: 2,
    title: "International Hybrid Student Conference on Social Work and Migration Kicks Off at LOGOS University College in Tirana",
    excerpt:
      "The first day emphasized collaborative and interdisciplinary responses to migration challenges, vulnerability, trauma, resilience, and community-based approaches.",
    content:
      "The first day of the International Hybrid Student Conference on Social Work and Migration – \"Challenges, Resilience, and Innovative Practices in Supporting Migrant Communities\" was successfully held on March 26, 2026, at LOGOS University College in Tirana, within the framework of the Edu4Migration project.\n\n" +
      "The conference brought together students, academics, and professionals to discuss key issues related to migration and social work.\n\n" +
      "The day began with opening remarks, emphasizing the importance of addressing migration challenges through collaborative and interdisciplinary approaches. Throughout the day, presentations and discussions focused on structural and policy challenges in social work with migrants, highlighting the need for more inclusive and effective institutional frameworks.\n\n" +
      "Participants also explored themes related to vulnerability, trauma, and psychosocial support, sharing insights on how to better support individuals and communities affected by migration. In addition, particular attention was given to resilience and community-based approaches, with discussions centered on strengthening local capacities and promoting sustainable support systems for migrant populations.\n\n" +
      "The sessions encouraged active engagement, allowing participants to exchange ideas, experiences, and innovative practices. The first day concluded with reflections on the key topics discussed and the importance of continuing dialogue and cooperation in this field.\n\n" +
      "The second day of the conference was held at AAB College in Prishtina.",
    publishedAt: "2026-03-30",
    thumbnailUrl: "/uploads/News/2026.03.30 - International Hybrid Student Conference/thumbnail.jpg",
    imageUrl: "/uploads/News/2026.03.30 - International Hybrid Student Conference/thumbnail.jpg",
    gallery: [],
    isPublished: true
  },
  {
    id: 3,
    title: "Second Day of the International Student Conference on Social Work and Migration Held at AAB College",
    excerpt:
      "The second day in Prishtina focused on children and families in migration contexts, psychological support, educational settings, ethics, and interdisciplinary cooperation.",
    content:
      "The International Hybrid Student Conference on Social Work and Migration – \"Challenges, Resilience, and Innovative Practices in Supporting Migrant Communities\" took place on March 26–27, 2026, as part of the Edu4Migration project, hosted at LOGOS University College in Tirana and AAB College in Prishtina.\n\n" +
      "The conference brought together students, academics, and professionals to discuss key issues in migration and social work. Over the two days, sessions focused on structural and policy challenges, the need for more inclusive institutional frameworks, and psychosocial support for individuals and communities affected by migration.\n\n" +
      "Discussions emphasized resilience and community-based approaches, strengthening local capacities, and promoting sustainable support systems for migrant populations. Particular attention was given to the psychological dimension of migration, including mental health, emotional well-being, acculturative stress, and barriers to reporting gender-based violence.\n\n" +
      "Students and researchers presented studies and innovative practices, fostering international cooperation and interdisciplinary dialogue. The conference served as a vital platform for exchanging ideas, experiences, and sustainable solutions in the field of migration and social work.",    publishedAt: "2026-03-27",
    thumbnailUrl: "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/1.jpg",
    imageUrl: "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/1.jpg",
    gallery: ["/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/1.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/2.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/3.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/4.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/5.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/6.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/7.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/8.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/9.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/10.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/11.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/12.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/13.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/14.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/15.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/16.jpg",
      "/uploads/News/2026.03.27 - Two-Day International Hybrid Student Conference/17.jpg",
    ],
    isPublished: true
  },
  {
    id: 4,
    title: "Upcoming International Student Conference on Social Work and Migration",
    excerpt:
      "The International Hybrid Student Conference on Social Work and Migration was scheduled for March 26-27, 2026, with Day 1 at LOGOS University College in Tirana and Day 2 at AAB College in Prishtina.",
    content:
      "Join us for the upcoming International Hybrid Student Conference on Social Work and Migration – \"Student Resilience and Innovative Practices in Supporting Migrant Communities\", organized by the EU-funded WB-Edu4Migration project.\n\n" +
      "This two-day event will take place on March 26–27, 2026, bringing together students, academics, researchers, and professionals to discuss key challenges and innovative approaches in supporting migrant communities. Day 1 will be hosted by LOGOS University College in Tirana, Albania, on March 26, while Day 2 will take place at AAB College in Prishtina, Kosovo, on March 27.\n\n" +
      "Participants will explore topics including structural and policy challenges in social work with migrants, psychosocial trauma and resilience, innovative practices in social services, education, and migration management, as well as approaches that promote inclusion, well-being, and sustainable support systems for migrant populations.\n\n" +
      "Link for Day 2 in Prishtina:\nhttps://meet.google.com/bbt-suhj-uzp\n\n" +
      "Link for Day 1 in Tirana:\nhttps://teams.microsoft.com/meet/34401564410810?p=TwtCjLwB6lI9rHPnSb",
    publishedAt: "2026-03-26",
    thumbnailUrl: "/uploads/News/2026.03.26 - Upcoming International Student Conference/thumbnail.png",
    imageUrl: "/uploads/News/2026.03.26 - Upcoming International Student Conference/thumbnail.png",
    gallery:[],
    isPublished: true
  },
  {
    id: 5,
    title: "Call for Abstracts: International Student Conference on Social Work and Migration",
    excerpt:
      "The project invited students from partner institutions to submit abstracts on challenges, resilience, and innovative practices in supporting migrant communities.",
    content:
      "The International Hybrid Student Conference on \"Social Work and Migration: Challenges, Resilience, and Innovative Practices in Supporting Migrant Communities\" invites abstract submissions from students across partner institutions.\n\n" +
      "Scheduled for March 26–27, 2026, the conference will be held in a hybrid format, with Day 1 hosted on-site and online at LOGOS University College in Tirana, Albania, and Day 2 taking place at AAB College in Prishtina, Kosovo. The event is organized within the framework of the WB-Edu4Migration Project.\n\n" +
      "The conference aims to provide a platform for students to present research, exchange ideas, and engage in interdisciplinary discussions on migration and social work. Themes include structural and policy challenges, vulnerability and psychosocial support, resilience strategies, psychology in migration, innovative social services, and professional development in education and ethics.\n\n" +
      "Students are invited to submit abstracts of 250–300 words in English by March 20, 2026. Selected participants will have the opportunity to present their work and contribute to meaningful dialogue on supporting migrant communities through innovative and sustainable practices.",
    publishedAt: "2026-03-11",
    thumbnailUrl: "/uploads/News/2026.03.11 - Call for Abstracts International Student Conference/thumbnail.png",
    documentTitle: "Call for Abstracts PDF",
    documentUrl: "/uploads/Documents/Call_for_Abstracts_International_Student_Conference_Social_Work_and_Migration.pdf",
    imageUrl: "",
    isPublished: true
  },
  {
    id: 6,
    title: "Edu4Migration Project – IULM University Leads Regional Training to Advance Micro-Credential Courses Across the Western Balkans",
    excerpt:
      "A regional training activity supported trainers and academic staff in designing flexible micro-credential courses across the Western Balkans.",
    content:
      "The <a href=\"https://openday.iulm.it/\" target=\"_blank\" rel=\"noopener noreferrer\">IULM University</a> (Italy) successfully led the E4.1 Training of Trainers (ToT) for Western Balkan University Partners, focused on developing micro-credential courses under the WB-Edu4Migration project. The ToT was held on 17–18 November at <a href=\"https://aab-edu.net\" target=\"_blank\" rel=\"noopener noreferrer\">AAB College</a> in Prishtina and continued on 20–21 November at Barleti University in Tirana, bringing together project staff and regional partners for a collaborative learning experience.\n\n" +
      "The training showcased IULM’s expertise in innovative higher-education methodologies. While <a href=\"https://openday.iulm.it/\" target=\"_blank\" rel=\"noopener noreferrer\">IULM</a> professors Andrea Miconi and Simona Pezzano conducted sessions online, Fabio De Giorgio from <a href=\"https://openday.iulm.it/\" target=\"_blank\" rel=\"noopener noreferrer\">IULM</a> facilitated the program in person at AAB College, ensuring seamless interaction between the participants and the trainers. The Prishtina sessions included professors from <a href=\"https://aab-edu.net/\" target=\"_blank\" rel=\"noopener noreferrer\">AAB College</a>, <a href=\"https://ibcmitrovica.eu\" target=\"_blank\" rel=\"noopener noreferrer\">IBCM</a>, and the <a href=\"https://uni-gjk.org\" target=\"_blank\" rel=\"noopener noreferrer\">University of Gjakova “Fehmi Agani”</a>. The sessions in Tirana brought together representatives from <a href=\"https://logos.edu.al\" target=\"_blank\" rel=\"noopener noreferrer\">LOGOS University College</a>, Barleti University, and the <a href=\"https://unitir.edu.al\" target=\"_blank\" rel=\"noopener noreferrer\">University of Tirana</a>, further enhancing regional collaboration and knowledge exchange.\n\n" +
      "The first day focused on foundational concepts of micro-credentials, international standards, and successful implementation models. Participants explored ways to integrate micro-credentials into contemporary higher-education systems, highlighting IULM’s thought leadership in flexible and future-oriented learning solutions.\n\n" +
      "The second day emphasized practical application. Participants designed course structures, defined learning outcomes, and carried out exercises based on the materials developed under Work Package 3, applying IULM’s pedagogical frameworks to real-world scenarios.\n\n" +
      "The E4.1 training provided a dynamic platform for collaboration, knowledge exchange, and capacity building. IULM University reinforced its role as a driving force in the development of micro-credential education, supporting the creation of flexible learning pathways that respond to contemporary educational and labor-market needs across the Western Balkans.",
    publishedAt: "2025-12-02",
    thumbnailUrl: "/uploads/News/2025.12.05 - Edu4Migration Project – IULM University Leads Regional Training/1.jpg",
    imageUrl: "/uploads/News/2025.12.05 - Edu4Migration Project – IULM University Leads Regional Training/1.jpg",
    gallery: ["/uploads/News/2025.12.05 - Edu4Migration Project – IULM University Leads Regional Training/2.png",
      "/uploads/News/2025.12.05 - Edu4Migration Project – IULM University Leads Regional Training/3.png",
      "/uploads/News/2025.12.05 - Edu4Migration Project – IULM University Leads Regional Training/4.jpg",
      "/uploads/News/2025.12.05 - Edu4Migration Project – IULM University Leads Regional Training/5.jpg",
      "/uploads/News/2025.12.05 - Edu4Migration Project – IULM University Leads Regional Training/6.jpg",
      "/uploads/News/2025.12.05 - Edu4Migration Project – IULM University Leads Regional Training/7.jpg",
      "/uploads/News/2025.12.05 - Edu4Migration Project – IULM University Leads Regional Training/8.jpg",
      "/uploads/News/2025.12.05 - Edu4Migration Project – IULM University Leads Regional Training/9.jpg",
      "/uploads/News/2025.12.05 - Edu4Migration Project – IULM University Leads Regional Training/10.jpg",
      "/uploads/News/2025.12.05 - Edu4Migration Project – IULM University Leads Regional Training/11.jpg",
    ],
    isPublished: true
  },
  {
    id: 7,
    title: "WB-Edu4Migration hosts two-day training of Trainers at AAB College",
    excerpt:"AAB College in Prishtina hosted the two-day Training of Trainers under the WB-Edu4Migration Project, funded by the European Commission through the Erasmus+ program.",
    content:
      "AAB College in Prishtina hosted the two-day Training of Trainers under the WB-Edu4Migration Project, funded by the European Commission through the Erasmus+ Programme. The training focused on developing micro-credential courses for Western Balkan university partners and was held on 17–18 November 2025, bringing together academic staff to strengthen expertise in planning, designing, and evaluating micro-credentials.\n\n" +
      "The first day introduced participants to the conceptual foundations of micro-credentials, their key characteristics, and their growing relevance in contemporary higher education. Sessions explored the benefits of micro-credentials for learners, educators, and employers, while also presenting case studies and examples of successful implementation.\n\n" +
      "Participants examined different models of micro-credential courses and reviewed the Pages Project online course on cross-media journalism, as well as the Erasmus+-funded CLIP project focused on visual media literacy. These examples provided practical insights into the development and delivery of flexible learning opportunities.\n\n" +
      "The second day focused on the practical design of micro-credential courses. Participants worked on organizing materials from Work Package 3, defining learning outcomes, structuring course content, and developing engaging learning activities. Additional sessions addressed the selection of digital tools, course development processes, and a mini iteration exercise that allowed participants to test and refine their course designs.\n\n" +
      "The training provided a valuable platform for collaboration, knowledge exchange, and capacity building among universities in the region. It marked an important step toward advancing innovative and flexible learning pathways that respond to the evolving needs of students, higher education institutions, and the labor market.",
    publishedAt: "2025-11-20",
    thumbnailUrl: "/uploads/News/2025.11.20 - WB-Edu4Migration hosts two-day training of Trainers at AAB College/thumbnail.jpg",
    imageUrl: "/uploads/News/2025.11.20 - WB-Edu4Migration hosts two-day training of Trainers at AAB College/thumbnail.jpg",
    gallery: [],
    isPublished: true
  },
  {
    id: 8,
    title: "International Training of Trainers Held in Vejle, Denmark",
    excerpt:"In Vejle, Denmark, the Training of Trainers activity was held within the framework of the WB-Edu4Migration project, funded by the Erasmus+ Programme of the European Commission.",
    content:"",
    publishedAt: "2025-11-20",
    thumbnailUrl: "/uploads/News/2025.11.07 - International Training of Trainers Held in Vejle, Denmark/thumbnail.jpg",
    imageUrl: "/uploads/News/2025.11.07 - International Training of Trainers Held in Vejle, Denmark/thumbnail.jpg",
    gallery: ["/uploads/News/2025.11.07 - International Training of Trainers Held in Vejle, Denmark/1.jpg",
      "/uploads/News/2025.11.07 - International Training of Trainers Held in Vejle, Denmark/2.jpg",
      "/uploads/News/2025.11.07 - International Training of Trainers Held in Vejle, Denmark/3.jpg",
      "/uploads/News/2025.11.07 - International Training of Trainers Held in Vejle, Denmark/4.jpg",
    ],
    isPublished: true
  },
  {
    id: 9,
    title: "Three-day Training for the Development of Contemporary Teaching Methodologies in Denmark",
    excerpt:"In Vejle, Denmark, a three-day training is taking place for the academic staff of partner universities from the Western Balkans, within the framework of the “Training of Trainers” activity.",
    content:
      "A three-day Training of Trainers activity was held in Vejle, Denmark, within the framework of the WB-Edu4Migration project, funded by the European Commission through the Erasmus+ Programme. The training brought together academic staff from partner universities across the Western Balkans to strengthen their capacities in developing case studies and implementing Project-Based Learning (PBL) and Problem-Based Learning (PrBL) methodologies.\n\n" +
      "Hosted by <a href=\"https://www.ucl.dk\" target=\"_blank\" rel=\"noopener noreferrer\">UCL University College</a> in Vejle, the training focused on creating stronger connections between theory and practice in higher education. Participants explored innovative teaching approaches designed to enhance student engagement, critical thinking, and real-world problem-solving skills.\n\n" +
      "Twelve academic representatives from partner institutions participated in the activity, including <a href=\"https://aab-edu.net\" target=\"_blank\" rel=\"noopener noreferrer\">AAB College</a>, <a href=\"https://ibcmitrovica.eu\" target=\"_blank\" rel=\"noopener noreferrer\">IBCM</a>, <a href=\"https://uni-gjk.org\" target=\"_blank\" rel=\"noopener noreferrer\">University of Gjakova “Fehmi Agani”</a>, <a href=\"https://unitir.edu.al\" target=\"_blank\" rel=\"noopener noreferrer\">University of Tirana</a>, <a href=\"https://www.uniba.sk\" target=\"_blank\" rel=\"noopener noreferrer\">UniBA</a>, <a href=\"https://logos.edu.al\" target=\"_blank\" rel=\"noopener noreferrer\">LOGOS University College</a>, UCL University College, IREDS, and IRCA.\n\n" +
      "Throughout the three days, participants engaged in interactive workshops, collaborative group work, and experience-sharing sessions. They worked on developing concrete case study examples and explored practical methods for integrating PBL and PrBL approaches into their academic programs.\n\n" +
      "The training provided a valuable platform for collaboration, knowledge exchange, and professional development among partner institutions. By promoting innovative and student-centered learning methodologies, the activity contributed to strengthening higher education practices across the region and enhancing cooperation among universities involved in the WB-Edu4Migration project.",
    publishedAt: "2025-10-29",
    thumbnailUrl: "/uploads/News/2025.10.29 - Three-day Training for the Development of Contemporary Teaching Methodologies in Denmark/1.jpg",
    imageUrl: "/uploads/News/2025.10.29 - Three-day Training for the Development of Contemporary Teaching Methodologies in Denmark/1.jpg",
    gallery: ["/uploads/News/2025.10.29 - Three-day Training for the Development of Contemporary Teaching Methodologies in Denmark/2.jpg",
      "/uploads/News/2025.10.29 - Three-day Training for the Development of Contemporary Teaching Methodologies in Denmark/1.jpg"
    ],
    isPublished: true
  },
  {
    id: 10,
    title: "CALL FOR EXTERNAL EXPERT – Development of Micro-Credential Courses",
    excerpt:"The project WB–Edu4Migration – “Mitigating Migration Challenges in the Western Balkans through Curriculum Enhancement and Micro-Credential Development in Social Care” –, co – founded by the European Union, is launching a call for an external expert in the field of higher education and micro-credentialing.",
    content:"",
    publishedAt: "2025-06-04",
    documentTitle: "ToR Microcredential PDF",
    documentUrl: "/uploads/Documents/ToR-Microcredential-Expert-WB-Edu4Migration.pdf",
    thumbnailUrl: "/uploads/News/2025.06.04 - Call for external expert/thumbnail.png",
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
  "work-packages": 
  {
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
  deliverables: 
  {
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
  milestones: 
  {
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
  events: 
  {
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
  updates: 
  {
    eyebrow: "Updates",
    title: "Project Updates",
    intro: "The live project-updates page is reserved for ongoing implementation updates.",
    sections: [
      { title: "Training and project activity", body: "Project updates are also surfaced through the News page, including training activities, conferences, calls, and student events." },
      { title: "Admin-managed updates", body: "Use the admin panel to publish new updates without editing code." }
    ]
  },
  downloads: 
  {
    eyebrow: "Resources",
    title: "Downloadable Documents",
    intro: "The downloadable documents section is ready for public files and project outputs.",
    sections: [
      {
        title: "Call for Abstracts: International Student Conference on Social Work and Migration",
        body: "Download the call for abstracts for the International Student Conference on Social Work and Migration.",
        documentTitle: "Call for Abstracts PDF",
        documentUrl: "/uploads/Documents/Call_for_Abstracts_International_Student_Conference_Social_Work_and_Migration.pdf"
      },
      {
        title: "Terms of Reference: Microcredential Expert",
        body: "Download the terms of reference for the Microcredential Expert role under the WB-Edu4Migration project.",
        documentTitle: "ToR Microcredential Expert PDF",
        documentUrl: "/uploads/Documents/ToR-Microcredential-Expert-WB-Edu4Migration.pdf"
      }
    ]
  },
  "case-studies": 
  {
    eyebrow: "Resources",
    title: "Case Studies and Reports",
    intro: "This section is prepared for migration-focused case studies and project reports.",
    sections: [
      { title: "Case study book", body: "The project includes a Book of Case Studies on Migration Topics as a planned deliverable." },
      { title: "Reports", body: "Needs assessment reports, practitioner-day reports, roundtable reports, and curriculum feedback reports can be collected here." }
    ]
  },
  multimedia: 
  {
    eyebrow: "Resources",
    title: "Multimedia",
    intro: "The live multimedia page is reserved for project photos, videos, and visual material.",
    sections: [
      { title: "Project media", body: "Use this space for event galleries, training photos, conference media, and partner communication material." },
      { title: "Media references", body: "Images uploaded through the admin panel can be referenced in news and homepage content." }
    ]
  }
};
