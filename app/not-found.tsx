import { ButtonLink } from "@/components/ui/Button";
import { FortuneCookie } from "@/components/interactive/FortuneCookie";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
      <p className="eyebrow text-bamboo">Page not found</p>
      <h1 className="mt-4 text-6xl font-semibold">
        This page wandered <span className="italic text-red">off the menu.</span>
      </h1>
      <FortuneCookie className="mt-8" />
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/menu">See the menu</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Home
        </ButtonLink>
      </div>
    </section>
  );
}
