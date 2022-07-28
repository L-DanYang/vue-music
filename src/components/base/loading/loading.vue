<template>
<div class="loading">
    <div class="loading-content">
        <img src="./loading.gif" width="24px" height="24px">
        <p class="desc">{{title}}</p>
    </div>
</div>
</template>

<script>
export default {
    name:'loading',
    data(){
        return {
            title:'正在加载中...'
        }
    },
    methods:{
        // setTitle(title){
        //     this.title=title
        // }
    }
}
</script>

<style lang="scss" scoped>
.loading{
// loading容器
    position:absolute;
    top:50%;
    left:50%;
    transform:translate3d(-50%,-50%,0);
    .loading-content{
        // loading内容
        text-align:center;
        .desc{
            //loading文字
            line-height:20px;
            font-size:$font-size-small;
            color:$color-text-l;
        }
    }
}

</style>