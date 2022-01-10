<template>
  <div>
    <p>
      <template v-if="loading">Loading... </template>
    </p>
    <template v-if="!loading">
      <search @search-term="search" ref="search"></search>
      <div class="container">
        <div class="col">
          <div class="title">Regions</div>
          <div class="list">
            <div
              class="item"
              @click="updatedList('regions', region)"
              :class="{ active: region === activeRegion }"
              v-for="region in filteredRegions"
              :key="region"
            >
              <div>{{ region }}</div>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="title">Subregions</div>
          <div class="list">
            <div
              class="item"
              @click="updatedList('subregions', subregion)"
              :class="{ active: subregion === activeSubregion }"
              v-for="subregion in filteredSubregions"
              :key="subregion"
            >
              {{ subregion.name }}
            </div>
          </div>
        </div>
        <div class="col">
          <div class="title">Countries</div>
          <div class="list">
            <div
              class="item"
              v-for="country in filteredCountries"
              :key="country"
              @click="showModal(country)"
              :class="{
                active: country.abbr === abbr,
              }"
            >
              <div>
                {{ country.name.common }}
                <img class="info" src="../assets/info.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="abbr">
      <Modal :country="activeCountry"></Modal>
    </template>
  </div>
</template>

<script>
import Modal from "../components/Modal.vue";
import Search from "../components/Search.vue";
import { defineComponent } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
export default defineComponent({
  data() {
    return {
      countries: [],
      regions: [],
      subregions: [],
      filteredRegions: [],
      filteredSubregions: [],
      filteredCountries: [],
      loading: true,
      activeRegion: "",
      activeSubregion: "",
      activeCountry: null,
    };
  },
  setup() {
    const abbr = useRoute()?.params?.abbr;
    return { abbr };
  },
  async created() {
    this.regions = (
      await axios.get("http://" + process.env.VUE_APP_SERVER_URL + "/regions")
    ).data;
    this.filteredRegions = this.regions;
    this.subregions = (
      await axios.get(
        "http://" + process.env.VUE_APP_SERVER_URL + "/subregions"
      )
    ).data;
    this.countries = (
      await axios.get("http://" + process.env.VUE_APP_SERVER_URL + "/countries")
    ).data;
    this.filteredSubregions = this.subregions;
    this.countries.sort(this.byCommonName);
    this.filteredCountries = this.countries;
    this.$store.commit("setCountries", this.countries);
    this.loading = false;
    if (this.abbr) {
      this.showModal(
        this.countries.find((country) => country.abbr === this.abbr) ?? {
          abbr: this.abbr,
        }
      );
    }
  },
  components: {
    Modal,
    Search,
  },
  watch: {
    $route: function (to) {
      if (to.params?.abbr)
        this.showModal(
          this.countries.find((country) => country.abbr === to.params.abbr) || {
            abbr: to.params.abbr,
          }
        );
      else this.abbr = "";
    },
  },
  methods: {
    updatedList(type, index) {
      this.$refs.search.resetSearchTerm();
      switch (type) {
        case "regions":
          this.activeSubregion = "";
          if (this.activeRegion === index) {
            this.activeRegion = "";
            this.filteredSubregions = this.subregions;
            this.filteredCountries = this.$store.getters.countries;
          } else {
            this.activeRegion = index;
            this.filteredRegions = this.regions;
            this.filter("subregions");
          }
          break;
        case "subregions":
          if (this.activeSubregion.name === index.name) {
            this.activeSubregion = "";
          } else {
            this.activeSubregion = index;
          }
          this.filter("countries");
      }
    },
    filter(type) {
      switch (type) {
        case "subregions":
          this.filteredSubregions = this.subregions.filter((sub) => {
            return sub.sup === this.activeRegion;
          });
        case "countries":
          this.filteredCountries = this.filterCountries().sort(
            this.byCommonName
          );
          break;
      }
    },
    async showModal(country) {
      this.activeCountry = country;
      this.abbr = country?.abbr || this.abbr;
      await this.$router.push(country.abbr || this.abbr);
    },
    byCommonName(a, b) {
      if (a.name.common < b.name.common) return -1;
      else if (a.name.common > b.name.common) return 1;
      return 0;
    },
    filterCountries() {
      return this.$store.getters.countries.filter((country) => {
        if (country.subregion === this.activeSubregion.name) return true;
        if (this.activeSubregion === "" && country.region === this.activeRegion)
          return true;
        return false;
      });
    },
    search(term) {
      term = term.toLowerCase();
      this.activeRegion = "";
      this.activeSubregion = "";
      if (term === "") {
        this.filteredRegions = this.regions;
        this.filteredSubregions = this.subregions;
        this.filteredCountries = this.$store.getters.countries;
      } else {
        this.filteredRegions = this.regions.filter((region) =>
          region.toLowerCase().includes(term)
        );
        this.filteredSubregions = this.subregions.filter((subregion) =>
          subregion.name.toLowerCase().includes(term)
        );
        this.filteredCountries = this.$store.getters.countries.filter(
          (country) =>
            country.name.common.toLowerCase().includes(term) ||
            country.name.official.toLowerCase().includes(term)
        );
      }
    },
  },
});
</script>

<style>
.container {
  display: flex;
  flex-direction: row;
}
.col {
  width: 33%;
  height: 70vh;
  flex: 1 1 auto;
  margin: 0 1%;
}
.title {
  text-align: center;
  background-color: grey;
  border: 1px solid black;
  border-bottom: 0px;
  padding: 10px 0;
}
.abbr {
  border: 1px solid black;
  padding: 0.5% 1%;
  border-radius: 10%;
}
.list {
  border: 1px solid black;
  overflow-y: auto;
  height: 65vh;
}
.item {
  padding: 4% 2%;
  position: relative;
}
.item:hover {
  background-color: grey;
}
.active {
  background-color: darkslategray;
}
.info {
  position: absolute;
  right: 2%;
  height: 1rem;
}
</style>
