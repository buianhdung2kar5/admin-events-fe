import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix React Leaflet default icon issues in Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface MapPickerProps {
    latitude: number;
    longitude: number;
    center?: [number, number];
    onChange: (lat: number, lng: number) => void;
}

const LocationMarker = ({ latitude, longitude, onChange }: MapPickerProps) => {
    useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng);
        },
    });

    const position = latitude && longitude ? new L.LatLng(latitude, longitude) : null;
    return position === null ? null : <Marker position={position}></Marker>;
};

function MapController({ center }: { center?: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15);
        }
    }, [center, map]);
    return null;
}

export default function MapPicker({ latitude, longitude, center, onChange }: MapPickerProps) {
    const initialCenter = center || (latitude && longitude ? [latitude, longitude] : [10.7769, 106.7009]); // Default: HCM City

    return (
        <div className="w-full h-[300px] rounded-xl overflow-hidden border border-gray-200 z-0 relative">
            <MapContainer center={initialCenter as [number, number]} zoom={13} scrollWheelZoom={true} className="w-full h-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker latitude={latitude} longitude={longitude} onChange={onChange} />
                <MapController center={center} />
            </MapContainer>
        </div>
    );
}
