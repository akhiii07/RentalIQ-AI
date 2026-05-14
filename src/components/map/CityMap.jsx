import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import { T } from "../../theme";
import { LOCALITIES, BLR_BOUNDS, findLocality, findAptsInLocality } from "../../data";
import { fmtINRk } from "../../utils";

const CENTER = [12.955, 77.620];

// --- icon factories ---------------------------------------------------------

function localityPillIcon(loc, selected, hovered) {
  const state = selected ? "sel" : hovered ? "hov" : "";
  const dot = T.heat[loc.heat];
  const arrow = loc.trend >= 0 ? "↑" : "↓";
  return L.divIcon({
    className: "riq-marker-wrap",
    html: `
      <div class="riq-marker ${state}">
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

function aptPillIcon(apt, hovered) {
  return L.divIcon({
    className: "riq-marker-wrap",
    html: `
      <div class="riq-apt ${hovered ? "hov" : ""}">
        <div class="riq-apt-pill">${fmtINRk(apt.rent)}</div>
        <div class="riq-apt-label">${apt.bhk}BHK · ${apt.name}</div>
      </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// --- map controllers --------------------------------------------------------

// Animate camera to (lat,lng) at target zoom when drilled-in changes.
function DrillController({ drilledInto }) {
  const map = useMap();
  useEffect(() => {
    if (drilledInto) {
      const loc = findLocality(drilledInto);
      if (loc) map.flyTo([loc.lat, loc.lng], 15, { duration: 0.9 });
    } else {
      map.flyTo(CENTER, 11.5, { duration: 0.9 });
    }
  }, [drilledInto, map]);
  return null;
}

// --- marker components ------------------------------------------------------

function LocalityZone({ loc, selected, hovered, onSelect, setHover }) {
  const fill = T.heat[loc.heat];
  const icon = useMemo(
    () => localityPillIcon(loc, selected, hovered),
    [loc.id, loc.avgRent, loc.trend, selected, hovered]
  );
  return (
    <>
      <Polygon
        positions={loc.polygon}
        pathOptions={{
          color: hovered || selected ? T.ink : T.ink2,
          weight: hovered || selected ? 2 : 1.2,
          fillColor: fill,
          fillOpacity: hovered ? 0.65 : selected ? 0.7 : 0.48,
          dashArray: "4 4",
          lineJoin: "round",
        }}
        eventHandlers={{
          click: () => onSelect(loc.id),
          mouseover: () => setHover(loc.id),
          mouseout: () => setHover(null),
        }}
      />
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
    </>
  );
}

function AptMarker({ apt, hovered, onClick, setHover }) {
  const icon = useMemo(() => aptPillIcon(apt, hovered), [apt.id, apt.rent, hovered]);
  return (
    <Marker
      position={[apt.lat, apt.lng]}
      icon={icon}
      zIndexOffset={hovered ? 500 : 0}
      eventHandlers={{
        click: () => onClick(apt),
        mouseover: () => setHover(apt.id),
        mouseout: () => setHover(null),
      }}
    />
  );
}

// --- main map ---------------------------------------------------------------

export default function CityMap({
  selected,
  onSelect,
  hoverId,
  setHoverId,
  drilledInto,
  setDrilledInto,
  onAptClick,
  hoverAptId,
  setHoverAptId,
}) {
  const apartments = drilledInto ? findAptsInLocality(drilledInto) : [];
  const drilledLoc = drilledInto ? findLocality(drilledInto) : null;

  return (
    <MapContainer
      center={CENTER}
      zoom={11.5}
      minZoom={11}
      maxZoom={17}
      maxBounds={BLR_BOUNDS}
      maxBoundsViscosity={1.0}
      scrollWheelZoom
      zoomControl
      style={{ width: "100%", height: "100%", background: "#F5F5F2" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
        bounds={BLR_BOUNDS}
      />

      <DrillController drilledInto={drilledInto} />

      {/* Overview mode — all locality polygons + price pills. */}
      {!drilledInto && LOCALITIES.map((loc) => (
        <LocalityZone
          key={loc.id}
          loc={loc}
          selected={selected === loc.id}
          hovered={hoverId === loc.id}
          onSelect={(id) => {
            setDrilledInto(id);
            onSelect(id);
          }}
          setHover={setHoverId}
        />
      ))}

      {/* Drill-in mode — selected polygon as faint outline + apartment markers. */}
      {drilledLoc && (
        <Polygon
          positions={drilledLoc.polygon}
          pathOptions={{
            color: T.ink2,
            weight: 1.4,
            fillColor: T.heat[drilledLoc.heat],
            fillOpacity: 0.18,
            dashArray: "5 4",
          }}
          interactive={false}
        />
      )}
      {drilledInto && apartments.map((apt) => (
        <AptMarker
          key={apt.id}
          apt={apt}
          hovered={hoverAptId === apt.id}
          onClick={onAptClick}
          setHover={setHoverAptId}
        />
      ))}
    </MapContainer>
  );
}
