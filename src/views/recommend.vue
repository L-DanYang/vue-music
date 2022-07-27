<template>
    <div>
        recommend
    </div>
</template>

<script>
import { getRecommend } from '@/service/recommend'

export default {
    neme:"recommend",
    // 从发送请求到拿到结果整个过程是一个异步的
    async created(){
        const result = await getRecommend()
        console.log(result)
    }
}
</script>

<style lang="scss" scoped>

</style>