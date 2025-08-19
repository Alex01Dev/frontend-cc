import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icono ♻️ personalizado
const recycleIcon = L.divIcon({
  className: "custom-icon",
  html: "♻️",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function CentrosReciclaje() {
  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCentros = async () => {
      try {
        // Consulta Overpass (CDMX bounding box aprox)
        const query = `[out:json][timeout:25];
          (
            node["amenity"="recycling"](19.2,-99.35,19.6,-98.8);
          );
          out body 50;`; // máx 50 resultados

        const url = "https://overpass.kumi.systems/api/interpreter";
        const res = await axios.post(url, query, {
          headers: { "Content-Type": "text/plain" },
        });

        if (res.data?.elements) {
          const data = res.data.elements.map((e) => ({
            id: e.id,
            nombre: e.tags?.name || "Centro de reciclaje",
            materiales: e.tags || {},
            lat: e.lat,
            lon: e.lon,
          }));
          setCentros(data);
        }
      } catch (err) {
        console.error("Error al obtener datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCentros();
  }, []);

  if (loading) return <p>Cargando centros de reciclaje...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>♻️ Centros de Reciclaje en CDMX (OpenStreetMap)</h1>
      <p>Fuente: Overpass API</p>

      {/* 🌍 Mapa con react-leaflet */}
      <MapContainer
        center={[19.4326, -99.1332]} // CDMX centro
        zoom={12}
        style={{ height: "500px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {centros.map(
          (c) =>
            c.lat &&
            c.lon && (
              <Marker key={c.id} position={[c.lat, c.lon]} icon={recycleIcon}>
                <Popup>
                  <strong>{c.nombre}</strong> <br />
                  🗑️ Materiales:{" "}
                  {Object.keys(c.materiales).length > 0
                    ? JSON.stringify(c.materiales)
                    : "No especificados"}
                  <br />
                  🌍 {c.lat}, {c.lon}
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>

      {/* 📋 Lista simple */}
      <h2 style={{ marginTop: "20px" }}>📋 Lista de Centros</h2>
      <ul>
        {centros.map((c) => (
          <li key={c.id}>
            <strong>{c.nombre}</strong> — 🌍 ({c.lat}, {c.lon})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CentrosReciclaje;
