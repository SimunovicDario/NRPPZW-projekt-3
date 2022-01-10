<template>
  <div>
    <router-link to="/" class="navbar">
      <img src="../assets/globe.svg" class="logo" />
      <h3 style="margin-left: 0.5rem">Geodata</h3>
    </router-link>
    <div class="slot">
      <router-view></router-view>
    </div>
  </div>
</template>
<style>
body {
  margin: 0;
  background-color: darkgrey;
}
a {
  all: unset;
  cursor: pointer;
}
.logo {
  width: 2rem;
  margin-left: 8px;
}
.navbar {
  display: flex;
  align-items: center;
  background-color: slategray;
}
.slot {
  margin: 0 8px;
}
</style>
