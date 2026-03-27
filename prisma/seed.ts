import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CMS content...");

  // ── Clean up old data to prevent duplicates ───────────────────
  await prisma.videoTestimonial.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.pricingTier.deleteMany();
  await prisma.faqItem.deleteMany();
  console.log("  ✓ Cleared old data");

  // ── Services ──────────────────────────────────────────────────
  const services = [
    {
      slug: "uk-visa",
      flag: "🇬🇧",
      title: "UK Visa Refusal Recovery Service",
      subtitle: "Focused SOP rebuilding and refusal-response strategy for UK student and visitor cases.",
      description: "Expert SOP rewriting and documentation strategy for UK student, visitor, and dependent visa refusals.",
      accent: "accent-uk",
      price: "Starting from ₹4,999",
      reasonStats: JSON.stringify([
        "Most UK refusals cite credibility, funds clarity, or weak academic rationale.",
        "Template SOPs and generic career plans are frequently flagged by officers.",
        "Reapplications succeed when each refusal line is answered with evidence-backed logic.",
      ]),
      differentiators: JSON.stringify([
        "Former UK-document-review perspective in strategy design",
        "Clear tie-back narrative for return intent and progression logic",
        "Submission-ready checklist aligned to VFS and UKVI expectations",
      ]),
      pricingAnalysis: "₹999",
      pricingFull: "₹4,999",
      pricingExpress: "₹7,999",
      testimonials: JSON.stringify([
        { name: "Rahul M.", role: "MSc Applicant", feedback: "The rewritten SOP addressed every refusal point and improved my presentation significantly." },
        { name: "Sonal K.", role: "Visitor Visa Applicant", feedback: "They improved my financial and intent explanation without making unrealistic claims." },
      ]),
      sortOrder: 0,
    },
    {
      slug: "canada-visa",
      flag: "🇨🇦",
      title: "Canada Study Permit Refusal Recovery",
      subtitle: "High-precision SOP and financial explanation strategy for Canadian study permits.",
      description: "High-precision SOP and financial explanation strategy tailored to IRCC reasoning patterns.",
      accent: "accent-canada",
      price: "Starting from ₹5,499",
      reasonStats: JSON.stringify([
        "Study permit refusals often cite purpose of visit and financial sufficiency.",
        "Officers look for coherent program logic and realistic post-study pathway.",
        "Strong proof alignment between SOP, finances, and admission profile is essential.",
      ]),
      differentiators: JSON.stringify([
        "Program-to-career narrative framework tailored to IRCC reasoning",
        "Financial continuity explanations for salary, sponsor, and asset documents",
        "Pre-submission contradiction audit across all forms and supporting files",
      ]),
      pricingAnalysis: "₹1,199",
      pricingFull: "₹5,499",
      pricingExpress: "₹8,499",
      testimonials: JSON.stringify([
        { name: "Sneha P.", role: "PG Diploma Applicant", feedback: "My refusal was for purpose of visit. Their strategy made my case coherent and credible." },
        { name: "Dev J.", role: "Business Program Applicant", feedback: "The financial explanation letter was the biggest difference in my reapplication." },
      ]),
      sortOrder: 1,
    },
    {
      slug: "schengen-visa",
      flag: "🇪🇺",
      title: "Schengen Visa Refusal Fix Service",
      subtitle: "Tourist and short-stay refusal recovery with itinerary-safe documentation.",
      description: "Tourist and short-stay refusal recovery with itinerary-safe documentation for Italy, France, and more.",
      accent: "accent-schengen",
      price: "Starting from ₹4,499",
      reasonStats: JSON.stringify([
        "Common refusal grounds include travel intent, financial reliability, and return certainty.",
        "Weak itinerary or inconsistent bookings can trigger avoidable doubts.",
        "Country-specific embassy preferences need precision in supporting evidence.",
      ]),
      differentiators: JSON.stringify([
        "Itinerary-document consistency checks before filing",
        "Intent and tie-back narrative for tourism and short visits",
        "Country-specific document framing for Italy, France, Germany, and more",
      ]),
      pricingAnalysis: "₹899",
      pricingFull: "₹4,499",
      pricingExpress: "₹6,999",
      testimonials: JSON.stringify([
        { name: "Nisha T.", role: "Italy Tourist Visa Applicant", feedback: "Their updated cover letter and itinerary proof solved the refusal issues quickly." },
        { name: "Aditya V.", role: "France Visitor Applicant", feedback: "They found contradictions in my bookings that my earlier consultant missed." },
      ]),
      sortOrder: 2,
    },
    {
      slug: "germany-visa",
      flag: "🇩🇪",
      title: "Germany Student Visa Refusal Recovery",
      subtitle: "Specialized SOP and blocked-account clarification for German study applications.",
      description: "Specialized SOP and blocked-account clarification for German study and work visa applications.",
      accent: "accent-germany",
      price: "Starting from ₹5,999",
      reasonStats: JSON.stringify([
        "Frequent concerns include financial proof clarity, APS context, and study intent.",
        "Inconsistent academic mapping can weaken visa officer confidence.",
        "Proper consulate-ready documentation significantly improves outcomes.",
      ]),
      differentiators: JSON.stringify([
        "Academic progression narrative matched to German course structure",
        "Blocked-account and sponsor explanation support",
        "Concise document pack with interview-consistent talking points",
      ]),
      pricingAnalysis: "₹1,199",
      pricingFull: "₹5,999",
      pricingExpress: "₹8,999",
      testimonials: JSON.stringify([
        { name: "Ananya L.", role: "TU9 Applicant", feedback: "They clarified my financial trail and improved SOP logic. Approval came in the next cycle." },
        { name: "Ankit R.", role: "Data Science Applicant", feedback: "The team made my documents consulate-ready and easier to defend in interview." },
      ]),
      sortOrder: 3,
    },
    {
      slug: "australia-visa",
      flag: "🇦🇺",
      title: "Australia Visa Refusal Recovery",
      subtitle: "Strong genuine-student narrative and evidence strategy for reapplications.",
      description: "Strong genuine-student narrative and evidence strategy for Australian reapplications.",
      accent: "accent-australia",
      price: "Starting from ₹5,499",
      reasonStats: JSON.stringify([
        "Australian refusals often revolve around intent credibility and profile consistency.",
        "Generic statements about career plans are commonly rejected.",
        "Financial and sponsor narratives must match documentation exactly.",
      ]),
      differentiators: JSON.stringify([
        "GTE-style narrative improvement focused on credibility",
        "Profile consistency review across forms and attachments",
        "Fast-tracked urgent filing support for intake deadlines",
      ]),
      pricingAnalysis: "₹1,099",
      pricingFull: "₹5,499",
      pricingExpress: "₹8,299",
      testimonials: JSON.stringify([
        { name: "Karan S.", role: "Masters Applicant", feedback: "My file became much stronger after they restructured intent and financial sections." },
        { name: "Nikita H.", role: "Graduate Diploma Applicant", feedback: "Excellent turnaround and practical checklists. I knew exactly what to submit." },
      ]),
      sortOrder: 4,
    },
    {
      slug: "fresh-sop",
      flag: "📝",
      title: "Fresh SOP Writing Service",
      subtitle: "Officer-focused SOP drafting for first-time applicants who want a strong file from day one.",
      description: "Officer-focused SOP drafting for first-time applicants who want a strong file from day one.",
      accent: "accent-sop",
      price: "Starting from ₹2,999",
      reasonStats: JSON.stringify([
        "Many first-time refusals are preventable with better narrative structure.",
        "Weakly structured SOPs create doubt around intent and planning.",
        "Country-specific SOP expectations differ and require tailored writing.",
      ]),
      differentiators: JSON.stringify([
        "Interview-aligned SOP narrative that is easy to defend",
        "Country and visa-type custom drafting instead of templates",
        "Revision rounds included before final submission",
      ]),
      pricingAnalysis: "Free fit-check",
      pricingFull: "₹2,999",
      pricingExpress: "₹4,499",
      testimonials: JSON.stringify([
        { name: "Riya B.", role: "First-Time Canada Applicant", feedback: "They made my SOP structured and evidence-driven. It sounded like my profile, not a template." },
        { name: "Akash N.", role: "UK MSc Applicant", feedback: "Clear writing, practical edits, and great support before final submission." },
      ]),
      sortOrder: 5,
    },
  ];

  for (const svc of services) {
    await prisma.siteService.upsert({
      where: { slug: svc.slug },
      update: svc,
      create: svc,
    });
  }
  console.log(`  ✓ ${services.length} services seeded`);

  // ── Service FAQs ──────────────────────────────────────────────
  const serviceFaqs: Record<string, { question: string; answer: string }[]> = {
    "uk-visa": [
      { question: "Can you help after multiple UK refusals?", answer: "Yes. Multi-refusal cases are common and require deeper evidence restructuring." },
      { question: "Do you review CAS-related documentation context?", answer: "Yes, especially where course logic and progression need better explanation." },
      { question: "Do you support visitor and dependent categories?", answer: "Yes, where refusal recovery depends on narrative and documentation quality." },
    ],
    "canada-visa": [
      { question: "Can you assist with SDS and non-SDS files?", answer: "Yes. We structure strategy based on your specific intake, category, and profile." },
      { question: "Do you rewrite old generic SOPs from agents?", answer: "Yes. Most clients come with template SOPs that need complete reconstruction." },
      { question: "Do you include financial explanation letters?", answer: "Yes, included in full recovery plans with rationale and document references." },
    ],
    "schengen-visa": [
      { question: "Can you help with Italy and France refusals?", answer: "Yes, including itinerary, sponsor, and return-intent strengthening." },
      { question: "Do you prepare cover letters for Schengen cases?", answer: "Yes. Cover letters are included in full recovery and express plans." },
      { question: "Can you support family travel applications?", answer: "Yes, with profile-specific consistency checks across all applicants." },
    ],
    "germany-visa": [
      { question: "Can you help with blocked account explanations?", answer: "Yes, we build clear source-of-funds and continuity narratives." },
      { question: "Do you support APS-linked profile clarity?", answer: "Yes. We align educational history, chosen course, and post-study plan." },
      { question: "Do you give mock interview guidance?", answer: "Yes, high-level talking points are included with full recovery plans." },
    ],
    "australia-visa": [
      { question: "Do you support GS/GTE related refusals?", answer: "Yes, this is one of our most common Australia case categories." },
      { question: "Can you prepare financial explanations for sponsors?", answer: "Yes. We include sponsor background and fund-source narrative where needed." },
      { question: "Do you handle urgent deadlines?", answer: "Yes, express turnaround is available for qualifying profiles." },
    ],
    "fresh-sop": [
      { question: "Do you write SOPs for first-time applicants?", answer: "Yes. We draft from scratch based on your profile and destination." },
      { question: "Can one SOP be reused for multiple countries?", answer: "No. Each destination requires a tailored narrative and supporting logic." },
      { question: "How many revisions are included?", answer: "Two rounds are included in the standard plan, with add-ons available." },
    ],
  };

  let faqCount = 0;
  for (const [slug, faqs] of Object.entries(serviceFaqs)) {
    const service = await prisma.siteService.findUnique({ where: { slug } });
    if (!service) continue;
    for (let i = 0; i < faqs.length; i++) {
      await prisma.faqItem.create({
        data: { question: faqs[i].question, answer: faqs[i].answer, serviceId: service.id, sortOrder: i },
      });
      faqCount++;
    }
  }

  // ── Global FAQs ───────────────────────────────────────────────
  const globalFaqs = [
    { question: "Will reapplying after a refusal hurt my chances?", answer: "Not if refusal reasons are addressed directly with stronger evidence and improved narrative logic." },
    { question: "How do I share my refusal letter with you?", answer: "Use the encrypted upload field in our form or share securely on WhatsApp Business after confirmation." },
    { question: "Is my personal information safe?", answer: "Yes. Files are encrypted in transit and retained only for the minimum service period." },
    { question: "What if I disagree with the refusal reason?", answer: "We still map strategy to the officer's written concerns, because that is what is evaluated during reapplication." },
    { question: "Can you help with multiple visa types?", answer: "Yes. We support student, tourist, selected work categories, and fresh SOP writing." },
    { question: "How soon can I reapply after rejection?", answer: "Timelines vary by country and category. Reapply once refusal points are resolved and documents are updated." },
    { question: "Do you provide services for work visas too?", answer: "Yes, for selected categories where document narratives are required." },
    { question: "What is your approval rate?", answer: "Our rolling success benchmark is 94% on cases that follow the full strategy and checklist." },
    { question: "Can I use the SOP for multiple countries?", answer: "No. Each destination evaluates specific criteria, so each SOP should be tailored." },
    { question: "Do you work with students, workers, or tourists?", answer: "All three. Each case is handled with profile-specific strategy and documents." },
  ];

  for (let i = 0; i < globalFaqs.length; i++) {
    await prisma.faqItem.create({
      data: { question: globalFaqs[i].question, answer: globalFaqs[i].answer, serviceId: null, sortOrder: i },
    });
    faqCount++;
  }
  console.log(`  ✓ ${faqCount} FAQ items seeded`);

  // ── Testimonials ──────────────────────────────────────────────
  const testimonials = [
    { name: "Rahul M.", country: "🇬🇧 UK Visa", date: "February 2026", feedback: "After two UK refusals I was hopeless. Their consultant analyzed my letter in two hours and mapped every red flag." },
    { name: "Sneha P.", country: "🇨🇦 Canada Visa", date: "January 2026", feedback: "The SOP they wrote was completely different from what I had. Specific, professional, and easy for the officer to follow." },
    { name: "Ankit R.", country: "🇩🇪 Germany Visa", date: "December 2025", feedback: "Their financial explanation letter solved exactly what was missing in my previous file." },
    { name: "Nisha T.", country: "🇫🇷 Schengen Visa", date: "November 2025", feedback: "Fast turnaround and clear communication. They rewrote my trip narrative and fixed document mismatches." },
    { name: "Karan S.", country: "🇦🇺 Australia Visa", date: "October 2025", feedback: "They told me what to fix first, then delivered every file in 24 hours for my urgent timeline." },
    { name: "Megha D.", country: "🇨🇦 Canada Visa", date: "September 2025", feedback: "The difference was structure and logic, not fancy words. That changed my outcome." },
  ];

  for (let i = 0; i < testimonials.length; i++) {
    await prisma.testimonial.create({
      data: { ...testimonials[i], rating: 5, featured: i < 3, sortOrder: i },
    });
  }
  console.log(`  ✓ ${testimonials.length} testimonials seeded`);

  // ── Pricing Tiers ─────────────────────────────────────────────
  const pricingTiers = [
    {
      name: "Refusal Analysis Only",
      price: "₹999",
      note: "Single-case strategy report",
      features: JSON.stringify(["Detailed analysis of refusal reasons", "Written strategy report", "Actionable reapplication checklist", "SOP writing not included"]),
      popular: false,
      amountInr: 999,
      sortOrder: 0,
    },
    {
      name: "Full Visa Recovery",
      price: "₹4,999 / €60",
      note: "Most popular",
      features: JSON.stringify(["Everything in Analysis", "Full SOP rewrite (2 revisions)", "Financial explanation letter", "Submission checklist", "48-hour delivery", "Refund if reapplication rejected*"]),
      popular: true,
      amountInr: 4999,
      sortOrder: 1,
    },
    {
      name: "Express Recovery",
      price: "₹12,000",
      note: "Urgent turnaround",
      features: JSON.stringify(["Everything in Full Recovery", "24-hour delivery", "Priority WhatsApp support", "Cover letter + supporting docs"]),
      popular: false,
      amountInr: 12000,
      sortOrder: 2,
    },
  ];

  for (const tier of pricingTiers) {
    await prisma.pricingTier.create({ data: tier });
  }
  console.log(`  ✓ ${pricingTiers.length} pricing tiers seeded`);

  // ── Blog Posts ─────────────────────────────────────────────────
  const blogPosts = [
    {
      slug: "sop-canada-study-visa-after-refusal-2026-guide",
      title: "SOP for Canada Study Visa After Refusal: 2026 Guide",
      description: "A practical framework to rebuild a Canada study permit SOP after refusal with stronger intent and financial logic.",
      publishedAt: "2026-02-14",
      readTime: "14 min read",
      cta: "Need a refusal-focused Canada SOP? Start with a free analysis.",
      content: JSON.stringify([
        { heading: "Why Most Rewritten SOPs Still Fail", paragraphs: ["After refusal, many applicants only edit wording but keep the same weak structure. Visa officers are not judging vocabulary; they are judging credibility and risk.", "If your first SOP had unclear progression, unsupported career claims, or inconsistent finance references, a cosmetic rewrite will not help."] },
        { heading: "The 2026 SOP Structure That Works", paragraphs: ["Open with a concise academic and professional timeline. Explain why this program is a logical continuation instead of a random choice.", "Demonstrate sustainable funding and close with a realistic post-study plan tied to home-country opportunities."] },
        { heading: "Refusal-to-Response Mapping", paragraphs: ["If refusal cites purpose of visit, answer with curriculum relevance and role-based career outcomes. If refusal cites finances, add source tracing and sponsor continuity.", "Your SOP should never argue emotionally with refusal language. It should prove, through evidence, that concerns are now resolved."] },
        { heading: "Before You Reapply", paragraphs: ["Verify all dates, sponsor relations, and account references are consistent across SOP, forms, and supporting files.", "Reapply only when your new file is structurally stronger than the refused one."] },
      ]),
    },
    {
      slug: "uk-student-visa-rejected-what-to-do-next",
      title: "UK Student Visa Rejected: What to Do Next",
      description: "A practical post-refusal action plan for UK student applicants, from letter analysis to reapplication timing.",
      publishedAt: "2026-01-28",
      readTime: "12 min read",
      cta: "Upload your UK refusal letter for a 2-hour strategy breakdown.",
      content: JSON.stringify([
        { heading: "Read the Refusal Letter Properly", paragraphs: ["Treat the refusal letter as your roadmap. Separate factual gaps from interpretation gaps so your corrections are targeted.", "UK refusals often repeat when applicants refile quickly without addressing root issues."] },
        { heading: "Diagnose the Root Cause", paragraphs: ["Most UK student refusals involve intent credibility, funds traceability, or weak course-progression logic.", "If your SOP sounds templated or your sponsor context is unclear, rebuild both narrative and financial explanation together."] },
        { heading: "Rebuild in Layers", paragraphs: ["Layer 1 is narrative, layer 2 is evidence, and layer 3 is submission control. All three must align.", "A better file is one where an officer can verify claims quickly without contradictions."] },
        { heading: "Reapplication Timing", paragraphs: ["There is no universal waiting period. Quality matters more than speed.", "Reapply when each refusal line has a document-backed response."] },
      ]),
    },
    {
      slug: "schengen-visa-refusal-reasons-and-how-to-fix-them",
      title: "Schengen Visa Refusal Reasons and How to Fix Them",
      description: "Understand common Schengen refusal patterns and fix itinerary, finance, and return-intent issues before reapplying.",
      publishedAt: "2026-03-02",
      readTime: "11 min read",
      cta: "Get your Schengen refusal analyzed before booking again.",
      content: JSON.stringify([
        { heading: "Common Refusal Patterns", paragraphs: ["Top patterns include unclear travel intent, weak financial proof, and insufficient return ties.", "Applications with inconsistent bookings or vague day plans face higher rejection risk."] },
        { heading: "Fixing Itinerary Credibility", paragraphs: ["Your itinerary should be realistic and document-backed. Avoid over-ambitious plans copied from internet samples.", "Ensure bookings, leave dates, insurance windows, and cover letter timeline all match."] },
        { heading: "Strengthening Financial Presentation", paragraphs: ["Explain unusual account movement and sponsor relationships clearly. Do not rely on one large recent deposit without context.", "Submit relevant financial evidence only, organized for easy officer review."] },
        { heading: "Reapply with a Clean File", paragraphs: ["Address the refusal reason directly and avoid argumentative language.", "Submit a compact file where every claim maps to supporting proof."] },
      ]),
    },
    {
      slug: "how-to-write-a-financial-explanation-letter-for-visa",
      title: "How to Write a Financial Explanation Letter for Visa",
      description: "A practical format for financial explanation letters that removes ambiguity and improves file clarity.",
      publishedAt: "2026-02-06",
      readTime: "10 min read",
      cta: "Need help drafting your financial explanation letter? Talk to our team.",
      content: JSON.stringify([
        { heading: "When You Need This Letter", paragraphs: ["Use a financial letter when statements alone do not explain source of funds, sponsor support, or unusual movements.", "It is critical in refusal recovery where affordability or legitimacy was questioned."] },
        { heading: "Recommended Structure", paragraphs: ["Start with who is funding and why. Then list each funding source with exact value and document references.", "Explain unusual transactions in plain language and close with confirmation of available funds."] },
        { heading: "Mistakes to Avoid", paragraphs: ["Do not use unverifiable rounded claims. Do not contradict SOP and form figures.", "Avoid legal jargon. Keep the letter concise and factual."] },
        { heading: "Final Validation", paragraphs: ["Double-check arithmetic, names, and relationship details across all files.", "A clean index with numbered attachments helps officers verify quickly."] },
      ]),
    },
    {
      slug: "germany-student-visa-rejection-common-mistakes",
      title: "Germany Student Visa Rejection: Common Mistakes",
      description: "Avoid common Germany student visa errors with better course logic, financial presentation, and interview consistency.",
      publishedAt: "2026-01-17",
      readTime: "13 min read",
      cta: "Book a Germany refusal review with our document specialists.",
      content: JSON.stringify([
        { heading: "Weak Course Logic", paragraphs: ["Random degree switching without a clear rationale creates doubt around intent and planning.", "Explain exactly why your chosen curriculum is the right next step for your profile."] },
        { heading: "Financial Clarity Gaps", paragraphs: ["Blocked account proof alone may not be enough if sponsor support remains unclear.", "Build a source-of-funds narrative that is stable and easy to verify."] },
        { heading: "Generic SOPs", paragraphs: ["Statements like 'Germany has quality education' are too broad and add little value.", "Use profile-specific and program-specific details instead of template language."] },
        { heading: "Interview Mismatch", paragraphs: ["Interview answers must align with SOP and supporting documents.", "Prepare concise talking points so you can defend your file consistently."] },
      ]),
    },
    {
      slug: "what-does-not-satisfied-you-will-leave-mean-on-a-refusal",
      title: "What Does 'Not Satisfied You Will Leave' Mean on a Refusal?",
      description: "Decode this refusal line and improve return-intent evidence before your next application.",
      publishedAt: "2026-03-10",
      readTime: "9 min read",
      cta: "Get a return-intent strategy audit before reapplying.",
      content: JSON.stringify([
        { heading: "Officer Interpretation", paragraphs: ["This line means the officer was not convinced your stay would remain temporary.", "It often reflects unclear evidence-to-narrative linking rather than one single missing document."] },
        { heading: "Typical Triggers", paragraphs: ["Weak employment/business ties, inconsistent finances, or vague trip purpose can trigger this concern.", "Copy-paste statements without personal context usually reduce credibility."] },
        { heading: "How to Strengthen Return Intent", paragraphs: ["Use concrete anchors: ongoing job responsibilities, business obligations, family commitments, or program-linked return outcomes.", "Keep your timeline realistic and ensure every claim has documentary support."] },
        { heading: "Reapplication Approach", paragraphs: ["Do not contest the wording emotionally. Resolve the concern with cleaner evidence and clearer narrative.", "Run a contradiction audit before filing again."] },
      ]),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPostEntry.upsert({
      where: { slug: post.slug },
      update: post,
      create: { ...post, status: "published" },
    });
  }
  console.log(`  ✓ ${blogPosts.length} blog posts seeded`);

  // ── Site Config ───────────────────────────────────────────────
  const configs = [
    { key: "hero_title", value: JSON.stringify("Every Visa Problem Has a Strategy"), label: "Hero Title" },
    { key: "hero_subtitle", value: JSON.stringify("We fix refusals by rebuilding your case from the officer's perspective."), label: "Hero Subtitle" },
    { key: "trust_stats", value: JSON.stringify([
      { label: "Cases Handled", value: "500+" },
      { label: "Approval Rate", value: "94%" },
      { label: "Average Delivery", value: "48hr" },
      { label: "Average Rating", value: "5★" },
    ]), label: "Trust Statistics" },
    { key: "process_steps", value: JSON.stringify([
      { title: "Share Your Refusal Letter", day: "Day 0", description: "Upload your refusal letter securely. We review every line and supporting context." },
      { title: "Expert Refusal Analysis", day: "Day 1", description: "A senior consultant maps every concern raised by the visa officer into a response strategy." },
      { title: "SOP + Document Rebuild", day: "Day 1-2", description: "We write an officer-focused SOP, financial explanation, and supporting letters where needed." },
      { title: "Reapply With Confidence", day: "Day 3+", description: "Receive final documents with a submission checklist and strategic filing notes." },
    ]), label: "Process Steps" },
    { key: "problem_cards", value: JSON.stringify([
      { title: "Weak SOP", description: "Visa officers reject 60%+ of applications because the SOP does not address specific concerns." },
      { title: "Financial Ambiguity", description: "Unclear or incomplete financial evidence triggers automatic doubt, regardless of actual funds." },
      { title: "Poor Documentation", description: "Missing or mismatched documents are the #1 avoidable reason for refusals." },
      { title: "No Clear Intent", description: "Officers need a compelling reason for your trip and a credible return intent." },
      { title: "Generic Templates", description: "AI-generated or copy-pasted SOPs are recognized quickly by experienced reviewers." },
      { title: "No Refusal Strategy", description: "Reapplying without addressing the exact refusal grounds is the biggest post-rejection mistake." },
    ]), label: "Problem Cards" },
    { key: "expert_profile", value: JSON.stringify({
      name: "Priya Mehta",
      role: "Former UK Home Office Documentation Reviewer",
      experience: "9 years of visa documentation and refusal-recovery experience",
      summary: "Our team includes ex-visa consultants, IELTS experts, and certified SOP writers who have reviewed applications from both sides of the table.",
    }), label: "Expert Profile" },
    { key: "social_proof_ticker", value: JSON.stringify([
      "Priya from Mumbai got her Canada visa approved this week",
      "Arjun from Pune received UK student visa approval",
      "Nidhi from Delhi cleared Schengen reapplication",
      "Harsh from Ahmedabad fixed financial clarification and got approval",
      "Ananya from Hyderabad approved for Germany intake",
      "Rohit from Bengaluru converted refusal into approval in 17 days",
    ]), label: "Social Proof Ticker" },
    { key: "case_studies", value: JSON.stringify([
      { title: "UK Student Visa", timeline: "Refused in January 2026 -> Approved in March 2026", before: "Refusal cited unclear study progression and weak post-study return rationale.", after: "Rebuilt SOP around academic progression, sponsor liquidity proof, and country-return anchors." },
      { title: "Canada Study Permit", timeline: "Refused in August 2025 -> Approved in November 2025", before: "Officer flagged purpose of visit and financial sustainability with inconsistent evidence.", after: "Drafted targeted SOP with ROI logic and a compliant financial narrative." },
      { title: "Schengen Italy Visa", timeline: "Refused in May 2025 -> Approved in July 2025", before: "Refusal letter highlighted uncertain itinerary credibility and weak tie-back evidence.", after: "Restructured travel narrative with document-aligned itinerary and return-intent proof." },
    ]), label: "Case Studies" },
    { key: "trust_destinations", value: JSON.stringify(["🇬🇧 UK", "🇨🇦 Canada", "🇩🇪 Germany", "🇮🇹 Italy", "🇦🇺 Australia", "🇫🇷 France"]), label: "Trust Destinations" },
    { key: "media_logos", value: JSON.stringify(["Shiksha", "Yocket", "Quora", "Reddit Communities"]), label: "Media Logos" },
    { key: "brand_name", value: JSON.stringify("VisaGuru"), label: "Brand Name" },
    { key: "brand_since", value: JSON.stringify("Since 2020"), label: "Brand Since Tag" },
    { key: "brand_tagline", value: JSON.stringify("Turning Visa Rejections Into Approvals Since 2020."), label: "Brand Tagline" },
    { key: "nav_links", value: JSON.stringify([
      { href: "/", label: "Home" },
      { href: "/services", label: "Services" },
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/reviews", label: "Reviews" },
    ]), label: "Navigation Links" },
    { key: "header_login", value: JSON.stringify({ href: "/login", label: "Login" }), label: "Header Login Link" },
    { key: "header_cta", value: JSON.stringify({ href: "/#free-analysis", label: "Free Refusal Analysis" }), label: "Header CTA" },
    { key: "footer_description", value: JSON.stringify("Premium refusal-recovery strategy for students, workers, and tourists."), label: "Footer Description" },
    { key: "footer_disclaimer", value: JSON.stringify("We are document preparation specialists. We do not provide legal advice. For complex immigration matters, consult a licensed immigration lawyer."), label: "Footer Disclaimer" },
    { key: "footer_link_groups", value: JSON.stringify([
      {
        title: "Services",
        links: [
          { href: "/uk-visa", label: "UK Visa" },
          { href: "/canada-visa", label: "Canada Visa" },
          { href: "/schengen-visa", label: "Europe Visa" },
          { href: "/germany-visa", label: "Germany Visa" },
          { href: "/australia-visa", label: "Australia Visa" },
          { href: "/fresh-sop", label: "Fresh SOP Writing" },
        ],
      },
      {
        title: "Company",
        links: [
          { href: "/about", label: "About Us" },
          { href: "/about#team", label: "Our Team" },
          { href: "/blog", label: "Blog" },
          { href: "/reviews", label: "Reviews" },
          { href: "/login", label: "Login" },
        ],
      },
      {
        title: "Legal",
        links: [
          { href: "/privacy-policy", label: "Privacy Policy" },
          { href: "/terms", label: "Terms of Service" },
          { href: "/refund-policy", label: "Refund Policy" },
          { href: "/cookie-policy", label: "Cookie Policy" },
        ],
      },
    ]), label: "Footer Link Groups" },
    { key: "footer_contact_links", value: JSON.stringify([
      { label: "Email", href: "mailto:hello@visaguru.live" },
      { label: "WhatsApp", href: "https://wa.me/919999999999" },
      { label: "Phone", href: "tel:+919999999999" },
    ]), label: "Footer Contact Links" },
    { key: "footer_social_links", value: JSON.stringify([
      { platform: "LinkedIn", href: "https://www.linkedin.com/company/visaguru" },
      { platform: "Instagram", href: "https://www.instagram.com/visaguru" },
      { platform: "YouTube", href: "https://www.youtube.com/@visaguru" },
    ]), label: "Footer Social Links" },
    { key: "footer_bottom_text", value: JSON.stringify("© 2026 VisaGuru | Registered in India (CIN: U12345MH2020PTC123456) | Not affiliated with any government embassy or immigration authority."), label: "Footer Bottom Text" },
    { key: "newsletter_title", value: JSON.stringify("Get visa tips in your inbox"), label: "Newsletter Title" },
    { key: "newsletter_subtitle", value: JSON.stringify("Actionable refusal-recovery guides, no spam."), label: "Newsletter Subtitle" },
    { key: "newsletter_button", value: JSON.stringify("Subscribe"), label: "Newsletter Button Text" },
    { key: "newsletter_placeholder", value: JSON.stringify("you@example.com"), label: "Newsletter Placeholder" },
    { key: "hero_tagline", value: JSON.stringify("Premium Visa Refusal Recovery"), label: "Hero Tagline" },
    { key: "hero_trust_message", value: JSON.stringify("Expert SOP Writing for All Major Destinations"), label: "Hero Trust Message" },
    { key: "stat_callout", value: JSON.stringify("In 2023, Canada alone rejected approximately 320,000 study permit applications."), label: "Homepage Stat Callout" },
    { key: "google_reviews_url", value: JSON.stringify("https://www.google.com/maps"), label: "Google Reviews URL" },
  ];

  for (const cfg of configs) {
    await prisma.siteConfig.upsert({
      where: { key: cfg.key },
      update: { value: cfg.value, label: cfg.label },
      create: cfg,
    });
  }
  console.log(`  ✓ ${configs.length} site config entries seeded`);

  // ── Video Testimonials (placeholders) ─────────────────────────
  const videos = [
    { title: "UK Student: From Double Refusal to Approval", videoUrl: "https://youtube.com/watch?v=placeholder1", country: "🇬🇧 UK", featured: true, sortOrder: 0 },
    { title: "Canada Study Permit Recovery", videoUrl: "https://youtube.com/watch?v=placeholder2", country: "🇨🇦 Canada", featured: true, sortOrder: 1 },
    { title: "Schengen Tourist Visa Success", videoUrl: "https://youtube.com/watch?v=placeholder3", country: "🇪🇺 Schengen", featured: false, sortOrder: 2 },
  ];

  for (const vid of videos) {
    await prisma.videoTestimonial.create({ data: vid });
  }
  console.log(`  ✓ ${videos.length} video testimonials seeded`);

  console.log("✅ Seeding complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
