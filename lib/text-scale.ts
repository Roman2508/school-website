export const TEXT_SCALE_STORAGE_KEY = "school-website:text-scale";
export const TEXT_SCALE_EVENT = "school-website:text-scale-change";
export const TEXT_SCALE_DEFAULT = 100;
export const TEXT_SCALE_STEPS = [100, 125, 150, 175, 200] as const;

export type TextScale = (typeof TEXT_SCALE_STEPS)[number];

export function clampTextScale(value: number): TextScale {
  if (!Number.isFinite(value)) {
    return TEXT_SCALE_DEFAULT;
  }

  if (value <= TEXT_SCALE_STEPS[0]) {
    return TEXT_SCALE_STEPS[0];
  }

  const maxScale = TEXT_SCALE_STEPS[TEXT_SCALE_STEPS.length - 1];
  if (value >= maxScale) {
    return maxScale;
  }

  return TEXT_SCALE_STEPS.reduce<TextScale>((closest, step) => {
    return Math.abs(step - value) < Math.abs(closest - value) ? step : closest;
  }, TEXT_SCALE_DEFAULT);
}

export function applyTextScale(scale: number) {
  if (typeof document === "undefined") {
    return TEXT_SCALE_DEFAULT;
  }

  const nextScale = clampTextScale(scale);
  document.documentElement.style.fontSize = `${nextScale}%`;

  return nextScale;
}

export function readTextScale(): TextScale {
  if (typeof window === "undefined") {
    return TEXT_SCALE_DEFAULT;
  }

  try {
    const stored = window.localStorage.getItem(TEXT_SCALE_STORAGE_KEY);
    return clampTextScale(Number.parseFloat(stored ?? ""));
  } catch {
    return TEXT_SCALE_DEFAULT;
  }
}

export function setTextScale(scale: number): TextScale {
  const nextScale = applyTextScale(scale);

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(TEXT_SCALE_STORAGE_KEY, String(nextScale));
    } catch {
      // Ignore storage errors and still apply the scale for the current session.
    }

    window.dispatchEvent(
      new CustomEvent<TextScale>(TEXT_SCALE_EVENT, {
        detail: nextScale,
      }),
    );
  }

  return nextScale;
}

export const TEXT_SCALE_INIT_SCRIPT = `(() => {
  const storageKey = ${JSON.stringify(TEXT_SCALE_STORAGE_KEY)};
  const defaultScale = ${TEXT_SCALE_DEFAULT};
  const steps = ${JSON.stringify(TEXT_SCALE_STEPS)};

  const clamp = (value) => {
    if (!Number.isFinite(value)) {
      return defaultScale;
    }

    if (value <= steps[0]) {
      return steps[0];
    }

    const maxScale = steps[steps.length - 1];
    if (value >= maxScale) {
      return maxScale;
    }

    return steps.reduce((closest, step) => {
      return Math.abs(step - value) < Math.abs(closest - value) ? step : closest;
    }, defaultScale);
  };

  try {
    const stored = window.localStorage.getItem(storageKey);
    const nextScale = clamp(Number.parseFloat(stored ?? ""));
    document.documentElement.style.fontSize = nextScale + "%";
  } catch {
    document.documentElement.style.fontSize = defaultScale + "%";
  }
})();`;
