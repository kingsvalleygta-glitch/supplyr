"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface TrackingMapProps {
  destination: { lat: number; lng: number };
  driver?: { lat: number; lng: number; heading?: number } | null;
  route: [number, number][];
  live?: boolean;
}

function FitBounds({
  points,
}: {
  points: [number, number][];
}) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) {
      if (points[0]) map.setView(points[0], 12);
      return;
    }
    const bounds = L.latLngBounds(points.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 13 });
  }, [map, points]);
  return null;
}

function PanToDriver({
  driver,
  live,
}: {
  driver?: { lat: number; lng: number } | null;
  live?: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (!live || !driver) return;
    map.panTo([driver.lat, driver.lng], { animate: true, duration: 0.8 });
  }, [map, driver?.lat, driver?.lng, live]);
  return null;
}

const destIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#111113;border:3px solid #f5c518;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function driverIcon(heading = 0) {
  return L.divIcon({
    className: "",
    html: `<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;transform:rotate(${heading}deg)">
      <div style="width:22px;height:22px;border-radius:50%;background:#f5c518;border:3px solid #111113;box-shadow:0 2px 10px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="transform:rotate(-${heading}deg)">
          <path d="M12 3l7 18-7-4-7 4 7-18z" fill="#111113"/>
        </svg>
      </div>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

export function OrderTrackingMap({
  destination,
  driver,
  route,
  live,
}: TrackingMapProps) {
  const fitPoints = useMemo(() => {
    const pts: [number, number][] = [...route];
    pts.push([destination.lat, destination.lng]);
    if (driver) pts.push([driver.lat, driver.lng]);
    return pts;
  }, [route, destination, driver]);

  const center: [number, number] = driver
    ? [driver.lat, driver.lng]
    : [destination.lat, destination.lng];

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="h-full w-full rounded-xl"
      style={{ minHeight: 280, background: "#1a1a1e" }}
      zoomControl={false}
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FitBounds points={fitPoints} />
      <PanToDriver driver={driver} live={live} />
      {route.length >= 2 ? (
        <Polyline
          positions={route}
          pathOptions={{
            color: "#f5c518",
            weight: 4,
            opacity: 0.85,
            dashArray: live ? undefined : "6 8",
          }}
        />
      ) : null}
      <CircleMarker
        center={[destination.lat, destination.lng]}
        radius={10}
        pathOptions={{
          color: "#f5c518",
          fillColor: "#111113",
          fillOpacity: 0.9,
          weight: 3,
        }}
      />
      <Marker position={[destination.lat, destination.lng]} icon={destIcon} />
      {driver ? (
        <Marker
          position={[driver.lat, driver.lng]}
          icon={driverIcon(driver.heading ?? 0)}
        />
      ) : null}
    </MapContainer>
  );
}
