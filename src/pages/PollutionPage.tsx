import { useState } from "react";
import { VStack, Heading, Text, Box } from "@chakra-ui/react";
import { PollutionMap } from "@/components/sections/pollution/PollutionMap";
import { PollutionWidget } from "@/components/sections/pollution/PollutionWidget";
import type { PollutionData, PollutionMetric } from "@/models/pollution";
import { getLegendForMetric } from "@/models/pollutionLegend";

const METRICS: { key: PollutionMetric; label: string; icon: string }[] = [
  { key: "pm10",        label: "PM10",        icon: "💨" },
  { key: "pm25",        label: "PM2.5",       icon: "🌫️" },
  { key: "pm1",         label: "PM1",         icon: "🔬" },
  { key: "no2",         label: "NO₂",         icon: "🏭" },
  { key: "o3",          label: "O₃",          icon: "☁️" },
  { key: "temperature", label: "Temperature", icon: "🌡️" },
  { key: "humidity",    label: "Humidity",    icon: "💧" },
  { key: "pressure",    label: "Pressure",    icon: "🔵" },
  { key: "noise_dba",   label: "Noise",       icon: "🔊" },
];

const CITY = "Skopje";

export function PollutionPage() {
  const [selectedMetric, setSelectedMetric] = useState<PollutionMetric>("pm10");
  const [pollutionData,  setPollutionData]  = useState<PollutionData | null>(null);

  // Override backend legend with correct per-metric legend
  const handleDataLoaded = (data: PollutionData) => {
    setPollutionData({
      ...data,
      legend: getLegendForMetric(data.metric),
    });
  };

  return (
    <VStack align="stretch" gap="5">
      <Box>
        <Heading size="lg" letterSpacing="-0.3px">Air Quality Monitor</Heading>
        <Text color="fg.muted" fontSize="sm" mt="1">
          Real-time pollution data · Skopje
        </Text>
      </Box>

      <Box display="flex" gap="2" flexWrap="wrap">
        {METRICS.map((m) => {
          const active = m.key === selectedMetric;
          return (
            <button
              key={m.key}
              className={`metric-btn${active ? " metric-btn--active" : ""}`}
              onClick={() => { if (m.key === selectedMetric) return; setSelectedMetric(m.key); setPollutionData(null); }}
            >
              <span className="metric-btn__icon">{m.icon}</span>
              <span className="metric-btn__label">{m.label}</span>
            </button>
          );
        })}
      </Box>

      <PollutionMap
        stations={pollutionData?.stations}
        legend={getLegendForMetric(selectedMetric)}
        unit={pollutionData?.unit}
        metric={selectedMetric}
      />

      <PollutionWidget
        city={CITY}
        metric={selectedMetric}
        onDataLoaded={handleDataLoaded}
      />

      <style>{`
        .metric-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 100px;
          border: 1px solid var(--chakra-colors-border-DEFAULT, #e5e5e5);
          cursor: pointer;
          font-family: "Manrope Variable", Manrope, sans-serif;
          font-weight: 500;
          font-size: 13px;
          background: transparent;
          color: var(--chakra-colors-fg-muted, #555);
          transition: background 0.15s ease, color 0.15s ease,
                      box-shadow 0.15s ease, border-color 0.15s ease;
        }
        .metric-btn--active {
          background: var(--chakra-colors-accent-700, #225f42);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 2px 12px rgba(34,95,66,0.28);
          font-weight: 700;
        }
        .metric-btn__icon {
          font-size: 14px;
          line-height: 1;
          display: inline-block;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .metric-btn__label {
          display: inline-block;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      font-weight 0.15s ease;
        }
        .metric-btn:not(.metric-btn--active):hover .metric-btn__icon {
          transform: scale(1.35);
        }
        .metric-btn:not(.metric-btn--active):hover .metric-btn__label {
          transform: scale(1.08);
          font-weight: 600;
        }
        .metric-btn:not(.metric-btn--active):hover {
          background: var(--chakra-colors-bg-muted, #efefef);
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        }
      `}</style>
    </VStack>
  );
}