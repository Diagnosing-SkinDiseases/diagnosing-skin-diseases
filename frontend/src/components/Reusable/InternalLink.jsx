import { Link, useLocation } from "react-router-dom";

const InternalLink = ({ to, state = {}, children, target, ...props }) => {
  const location = useLocation();

  const isNewTab = target === "_blank";

  const previousPath = `${location.pathname}${location.search}${location.hash}`;

  return (
    <Link
      to={to}
      target={target}
      state={
        isNewTab
          ? state
          : {
              ...state,
              internalPrevious: previousPath,
            }
      }
      {...props}
    >
      {children}
    </Link>
  );
};

export default InternalLink;
