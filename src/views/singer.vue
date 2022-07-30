<template>
    <div class="singer">
        <index-list :data="singers"></index-list>
    </div>
</template>

<script>
import { getSingerList } from '@/service/singer'//获取数据的方法
import IndexList from '@/components/index-list/index-list.vue'

export default {
    neme:"singer",
    components:{
        IndexList,
    },
    data(){
        return {
            singers:[],
        }
    },
    async created(){
        const result = await getSingerList()
        this.singers = result.singers
        console.log(this.singers)
    }
}
</script>

<style lang="scss" scoped>
.singer{
    position:fixed;
    width:100%;
    top:88px;
    bottom:0;
}
</style>