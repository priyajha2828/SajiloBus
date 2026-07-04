import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Map } from "lucide-react";
import { FaBus, FaUserTie } from "react-icons/fa";

import "leaflet/dist/leaflet.css";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LiveMap() {
  return (
    <div className="map-card">
      {/* Heading */}
      <h2 className="map-title">
        <Map size={30} className="map-icon" />
        Live Tracking
      </h2>

      {/* Map */}
      <MapContainer
        center={[27.7172, 85.324]}
        zoom={13}
        style={{
          height: "450px",
          width: "100%",
          borderRadius: "12px",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Bus 101 */}
        <Marker position={[27.7172, 85.324]}>
          <Popup>
            <strong>
              <FaBus
                style={{
                  marginRight: "6px",
                  color: "#1976d2",
                  verticalAlign: "middle",
                }}
              />
              Bus 101
            </strong>

            <br />

            <FaUserTie
              style={{
                marginRight: "6px",
                color: "#16a34a",
                verticalAlign: "middle",
              }}
            />
            Driver: Ram Sharma
          </Popup>
        </Marker>

        {/* Bus 205 */}
        <Marker position={[27.714, 85.328]}>
          <Popup>
            <strong>
              <FaBus
                style={{
                  marginRight: "6px",
                  color: "#1976d2",
                  verticalAlign: "middle",
                }}
              />
              Bus 205
            </strong>

            <br />

            <FaUserTie
              style={{
                marginRight: "6px",
                color: "#16a34a",
                verticalAlign: "middle",
              }}
            />
            Driver: Hari Lama
          </Popup>
        </Marker>

        {/* Waiting Driver */}
        <Marker position={[27.7205, 85.321]}>
          <Popup>
            <strong>
              <FaUserTie
                style={{
                  marginRight: "6px",
                  color: "#16a34a",
                  verticalAlign: "middle",
                }}
              />
              Driver Waiting
            </strong>

            <br />

            Name: Suman Rai
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default LiveMap;