import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import Hero from "./Hero/Hero";
import StatsStrip from "./Extras/StatsStrip";
import Assistant from "./Assistant/Assistant";
import AllHotel from "./AllHotel/AllHotel";
import RecentlyViewed from "./Extras/RecentlyViewed";
import AmenityBrowse from "./Extras/AmenityBrowse";
import TripPlanner from "./Extras/TripPlanner";
import BannerSlider from "./BannerSlider/BannerSlider";
import Destinations from "./Destinations/Destinations";
import WhyUs from "./WhyUs/WhyUs";
import Newsletter from "./Extras/Newsletter";
import SectionHeader from "./SectionHeader";
import Faq from "../../components/ui/Faq";
import Deferred from "../../components/ui/Deferred";
import { useI18n } from "../../i18n/LanguageProvider";

const Home = () => {
  const { t } = useI18n();
  return (
  <>
    <Hero />
    <StatsStrip />
    {/* Below the first screen: built after it paints (see Deferred). */}
    <Deferred minHeight={520}>
      <Assistant />
    </Deferred>
    <Deferred minHeight={900}>
      <AllHotel />
      <RecentlyViewed />
    </Deferred>
    <Deferred minHeight={600}>
      <AmenityBrowse />
      <TripPlanner />
    </Deferred>
    <Deferred minHeight={700}>
      <BannerSlider />
      <Destinations />
    </Deferred>
    <Deferred minHeight={600}>
      <WhyUs />
      <section className="container-x pb-20 sm:pb-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeader eyebrow="home.faqEyebrow" title="home.faqTitle" subtitle="home.faqSubtitle" />
            <Link to="/contact" className="btn-ghost mt-6">
              {t("home.faqMore")} <LuArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Faq limit={4} />
        </div>
      </section>
      <Newsletter />
    </Deferred>
  </>
  );
};

export default Home;
