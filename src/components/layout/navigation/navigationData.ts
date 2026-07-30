import {
  Sparkles,
  ShoppingBag,
  Megaphone,
  Share2,
  BookOpen,
  ShieldCheck,
  LifeBuoy,
} from "lucide-react";

import type { NavigationItem } from "./navigationTypes";

export const CREATIVE_STUDIO_ITEMS: NavigationItem[] = [
  {
    title: "Hero Images",
    description: "AI Fashion Photography",
    icon: Sparkles,
    to: "/create-ai-hero",
    featured: true,
  },
  {
    title: "Product Packs",
    description: "E-commerce Image Packs",
    icon: ShoppingBag,
    to: "/pack/ecom",
  },
  {
    title: "Campaign Studio",
    description: "Marketing Campaigns",
    icon: Megaphone,
    to: "/campaign-engine",
  },
  {
    title: "Social Studio",
    description: "Platform-ready Creatives",
    icon: Share2,
    to: "/create/social-campaign",
  },
];

export const RESOURCE_ITEMS: NavigationItem[] = [
  {
    title: "Documentation",
    description: "Guides, Tutorials & FAQs",
    icon: BookOpen,
    to: "/docs",
  },
  {
    title: "Policies",
    description: "Legal & Compliance",
    icon: ShieldCheck,
    to: "/policies",
  },
  {
    title: "Contact Support",
    description: "We're here to help",
    icon: LifeBuoy,
    to: "/support/contact",
  },
];