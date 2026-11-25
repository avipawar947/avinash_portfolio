/**
 * Faint guide grid used behind the Gallery section.
 *
 * Desktop (`≥ lg`) reproduces the Figma guide grid shared by "Why Choose Me"
 * and "Our Process": vertical lines at x=160 on a 200px pitch, horizontal
 * lines at y=183 on a 184px pitch. Below `lg` the section re-bases onto the
 * design's ~100px square cell (`--grid-cell`), which is the grid the small
 * screens show.
 *
 * Both layers sit inside `.gallery-grid-bg`, whose mask fades the rules into
 * the background at the top and bottom — the same soft seam as the Case Study
 * stage — so the grid never hits the section edges hard.
 */
export default function GridOverlay() {
  return (
    <div className="gallery-grid-bg pointer-events-none absolute inset-0" aria-hidden>
      <div className="gallery-grid-desktop absolute inset-0 hidden lg:block" />
      <div className="gallery-grid-mobile absolute inset-0 lg:hidden" />
    </div>
  );
}
