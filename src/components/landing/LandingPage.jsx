import EventsPage from "../../pages/EventsPage.jsx";
import HeroSection from "./HeroSection.jsx";
import OutcomesSection from "./OutcomesSection.jsx";
import OverviewSection from "./OverviewSection.jsx";
import TimelineSection from "./TimelineSection.jsx";
import WingsSection from "./WingsSection.jsx";
import WorkshopsSection from "./WorkshopsSection.jsx";

export default function LandingPage({ listRef, user }) {
  return (
    <>
      <HeroSection user={user} />
      <OverviewSection />
      <TimelineSection listRef={listRef} />
      <WingsSection />
      <WorkshopsSection />
      <OutcomesSection />
      <EventsPage />
    </>
  );
}
