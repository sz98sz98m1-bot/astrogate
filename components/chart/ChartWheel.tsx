import type { ChartData } from "@/types/chart";
import { normalizeDegrees, ZODIAC_NAMES_AR, ZODIAC_SIGNS, ZODIAC_SYMBOLS } from "@/lib/astro/zodiac";
import { PLANET_SYMBOLS } from "@/lib/astro/labels";

const SIZE = 420;
const CENTER = SIZE / 2;
const ZODIAC_RADIUS = 190;
const ZODIAC_LABEL_RADIUS = 168;
const HOUSE_NUMBER_RADIUS = 140;
const PLANET_RADIUS = 118;

/**
 * Converts an absolute ecliptic longitude to an SVG point, rotated so the Ascendant
 * always sits at the 9 o'clock position with the zodiac running counterclockwise --
 * the standard visual convention for a natal chart wheel. This rotation is independent
 * of page text direction (RTL), since SVG does not auto-mirror with CSS `dir`.
 */
function pointForLongitude(longitude: number, ascendantLongitude: number, radius: number) {
  const rotated = normalizeDegrees(longitude - ascendantLongitude);
  const mathAngleDeg = normalizeDegrees(180 + rotated);
  const rad = (mathAngleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER - radius * Math.sin(rad),
  };
}

export default function ChartWheel({ chart }: { chart: ChartData }) {
  const ascLon = chart.ascendant.longitude;

  const signBoundaries = ZODIAC_SIGNS.map((sign, index) => {
    const startLongitude = index * 30;
    const start = pointForLongitude(startLongitude, ascLon, ZODIAC_RADIUS);
    const labelPoint = pointForLongitude(startLongitude + 15, ascLon, ZODIAC_LABEL_RADIUS);
    return { sign, start, labelPoint };
  });

  const houseNumberPoints = chart.houses.map((house) => {
    const point = pointForLongitude(house.longitude + 15, ascLon, HOUSE_NUMBER_RADIUS);
    return { ...house, point };
  });

  const ascPoint = pointForLongitude(ascLon, ascLon, ZODIAC_RADIUS);
  const mcPoint = pointForLongitude(chart.midheaven.longitude, ascLon, ZODIAC_RADIUS);

  return (
    <div className="glass-panel relative mx-auto flex max-w-md items-center justify-center p-6">
      <div
        className="pointer-events-none absolute inset-0 rounded-[24px] opacity-40 blur-2xl"
        style={{
          background: "radial-gradient(circle, var(--color-violet-accent) 0%, transparent 70%)",
        }}
      />
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="relative w-full"
        style={{ direction: "ltr" }}
      >
        <defs>
          <filter id="planet-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={ZODIAC_RADIUS} fill="none" stroke="#a855f733" />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={PLANET_RADIUS + 18}
          fill="none"
          stroke="#a855f722"
        />

        {signBoundaries.map(({ sign, start, labelPoint }) => (
          <g key={sign}>
            <line
              x1={CENTER}
              y1={CENTER}
              x2={start.x}
              y2={start.y}
              stroke="#a855f733"
              strokeWidth={1}
            />
            <text
              x={labelPoint.x}
              y={labelPoint.y}
              fontSize={18}
              fill="#ffd166"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {ZODIAC_SYMBOLS[sign]}
            </text>
          </g>
        ))}

        {houseNumberPoints.map((house) => (
          <text
            key={house.house}
            x={house.point.x}
            y={house.point.y}
            fontSize={11}
            fill="#eef1ffaa"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {house.house}
          </text>
        ))}

        {/* Ascendant marker */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={ascPoint.x}
          y2={ascPoint.y}
          stroke="#ffd166"
          strokeWidth={2}
        />
        <text x={ascPoint.x - 14} y={ascPoint.y + 4} fontSize={12} fill="#ffd166">
          ASC
        </text>

        {/* Midheaven marker */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={mcPoint.x}
          y2={mcPoint.y}
          stroke="#38bdf8"
          strokeWidth={2}
        />
        <text x={mcPoint.x - 10} y={mcPoint.y - 8} fontSize={12} fill="#38bdf8">
          MC
        </text>

        {chart.planets.map((planet) => {
          const point = pointForLongitude(planet.longitude, ascLon, PLANET_RADIUS);
          return (
            <text
              key={planet.planet}
              x={point.x}
              y={point.y}
              fontSize={20}
              fill="#eef1ff"
              textAnchor="middle"
              dominantBaseline="middle"
              filter="url(#planet-glow)"
            >
              {PLANET_SYMBOLS[planet.planet]}
            </text>
          );
        })}

        <text
          x={CENTER}
          y={CENTER}
          fontSize={11}
          fill="#eef1ff66"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {ZODIAC_NAMES_AR[chart.ascendant.sign]}
        </text>
      </svg>
    </div>
  );
}
