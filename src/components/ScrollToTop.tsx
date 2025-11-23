// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Jump to top whenever the URL path changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // or "smooth" if you want a scroll animation
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
