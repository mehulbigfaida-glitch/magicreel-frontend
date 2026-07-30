import { Link } from "react-router-dom";
import "./DesktopNav.css";
import {
  Sparkles,
  ShoppingBag,
  Megaphone,
  Share2,
  ChevronRight,
} from "lucide-react";

import "./CreativeStudioMenu.css";
import { CREATIVE_STUDIO_ITEMS } from "./navigationData";

export default function CreativeStudioMenu() {
  const featured = CREATIVE_STUDIO_ITEMS.find(
  (item) => item.featured
);
  const FeaturedIcon = featured?.icon;
  const secondary = CREATIVE_STUDIO_ITEMS.filter(
  (item) => !item.featured
);

  return (
    <div className="mr-studio-menu">
      <div className="mr-studio-header">
        <h3>Creative Studio</h3>
        <p>Choose what you want to create today.</p>
      </div>

      <div className="mr-studio-layout">
        {featured && (
          <Link
            to={featured.to}
            className="mr-studio-card mr-featured-card"
          >
            <div className="mr-studio-icon">
  {FeaturedIcon && <FeaturedIcon size={28} />}
</div>

            <div className="mr-studio-body">
              <h4>{featured.title}</h4>
              <p>{featured.description}</p>
            </div>

            <ChevronRight
              size={20}
              className="mr-studio-arrow"
            />
          </Link>
        )}

        <div className="mr-studio-secondary">
          {secondary.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.to}
                className="mr-studio-card"
              >
                <div className="mr-studio-icon">
                  <Icon size={20} />
                </div>

                <div className="mr-studio-body">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>

                <ChevronRight
                  size={18}
                  className="mr-studio-arrow"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}