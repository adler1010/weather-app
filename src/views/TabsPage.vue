<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="Weather" href="/Weather">
          <ion-icon aria-hidden="true" :icon="sunnyOutline" />
          <ion-label>Weather</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="Pollination" href="/Pollination">
          <ion-icon aria-hidden="true" :icon="flowerOutline" />
          <ion-label>Pollination</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="Settings" href="/Settings">
          <ion-icon aria-hidden="true" :icon="settingsOutline" />
          <ion-label>Settings</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { ellipse, flowerOutline, settingsOutline, square, sunnyOutline, triangle } from 'ionicons/icons';
</script>
