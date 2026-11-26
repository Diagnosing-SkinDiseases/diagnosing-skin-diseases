import ReactGA from "react-ga4";

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    return;
  }

  ReactGA.initialize(measurementId, {
    gaOptions: {
      debug_mode: import.meta.env.DEV,
    },
  });
};

export const trackPage = (path) => {
  ReactGA.send({
    hitType: "pageview",
    page: path,
  });
};

export const trackEvent = (eventName, params = {}) => {
  ReactGA.event(eventName, params);
};
