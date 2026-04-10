<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Pollination Map</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="selectedDay = 'today'" :fill="selectedDay === 'today' ? 'solid' : 'clear'">Heute</ion-button>
          <ion-button @click="selectedDay = 'tomorrow'" :fill="selectedDay === 'tomorrow' ? 'solid' : 'clear'">Morgen</ion-button>
          <ion-button @click="selectedDay = 'dayafter_to'" :fill="selectedDay === 'dayafter_to' ? 'solid' : 'clear'">Übermorgen</ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <div class="pollen-selector">
          <ion-button 
            v-for="pollen in pollenTypes" 
            :key="pollen"
            @click="selectedPollenType = pollen; console.log('Switching to', pollen, allPollenData[pollen]);"
            :fill="selectedPollenType === pollen ? 'solid' : 'clear'">
            {{ pollen }}
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <LeafletMap v-if="Object.keys(currentPollenData).length" :geoJson="dwdPollenfluggebiete" :pollenData="currentPollenData" :key="`${selectedPollenType}-${selectedDay}`" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton } from '@ionic/vue';
import { ref, onMounted, computed } from 'vue';
import LeafletMap from '@/components/LeafletMap.vue';
import PollenService, { PollenRegion } from '@/services/PollenService';
import dwdPollenfluggebiete from '@/assets/dwd_pollenfluggebiete.geo.json';

type Day = 'today' | 'tomorrow' | 'dayafter_to';

const allPollenData = ref<Record<string, Record<string, Record<Day, number>>>>({});
const pollenTypes = ref<string[]>([]);
const selectedPollenType = ref<string>('');
const selectedDay = ref<Day>('today');

const currentPollenData = computed(() => {
  if (selectedPollenType.value && allPollenData.value[selectedPollenType.value]) {
    const pollenDataForType = allPollenData.value[selectedPollenType.value];
    const result: Record<string, number> = {};
    for (const regionId in pollenDataForType) {
      result[regionId] = pollenDataForType[regionId][selectedDay.value];
    }
    return result;
  }
  return {};
});

onMounted(async () => {
  try {
    const data: PollenRegion[] = await PollenService.getPollenData();
    
    const mapping: Record<string, Record<string, Record<Day, number>>> = {};
    const types = new Set<string>();

    for (const region of data) {
      const regionId = region.partregion_id === -1 ? String(region.region_id) : String(region.partregion_id);

      for (const [pollenName, values] of Object.entries(region.Pollen)) {
        types.add(pollenName);
        if (!mapping[pollenName]) {
          mapping[pollenName] = {};
        }
        
        mapping[pollenName][regionId] = {
          today: PollenService.parsePollenLevel(values.today),
          tomorrow: PollenService.parsePollenLevel(values.tomorrow),
          dayafter_to: PollenService.parsePollenLevel(values.dayafter_to),
        };
      }
    }

    pollenTypes.value = Array.from(types).sort();
    if (pollenTypes.value.includes('Graeser')) {
      selectedPollenType.value = 'Graeser';
    } else if (pollenTypes.value.length > 0) {
      selectedPollenType.value = pollenTypes.value[0];
    }
    allPollenData.value = mapping;

  } catch (err) {
    console.error("Failed to fetch pollen data:", err);
  }
});
</script>

<style scoped>
.pollen-selector {
  display: flex;
  overflow-x: auto;
  padding: 0 8px;
}
</style>
