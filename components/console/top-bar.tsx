"use client";

import { Card, CardBody, Image } from "@nextui-org/react";
// import { SignedIn, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export default function TopBar({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "w-full h-full overflow-hidden z-20 animate-fade-in",
        className
      )}
    >
      <CardBody className="flex flex-row justify-between items-center overflow-hidden">
        <Image src="/logo/icon.png" alt="logo" className="h-full w-12" />
        <div className="w-12 h-4 bg-red-500"></div>
        {/* <SignedIn>
          <div suppressHydrationWarning>
            <UserButton showName />
          </div>
        </SignedIn> */}
      </CardBody>
    </Card>
  );
}
