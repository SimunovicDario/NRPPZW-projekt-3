<template>
  <input
    class="search"
    type="text"
    placeholder="Write term for any column and press enter"
    v-model="name"
    @keyup.enter="emit"
  />
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      name: "",
    };
  },
  methods: {
    resetSearchTerm() {
      this.name = "";
    },
    emit() {
      this.$emit("searchTerm", this.name);
    },
  },
});
</script>

<style>
.search {
  width: 98%;
  box-sizing: border-box;
  margin: 0 1% 1% 1%;
  padding: 0 1%;
  height: 2rem;
}
</style>
