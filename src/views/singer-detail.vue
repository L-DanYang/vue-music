
<template>
 <!-- 放在view中因为希望这个通过二级路由来实现 -->
    <div class="singer-detail">
        <music-list :songs="songs" :pic="pic" :title="title" :loading="loading">

        </music-list>
    </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import {processSongs} from '@/service/song'
import MusicList from '@/components/music-list/music-list.vue'

import storage from 'good-storage'
import {SINGER_KEY } from '@/assets/js/constant'

export default {
    name:'singer-detail',
    props:{
        singer:Object
    },
    components:{
       MusicList 
    },
    data(){
        return{
            songs:[],
            loading:true
        }
    },
    computed:{
        computedSinger(){
            let ret = null
            const singer=this.singer
            if(singer){
                ret = singer
            }else{
                const cachedSinger = storage.session.get(SINGER_KEY)
                if(cachedSinger && cachedSinger.mid === this.$route.params.id){
                    ret = cachedSinger
                }
            }
            return ret
        },
        pic(){
            const singer = this.computedSinger
            return singer && singer.pic
        },
        title(){
            const singer = this.computedSinger
            return singer && singer.name
        }
    },
    async created(){
        if(!this.computedSinger){//做一层保护，如果没有这个路径跳转到上一级路由
            const path = this.$route.matched[0].path
            this.$router.push({
                path
            })
            return
        }
        const result = await getSingerDetail(this.computedSinger)
        this.songs = await processSongs(result.songs)
        this.loading = false
    }
}
</script>

<style lang="scss" scoped>
.singer-detail{
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
}

</style>