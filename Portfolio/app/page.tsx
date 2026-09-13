import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Journey } from "@/components/Journey";
import { Life } from "@/components/Life";
import { Marquee } from "@/components/Marquee";
import { Navbar } from "@/components/Navbar";
import { Process } from "@/components/Process";
import { Projects } from "@/components/Projects";
import { Tools } from "@/components/Tools";

/**
 * Homepage — Figma frame 1:2 "Homepage" (1920 x 11835).
 *
 * Sections appear in the design's own vertical order; each owns its
 * layout, so this file stays a thin server component.
 *
 *   1:34   Navbar
 *   1:3    Hero                  y=0
 *   1:47   Marquee               y=1248
 *   1:127  Projects              y=1408
 *   1:273  Journey (stats)       y=3436
 *   1:163  Process               y=4811
 *   1:214  Gallery               y=6177
 *   1:396  About                 y=7276
 *   1:337  Tools                 y=8317
 *   1:410  Life                  y=10415
 *   1:703  Footer                y=11572  (empty in the design)
 *
 * Node 1:245 (y=9619, 1720x656) is skipped: it is an empty frame in the
 * design with no children and no name beyond a Webflow node id.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Marquee />
        <Projects />
        <Journey />
        <Process />
        <Gallery />
        <About />
        <Tools />
        <Life />
      </main>
      <Footer />
    </>
  );
}
