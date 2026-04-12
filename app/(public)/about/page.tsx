import type { Metadata } from "next"
import AboutClient from "./AboutClient"

export const metadata: Metadata = {
  title: "About Us — Mathura Vrindavan Travel",
  description:
    "Learn about Mathura Vrindavan Travel — a family-owned pilgrimage tour company serving devotees since 2018 with honest pricing and heartfelt service.",
}

export default function AboutPage() {
  return <AboutClient />
}