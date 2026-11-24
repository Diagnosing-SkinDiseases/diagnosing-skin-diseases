import axios from "axios";

// TEMPORARY DEV TEST: set this sessionStorage flag to simulate one Save 401.
export const TEMPORARY_SAVE_401_FLAG = "dsd-dev-simulate-save-401";

export const consumeTemporarySave401 = (config) => {
  if (!import.meta.env.DEV || !config.simulateSessionExpiryOnSave) {
    return false;
  }

  try {
    if (sessionStorage.getItem(TEMPORARY_SAVE_401_FLAG) !== "true") {
      return false;
    }

    sessionStorage.removeItem(TEMPORARY_SAVE_401_FLAG);
    return true;
  } catch {
    return false;
  }
};

export const createTemporarySave401Error = (config) => {
  const response = {
    data: { error: "Temporary development session expiry simulation" },
    status: 401,
    statusText: "Unauthorized",
    headers: {},
    config,
  };

  return new axios.AxiosError(
    "Request failed with status code 401 (temporary development simulation)",
    "ERR_BAD_REQUEST",
    config,
    undefined,
    response,
  );
};
