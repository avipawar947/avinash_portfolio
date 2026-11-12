import { notFound } from "next/navigation";
import PageShell from "@/components/ui/PageShell";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ContactCTA from "@/components/sections/ContactCTA";
import CaseStudyHero from "@/components/case-study/CaseStudyHero";
import CaseStudyViewer from "@/components/case-study/CaseStudyViewer";
import CaseStudyMoreWork from "@/components/case-study/CaseStudyMoreWork";
import { heroTitle, logoUrl, navTitle } from "@/components/case-study/helpers";
import { getCaseStudyBySlug } from "@/lib/content";
import { resolvePanels } from "@/lib/case-study-panels";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getCaseStudyBySlug(params.slug);
  if (!data) return { title: "Case Study — Avinash Pawar" };
  const title = heroTitle(data.project);
  const overview = resolvePanels(data.project.caseStudy).find((p) => p.preset === "overview");
  return {
    title: `${title} — Case Study · Avinash Pawar`,
    description: overview?.body?.slice(0, 160) || `Case study: ${title}`,
  };
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const data = await getCaseStudyBySlug(params.slug);
  if (!data) notFound();
  const { project, related, navbar, contactCTA, footer } = data;
  const navLogo = logoUrl(project);

  // The hero + viewer are client components; strip Mongoose document
  // prototypes so only plain JSON crosses the server/client boundary.
  const projectData = JSON.parse(JSON.stringify(project));
  // Navbar hash links (#work etc.) must go home: /#work
  const navLinks = navbar.links.map((l) =>
    l.href.startsWith("#") ? { ...l, href: `/${l.href}` } : l
  );
  const navbarContent = { ...navbar, links: navLinks };

  return (
    <PageShell>
      <Navbar
        content={navbarContent}
        linkedInUrl={footer.socialLinks.find((s) => s.platform === "linkedin")?.url}
      />
      <main className="cs-page bg-[#0b0b0b]">
        <CaseStudyHero project={projectData} />
        <CaseStudyViewer project={projectData} logoUrl={navLogo} projectTitle={navTitle(project)} />
        <CaseStudyMoreWork related={related} />
        <ContactCTA content={contactCTA} footer={footer} variant="case-study" />
      </main>
      <Footer footer={footer} navbar={navbar} />
    </PageShell>
  );
}
