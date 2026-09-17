import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

function Tracking() {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[26.4525, 87.2718]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[26.4525, 87.2718]}>
          <Popup>Bus Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Tracking;
