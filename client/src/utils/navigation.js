export const NAV_ITEMS = [
  ["overview", "Overview"],
  ["timeline", "Timeline"],
  ["wings", "Wings"],
  ["workshops", "Workshops"],
  ["outcomes", "Outcomes"],
  ["events", "Events"],
];

const sections = NAV_ITEMS.map(([section]) => section);

export function parseRoute(hash = window.location.hash) {
  const [path, param] = hash.replace(/^#\/?/, "").split("/");

  if (path === "register") {
    return { page: "register", section: "", param: param || "" };
  }

  if (path === "admin") {
    return { page: "home", section: "events", param: "" };
  }

  return {
    page: "home",
    section: sections.includes(path) ? path : "",
    param: "",
  };
}

export function scrollToPosition(top) {
  try {
    window.scrollTo({ top, left: 0, behavior: "instant" });
  } catch {
    window.scrollTo(0, top);
  }
}

export function getSectionTop(section) {
  const element = document.getElementById(section || "home");

  return element
    ? Math.max(0, element.getBoundingClientRect().top + window.scrollY)
    : 0;
}
