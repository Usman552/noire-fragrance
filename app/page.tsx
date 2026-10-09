import { Hero } from "@/components/home/Hero";
import { Introduction } from "@/components/home/Introduction";
import { Notes } from "@/components/home/Notes";
import { Campaign } from "@/components/home/Campaign";
import { Collection } from "@/components/home/Collection";
import { BrandStory } from "@/components/home/BrandStory";
import { Closing } from "@/components/home/Closing";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <Notes />
      <Campaign />
      <Collection />
      <BrandStory />
      <Closing />
    </>
  );
}
