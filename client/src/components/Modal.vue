<template>
  <div class="modal" @click="closeModal()">
    <div class="modal-content" @click.stop="">
      <div v-if="!country?.name" style="padding: 20px; text-align: center">
        No country with abbreviation "{{ country?.abbr }}" found!
      </div>
      <template v-if="country?.name">
        <div class="title">
          {{ countryName }}
        </div>
        <div style="margin: 1% 2%">
          <div>Region: {{ region }}</div>
          <div>Capital: {{ country?.capital.join(", ") }}</div>
          <div>Area: {{ country.area }} km<sup>2</sup></div>
          <div>
            Latitude: {{ country.latlng[0] }}, longitude:
            {{ country.latlng[1] }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: ["country"],
  computed: {
    countryName: function () {
      return `${this.country.name.common} ${
        this.country.name.common !== this.country.name.official
          ? " (" + this.country.name.official + ")"
          : ""
      }`;
    },
    region: function () {
      return `${this.country.region} ${
        this.country.subregion ? "(" + this.country.subregion + ")" : null
      }`;
    },
  },
  methods: {
    async closeModal() {
      await this.$router.push("/");
    },
  },
});
</script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 15% auto;
  width: 80%;
  height: 60%;
}

.title {
  text-align: center;
  padding: 20px;
  background-color: grey;
}
</style>
