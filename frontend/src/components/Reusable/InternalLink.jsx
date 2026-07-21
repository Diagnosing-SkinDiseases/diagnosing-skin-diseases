import { Link, useLocation } from "react-router-dom";

const InternalLink = ({ to, state = {}, children, target, ...props }) => {
  const location = useLocation();

  const isNewTab = target === "_blank";

  const currentPath = `${location.pathname}${location.search}${location.hash}`;

  const existingHistory = Array.isArray(location.state?.internalHistory)
    ? location.state.internalHistory
    : [];

  const nextHistory = [...existingHistory, currentPath];

  return (
    <Link
      to={to}
      target={target}
      state={
        isNewTab
          ? state
          : {
              ...state,
              internalPrevious: currentPath,
              internalHistory: nextHistory,
            }
      }
      {...props}
    >
      {children}
    </Link>
  );
};

export default InternalLink;
