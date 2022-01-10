import { createStore } from "vuex";
export default createStore({
  state: {
    countries: null,
  },
  mutations: {
    setCountries(store, countries) {
      store.countries = countries;
    },
  },
  getters: {
    countries(store) {
      return store.countries;
    },
  },
});
