<template lang="html">
  <section class="mapforlist">
    <div><Input placeholder="项目位置" ref="position"/></div>
    <div id="allmap" :style="mapStyle"></div>
  </section>
</template>

<script>

export default {
  head: {
    // script: [
    //   { src: 'http://api.map.baidu.com/api?v=2.0&ak=Qk4XGHvmWkjCTcYYjopw6jyYcvDm1sOm' },//百度地图api
    // ]
  },
  data() {
    return {
        mapStyle:{
            width:'100%',
            height:'calc(100% - 32px)',
            borderRadius: '5px'
        },
        map:null,
        Dis:null,
        marker:null,
        groundOverlay:null,
        markers:[],
        position:null
    }
  },
  computed: {
    
  },
  props: {

  },
  watch: {
    position() {
      this.$emit('on-change', this.position)
    }
  },
  mounted() {

  },
  methods: {
      loadmap(){
        let map = new BMap.Map("allmap",{minZoom:5,maxZoom:19,enableMapClick:false});   // 创建Map实例,设置地图允许的最小/大级别,构造底图时，关闭底图可点功能
        map.centerAndZoom(new BMap.Point(106.635395,37.087414), 5); // 初始化地图,设置中心点坐标和地图级别

        map.setDefaultCursor("default");
        map.setDraggingCursor("default");
        
        var top_left_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE}); //右上角，仅包含平移和缩放按钮
        //BMAP_NAVIGATION_CONTROL_LARGE	标准的平移缩放控件（包括平移、缩放按钮和滑块）
        //BMAP_NAVIGATION_CONTROL_SMALL	仅包含平移和缩放按钮
        //BMAP_NAVIGATION_CONTROL_PAN	仅包含平移按钮
        //BMAP_NAVIGATION_CONTROL_ZOOM	仅包含缩放按钮
        var top_right_navigation = new BMap.CityListControl({anchor: BMAP_ANCHOR_TOP_RIGHT,offset: new BMap.Size(10, 20)});

        map.addControl(top_left_navigation);        
        map.addControl(top_right_navigation);

        this.map = map;

        //拾取坐标
        let myrefs = this.$refs;
        let that = this;
        map.addEventListener("click",function(e){
            map.clearOverlays();

            myrefs.position.value = e.point.lng+','+e.point.lat;

            that.updatePosition(myrefs.position.value);

            let point = new BMap.Point(e.point.lng, e.point.lat);
	        //map.centerAndZoom(point,16);
	        let marker = new BMap.Marker(point);  // 创建标注
	        map.addOverlay(marker);               // 将标注添加到地图中
	        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

        });

        


      },
      addMarker2(point,num,color){//color 1红色 2黄色 3绿色
        var pointcolor = null;
        switch(Number(color)){
            case 1: pointcolor=this.redpoint;break;
            case 2: pointcolor=this.yellowpoint;break;
            case 3: pointcolor=this.greenpoint;break;
        }

        var myIcon = new BMap.Icon(pointcolor, new BMap.Size(30,30));//自定义图片
        var marker = new BMap.Marker(point,{icon:myIcon}); //new BMap.Marker(point);
        var label = new BMap.Label(num,{offset:new BMap.Size(5,9)});
        label.setStyle({
            color : "white",
            background:"transparent",
            border:"none"
        });
        marker.setLabel(label);
        marker.addEventListener("click",this.attribute);
        this.markers.push(marker);
      },
      updatePosition(value){
        this.position=value;

      }
    
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.mapforlist{
    width:100%;
    height:$map-for-list-height;
}
</style>
