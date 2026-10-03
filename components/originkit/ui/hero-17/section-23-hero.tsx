"use client";

"use client";

import { motion, useReducedMotion } from "motion/react";
import Globe from "@/components/originkit/ui/hero-17/globe";
import { FlagPill } from "@/components/originkit/ui/hero-17/flag-pill";

function asset(file: string) {
  return `/originkit/hero-17/${file}`;
}

const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

const GLOBE_DOTS = {
  color: "#357de9",
  size: 5,
  density: 7,
  allDots: false,
} as const;

const FLAG_MASK = [
  "linear-gradient(to bottom, #000 0%, #000 50%, transparent 100%)",
  "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)",
].join(", ");

const FLAG_ROWS = [
  [
    { src: asset("flags/brazil.svg"), alt: "Brazil" },
    { src: asset("flags/canada.svg"), alt: "Canada" },
    { src: asset("flags/israel.svg"), alt: "Israel" },
    { src: asset("flags/india.svg"), alt: "India" },
    { src: asset("flags/brunei.svg"), alt: "Brunei" },
  ],
  [
    { src: asset("flags/nauru.svg"), alt: "Nauru" },
    { src: asset("flags/wales.svg"), alt: "Wales" },
    { src: asset("flags/haiti.svg"), alt: "Haiti" },
    { src: asset("flags/taiwan.svg"), alt: "Taiwan" },
    { src: asset("flags/jordan.svg"), alt: "Jordan" },
    { src: asset("flags/uganda.svg"), alt: "Uganda" },
  ],
  [
    { src: asset("flags/india.svg"), alt: "India" },
    { src: asset("flags/canada.svg"), alt: "Canada" },
    { src: asset("flags/india.svg"), alt: "India" },
    { src: asset("flags/brunei.svg"), alt: "Brunei" },
    { src: asset("flags/brazil.svg"), alt: "Brazil" },
  ],
  [
    { src: asset("flags/wales.svg"), alt: "Wales" },
    { src: asset("flags/haiti.svg"), alt: "Haiti" },
    { src: asset("flags/nauru.svg"), alt: "Nauru" },
    { src: asset("flags/jordan.svg"), alt: "Jordan" },
    { src: asset("flags/uganda.svg"), alt: "Uganda" },
    { src: asset("flags/taiwan.svg"), alt: "Taiwan" },
  ],
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

type Flag = (typeof FLAG_ROWS)[number][number];

const getGlowStyle = (flagIndex: number) =>
  ({
    animation: `section-18-glow ${3.5 + (flagIndex % 3) * 0.4}s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite alternate`,
    animationDelay: `${flagIndex * 0.15}s`,
  }) as const;

const HALF_REPEATS = 3;

const FlagMarqueeHalf = ({
  flags,
  rowIndex,
  duplicate = false,
  reducedMotion,
}: {
  flags: readonly Flag[];
  rowIndex: number;
  duplicate?: boolean;
  reducedMotion: boolean | null;
}) => (
  <div
    className="flex shrink-0 items-center gap-5 pr-5 ipad:gap-8 ipad:pr-8"
    aria-hidden={duplicate ? true : undefined}
  >
    {Array.from({ length: HALF_REPEATS }).flatMap((_, repeat) =>
      flags.map((flag, flagIndex) => (
        <div
          key={`${duplicate ? "dup" : "a"}-${repeat}-${flag.alt}-${rowIndex}-${flagIndex}`}
          className="shrink-0"
          style={reducedMotion ? undefined : getGlowStyle(flagIndex)}
        >
          <FlagPill flagSrc={flag.src} flagAlt="" />
        </div>
      )),
    )}
  </div>
);

const FlagMarqueeRow = ({
  flags,
  rowIndex,
  reducedMotion,
}: {
  flags: readonly Flag[];
  rowIndex: number;
  reducedMotion: boolean | null;
}) => {
  const rowClass = rowIndex >= 3 ? "block desktop-sm:hidden" : undefined;
  const durationSec = 42 + rowIndex * 8;
  const reverse = rowIndex % 2 === 1;

  if (reducedMotion) {
    return (
      <div
        className={`flex w-full items-center justify-center gap-5 overflow-hidden ipad:gap-8 ${rowClass ?? ""}`}
      >
        {flags.map((flag, flagIndex) => (
          <div
            key={`${flag.alt}-${rowIndex}-${flagIndex}`}
            className="shrink-0"
          >
            <FlagPill flagSrc={flag.src} flagAlt="" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${rowClass ?? ""}`}>
      <div
        className="flex w-max items-center animate-trusted-marquee will-change-transform"
        style={{
          animationDuration: `${durationSec}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <FlagMarqueeHalf
          flags={flags}
          rowIndex={rowIndex}
          reducedMotion={reducedMotion}
        />
        <FlagMarqueeHalf
          flags={flags}
          rowIndex={rowIndex}
          duplicate
          reducedMotion={reducedMotion}
        />
      </div>
    </div>
  );
};

export const Section23Hero = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-label="Your content deserves a global audience"
      className="relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#171717] px-4 py-8 ipad:px-8 ipad:py-12 desktop-sm:px-11 desktop-sm:py-16"
    >
      {}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1f1f1f] to-[#171717]" />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(129,187,255,0.55) 0%, rgba(101,75,255,0.28) 42%, transparent 72%)",
          }}
        />
        <img
          src={asset("gradient.svg")}
          alt=""
          className="absolute top-[-40%] left-1/2 h-[120%] w-[160%] max-w-none -translate-x-1/2 opacity-80"
        />
        <div
          className="absolute inset-x-0 top-0 h-[55%] opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `url(${asset("dust.png")})`,
            backgroundSize: "1024px 1024px",
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 55%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 55%, transparent 100%)",
          }}
        />
      </div>

      {}
      <motion.div
        className="relative z-10 w-full max-w-[90dvw] full-hd:max-w-[65dvw] overflow-hidden rounded-[16px] ipad:rounded-[20px]"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#222226] to-[#1d1d20]"
        />

        <img
          src={asset("ellipse-glow.svg")}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[-40%] left-1/2 size-[280px] max-w-none -translate-x-1/2 opacity-80 ipad:size-[364px]"
        />

        {}
        <div className="card-orbit-border relative m-2 rounded-[12px] ipad:m-4 ipad:rounded-[16px]">
          <div className="card-orbit-border__inner overflow-hidden rounded-[10.5px] bg-[#16131c] ipad:rounded-[14.5px]">
            <img
              src={asset("glow.svg")}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute top-[-30%] left-1/2 h-[70%] w-[90%] max-w-none -translate-x-1/2 opacity-90"
            />

            {}
            <div className="relative mx-auto flex w-full flex-col items-center pt-10 ipad:pt-12 desktop-sm:min-h-[380px] desktop-sm:pt-12">
              <div className="relative flex w-full items-center justify-center pb-4 ipad:pb-6 desktop-sm:pb-0">
                {}
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-5 px-1 ipad:gap-8 ipad:px-0"
                  style={{
                    maskImage: FLAG_MASK,
                    WebkitMaskImage: FLAG_MASK,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                  }}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 }}
                >
                  {FLAG_ROWS.map((row, rowIndex) => (
                    <FlagMarqueeRow
                      key={rowIndex}
                      flags={row}
                      rowIndex={rowIndex}
                      reducedMotion={prefersReducedMotion}
                    />
                  ))}
                </motion.div>

                {}
                <motion.div
                  className="relative z-20 size-[280px] translate-y-26 overflow-hidden rounded-full ipad:size-[520px] ipad:translate-y-30 desktop-sm:size-[420px] desktop-sm:translate-y-16"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, #000 0%, #000 52%, transparent 92%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, #000 0%, #000 52%, transparent 92%)",
                  }}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.1 }}
                >
                  <Globe
                    direction="right"
                    speed={prefersReducedMotion ? 0 : 2}
                    smoothing={8}
                    stopOnHover={true}
                    dragSpeed={0}
                    fill="dots"
                    dots={GLOBE_DOTS}
                    oceanColor="#0a112a"
                    outlineColor="#357de9"
                    graticuleColor="#4B6AAA"
                    showOutline={true}
                    showGrid={true}
                    outlineWidth={1}
                    scale={10}
                    detail={6}
                    initialLatitude={23}
                    initialLongitude={-23}
                  />
                </motion.div>
              </div>
            </div>

            {}
            <motion.div
              className="relative z-30 mx-auto flex w-full max-w-[449px] ipad:max-w-[550px] flex-col items-center gap-6 px-5 pb-10 pt-22 text-center ipad:gap-8 ipad:px-10 ipad:pb-12 desktop-sm:max-w-none desktop-sm:flex-row desktop-sm:items-end desktop-sm:justify-between desktop-sm:gap-10 desktop-sm:px-[58px] desktop-sm:pb-12 desktop-sm:pt-2 desktop-sm:text-left"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: prefersReducedMotion ? 0 : 0.12,
                    delayChildren: prefersReducedMotion ? 0 : 0.35,
                  },
                },
              }}
            >
              <motion.div
                variants={fadeUp}
                className="flex w-full flex-col items-center gap-2 ipad:gap-4 desktop-sm:max-w-97 desktop-sm:items-start"
              >
                <h1 className="w-full font-instrument-serif text-[44px] leading-[1.1] tracking-[-1.76px] text-white ipad:text-[56px] ipad:tracking-[-2.24px] desktop-sm:text-[56px]">
                  Your Content Deserves a Global Audience.
                </h1>
                <p className="max-w-[256px] font-sans text-[14px] leading-[1.4] tracking-[-0.28px] text-[#c2c0c9] ipad:max-w-[387px] desktop-sm:hidden">
                  Translate speech into 150+ languages with AI voices that sound
                  natural, and are ready in minutes
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="flex w-full max-w-[280px] flex-col items-center gap-4 desktop-sm:items-start"
              >
                <p className="hidden font-sans text-[14px] leading-[1.4] tracking-[-0.28px] text-[#c2c0c9] desktop-sm:block">
                  Translate speech into 150+ languages with AI voices that sound
                  natural, and are ready in minutes
                </p>
                <a
                  href="#start"
                  className="relative inline-flex min-h-11 items-center justify-center rounded-full px-4 py-3 font-sans text-base font-medium tracking-[-0.32px] text-[#060e08] shadow-[0_2px_2.5px_rgba(0,0,0,0.1),0_9px_4.5px_rgba(0,0,0,0.09),0_19px_6px_rgba(0,0,0,0.05),inset_0_1px_1px_0_white,inset_0_-1.5px_0_0_rgba(0,0,0,0.1)] touch-manipulation transition-transform duration-200 ease focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [-webkit-tap-highlight-color:transparent] [@media(hover:hover)_and_(pointer:fine)]:hover:scale-[1.02] cursor-pointer"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, rgba(255,255,255,0.33) 0%, rgba(255,255,255,0) 100%), linear-gradient(90deg, #f0f0f0 0%, #f0f0f0 100%)",
                  }}
                >
                  Get started for free
                </a>
              </motion.div>
            </motion.div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_7px_0px_rgba(0,0,0,0.92)]"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};