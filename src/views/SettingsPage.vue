<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list :inset="true">
        <ion-toggle :checked="darkModeActivated" @ionChange="darkModeToggleChanged($event)" justify="space-between">
          Dark Mode
        </ion-toggle>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, ToggleCustomEvent, IonList, IonToggle } from '@ionic/vue';
import { ref, onMounted } from 'vue';

const darkModeActivated = ref(false);

const toggleDarkpalette = (shouldAddDarkPallette: boolean) => {
  document.documentElement.classList.toggle('ion-palette-dark', shouldAddDarkPallette);
} 

const darkModeToggleChanged = (event: ToggleCustomEvent) => {
  toggleDarkpalette(event.detail.checked);
}

</script>
