"use client";

import { Card, CardBody, Image } from "@nextui-org/react";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function TopBar({ className }: { className?: string }) {
  return (
    <Card
      className="w-full h-full overflow-hidden z-20 animate-fade-in"
      suppressHydrationWarning
    >
      <CardBody className="flex flex-row justify-between items-center overflow-hidden">
        <Image src="/logo/icon.png" alt="logo" className="h-full w-12" />
        <SignedIn>
          <UserButton showName />
        </SignedIn>
      </CardBody>
    </Card>
  );
}
