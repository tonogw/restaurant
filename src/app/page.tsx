"use client";
import RegisterPage from "./(auth)/register/page";
// import Footer from "./home/parts/footer";
// import Hero from "./home/parts/hero";
// import Navbar from "./home/parts/navbar";

// import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { restoApi } from "@/lib/api/resto";
import { useState, useEffect, ReactFormEvent } from "react";

const CATEGORIES = [
  { name: "All Restaurant", icon: "🍔" },
  { name: "Nearby", icon: "📍" },
  { name: "Best Seller", icon: "🏆" },
  { name: "Lunch", icon: "Rice" },
];
