from django.db import migrations

HOMEPAGE_SECTIONS_EN = {
    "hero": {
        "eyebrow": "Technology & Digital Transformation Company · Tanzania",
        "titleLine1": "Engineering the Digital Backbone of",
        "titleLine2": "East African Business",
        "subtitle": (
            "Syntrix Digital Solutions designs and builds enterprise software, ERP systems, "
            "websites, and AI-driven digital experiences that help organizations in Tanzania "
            "and across East Africa operate faster, safer, and smarter."
        ),
        "primaryCta": "Request a Free Consultation",
        "secondaryCta": "Explore Our Services",
        "trustBadge": "Trusted by schools, enterprises, and growing businesses across Tanzania",
    },
    "intro": {
        "eyebrow": "Who We Are",
        "title": "A Digital Transformation Partner Built for Africa's Growth",
        "description": (
            "We are a full-service technology company headquartered in Tanzania, combining "
            "enterprise software engineering, cloud architecture, SEO, and AI to help businesses, "
            "schools, and institutions modernize with confidence. From custom-built ERP systems to "
            "secure cloud infrastructure, we engineer solutions that scale with you."
        ),
        "points": [
            "Enterprise-grade engineering standards",
            "Deep understanding of the East African market",
            "End-to-end delivery — from strategy to support",
            "Security and compliance built in from day one",
        ],
        "badgeValue": "10+",
        "badgeLabel": "Years of Impact",
    },
    "overview": {
        "eyebrow": "Digital Solutions Overview",
        "title": "Every Layer of Your Digital Transformation, Handled",
        "description": (
            "Software, infrastructure, growth, and brand — delivered as one coherent system "
            "instead of disconnected vendors."
        ),
        "pillars": [
            {"title": "Build", "description": "Custom software, websites, ERP systems, and mobile apps engineered for reliability at scale."},
            {"title": "Automate", "description": "Business process automation and AI solutions that remove manual work and reduce errors."},
            {"title": "Grow", "description": "SEO, digital marketing, and branding that turn your digital presence into a growth engine."},
            {"title": "Secure & Scale", "description": "Cloud architecture and IT consulting that keep systems secure, available, and ready to scale."},
        ],
    },
    "featuredProjects": {
        "eyebrow": "Our Work",
        "title": "Recent Projects",
        "description": "A look at how we've helped organizations across Tanzania modernize with confidence.",
    },
    "services": {
        "eyebrow": "Our Services",
        "title": "Comprehensive Digital Solutions Under One Roof",
        "description": "Ten core service lines covering the full lifecycle of enterprise digital transformation.",
        "viewAll": "View All Services",
    },
    "techStack": {
        "eyebrow": "Technology Stack",
        "title": "Modern, Battle-Tested Technology",
        "description": (
            "We build on production-proven frameworks trusted by the world's leading technology "
            "companies — chosen for performance, security, and long-term maintainability."
        ),
        "categories": [
            {"label": "Frontend", "items": ["Next.js", "React", "TypeScript", "Tailwind CSS"]},
            {"label": "Backend", "items": ["Django", "Django REST Framework", "Python", "Node.js"]},
            {"label": "Data", "items": ["PostgreSQL", "Redis", "REST APIs", "GraphQL"]},
            {"label": "Cloud & DevOps", "items": ["Docker", "AWS", "CI/CD", "Nginx"]},
            {"label": "AI & Automation", "items": ["Machine Learning", "Process Automation", "AI Translation", "Data Pipelines"]},
        ],
    },
    "whyChooseUs": {
        "eyebrow": "Why Choose Syntrix",
        "title": "Enterprise Quality, Local Understanding",
        "reasons": [
            {"title": "Enterprise-Grade Engineering", "description": "Production-ready architecture, tested code, and scalable infrastructure — not templated shortcuts."},
            {"title": "Security by Design", "description": "Authentication, data protection, and secure API design are built in from the first line of code."},
            {"title": "Local Market Expertise", "description": "We understand Tanzanian and East African business, regulatory, and infrastructure realities."},
            {"title": "Transparent Delivery", "description": "Clear timelines, documented architecture decisions, and honest communication throughout every project."},
            {"title": "Long-Term Partnership", "description": "We support, maintain, and evolve what we build — we don't disappear after launch."},
            {"title": "Multilingual, Multi-Market Ready", "description": "Every solution is built to serve English, Kiswahili, French, and Arabic-speaking audiences from day one."},
        ],
    },
    "industries": {
        "eyebrow": "Industries Served",
        "title": "Purpose-Built Solutions Across Sectors",
        "items": [
            {"title": "Education", "description": "School and university ERP systems, student management, and e-learning platforms."},
            {"title": "Finance & Banking", "description": "Secure, compliant systems for financial institutions and fintech innovators."},
            {"title": "Healthcare", "description": "Patient management, records, and digital health infrastructure."},
            {"title": "Retail & E-Commerce", "description": "Online storefronts, inventory, and business management systems."},
            {"title": "Government & NGOs", "description": "Digital services, reporting systems, and public-facing platforms."},
            {"title": "Manufacturing & Logistics", "description": "Automation and business management systems for operational efficiency."},
        ],
    },
    "stats": {
        "eyebrow": "Our Impact",
        "items": [
            {"value": "50+", "label": "Projects Delivered"},
            {"value": "30+", "label": "Businesses Transformed"},
            {"value": "4", "label": "Languages Supported"},
            {"value": "99.9%", "label": "Platform Uptime Target"},
        ],
    },
    "testimonials": {
        "eyebrow": "Client Testimonials",
        "title": "Trusted by Organizations Across Tanzania",
        "items": [
            {
                "quote": "Syntrix rebuilt our entire student management workflow. What used to take our staff days now takes minutes, and parents finally have real visibility into their children's progress.",
                "name": "Head of Administration",
                "role": "Private Secondary School, Dar es Salaam",
            },
            {
                "quote": "Our new website and SEO strategy from Syntrix doubled our qualified inquiries within four months. The team understood our market in a way international agencies never did.",
                "name": "Managing Director",
                "role": "Logistics Company, Tanzania",
            },
            {
                "quote": "They didn't just write code — they explained every architectural decision and left us with documentation our internal team could actually maintain.",
                "name": "IT Manager",
                "role": "Financial Services Firm",
            },
        ],
    },
    "cta": {
        "title": "Ready to Transform Your Business Digitally?",
        "description": "Talk to our team about how custom software, ERP systems, or a modern digital presence can move your organization forward.",
        "primary": "Request a Free Consultation",
        "secondary": "View Our Portfolio",
    },
}

