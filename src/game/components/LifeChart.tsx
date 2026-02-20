'use client';

import { useState, useMemo } from 'react';

export interface StatsHistoryEntry {
  age: number;
  stats: Record<string, number>;
}

interface LifeChartProps {
  history: StatsHistoryEntry[];
}

const STAT_LINES: { key: string; color: string; label: string }[] = [
  { key: 'health', color: '#ef4444', label: 'Salud' },
  { key: 'happiness', color: '#22c55e', label: 'Felicidad' },
  { key: 'money', color: '#eab308', label: 'Dinero' },
  { key: 'education', color: '#3b82f6', label: 'Educación' },
];

const PADDING = { top: 20, right: 20, bottom: 30, left: 35 };

export default function LifeChart({ history }: LifeChartProps) {
  const [enabledStats, setEnabledStats] = useState<Set<string>>(
    () => new Set(STAT_LINES.map((s) => s.key))
  );
  const [hoveredPoint, setHoveredPoint] = useState<{
    age: number;
    stats: Record<string, number>;
    x: number;
    y: number;
  } | null>(null);

  // Use a viewBox for responsiveness
  const viewW = 600;
  const viewH = 260;
  const chartW = viewW - PADDING.left - PADDING.right;
  const chartH = viewH - PADDING.top - PADDING.bottom;

  const { xScale, yScale, ages } = useMemo(() => {
    if (history.length === 0) return { xScale: () => 0, yScale: () => 0, ages: [] as number[] };
    const ages = history.map((h) => h.age);
    const minAge = ages[0];
    const maxAge = ages[ages.length - 1];
    const range = maxAge - minAge || 1;
    const xScale = (age: number) => PADDING.left + ((age - minAge) / range) * chartW;
    const yScale = (val: number) => PADDING.top + chartH - (val / 100) * chartH;
    return { xScale, yScale, ages };
  }, [history, chartW, chartH]);

  if (history.length < 2) return null;

  const toggleStat = (key: string) => {
    setEnabledStats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Y-axis grid lines
  const yTicks = [0, 25, 50, 75, 100];
  // X-axis labels every 10 ages
  const xTicks = ages.filter((a) => a % 10 === 0);

  return (
    <div className="bg-surface-card border border-surface-card rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">📊 Evolución de vida</h3>

      {/* Legend (toggleable) */}
      <div className="flex flex-wrap gap-2">
        {STAT_LINES.map((s) => (
          <button
            key={s.key}
            onClick={() => toggleStat(s.key)}
            className={`text-xs px-2 py-1 rounded-full border transition-all ${
              enabledStats.has(s.key)
                ? 'border-current opacity-100'
                : 'border-gray-600 opacity-40'
            }`}
            style={{ color: s.color }}
          >
            ● {s.label}
          </button>
        ))}
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          className="w-full h-auto"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Grid lines */}
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={PADDING.left}
                x2={viewW - PADDING.right}
                y1={yScale(tick)}
                y2={yScale(tick)}
                stroke="#374151"
                strokeWidth={0.5}
              />
              <text
                x={PADDING.left - 5}
                y={yScale(tick) + 3}
                textAnchor="end"
                fill="#6b7280"
                fontSize={9}
              >
                {tick}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {xTicks.map((age) => (
            <text
              key={age}
              x={xScale(age)}
              y={viewH - 5}
              textAnchor="middle"
              fill="#6b7280"
              fontSize={9}
            >
              {age}
            </text>
          ))}

          {/* Stat lines */}
          {STAT_LINES.filter((s) => enabledStats.has(s.key)).map((s) => {
            const points = history
              .filter((h) => h.stats[s.key] !== undefined)
              .map((h) => `${xScale(h.age)},${yScale(h.stats[s.key])}`);
            if (points.length < 2) return null;
            return (
              <polyline
                key={s.key}
                points={points.join(' ')}
                fill="none"
                stroke={s.color}
                strokeWidth={1.8}
                strokeLinejoin="round"
                opacity={0.85}
              />
            );
          })}

          {/* Invisible hover zones per data point */}
          {history.map((h, i) => (
            <rect
              key={i}
              x={xScale(h.age) - (chartW / history.length) / 2}
              y={PADDING.top}
              width={Math.max(chartW / history.length, 6)}
              height={chartH}
              fill="transparent"
              onMouseEnter={() =>
                setHoveredPoint({ age: h.age, stats: h.stats, x: xScale(h.age), y: PADDING.top })
              }
            />
          ))}

          {/* Hover dots */}
          {hoveredPoint &&
            STAT_LINES.filter((s) => enabledStats.has(s.key)).map((s) => {
              const val = hoveredPoint.stats[s.key];
              if (val === undefined) return null;
              return (
                <circle
                  key={s.key}
                  cx={hoveredPoint.x}
                  cy={yScale(val)}
                  r={3.5}
                  fill={s.color}
                  stroke="#111"
                  strokeWidth={1}
                />
              );
            })}

          {/* Hover vertical line */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              x2={hoveredPoint.x}
              y1={PADDING.top}
              y2={PADDING.top + chartH}
              stroke="#9ca3af"
              strokeWidth={0.5}
              strokeDasharray="3,3"
            />
          )}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute bg-surface-elevated border border-gray-700 rounded-lg px-3 py-2 text-xs pointer-events-none z-10 shadow-lg"
            style={{
              left: `${(hoveredPoint.x / viewW) * 100}%`,
              top: 0,
              transform: 'translateX(-50%)',
            }}
          >
            <p className="font-semibold text-foreground mb-1">Edad {hoveredPoint.age}</p>
            {STAT_LINES.filter((s) => enabledStats.has(s.key)).map((s) => (
              <p key={s.key} style={{ color: s.color }}>
                {s.label}: {hoveredPoint.stats[s.key] ?? '—'}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
