"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteStyling() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const path = pathname.replace(/\/$/, "") || "/";
    const chapterMatch = path.match(/^\/james\/(\d+)$/);

    html.classList.add("dark");
    html.style.colorScheme = "dark";
    body.classList.add("mbe-shell-managed");
    body.removeAttribute("data-james-chapter");

    if (path === "/") body.dataset.jamesRoute = "home";
    else if (path === "/background") body.dataset.jamesRoute = "introduction";
    else if (path === "/articles" || path.startsWith("/articles/")) body.dataset.jamesRoute = "articles";
    else if (chapterMatch) {
      body.dataset.jamesRoute = "commentary";
      body.dataset.jamesChapter = chapterMatch[1];
    } else body.removeAttribute("data-james-route");
  }, [pathname]);

  return null;
}
