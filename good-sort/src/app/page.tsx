import { BrandStatement } from "@/components/BrandStatement";
import { Campaign } from "@/components/Campaign";
import { Community } from "@/components/Community";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Hero } from "@/components/Hero";
import { Newsletter } from "@/components/Newsletter";
import { ScrollingTagline } from "@/components/ScrollingTagline";
import { ShopByKind } from "@/components/ShopByKind";
import { ShopTheWalk } from "@/components/ShopTheWalk";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ScrollingTagline />
      <ShopByKind />
      <FeaturedProducts />
      <Campaign />
      <BrandStatement />
      <ShopTheWalk />
      <Community />
      <Newsletter />
    </>
  );
}
