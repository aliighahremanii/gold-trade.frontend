import { useEffect, useMemo, useState } from "react";

import type { NormalizedApiError } from "@/shared/errors";

import { parseRetryAfterSeconds } from "@/modules/identity/utils/otp-utils";

export function useRateLimitCooldown(error: NormalizedApiError | null) {
  const cooldownSeconds = useMemo(() => {
    if (error?.kind !== "rate_limited") {
      return 0;
    }

    return parseRetryAfterSeconds(error.message) ?? 30;
  }, [error]);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    if (cooldownSeconds === 0) {
      return;
    }

    // Reset the countdown whenever the backend returns a new rate-limit window.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- countdown must restart on new 429 responses
    setSecondsRemaining(cooldownSeconds);

    const intervalId = window.setInterval(() => {
      setSecondsRemaining((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [cooldownSeconds, error?.message]);

  const activeSecondsRemaining = cooldownSeconds > 0 ? secondsRemaining : 0;

  return {
    isCoolingDown: activeSecondsRemaining > 0,
    secondsRemaining: activeSecondsRemaining,
  };
}
