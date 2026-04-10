<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title >Weather</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content v-if="hasError" class="ion-padding">
      <ion-card color="danger">
        <ion-card-content>
          An error occurred. Please reload.
        </ion-card-content>  
      </ion-card>
    </ion-content>

    <ion-content v-else class="ion-padding">
      <ion-refresher slot="fixed" @ion-refresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <h1 style="margin-left: 20px;">{{ city }} <span><ion-icon :icon="locationOutline"></ion-icon></span></h1>

      <ion-grid style="height: 85%;">
        <ion-row style="height: 100%;">

          <ion-col size="12" size-md="6">
            <ion-card class="weather-card">
              <ion-card-header>
                <ion-card-title>Today - {{ new Date(weatherData[0]?.date).toLocaleDateString() }}</ion-card-title>
              </ion-card-header>        
              <ion-card-content class="vertically-centered-container">
                <div>
                  <span id="currentTemperature">{{ currentCondition?.temp_C }}°C</span>
                  <span> / Feels like {{ currentCondition?.FeelsLikeC }}°C</span>
                </div>                
                <span>from {{ weatherData[0]?.mintempC }}°C to {{ weatherData[0]?.maxtempC }}°C</span> 
                <span v-if="weatherDescription">{{ weatherDescription }}</span>
                <span>UV-Index: {{ currentCondition?.uvIndex }} </span>
                <span>Cloudcover: {{ currentCondition?.cloudcover }}%</span>
                <span>{{ weatherData[0]?.sunHour }} hours sunshine</span>  
              </ion-card-content>  
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="3">
            <ion-card class="weather-card">
              <ion-card-header>
                <ion-card-title>{{ new Date(weatherData[1]?.date).toLocaleDateString()  }}</ion-card-title>
              </ion-card-header>        
              <ion-card-content class="vertically-centered-container">
                <span>from {{ weatherData[1]?.mintempC }}°C to {{ weatherData[1]?.maxtempC }}°C</span>
                <span>average of {{ weatherData[1]?.avgtempC }}°C</span> 
                <span>UV-Index: {{ weatherData[1]?.uvIndex }} </span>
                <span>{{ weatherData[1]?.sunHour }} hours sunshine</span>  
              </ion-card-content>  
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="3">
            <ion-card class="weather-card">
              <ion-card-header>
                <ion-card-title>{{ new Date(weatherData[2]?.date).toLocaleDateString()  }}</ion-card-title>
              </ion-card-header>        
              <ion-card-content class="vertically-centered-container">
                <span>from {{ weatherData[2]?.mintempC }}°C to {{ weatherData[2]?.maxtempC }}°C</span>
                <span>average of {{ weatherData[2]?.avgtempC }}°C</span> 
                <span>UV-Index: {{ weatherData[2]?.uvIndex }} </span>
                <span>{{ weatherData[2]?.sunHour }} hours sunshine</span>  
              </ion-card-content>  
            </ion-card>
          </ion-col>

        </ion-row>
      </ion-grid>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonCard, IonCardHeader, IonCardContent, IonCardTitle, RefresherCustomEvent, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { onMounted, ref, Ref } from 'vue';
import WeatherService, { CurrentCondition, DailyWeather, WeatherData } from '@/services/WeatherService';
import { locationOutline } from 'ionicons/icons';

const hasError: Ref<boolean> = ref(false)
const city: Ref<string> = ref("")
const weatherDescription: Ref<string> = ref("")

const weatherData: Ref<DailyWeather[]> = ref([{} as DailyWeather])
const currentCondition: Ref<CurrentCondition> = ref({} as CurrentCondition)

const refreshPage = async () => {
  try {
    const data: WeatherData = await WeatherService.getWeatherData();    
    if (!data) {
      hasError.value = true;
      return;
    }

    //Refresh values
    city.value = data.nearest_area?.[0]?.areaName?.[0]?.value || "Unknown City"; 
    
    weatherDescription.value = data.current_condition?.[0]?.weatherDesc?.[0]?.value || "";

    weatherData.value = data.weather;
    currentCondition.value = data.current_condition[0];

    hasError.value = false;
  } catch(error) {
    hasError.value = true;
    console.log(`Error while loading data on the weather page: ${error}`)
  }
}

const handleRefresh = async (event: RefresherCustomEvent) => {
  await refreshPage();
  event.target.complete();
}

onMounted(refreshPage);
</script>

<style>
.vertically-centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.5em;
  font-size: 1.5rem;
}

.weather-card {
  height: 100%;
}

#currentTemperature {
  font-weight: bold;
  font-size: clamp(2.5rem, 4vw, 3.5rem);
}
</style>
