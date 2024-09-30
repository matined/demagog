export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-screen grid grid-columns-[1fr_2fr]">
      <div className="col-start-1 bg-secondary"></div>
      <div className="col-start-2 flex flex-col justify-center items-center">
        {children}
      </div>
    </div>
  );
}
