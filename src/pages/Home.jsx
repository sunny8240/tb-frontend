import Hero from "../component/Hero";
import HomeSearch from "../component/HomeSearch";
import StateSection from "../component/StateSection";
import PopularDestinations from "../component/PopularDestination";
import AutoGallery from "../component/AutoGallery";
import { useDestinations } from "../hooks/useApi";
import { destinationsData } from "../data/destinationsData";

// Home
export default function Home() {
  const { destinations = [] } = useDestinations();
  const MAX_GALLERY = 14;

  const slugify = (s) => {
    if (!s) return null;
    return s
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Gallery
  const galleryItems = [];

  if (Array.isArray(destinations)) {
    destinations.forEach((d) => {
      if (d.isApproved === false) return;
      if (d.images && d.images.length > 0) {
        galleryItems.push({ image: d.images[0], name: d.name, slug: d.slug });
      }
    });
  }

  // Fill
  if (galleryItems.length < MAX_GALLERY) {
    for (const def of destinationsData) {
      if (galleryItems.length >= MAX_GALLERY) break;
      if (!galleryItems.some((g) => g.name === def.name) && def.images && def.images.length > 0) {
        const match = destinations.find((d) => d.name && d.name.toLowerCase() === def.name.toLowerCase());
        const slug = match ? match.slug : slugify(def.name);
        galleryItems.push({ image: def.images[0], name: def.name, slug });
      }
    }
  }

  return (
    <div>
      <Hero />
      <HomeSearch />
      <StateSection />
      <PopularDestinations />
      <AutoGallery items={galleryItems} speed={28} label="Gallery" maxItems={MAX_GALLERY} />
    </div>
  );
}
