export type PaceDistance = { key: string; label: string; km: number; checkpointsKm: number[] };

export const PACE_DISTANCES: PaceDistance[] = [
  { key: '5k', label: '5k', km: 5, checkpointsKm: [1, 2, 3, 4] },
  { key: '10k', label: '10k', km: 10, checkpointsKm: [2, 4, 6, 8] },
  { key: 'half', label: 'Half Marathon', km: 21.0975, checkpointsKm: [5, 10, 15, 20] },
  { key: 'marathon', label: 'Marathon', km: 42.195, checkpointsKm: [5, 10, 15, 20, 30, 35, 40] },
];

export type SplitStrategy = { key: string; label: string; percent: number };

// Negative split: second half faster than the first. Positive: the reverse.
export const SPLIT_STRATEGIES: SplitStrategy[] = [
  { key: 'negative', label: 'Negative Split (-2%)', percent: -2 },
  { key: 'even', label: 'Even Split (0%)', percent: 0 },
  { key: 'positive', label: 'Positive Split (+2%)', percent: 2 },
];

export type Checkpoint = {
  label: string;
  km: number;
  elapsedSeconds: number;
  segmentPaceSecondsPerKm: number;
  cue: string;
};

export type PacePlan = {
  averagePaceSecondsPerKm: number;
  averageSpeedKmh: number;
  checkpoints: Checkpoint[];
};

// Parses "h:mm:ss" or "mm:ss" into whole seconds. Returns null when invalid.
export function parseTargetTime(input: string): number | null {
  const parts = input.trim().split(':');
  if (parts.length < 2 || parts.length > 3) return null;
  if (!parts.every((p) => /^\d+$/.test(p))) return null;
  const numbers = parts.map(Number);
  const [hours, minutes, seconds] = parts.length === 3 ? numbers : [0, ...numbers];
  if (minutes > 59 || seconds > 59) return null;
  const total = hours * 3600 + minutes * 60 + seconds;
  return total > 0 ? total : null;
}

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.round(totalSeconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(h > 0 ? 2 : 1, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatPace(secondsPerKm: number): string {
  return `${formatDuration(secondsPerKm)} /km`;
}

// The first half runs at average * (1 - p) and the second at average * (1 + p),
// where p is the strategy percent. The two halves are equal in distance, so the
// total always equals the target time exactly.
export function buildPacePlan(distance: PaceDistance, targetSeconds: number, strategy: SplitStrategy): PacePlan {
  const average = targetSeconds / distance.km;
  const shift = strategy.percent / 100;
  const firstHalfPace = average * (1 - shift);
  const secondHalfPace = average * (1 + shift);
  const halfKm = distance.km / 2;

  const elapsedAt = (km: number) =>
    km <= halfKm ? km * firstHalfPace : halfKm * firstHalfPace + (km - halfKm) * secondHalfPace;

  const marks = [
    ...distance.checkpointsKm.map((km) => ({ label: `${km}k`, km })),
    { label: 'Halfway', km: halfKm },
    { label: 'Finish', km: distance.km },
  ].sort((a, b) => a.km - b.km);

  const checkpoints = marks.map((mark) => {
    const isFinish = mark.km === distance.km;
    const inFirstHalf = mark.km <= halfKm;
    return {
      label: mark.label,
      km: mark.km,
      // The finish row is pinned to the target so rounding can never drift it.
      elapsedSeconds: isFinish ? targetSeconds : Math.round(elapsedAt(mark.km)),
      segmentPaceSecondsPerKm: Math.round(inFirstHalf ? firstHalfPace : secondHalfPace),
      cue: cueFor(strategy, inFirstHalf, isFinish),
    };
  });

  return {
    averagePaceSecondsPerKm: average,
    averageSpeedKmh: 3600 / average,
    checkpoints,
  };
}

function cueFor(strategy: SplitStrategy, inFirstHalf: boolean, isFinish: boolean): string {
  if (isFinish) return 'Empty the tank';
  if (strategy.percent === 0) return 'Hold steady';
  const holdingBack = strategy.percent < 0 ? inFirstHalf : !inFirstHalf;
  if (strategy.percent < 0) return holdingBack ? 'Stay controlled' : 'Build the pace';
  return holdingBack ? 'Protect the legs' : 'Bank time early';
}
