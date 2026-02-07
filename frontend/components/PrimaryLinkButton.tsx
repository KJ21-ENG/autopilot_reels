"use client";

import type { ReactNode } from "react";
import Link from "next/link";

type PrimaryLinkButtonProps = {
    href: string;
    children: ReactNode;
    className?: string;
};

export default function PrimaryLinkButton({
    href,
    children,
    className = "",
}: PrimaryLinkButtonProps) {
    return (
        <Link
            href={href}
            className={`inline-flex w-full items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg ${className}`}
        >
            {children}
        </Link>
    );
}
