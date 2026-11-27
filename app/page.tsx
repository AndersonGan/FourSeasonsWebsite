import { DimSum, Essentials, FamilyDinners, Favorites, Hero, LocalStory, MarFarFeature, Ratings, RealPlates, Seasons, Takeout, Visit } from "@/components/home/Sections";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  description:
    "Four Seasons Restaurant, 122 SE K Street in downtown Grants Pass, OR. Chinese-American favorites — Mar Far chicken, orange chicken, dim sum and family dinners. Dine-in, takeout and DoorDash delivery. Call (541) 479-6532.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Essentials />
      <RealPlates />
      <Favorites />
      <MarFarFeature />
      <FamilyDinners />
      <DimSum />
      <Seasons />
      <Takeout />
      <LocalStory />
      <Ratings />
      <Visit />
    </>
  );
}
