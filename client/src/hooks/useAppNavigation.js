import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import useTimelineProgress from "./useTimelineProgress.js";
import {
  NAV_ITEMS,
  getSectionTop,
  parseRoute,
  scrollToPosition,
} from "../utils/navigation.js";

export default function useAppNavigation() {
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(parseRoute);
  const [active, setActive] = useState("");
  const routeRef = useRef(route);
  routeRef.current = route;

  const holdRef = useRef(0);
  const scrollSpyRef = useRef(null);
  const listRef = useRef(null);
  const previousPageRef = useRef(null);
  const page = route.page;

  useTimelineProgress(listRef, page);

  // Keep the selected section highlighted until a navigation scroll settles.
  const holdScrollSpy = () => {
    clearTimeout(holdRef.current);
    holdRef.current = setTimeout(() => {
      holdRef.current = 0;
      scrollSpyRef.current && scrollSpyRef.current();
    }, 250);
  };

  const finishLoading = useCallback(() => {
    setLoading(false);

    // Re-align deep links after the loader has finished covering the page.
    const currentRoute = routeRef.current;
    if (currentRoute.page === "home" && currentRoute.section) {
      scrollToPosition(getSectionTop(currentRoute.section));
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => setRoute(parseRoute());
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useLayoutEffect(() => {
    const previousPage = previousPageRef.current;
    previousPageRef.current = page;

    if (page !== "home") {
      setActive("");
      scrollToPosition(0);
      return;
    }

    const top = getSectionTop(route.section);
    setActive(route.section);

    if (previousPage === "home") {
      holdScrollSpy();
      window.scrollTo({ top, left: 0, behavior: "auto" });
    } else {
      scrollToPosition(top);
    }
  }, [route]);

  useEffect(() => {
    if (page !== "home") return;

    let animationFrame = 0;

    const updateScrollSpy = () => {
      animationFrame = 0;
      const activationLine = window.innerHeight * 0.35;
      let currentSection = "";

      for (const [section] of NAV_ITEMS) {
        const element = document.getElementById(section);
        if (element && element.getBoundingClientRect().top <= activationLine) {
          currentSection = section;
        }
      }

      setActive(currentSection);
      const currentRoute = parseRoute();

      // Keep the address bar in sync with the section currently in view.
      if (
        currentRoute.page === "home" &&
        currentRoute.section !== currentSection
      ) {
        history.replaceState(
          null,
          "",
          currentSection
            ? "#/" + currentSection
            : location.pathname + location.search,
        );
      }
    };

    const requestScrollSpyUpdate = () => {
      if (holdRef.current) {
        holdScrollSpy();
      } else if (!animationFrame) {
        animationFrame = requestAnimationFrame(updateScrollSpy);
      }
    };

    scrollSpyRef.current = updateScrollSpy;
    updateScrollSpy();
    window.addEventListener("scroll", requestScrollSpyUpdate, {
      passive: true,
    });
    window.addEventListener("resize", requestScrollSpyUpdate);

    return () => {
      window.removeEventListener("scroll", requestScrollSpyUpdate);
      window.removeEventListener("resize", requestScrollSpyUpdate);
      cancelAnimationFrame(animationFrame);
      clearTimeout(holdRef.current);
      holdRef.current = 0;
      scrollSpyRef.current = null;
    };
  }, [page]);

  const handleMainClick = (event) => {
    if (
      event.defaultPrevented ||
      event.button ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      page !== "home"
    ) {
      return;
    }

    const anchor = event.target.closest && event.target.closest('a[href^="#"]');
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    const targetRoute = parseRoute(href);
    if (href !== location.hash || targetRoute.page !== "home") return;

    event.preventDefault();
    setActive(targetRoute.section);
    holdScrollSpy();
    window.scrollTo({
      top: getSectionTop(targetRoute.section),
      left: 0,
      behavior: "auto",
    });
  };

  return {
    active,
    finishLoading,
    handleMainClick,
    isLandingPage: page === "home",
    listRef,
    loading,
    page,
    route,
  };
}
