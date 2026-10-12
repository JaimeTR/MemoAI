"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, LocateFixed, Check } from "lucide-react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

export interface AddressComponents {
  district?: string;
  department?: string;
  city?: string;
}

interface AddressMapPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: string, lat: number, lng: number, components: AddressComponents) => void;
}

interface NominatimAddress {
  road?: string;
  house_number?: string;
  suburb?: string;
  neighbourhood?: string;
  city_district?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
  postcode?: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
}

const LIMA_CENTER: [number, number] = [-12.0464, -77.0428];

// District already gets its own combo box downstream — the summarized address only needs street + postal code.
function buildShortAddress(addr: NominatimAddress): string {
  const street = [addr.road, addr.house_number].filter(Boolean).join(" ");
  return [street, addr.postcode].filter(Boolean).join(", ");
}

function extractComponents(addr: NominatimAddress): AddressComponents {
  return {
    district: addr.suburb || addr.city_district || addr.neighbourhood,
    department: addr.state,
    city: addr.city || addr.town || addr.village || addr.county,
  };
}

export function AddressMapPicker({ isOpen, onClose, onSelect }: AddressMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const [address, setAddress] = useState("");
  const [components, setComponents] = useState<AddressComponents>({});
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState("");

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setCoords({ lat, lng });
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`
      );
      const data = await res.json();
      const addr: NominatimAddress = data.address || {};
      setAddress(buildShortAddress(addr) || data.display_name || "");
      setComponents(extractComponents(addr));
    } catch {
      setAddress("");
      setComponents({});
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapContainerRef.current) return;

      // Brand-colored pin instead of Leaflet's default blue marker — a plain SVG divIcon, no external image/CORS dependency.
      const pinIcon = L.divIcon({
        className: "",
        html:
          `<div style="position:relative;width:30px;height:40px;filter:drop-shadow(0 3px 4px rgba(0,0,0,0.35))">` +
          `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">` +
          `<path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.716 23.284 0 15 0z" fill="#6366f1"/>` +
          `<circle cx="15" cy="15" r="6" fill="white"/>` +
          `</svg></div>`,
        iconSize: [30, 40],
        iconAnchor: [15, 40],
      });

      const map = L.map(mapContainerRef.current).setView(LIMA_CENTER, 12);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker(LIMA_CENTER, { draggable: true, icon: pinIcon }).addTo(map);
      markerRef.current = marker;

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        reverseGeocode(pos.lat, pos.lng);
      });

      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      });

      reverseGeocode(LIMA_CENTER[0], LIMA_CENTER[1]);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [isOpen, reverseGeocode]);

  // Map follows what's typed, live — debounced so we don't hammer Nominatim on every keystroke, no text list involved.
  useEffect(() => {
    if (query.trim().length < 3) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}&countrycodes=pe&limit=1`
        );
        const data: NominatimResult[] = await res.json();
        if (data[0] && mapRef.current && markerRef.current) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const addr = data[0].address || {};
          mapRef.current.setView([lat, lon], 16);
          markerRef.current.setLatLng([lat, lon]);
          // OSM often lacks the exact house number for a street match — keep what the user typed (it has the number) and just append the postal code.
          const typed = query.trim();
          const postcode = addr.postcode;
          setAddress(postcode && !typed.includes(postcode) ? `${typed}, ${postcode}` : typed);
          setComponents(extractComponents(addr));
          setCoords({ lat, lng: lon });
        }
      } catch {}
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLocateError("Tu navegador no soporta geolocalización.");
      return;
    }
    setLocating(true);
    setLocateError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocating(false);
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([latitude, longitude], 17);
          markerRef.current.setLatLng([latitude, longitude]);
          reverseGeocode(latitude, longitude);
        }
      },
      (err) => {
        setLocating(false);
        setLocateError(
          err.code === err.PERMISSION_DENIED
            ? "Permiso de ubicación denegado. Actívalo en los ajustes del navegador."
            : "No se pudo obtener tu ubicación. Intenta buscar tu dirección o mover el pin."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-lg rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-heading text-lg font-bold">Elige tu ubicación</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 pb-2 flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe tu calle o distrito — el mapa se mueve solo..."
                className="flex-1 px-3 py-2 rounded-xl bg-surface-light/60 border border-border text-sm placeholder-text-muted/60 focus:outline-none focus:border-accent/50"
              />
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Search className="w-4 h-4 text-accent" />
              </div>
              <button
                type="button"
                onClick={handleLocate}
                disabled={locating}
                title="Usar mi ubicación"
                className="w-10 h-10 rounded-xl bg-accent/10 hover:bg-accent/20 flex items-center justify-center shrink-0 cursor-pointer transition-colors disabled:opacity-50"
              >
                <LocateFixed className={`w-4 h-4 text-accent ${locating ? "animate-pulse" : ""}`} />
              </button>
            </div>

            {locateError && (
              <p className="px-4 pb-2 text-[11px] text-red-500">{locateError}</p>
            )}

            <div ref={mapContainerRef} className="w-full h-72" />

            <div className="p-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="text-[11px] text-text-muted">Dirección detectada — confirma con el pin</p>
                {coords && (
                  <a
                    href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
                    target="_blank"
                    className="text-[11px] font-medium text-accent hover:text-accent-light shrink-0 transition-colors"
                  >
                    Ver en Google Maps
                  </a>
                )}
              </div>
              <p className="text-sm font-medium mb-3 min-h-[20px] truncate">
                {loading ? "Buscando dirección..." : address || "Mueve el pin o escribe tu dirección"}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (address && coords) {
                    onSelect(address, coords.lat, coords.lng, components);
                    onClose();
                  }
                }}
                disabled={!address || !coords || loading}
                className="w-full py-3 rounded-full bg-accent hover:bg-accent-light text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                Usar esta dirección
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
