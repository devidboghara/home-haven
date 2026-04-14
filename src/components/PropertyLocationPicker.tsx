"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface PropertyLocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (location: { lat: number; lng: number }) => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initPropertyMap?: () => void;
  }
}

export default function PropertyLocationPicker({
  initialLat = 43.6532,
  initialLng = -79.3832,
  onLocationChange,
}: PropertyLocationPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!apiKey) return;

    // If Google Maps is already loaded, init immediately
    if (typeof window !== "undefined" && window.google?.maps) {
      initMap();
      return;
    }

    // Avoid duplicate script tags
    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.addEventListener("load", initMap);
      return () => existingScript.removeEventListener("load", initMap);
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    script.onerror = () => {
      setError(true);
      setLoading(false);
    };
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", initMap);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  function initMap() {
    if (!mapRef.current || !window.google?.maps) return;
    setLoading(false);

    const center = { lat: initialLat, lng: initialLng };

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const marker = new window.google.maps.Marker({
      position: center,
      map,
      draggable: true,
      title: "Property location",
    });

    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      if (pos) {
        onLocationChange({ lat: pos.lat(), lng: pos.lng() });
      }
    });
  }

  // No API key — show placeholder
  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-[300px] rounded-xl border border-dashed border-[#E8E6E0] bg-[#F9F8F6] text-[#A8A49C]">
        <MapPin size={28} className="opacity-40" />
        <p className="text-[13px] font-medium">
          Map unavailable — configure{" "}
          <code className="text-[12px] bg-[#F0EDE6] px-1.5 py-0.5 rounded">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#E8E6E0]" style={{ height: 300 }}>
      {/* Map container */}
      <div ref={mapRef} id="property-location-map" className="w-full h-full" />

      {/* Loading overlay */}
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F9F8F6] gap-2 text-[#A8A49C]">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px]">Loading map…</span>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#F9F8F6] text-[#A8A49C]">
          <MapPin size={24} className="opacity-40" />
          <p className="text-[13px]">Failed to load Google Maps</p>
        </div>
      )}
    </div>
  );
}
