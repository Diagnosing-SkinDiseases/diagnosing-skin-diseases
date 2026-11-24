import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiUrl from "../../api";
import SessionReauthenticationModal from "../Login/SessionReauthenticationModal";
import {
  consumeTemporarySave401,
  createTemporarySave401Error,
} from "../../dev/temporarySave401";

const AuthContext = createContext(null);

const isAdminPath = (pathname) => pathname.startsWith("/admin/");
const requiresAuthentication = (pathname) =>
  isAdminPath(pathname) || pathname === "/signup";

const SESSION_EXPIRED_PROMPT = "Your session has expired. Are you still working?";
const LOGOUT_CONFIRMATION =
  "Are you sure you want to log out? Any unsaved changes will be discarded.";

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [renderLocation, setRenderLocation] = useState(location);
  const [routeReady, setRouteReady] = useState(
    !requiresAuthentication(location.pathname),
  );
  const [reauthenticationOpen, setReauthenticationOpen] = useState(false);
  const [reauthenticateUserId, setReauthenticateUserId] = useState(null);
  const committedLocationRef = useRef(location);
  const userIdRef = useRef(null);
  const recoveryActiveRef = useRef(false);
  const initialCheckRef = useRef(false);

  const checkCurrentSession = useCallback(async () => {
    const response = await fetch(`${apiUrl}/auth/me`, {
      credentials: "include",
    });

    if (response.ok) {
      const user = await response.json();
      userIdRef.current = user.userId;
      return { ok: true };
    }

    const payload = await response.json().catch(() => ({}));
    return { ok: false, status: response.status, error: payload.error };
  }, []);

  const startSessionRecovery = useCallback(() => {
    if (recoveryActiveRef.current) {
      return;
    }

    recoveryActiveRef.current = true;

    while (true) {
      if (window.confirm(SESSION_EXPIRED_PROMPT)) {
        setReauthenticateUserId(userIdRef.current);
        setReauthenticationOpen(true);
        return;
      }

      if (window.confirm(LOGOUT_CONFIRMATION)) {
        recoveryActiveRef.current = false;
        navigate("/logout", { replace: true });
        return;
      }
    }
  }, [navigate]);

  const finishReauthentication = useCallback(() => {
    setReauthenticationOpen(false);
    recoveryActiveRef.current = false;
    window.setTimeout(() => {
      window.alert(
        "Session refreshed. Please re attempt any editorial functions if applicable.",
      );
    }, 0);
  }, []);

  useEffect(() => {
    // TEMPORARY DEV TEST: reject one explicitly marked Save before it reaches the API.
    const requestInterceptorId = axios.interceptors.request.use((config) => {
      if (consumeTemporarySave401(config)) {
        return Promise.reject(createTemporarySave401Error(config));
      }

      return config;
    });

    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const requestUrl = error.config?.url || "";
        const isAuthRequest =
          requestUrl.includes("/auth/") || requestUrl.includes("/user/mfa/");
        const isApiRequest = requestUrl.startsWith(apiUrl);

        if (
          error.response?.status === 401 &&
          isApiRequest &&
          !isAuthRequest &&
          isAdminPath(committedLocationRef.current.pathname)
        ) {
          startSessionRecovery();
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptorId);
      axios.interceptors.response.eject(interceptorId);
    };
  }, [startSessionRecovery]);

  useEffect(() => {
    const nextLocation = location;
    const previousLocation = committedLocationRef.current;
    if (
      nextLocation.pathname === previousLocation.pathname &&
      nextLocation.search === previousLocation.search &&
      nextLocation.hash === previousLocation.hash
    ) {
      return;
    }

    if (recoveryActiveRef.current) {
      const committed = committedLocationRef.current;
      navigate(
        `${committed.pathname}${committed.search}${committed.hash}`,
        { replace: true, state: committed.state },
      );
      return;
    }

    if (!requiresAuthentication(nextLocation.pathname)) {
      committedLocationRef.current = nextLocation;
      // Keep the displayed route in sync after public or explicit logout navigation.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRenderLocation(nextLocation);
      setRouteReady(true);
      return;
    }

    let cancelled = false;
    const restoreCommittedLocation = () => {
      const committed = committedLocationRef.current;
      navigate(
        `${committed.pathname}${committed.search}${committed.hash}`,
        { replace: true, state: committed.state },
      );
    };

    const verifyBeforeNavigation = async () => {
      try {
        const result = await checkCurrentSession();
        if (cancelled) return;

        if (result.ok) {
          committedLocationRef.current = nextLocation;
          setRenderLocation(nextLocation);
          setRouteReady(true);
          return;
        }

        if (result.status === 401 && isAdminPath(previousLocation.pathname)) {
          startSessionRecovery();
          restoreCommittedLocation();
          return;
        }

        if (result.status === 403 && result.error === "MFA_REQUIRED") {
          navigate("/mfa-verify", {
            replace: true,
            state: { from: nextLocation },
          });
          return;
        }

        if (result.status === 403 && result.error === "MFA_NOT_INITIALIZED") {
          navigate("/mfa-setup", {
            replace: true,
            state: { from: nextLocation },
          });
          return;
        }

        navigate("/login", {
          replace: true,
          state: { from: nextLocation },
        });
      } catch {
        if (!cancelled) {
          if (isAdminPath(previousLocation.pathname)) {
            restoreCommittedLocation();
          } else {
            navigate("/login", {
              replace: true,
              state: { from: nextLocation },
            });
          }
        }
      }
    };

    verifyBeforeNavigation();
    return () => {
      cancelled = true;
    };
  }, [location, navigate, checkCurrentSession, startSessionRecovery]);

  useEffect(() => {
    if (initialCheckRef.current) {
      return;
    }

    initialCheckRef.current = true;
    if (!requiresAuthentication(location.pathname)) {
      return;
    }

    let cancelled = false;

    const verifyInitialSession = async () => {
      try {
        const result = await checkCurrentSession();
        if (cancelled) return;

        if (result.ok) {
          committedLocationRef.current = location;
          setRenderLocation(location);
          setRouteReady(true);
          return;
        }

        if (result.status === 403 && result.error === "MFA_REQUIRED") {
          navigate("/mfa-verify", {
            replace: true,
            state: { from: location },
          });
        } else if (
          result.status === 403 &&
          result.error === "MFA_NOT_INITIALIZED"
        ) {
          navigate("/mfa-setup", {
            replace: true,
            state: { from: location },
          });
        } else {
          navigate("/login", { replace: true, state: { from: location } });
        }
      } catch {
        if (!cancelled) {
          navigate("/login", { replace: true, state: { from: location } });
        }
      }
    };

    verifyInitialSession();
    return () => {
      cancelled = true;
    };
  }, [location, navigate, checkCurrentSession]);

  return (
    <AuthContext.Provider value={{ routeReady, renderLocation }}>
      {children}
      {reauthenticationOpen && (
        <SessionReauthenticationModal
          expectedUserId={reauthenticateUserId}
          onReauthenticated={finishReauthentication}
        />
      )}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
