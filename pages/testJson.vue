<template lang="html">
  <div>
    <div>
        <Upload :before-upload="handleUpload">
            <Button icon="ios-cloud-upload-outline">Select the file to upload</Button>
        </Upload>
    </div>
    <div>{{json}}</div>
    
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  layout: 'withTopMenu',
  data() {
    return {
      json:null,
    }
  },
  components: {

  },
  watch: {

  },
  mounted() {
    
  },
  methods: {
    handleUpload (file) {
        let that = this;

        console.log(file)
        let requestURL = window.URL.createObjectURL(file);
        let request = new XMLHttpRequest();
        //使用open（）打开一个新请求
        request.open('GET', requestURL);
        //设置XHR访问JSON格式数据，然后发送请求
        //设置XHR访问text格式数据
        request.responseType = 'text';
        request.send();
        //处理来自服务器的数据
        request.onload = function() {
            let superHeroesText = request.response;
            let superHeroes = JSON.parse(superHeroesText);
            console.log(superHeroes)
            that.showText(superHeroesText)
        };




        return false;
    },
    showText(data){
        this.json = data;
    }
  },
  
}
</script>

<style lang="scss" scoped>


</style>
