<template>
    <div class="map-container">
        <l-map :zoom="zoom" :center="mapCenter" style="height: 100vh;">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors" />
            <l-geo-json :geojson="geoJson" :options-style="styleFeature" :options-on-each-feature="onEachFeature" />
        </l-map>
    </div>
    <div class="info legend" :style="legendStyle">
        <h4>Pollenflug-Stärke</h4>
        <span v-for="(label, i) in legendLabels" :key="label" style="display:flex;align-items:center;margin-bottom:2px;">
            <i :style="legendCircleStyle(legendColors[i])"></i>
            <span style="line-height:1.2;">{{ label }}</span>
        </span>
    </div>
</template>

<script setup lang="ts">
import { LMap, LTileLayer, LGeoJson } from '@vue-leaflet/vue-leaflet';
import { computed } from 'vue';
import L from 'leaflet';

const props = defineProps<{
    geoJson: any;
    pollenData: Record<string, number>;
}>();

const zoom = 6;
const mapCenter = [51.1657, 10.4515];

const legendLabels = ['Kein Flug', 'Gering', 'Mäßig', 'Stark', 'Keine Daten'];
const legendColors = ['#A8E6A8', '#FFFF00', '#FFA500', '#FF0000', '#DDDDDD'];

const legendStyle = {
  background: '#fff',
  backgroundColor: '#fff',
  opacity: '1',
  boxShadow: '0 0 15px rgba(0,0,0,0.2)',
  borderRadius: '8px',
  padding: '12px 16px',
  position: 'fixed',
  right: '16px',
  bottom: '180px',
  zIndex: 2000,
  border: '1px solid #bbb',
  font: '14px Arial, Helvetica, sans-serif',
};

const legendCircleStyle = (color: string) => ({
  background: color,
  border: '1px solid #ccc',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  display: 'inline-block',
  marginRight: '7px',
  boxSizing: 'border-box',
});

function styleFeature(feature: any) {
  const regionId = feature.properties.GF; // GF = subregion ID
  const pollenLevel = props.pollenData[regionId] ?? -1;

  let fillColor = "#DDDDDD"; // Default for no data
  if (pollenLevel === 0) fillColor = "#A8E6A8"; // light green
  if (pollenLevel === 1) fillColor = "#FFFF00"; // yellow
  if (pollenLevel === 2) fillColor = "#FFA500"; // orange
  if (pollenLevel === 3) fillColor = "#FF0000"; // red

  return {
    color: "#000",
    weight: 1,
    fillColor,
    fillOpacity: 0.3
  };
}

function onEachFeature(feature: any, layer: L.Layer) {
  const regionId = feature.properties.GF; 
  const regionName = feature.properties.GEN ?? "Unknown region";
  const pollenLevel = props.pollenData[regionId] ?? "N/A";

  const popupContent = `
    <strong>${regionName}</strong><br/>
    Region ID (GF): ${regionId}<br/>
    Pollen Index: ${pollenLevel}
  `;

  layer.bindPopup(popupContent);

  layer.on('click', function (e: any) {
    console.log('Clicked region:', {
      regionId,
      regionName,
      pollenLevel,
      event: e
    });
    this.openPopup();
  });
}

</script>

<style scoped>
.map-container {
    height: 100%;
    width: 100%;
    position: relative;
}

.legend h4 {
    margin: 0 0 4px;
    color: #333;
}

.legend span {
    display: flex;
    align-items: center;
    margin-bottom: 2px;
}

.legend i {
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 7px;
    opacity: 1;
    border-radius: 50%;
    border: 1px solid #ccc;
    box-sizing: border-box;
}

.legend br {
    display: none;
}
</style>
