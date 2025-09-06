import Link from "next/link";
import { IntelliOpsLogo } from "@/components/icons";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <IntelliOpsLogo className="h-6 w-6 text-primary" />
          <span className="hidden font-headline font-bold sm:inline-block">
            IntelliOps Agent
          </span>
        </Link>
      </div>
    </header>
  );
}