ABOUT_SECTIONS_EN = {
    "hero": {
        "eyebrow": "About Syntrix Digital Solutions",
        "title": "Building Tanzania's Digital Infrastructure, One System at a Time",
        "subtitle": (
            "We're a team of engineers, designers, and strategists on a mission to make "
            "enterprise-grade technology accessible to East African businesses."
        ),
    },
    "story": {
        "eyebrow": "Our Story",
        "title": "Why Syntrix Exists",
        "paragraphs": [
            "Syntrix Digital Solutions was founded on a simple observation: businesses, schools, and institutions across Tanzania were being underserved by technology providers — offered either generic international templates or fragile, unsupported local builds.",
            "We set out to close that gap by combining international engineering standards with deep local market knowledge. Every system we build — from a school ERP to a corporate website — is designed to the same standard we'd hold for a global enterprise client.",
            "Today, Syntrix supports organizations across education, finance, retail, logistics, and government sectors with software that is secure, scalable, and built to last.",
        ],
    },
    "vision": {
        "title": "Our Vision",
        "description": "To be East Africa's most trusted digital transformation partner — the company organizations turn to when technology needs to work, not just launch.",
    },
    "mission": {
        "title": "Our Mission",
        "description": "To provide reliable digital solutions that help businesses grow through software development, modern websites, automation, AI solutions, SEO, and digital transformation.",
    },
    "values": {
        "eyebrow": "Core Values",
        "title": "What Guides Our Work",
        "items": [
            {"title": "Reliability", "description": "We build systems that work correctly, every time, under real-world conditions."},
            {"title": "Integrity", "description": "Transparent pricing, honest timelines, and architecture decisions we can always explain."},
            {"title": "Innovation", "description": "We stay current with modern engineering practice so our clients don't inherit outdated technology."},
            {"title": "Security", "description": "Every system is designed with data protection and secure-by-default practices from day one."},
            {"title": "Local Impact", "description": "We measure success by the growth our clients achieve, not just the software we ship."},
        ],
    },
    "leadership": {
        "eyebrow": "Leadership",
        "title": "The Team Behind Syntrix",
        "description": (
            "Our leadership team brings together enterprise software engineering, cloud "
            "architecture, and digital strategy experience to guide every client engagement."
        ),
        "members": [
            {"name": "Founder & CEO", "role": "Strategy & Client Partnerships", "bio": "Leads company vision and client strategy, ensuring every engagement is aligned with measurable business outcomes."},
            {"name": "Head of Engineering", "role": "Software Architecture", "bio": "Oversees technical architecture across all projects, from ERP systems to cloud infrastructure."},
            {"name": "Head of Design", "role": "UI/UX & Branding", "bio": "Leads product design and brand identity work across web, mobile, and marketing platforms."},
            {"name": "Head of Growth", "role": "SEO & Digital Marketing", "bio": "Directs SEO strategy and digital marketing campaigns for client growth programs."},
        ],
    },
    "culture": {
        "eyebrow": "Company Culture",
        "title": "How We Work",
        "description": (
            "We operate as a tight, senior-led team rather than a large outsourced agency. Every "
            "client works directly with the engineers and strategists building their solution — "
            "not layers of account management."
        ),
        "points": [
            "Direct access to the engineers building your system",
            "Documented, explainable architecture decisions",
            "Continuous learning — our team stays current with modern engineering practice",
            "Long-term thinking over one-off project delivery",
        ],
    },
}


def seed_sections(apps, schema_editor):
    Page = apps.get_model("pages", "Page")
    PageTranslation = apps.get_model("pages", "PageTranslation")

    for slug, sections in (("homepage", HOMEPAGE_SECTIONS_EN), ("about", ABOUT_SECTIONS_EN)):
        page, _ = Page.objects.get_or_create(slug=slug, defaults={"is_published": True})
        translation, created = PageTranslation.objects.get_or_create(
            page=page,
            language_code="en",
            defaults={
                "status": "published",
                "title": sections["hero"].get("title") or sections["hero"].get("titleLine1", slug),
                "sections": sections,
            },
        )
        if not created:
            translation.sections = sections
            translation.status = "published"
            translation.save(update_fields=["sections", "status"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("pages", "0002_pagetranslation_sections"),
    ]

    operations = [
        migrations.RunPython(seed_sections, noop_reverse),
    ]
