import { PACE_DISTANCES, SPLIT_STRATEGIES, buildPacePlan, formatDuration, parseTargetTime } from './pace';

describe('parseTargetTime', () => {
  it('reads h:mm:ss and mm:ss', () => {
    expect(parseTargetTime('3:30:00')).toBe(12600);
    expect(parseTargetTime('45:30')).toBe(2730);
  });

  it('rejects malformed input', () => {
    for (const bad of ['', 'abc', '3', '1:75:00', '0:00', '1:2:3:4', '-5:00']) {
      expect(parseTargetTime(bad)).toBeNull();
    }
  });
});

describe('formatDuration', () => {
  it('pads minutes only when hours are shown', () => {
    expect(formatDuration(12600)).toBe('3:30:00');
    expect(formatDuration(299)).toBe('4:59');
    expect(formatDuration(3605)).toBe('1:00:05');
  });
});

describe('buildPacePlan', () => {
  const targets = [1200, 2730, 5400, 12600, 17999];

  it('finishes exactly on the target for every distance and strategy', () => {
    for (const distance of PACE_DISTANCES) {
      for (const strategy of SPLIT_STRATEGIES) {
        for (const target of targets) {
          const plan = buildPacePlan(distance, target, strategy);
          expect(plan.checkpoints.at(-1)).toMatchObject({ label: 'Finish', elapsedSeconds: target });
        }
      }
    }
  });

  it('never goes backwards in time', () => {
    for (const distance of PACE_DISTANCES) {
      for (const strategy of SPLIT_STRATEGIES) {
        const elapsed = buildPacePlan(distance, 12600, strategy).checkpoints.map((c) => c.elapsedSeconds);
        expect([...elapsed].sort((a, b) => a - b)).toEqual(elapsed);
      }
    }
  });

  it('reaches halfway at half the target on an even split', () => {
    const even = SPLIT_STRATEGIES.find((s) => s.key === 'even')!;
    const marathon = PACE_DISTANCES.find((d) => d.key === 'marathon')!;
    const halfway = buildPacePlan(marathon, 12600, even).checkpoints.find((c) => c.label === 'Halfway');
    expect(halfway?.elapsedSeconds).toBe(6300);
  });

  it('runs the second half faster on a negative split and slower on a positive one', () => {
    const marathon = PACE_DISTANCES.find((d) => d.key === 'marathon')!;
    const halfwayAt = (key: string) =>
      buildPacePlan(marathon, 12600, SPLIT_STRATEGIES.find((s) => s.key === key)!).checkpoints.find(
        (c) => c.label === 'Halfway',
      )!.elapsedSeconds;
    expect(halfwayAt('negative')).toBe(6426);
    expect(halfwayAt('positive')).toBe(6174);
  });

  it('reports the average pace and speed', () => {
    const tenK = PACE_DISTANCES.find((d) => d.key === '10k')!;
    const plan = buildPacePlan(tenK, 3000, SPLIT_STRATEGIES[1]);
    expect(plan.averagePaceSecondsPerKm).toBe(300);
    expect(plan.averageSpeedKmh).toBe(12);
  });
});
