using System.Text.Json;
using Edu4Migration.Api.Data;
using Edu4Migration.Api.DTOs;
using Edu4Migration.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Edu4Migration.Api.Services;

public class SeedService(AppDbContext db)
{
    public async Task SeedAsync()
    {
        if (!await db.HomepageContents.AnyAsync())
        {
            db.HomepageContents.Add(new HomepageContent
            {
                HeroEyebrow = "EU Erasmus+ Capacity Building in Higher Education",
                HeroTitle = "Western Balkans",
                HeroSubtitle = "Edu4Migration",
                HeroBody = "Strengthening the competencies of current and future social workers in Kosovo and Albania so they can better respond to the unique needs and challenges faced by migrant populations.",
                HeroImageUrl = "/assets/Ardiani.jpg",
                StatsJson = JsonSerializer.Serialize(new List<StatDto>
                {
                    new("12+", "Partner Universities"),
                    new("5", "Countries Involved"),
                    new("200+", "Professionals Trained"),
                    new("20+", "Courses Developed")
                }),
                FocusAreasJson = JsonSerializer.Serialize(new List<FocusAreaDto>
                {
                    new("Curriculum Development", "Modernizing social work education for migration-related challenges and practice."),
                    new("Micro-Credentials", "Flexible learning programs and certification pathways for professionals."),
                    new("Capacity Building", "Training educators and institutions through collaboration and regional exchange.")
                }),
                PartnersJson = JsonSerializer.Serialize(new List<PartnerDto>
                {
                    new("Kolegji AAB", "Kosovo", "/assets/Partners/Kolegji AAB - No Bg.png", "Coordinator", "https://aab-edu.net/"),
                    new("International Business College Mitrovica", "Kosovo", "/assets/Partners/IBC-M.jpg", "Partner", "https://www.ibcmitrovica.eu/"),
                    new("Universiteti Fehmi Agani Gjakove", "Kosovo", "/assets/Partners/fehmi agani.jpg", "Partner", "https://uni-gjk.org/"),
                    new("University of Tirana", "Albania", "/assets/Partners/University-of-Tirana-Albania.jpg", "Partner", "https://unitir.edu.al/"),
                    new("Barleti University", "Albania", "/assets/Partners/Barleti University (Albania).jpg", "Partner", "https://umb.edu.al/"),
                    new("Logos University College", "Albania", "/assets/Partners/Logos University College (Albania).jpg", "Partner", "https://kulogos.edu.al/"),
                    new("Institute for Research, Education, and Social Development", "Kosovo", "/assets/Partners/ireds.jpg", "Partner", "https://ireds.org/"),
                    new("UCL University College", "Denmark", "/assets/Partners/UCL.jpg", "EU Partner", "https://www.ucl.dk/"),
                    new("Fachhochschule Salzburg", "Austria", "/assets/Partners/Fachhochschule-Salzburg-Austria.jpg", "EU Partner", "https://www.fh-salzburg.ac.at/"),
                    new("IULM University", "Italy", "/assets/Partners/IULM-University-Italy.jpg", "EU Partner", "https://www.iulm.it/")
                })
            });
        }

        if (!await db.NewsItems.AnyAsync())
        {
            db.NewsItems.AddRange(
                new NewsItem
                {
                    Title = "Global Perspectives on Migration and Social Work Highlighted in Two-Day International Hybrid Student Conference",
                    Excerpt = "Hosted at LOGOS University College in Tirana and AAB College in Prishtina, the conference focused on migration, resilience, psychosocial support, and inclusive institutional frameworks.",
                    Content = "The project gathered students, researchers, and practitioners to explore interdisciplinary responses to migration.",
                    PublishedAt = new DateTime(2026, 3, 30),
                    ImageUrl = "/assets/Ardiani.jpg"
                },
                new NewsItem
                {
                    Title = "IULM University Leads Regional Training to Advance Micro-Credential Courses",
                    Excerpt = "A regional training activity supported trainers and academic staff in designing flexible micro-credential courses across the Western Balkans.",
                    Content = "The training helped partner universities prepare targeted professional learning pathways.",
                    PublishedAt = new DateTime(2025, 12, 2)
                });
        }

        if (!await db.ContentPages.AnyAsync())
        {
            db.ContentPages.AddRange(DefaultPages());
        }

        await db.SaveChangesAsync();
    }

    private static IEnumerable<ContentPage> DefaultPages()
    {
        return
        [
            Page("overview", "About", "Project Overview", "The full project story, reorganized into a clearer page while keeping the actual site content.",
                ("What the project addresses", "The WB-Edu4Migration project addresses a critical skills gap among social workers in Kosovo and Albania regarding migrant populations."),
                ("Main purpose", "The goal is to create a more inclusive and supportive environment for migrants while helping social workers better advocate for their needs.")),
            Page("partners", "Consortium", "Project Partners", "Academic institutions and organizations from Kosovo, Albania, Denmark, Austria, and Italy.",
                ("Kolegji AAB", "Coordinator, Kosovo."),
                ("International Business College Mitrovica", "Partner institution, Kosovo."),
                ("University of Tirana", "Partner institution, Albania."),
                ("IULM University", "EU partner institution, Italy.")),
            Page("management", "Structure", "Project Management", "Clear coordination, monitoring, and implementation roles keep the consortium aligned.",
                ("Coordination", "Project coordination is led by AAB College with partner collaboration across work packages."),
                ("Monitoring", "Quality assurance, communication, and reporting support implementation and sustainability.")),
            Page("objectives", "Objectives", "Objectives and Target Groups", "The project supports future and current social workers, educators, institutions, and migrant communities.",
                ("Educational reform", "Enhance social work curricula with migration-focused content and applied teaching methods."),
                ("Professional development", "Offer flexible learning for practitioners through digital micro-credential courses.")),
            Page("outcomes", "Impact", "Expected Outcomes", "The project aims to leave stronger institutions, better trained professionals, and more inclusive support for migrants.",
                ("Updated curricula", "Partner institutions improve study programs in social work and related fields."),
                ("Sustainable learning", "Micro-credentials and training materials remain available for future cohorts.")),
            Page("deliverables", "Outputs", "Deliverables", "Reports, courses, training materials, and dissemination outputs are organized as reusable project resources.",
                ("Needs Assessment Report", "Research and analysis of migration-related skills gaps and education needs."),
                ("Micro-Credential Framework", "A flexible framework for professional learning modules.")),
            Page("milestones", "Timeline", "Milestones", "The implementation path moves from analysis to training, course development, pilots, and dissemination.",
                ("Project launch", "Kick-off, management structures, and work package alignment."),
                ("Training and pilots", "Training of trainers and implementation of migration-focused learning content.")),
            Page("events", "Activities", "Events", "Workshops, practitioners' days, roundtables, trainings, and dissemination conferences.",
                ("E1.1 - Kick-off Meeting", "Prishtina, Kosovo. Establish project structures and outline work packages."),
                ("E3.1 - Training of Trainers in Denmark", "Odense, Denmark. Case study development and project/problem-based learning methodologies."),
                ("E6.1 - Final Dissemination Conference in Kosovo", "Present results, lessons learned, and future sustainability."))
        ];
    }

    private static ContentPage Page(string slug, string eyebrow, string title, string intro, params (string Title, string Body)[] sections)
    {
        return new ContentPage
        {
            Slug = slug,
            Eyebrow = eyebrow,
            Title = title,
            Intro = intro,
            Sections = sections.Select((section, index) => new ContentSection
            {
                Title = section.Title,
                Body = section.Body,
                SortOrder = index
            }).ToList()
        };
    }
}
