"use client";

import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="bg-zinc-100 border-b border-neutral-200 sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between px-5 py-5 max-w-[1440px] mx-auto ">
        <Link href="/">
        <Image src="/logo.svg" alt="logo" width={150} height={32} />
         </Link>
      </div>
    </div>
  );
};

export default Navbar;