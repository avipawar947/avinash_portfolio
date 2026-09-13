import { getHomeContent } from '@/lib/content';
import PageShell from '@/components/ui/PageShell';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import ClientMarquee from '@/components/sections/ClientMarquee';
import Projects from '@/components/sections/Projects';
import StatsGrid from '@/components/sections/StatsGrid';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import Gallery from '@/components/sections/Gallery';
import MyJourney from '@/components/sections/MyJourney';
import ToolsGrid from '@/components/sections/ToolsGrid';
import ContactCTA from '@/components/sections/ContactCTA';
import LifeBehindText from '@/components/sections/LifeBehindText';
import Footer from '@/components/sections/Footer';

// Revalidate periodically + on-demand (admin saves call revalidatePath('/') too).
export const revalidate = 60;

export default async function HomePage() {
  const content = await getHomeContent();

  return (
    <PageShell>
      <Navbar content={content.navbar} />
      <main>
        <Hero content={content.hero} />
        <ClientMarquee logos={content.clientLogos} />
        <Projects items={content.projects} />
        <StatsGrid items={content.stats} />
        <ProcessTimeline items={content.process} />
        <Gallery items={content.gallery} />
        <MyJourney content={content.journey} />
        <ToolsGrid items={content.tools} />
        <ContactCTA footer={content.footer} />
        <LifeBehindText items={content.lifeBehindText} />
      </main>
      <Footer footer={content.footer} navbar={content.navbar} />
    </PageShell>
  );
}
