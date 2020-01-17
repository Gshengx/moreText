<template>
    <div class='router'>
        <div>路由跳转页</div>
        <div class='router-list'>
            <router-link v-for='link in linkList' :key='link.name' :to='link.path'>
                {{link.name}}
            </router-link>
        </div>
    </div>
</template>
<script>
import router from '../router/router';

export default {
  data() {
    return {
      linkList: router,
    };
  },
};
</script>
<style>
.router{
    padding: 20px;
    font-size: 20px;
    text-align: left;
}
.router-list{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}
</style>
