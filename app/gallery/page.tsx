import { Gallery } from "@/components/gallery/Gallery";
import { hasApprovedPhotos, visibleGallery } from "@/data/gallery";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/ui/PageIntro";

export const metadata = pageMetadata({
  title: "Gallery",
  description: "Illustrations of Four Seasons favorites — Mar Far chicken, dim sum, family dinners and takeout — from the Grants Pass Chinese restaurant on SE K Street.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <PageIntro eyebrow="Gallery" title={<>Drawn from <span className="italic text-red">the kitchen.</span></>}>
        {hasApprovedPhotos
          ? "Photographs from the restaurant alongside our illustrated series."
          : "Our illustrated series: favorite dishes, the takeout box and the four seasons that give us our name. These are original artwork, not photos of our food — restaurant photography is on the way."}
      </PageIntro>
      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <Gallery entries={visibleGallery} />
      </div>
    </>
  );
}
