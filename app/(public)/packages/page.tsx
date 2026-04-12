import type { Metadata } from "next"
import { ALL_PACKAGES } from "@/data/packages"
import PackagesClient from "./PackagesClient"

export const metadata: Metadata = {
  title: "Tour Packages — Mathura Vrindavan Travel",
  description:
    "Browse our Mathura Vrindavan tour packages — 1 day to 8 days. AC cars, expert drivers, hotel help. Starting from ₹2,000.",
  openGraph: {
    title: "Mathura Vrindavan Tour Packages",
    description: "Handcrafted spiritual tour packages starting from ₹2,000.",
  },
}

// Pure Server Component — no use client here.
// Interactive filtering logic lives in PackagesClient.tsx
export default function PackagesPage() {
  return <PackagesClient packages={ALL_PACKAGES} />
}