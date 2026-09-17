import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61231.png",
  iconSize: [35, 35],
});

function LiveTracking() {
  const [location, setLocation] = useState({
    lat: 26.4525,
    lng: 87.2718,
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("http://localhost:5000/tracking/latest/1");

        const data = await response.json();

        if (data.location) {
          setLocation({
            lat: Number(data.location.latitude),
            lng: Number(data.location.longitude),
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLocation();

    const interval = setInterval(fetchLocation, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "600px" }}>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[location.lat, location.lng]} icon={busIcon}>
          <Popup>Live Bus Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default LiveTracking;
