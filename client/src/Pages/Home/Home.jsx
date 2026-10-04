import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import Hero from "./Hero/Hero";
import StatsStrip from "./Extras/StatsStrip";
import AllHotel from "./AllHotel/AllHotel";
import RecentlyViewed from "./Extras/RecentlyViewed";
import AmenityBrowse from "./Extras/AmenityBrowse";
import TripPlanner from "./Extras/TripPlanner";
import BannerSlider from "./BannerSlider/BannerSlider";
import Destinations from "./Destinations/Destinations";
import WhyUs from "./WhyUs/WhyUs";
import Newsletter from "./Extras/Newsletter";
import SectionHeader from "./SectionHeader";
import Faq, { FAQS } from "../../components/ui/Faq";

const Home = () => (
  <>
    <Hero />
    <StatsStrip />
    <AllHotel />
    <RecentlyViewed />
    <AmenityBrowse />
    <TripPlanner />
    <BannerSlider />
    <Destinations />
    <WhyUs />
    <section className="container-x pb-20 sm:pb-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeader eyebrow="FAQ" title="Questions, answered" subtitle="The essentials about booking, payment and your stay." />
          <Link to="/contact" className="btn-ghost mt-6">
            Ask us something else <LuArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Faq items={FAQS.slice(0, 4)} />
      </div>
    </section>
    <Newsletter />
  </>
);

export default Home;
