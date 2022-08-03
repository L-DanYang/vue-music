<template>
  <Header></Header>
  <Tab></Tab>
  <router-view></router-view>
  <player></player>
</template>

<script>
import Header from './components/header/header.vue'
import Tab from './components/tab/tab.vue'
import Player from './components/player/player.vue'



export default{

  components:{
    Header,
    Tab,
    Player
  }
}
</script>

<style lang="scss">

</style>
