import Audiobars from "@/components/console/audio-bars";

export default function SessionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <Audiobars barColor="#f0613d" minBarHeight={10} maxBarHeight={50} />
      </div>
    </>
  );
}
