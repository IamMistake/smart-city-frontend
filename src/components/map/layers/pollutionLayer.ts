import maplibregl from "maplibre-gl";
import type { FeatureCollection } from "geojson";

function createPinImage(color: string): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = 40;
    canvas.height = 52;
    const ctx = canvas.getContext("2d")!;

    // Pin тело
    ctx.beginPath();
    ctx.arc(20, 20, 18, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Pin опашка
    ctx.beginPath();
    ctx.moveTo(13, 34);
    ctx.lineTo(20, 52);
    ctx.lineTo(27, 34);
    ctx.fillStyle = color;
    ctx.fill();

    return canvas;
}

const PIN_LEVELS = [
    { id: "pin-green",  color: "#3ce74d", min: 0,   max: 40  },
    { id: "pin-yellow", color: "#f3de4c", min: 40,  max: 80  },
    { id: "pin-orange", color: "#ff9f0a", min: 80,  max: 120 },
    { id: "pin-red",    color: "#ff3b30", min: 120, max: 999 },
];

export function addPollutionLayer(map: maplibregl.Map, data?: FeatureCollection) {
    if (map.getSource("pollution")) return;

    const pollutionData: FeatureCollection = data ?? { type: "FeatureCollection", features: [] };

    // Регистрирај pin слики
    for (const pin of PIN_LEVELS) {
        if (!map.hasImage(pin.id)) {
            const canvas = createPinImage(pin.color);
            const ctx = canvas.getContext("2d")!;
            // Бел текст placeholder (бројот се додава преку symbol layer)
            map.addImage(pin.id, ctx.getImageData(0, 0, 40, 52));
        }
    }

    map.addSource("pollution", { type: "geojson", data: pollutionData });

    // Heatmap позадина
    map.addLayer({
        id: "pollution-layer",
        type: "heatmap",
        source: "pollution",
        paint: {
            "heatmap-weight": ["interpolate", ["linear"], ["get", "value"], 0, 0, 150, 1],
            "heatmap-intensity": 1.2,
            "heatmap-radius": 40,
            "heatmap-opacity": 0.5,
            "heatmap-color": [
                "interpolate", ["linear"], ["heatmap-density"],
                0,   "rgba(0,255,0,0)",
                0.2, "#3ce74d",
                0.4, "#f3de4c",
                0.6, "#ff9f0a",
                1.0, "#ff3b30",
            ],
        },
    });

    // Circle со боја
    map.addLayer({
        id: "pollution-points",
        type: "circle",
        source: "pollution",
        paint: {
            "circle-radius": 18,
            "circle-color": [
                "step", ["get", "value"],
                "#3ce74d", 40,
                "#f3de4c", 80,
                "#ff9f0a", 120,
                "#ff3b30"
            ],
            "circle-stroke-width": 2.5,
            "circle-stroke-color": "#fff",
        },
    });

    // Број внатре
    map.addLayer({
        id: "pollution-labels",
        type: "symbol",
        source: "pollution",
        layout: {
            "text-field": ["to-string", ["get", "value"]],
            "text-size": 12,
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-allow-overlap": true,
            "text-anchor": "center",
        },
        paint: {
            "text-color": "#ffffff",
            "text-halo-color": "rgba(0,0,0,0.3)",
            "text-halo-width": 1,
        },
    });
}

export function removePollutionLayer(map: maplibregl.Map) {
    if (map.getLayer("pollution-labels")) map.removeLayer("pollution-labels");
    if (map.getLayer("pollution-points")) map.removeLayer("pollution-points");
    if (map.getLayer("pollution-layer")) map.removeLayer("pollution-layer");
    if (map.getSource("pollution")) map.removeSource("pollution");
}