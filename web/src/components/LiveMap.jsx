import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Map } from "lucide-react";
import { FaBus, FaUserTie } from "react-icons/fa";

import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
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
  const [buses, setBuses] = useState([]);

  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:5000/buses/live");
      const data = await response.json();

      if (data.success) {
        setBuses(data.buses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLocations();

    const interval = setInterval(fetchLocations, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="map-card">
      <h2 className="map-title">
        <Map size={30} className="map-icon" />
        Live Tracking
      </h2>

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

        {buses.map((bus) => {
          if (!bus.latitude || !bus.longitude) return null;

          return (
            <Marker
              key={bus.id}
              position={[
                Number(bus.latitude),
                Number(bus.longitude),
              ]}
            >
              <Popup>
                <strong>
                  <FaBus
                    style={{
                      marginRight: "6px",
                      color: "#1976d2",
                      verticalAlign: "middle",
                    }}
                  />
                  {bus.busNumber}
                </strong>

                <br />

                <FaUserTie
                  style={{
                    marginRight: "6px",
                    color: "#16a34a",
                    verticalAlign: "middle",
                  }}
                />

                Driver: {bus.driver}

                <br />

                Status: {bus.status}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default LiveMap;