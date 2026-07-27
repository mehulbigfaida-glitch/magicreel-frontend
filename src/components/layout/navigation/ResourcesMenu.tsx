import { Link } from "react-router-dom";
import {
  BookOpen,
  ShieldCheck,
  LifeBuoy,
  ChevronRight,
} from "lucide-react";

import "./ResourcesMenu.css";

const resources = [
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

export default function ResourcesMenu() {
  return (
    <div className="mr-resources-menu">
      <div className="mr-resources-header">
        <h3>Resources</h3>
        <p>Everything you need to use MagicReel.</p>
      </div>

      <div className="mr-resources-list">
        {resources.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              to={item.to}
              className="mr-resource-item"
            >
              <div className="mr-resource-icon">
                <Icon size={18} />
              </div>

              <div className="mr-resource-content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>

              <ChevronRight
                size={16}
                className="mr-resource-arrow"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}