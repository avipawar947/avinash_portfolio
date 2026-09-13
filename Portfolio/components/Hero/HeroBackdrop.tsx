import Image from "next/image";

/**
 * The hero's shared ground — Figma nodes 1:4, 1:24 and 1:25.
 *
 * The desktop and mobile compositions draw the same three layers (the
 * abstract texture at 10%, the portrait, and the fade that grounds it)
 * and differ only in geometry. They used to carry their own copies, and
 * because both compositions sit in the DOM with one `display: none`, the
 * browser fetched *both* sets — with `priority` preloading the hidden
 * one regardless. A phone was downloading the 1920px desktop texture and
 * portrait and then aborting them mid-flight.
 *
 * So the images live here once and the geometry moves at `lg`. Only the
 * gradients are duplicated, and those cost nothing.
 */
export function HeroBackdrop() {
  return (
    <>
      {/* 1:4 — abstract texture at 10% over a dark radial ground */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 h-full w-full lg:h-[calc(1124*var(--fig))] lg:w-[calc(1920*var(--fig))]"
      >
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <Image
            src="/backgrounds/grey-gradient-abstract.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="max-w-none object-cover"
          />
        </div>

        {/* The radial is tuned per composition; CSS only, so both can
            exist without costing a request. */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(102,102,102,0.02) 100%), radial-gradient(120% 70% at 50% 45%, rgba(20,20,20,0.8) 0%, rgba(11,11,11,0.9) 50%, rgba(1,1,1,1) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(102,102,102,0.02) 100%), radial-gradient(96% 56.2% at 50% 50%, rgba(20,20,20,0.8) 0%, rgba(11,11,11,0.9) 50%, rgba(1,1,1,1) 100%)",
          }}
        />
      </div>

      {/* 1:24 — portrait, bottom-anchored so the crop holds while scaling */}
      <div className="absolute inset-x-0 top-[8%] bottom-[18%] lg:inset-x-auto lg:top-auto lg:left-0 lg:bottom-[calc(69*var(--fig))] lg:h-[calc(1029*var(--fig))] lg:w-[calc(1920*var(--fig))]">
        <Image
          src="/images/character.png"
          alt="Portrait of Avinash Pawar"
          fill
          priority
          sizes="100vw"
          className="pointer-events-none max-w-none object-contain object-bottom"
        />
      </div>

      {/* 1:25 — fade that grounds the portrait into the page */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[55%] lg:hidden"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(11,11,11,0) 0%, rgb(11,11,11) 62%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
        style={{
          bottom: "calc(-2 * var(--fig))",
          width: "calc(1920 * var(--fig))",
          height: "calc(880 * var(--fig))",
          backgroundImage:
            "linear-gradient(180.32deg, rgba(11,11,11,0) 59.327%, rgb(11,11,11) 84.595%)",
        }}
      />
    </>
  );
}
