import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { AuthCardProps } from "@/types/user";


export default function AuthCard({
    title,
    subtitle,
    activeTab,
    children}:
    AuthCardProps){
        return (
    // Card responsive
    <div className="
    w-86.25 lg:w-93.5
    bg-white rounded-2xl
    flex felx-col gap-6
    md:gap-8
    "> 
    {/* Header Logo brand */}
    <div className="
    relative w-8 h-8
    ">
        <Image src={}/>
    </div>
    </div>
        )
    }
})

