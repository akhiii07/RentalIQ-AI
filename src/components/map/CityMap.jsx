import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Polygon, useMap } from "react-leaflet";
import L from "leaflet";
import { T } from "../../theme";
import { LOCALITIES, BLR_BOUNDS, findLocality, findAptsInLocality } from "../../data";
import { fmtINRk } from "../../utils";

const CENTER = [12.970, 77.640];

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
  // Building height varies by total floors → taller tower for taller buildings.
  const floors = Math.max(4, Math.min(8, Math.round(apt.totalFloors / 3)));
  const winRows = [];
  for (let row = 0; row < floors; row++) {
    const y = 9 + row * 4.2;
    winRows.push(
      `<rect x="6"  y="${y}" width="3" height="2.6" rx="0.4"/>` +
      `<rect x="11" y="${y}" width="3" height="2.6" rx="0.4"/>` +
      `<rect x="16" y="${y}" width="3" height="2.6" rx="0.4"/>` +
      `<rect x="21" y="${y}" width="3" height="2.6" rx="0.4"/>`
    );
  }
  const bldgHeight = 9 + floors * 4.2 + 3; // bottom padding
  return L.divIcon({
    className: "riq-marker-wrap",
    html: `
      <div class="riq-apt ${hovered ? "hov" : ""}">
        <div class="riq-apt-pill">${fmtINRk(apt.rent)}</div>
        <div class="riq-apt-bldg" aria-hidden="true">
          <svg width="30" height="${bldgHeight + 4}" viewBox="0 0 30 ${bldgHeight + 4}" fill="none">
            <!-- roof slab -->
            <rect x="3" y="4" width="24" height="3" rx="1" class="riq-bldg-roof" />
            <!-- body -->
            <rect x="3" y="6" width="24" height="${bldgHeight - 4}" rx="2" class="riq-bldg-body" />
            <!-- windows -->
            <g class="riq-bldg-win">${winRows.join("")}</g>
            <!-- door -->
            <rect x="13" y="${bldgHeight - 1}" width="4" height="3" rx="0.4" class="riq-bldg-door" />
          </svg>
        </div>
        <div class="riq-apt-label">${apt.bhk}BHK · ${apt.name}</div>
      </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// --- map controllers --------------------------------------------------------

// On first mount, fit the camera to the Bengaluru rental belt so all
// 20 localities fill the visible map. Subsequent drill-in events fly to a
// closer zoom; drill-out fits back to the bounds.
function DrillController({ drilledInto }) {
  const map = useMap();
  useEffect(() => {
    if (drilledInto) {
      const loc = findLocality(drilledInto);
      if (loc) map.flyTo([loc.lat, loc.lng], 15.5, { duration: 0.9 });
    } else {
      map.flyBounds
        ? map.flyBounds(BLR_BOUNDS, { duration: 0.9, padding: [16, 16] })
        : map.fitBounds(BLR_BOUNDS, { padding: [16, 16] });
    }
  }, [drilledInto, map]);
  return null;
}

// --- marker components ------------------------------------------------------

function LocalityZone({ loc, hovered, onDrill, setHover }) {
  const fill = T.heat[loc.heat];
  const icon = useMemo(
    () => localityPillIcon(loc, false, hovered),
    [loc.id, loc.avgRent, loc.trend, hovered]
  );
  return (
    <>
      <Polygon
        positions={loc.polygon}
        pathOptions={{
          color: hovered ? T.ink : T.ink2,
          weight: hovered ? 2.2 : 1.4,
          fillColor: fill,
          fillOpacity: hovered ? 0.78 : 0.6,
          dashArray: "5 4",
          lineJoin: "round",
        }}
        eventHandlers={{
          click: () => onDrill(loc.id),
          mouseover: () => setHover(loc.id),
          mouseout: () => setHover(null),
        }}
      />
      <Marker
        position={[loc.lat, loc.lng]}
        icon={icon}
        zIndexOffset={hovered ? 500 : 0}
        eventHandlers={{
          click: () => onDrill(loc.id),
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
      zoom={12.5}
      minZoom={12}
      maxZoom={18}
      maxBounds={BLR_BOUNDS}
      maxBoundsViscosity={1.0}
      scrollWheelZoom
      zoomControl
      zoomSnap={0.25}
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
          hovered={hoverId === loc.id}
          onDrill={setDrilledInto}
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
