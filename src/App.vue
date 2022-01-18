<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-text-field
        label="Moving avarage over days"
        v-model="movingAvrgDays"
        type="number"
      ></v-text-field>

      <ChartScatter :data="chartData" :layout="chartLayout" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

import ChartScatter from "@/components/ChartScatter.vue";

import { WeatehrData, ChartTrace } from "@/types";

const getSum = (arr: number[]) => arr.reduce((sum, num) => sum + num, 0);

const getMovingAvrg = (arr: number[], entries: number) => {
  return arr.reduce((acc, _, idx, arr) => {
    if (idx > entries - 1) {
      const range = arr.slice(idx - entries, idx);
      acc.push(getSum(range) / entries);
    }

    return acc;
  }, [] as number[]);
};

export default Vue.extend({
  name: "App",

  components: { ChartScatter },

  data: () => ({
    location: {
      lat: 51.5072,
      long: 0.1276,
    },
    weatherData: {} as WeatehrData,
    movingAvrgDays: 0,
  }),

  computed: {
    weatherApiUrl() {
      return `https://api.open-meteo.com/v1/forecast?latitude=${this.location.lat}&longitude=${this.location.long}&hourly=temperature_2m,precipitation`;
    },

    chartData() {
      const traces = [
        {
          name: "Temperature",
          type: "scatter",
          x: this.weatherData.time,
          y: this.weatherData.temperature_2m,
          mode: "lines",
        },
        {
          name: "Precipitation",
          type: "scatter",
          x: this.weatherData.time,
          y: this.weatherData.precipitation,
          mode: "lines",
        },
      ] as ChartTrace[];

      if (this.movingAvrgDays > 0) {
        const movingAvrgHours = this.movingAvrgDays * 24;

        traces.push({
          name: "Tem. mov. avrg",
          type: "scatter",
          x: this.weatherData.time.slice(movingAvrgHours),
          y: getMovingAvrg(this.weatherData.temperature_2m, movingAvrgHours),
          mode: "lines",
        });
      }

      return traces;
    },

    chartLayout() {
      return {
        layout: {
          title: "historical and predicted temperature and precipitation",
        },
      };
    },
  },

  methods: {
    async loadData() {
      let data: { hourly: WeatehrData };

      try {
        const response = await fetch(this.weatherApiUrl);
        data = await response.json();
      } catch (err) {
        return console.error(
          (err as Error).message || "Weather data cannot be loaded."
        );
      }

      this.weatherData = data.hourly;

      console.log(this.weatherData);
    },
  },

  // Live cycle hoocks
  created() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        this.location.lat = coords.latitude;
        this.location.long = coords.longitude;

        this.$nextTick(() => this.loadData());
      });
    }
  },
});
</script>
