import LandingNavbar from "@/components/landing/navbar";

export default function Home() {
  return (
    <div className="h-min-screen font-[family-name:var(--font-geist-sans)] overflow-visible">
      <LandingNavbar />
      <main>
        <div
          id="hero"
          className="w-full h-screen overflow-visible bg-[url('/backgrounds/hero.svg')] bg-cover bg-bottom grid grid-rows-[1fr_2fr_4fr] text-center"
        >
          <div className="row-start-2 w-full h-full flex justify-center items-center">
            <h1 className="font-black text-5xl leading-normal w-4/5">
              Real-time{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-tertiary">
                fact-checking
              </span>{" "}
              for your live <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                debates
              </span>
              ,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                discussions
              </span>
              , and{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                interviews
              </span>
              .
            </h1>
          </div>
          <div className="row-start-3 flex justify-center items-start overglow">
            <div className="relative p-[2px] rounded-xl w-3/5 shadow-2xl overflow-hidden animated-gradient-background">
              <video
                width="320"
                height="240"
                muted
                loop
                autoPlay
                playsInline
                preload="none"
                className="w-full rounded-[calc(0.75rem-2px)] bg-white z-20"
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
        <div
          id="solution"
          className="w-full h-screen overflow-visible bg-tertiary bg-gradient-to-b from-tertiary from-0% via-secondary via-10% to-white to-20%"
        ></div>
      </main>
    </div>
  );
}
