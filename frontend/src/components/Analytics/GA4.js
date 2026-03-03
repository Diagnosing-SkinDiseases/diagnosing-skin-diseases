import ReactGA from "react-ga4";

export const initGA = () => {
  console.log("TESTING", process.env.REACT_APP_GA_MEASUREMENT_ID);

  if (!process.env.REACT_APP_GA_MEASUREMENT_ID) {
    console.warn("GA Measurement ID missing");
    return;
  }

  ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID, {
    gaOptions: {
      debug_mode: process.env.NODE_ENV !== "production",
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
