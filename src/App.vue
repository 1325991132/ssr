<template>
  <div id="app">
    <div>
      <router-link to="/">首页</router-link>
      <router-link to="/detail">详情</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
