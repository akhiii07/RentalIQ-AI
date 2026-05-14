import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { T } from "../../theme";
import { LOCALITIES } from "../../data";
import { fmtINRk } from "../../utils";

const CENTER = [12.945, 77.655];
const ZOOM = 12;

function FlyToSelected({ selectedId }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const loc = LOCALITIES.find((l) => l.id === selectedId);
    if (loc) map.flyTo([loc.lat, loc.lng], 14, { duration: 0.7 });
  }, [selectedId, map]);
  return null;
}

function buildIcon(loc, selected, hovered) {
  const state = selected ? "sel" : hovered ? "hov" : "";
  const dot = T.heat[loc.heat];
  const arrow = loc.trend >= 0 ? "↑" : "↓";
  return L.divIcon({
    className: "riq-marker-wrap",
    html: `
      <div class="riq-marker ${state}" data-id="${loc.id}">
        <div class="riq-pill">
          <span class="riq-dot" style="background:${dot}"></span>
          <span class="riq-price">${fmtINRk(loc.avgRent)}</span>
          <span class="riq-trend">${arrow}${Math.abs(loc.trend).toFixed(1)}%</span>
        </div>
        <div class="riq-label">${loc.name}</div>
      </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function LocalityPin({ loc, selected, hovered, onSelect, setHover }) {
  const icon = useMemo(
    () => buildIcon(loc, selected, hovered),
    [loc.id, loc.avgRent, loc.name, loc.trend, selected, hovered]
  );
  return (
    <Marker
      position={[loc.lat, loc.lng]}
      icon={icon}
      zIndexOffset={selected ? 1000 : hovered ? 500 : 0}
      eventHandlers={{
        click: () => onSelect(loc.id),
        mouseover: () => setHover(loc.id),
        mouseout: () => setHover(null),
      }}
    />
  );
}

export default function CityMap({ selected, onSelect, hoverId, setHoverId }) {
  return (
    <MapContainer
      center={CENTER}
      zoom={ZOOM}
      scrollWheelZoom
      zoomControl
      style={{ width: "100%", height: "100%", background: "#F5F5F2" }}
    >
      {/* CARTO Positron — pale, neutral, Airbnb-style minimal tiles. */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
      />

      <FlyToSelected selectedId={selected} />

      {LOCALITIES.map((loc) => (
        <LocalityPin
          key={loc.id}
          loc={loc}
          selected={selected === loc.id}
          hovered={hoverId === loc.id}
          onSelect={onSelect}
          setHover={setHoverId}
        />
      ))}
    </MapContainer>
  );
}
