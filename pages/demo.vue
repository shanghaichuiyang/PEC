<template>
  <section class="container">
    <div id="allmap" :style="mapStyle">
      
    </div>
    <div class="tool">
      
      <button disabled>当前坐标<input type="text" readonly ref="position"/></button>


      <button @click="handle1">添加覆盖物</button>
      <button @click="handle2">删除覆盖物</button>

      <button @click="handle3">开启测距</button>
      <button @click="handle4">关闭测距</button>

      <button @click="handle5">新增线路</button>

      <button @click="handle6">显示工程图</button>
      <button @click="handle7">隐藏工程图</button>

      <button @click="handle8">改变001的颜色</button>


    </div>
  </section>
</template>

<script>
import background from '~/static/images/background.png'
import redpoint from '~/static/images/red.png'
import yellowpoint from '~/static/images/yellow.png'
import greenpoint from '~/static/images/green.png'

export default {
  head: {
    script: [
      { src: 'http://api.map.baidu.com/api?v=2.0&ak=Qk4XGHvmWkjCTcYYjopw6jyYcvDm1sOm' },//百度地图api
      { src: 'http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js' },//测距js
      { src: 'http://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js' },//点聚合
      { src: 'http://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js' },//点聚合
    ]
  },
  data:function(){
    return{
      mapStyle:{
        width:'100%',
        height:'100vh'
      },
      map:null,
      background,
      redpoint,
      yellowpoint,
      greenpoint,
      Dis:null,
      marker:null,
      groundOverlay:null,
      markers:[]
    }
  },
  computed: {
    
  },
  mounted(){
    // let map = new BMap.Map("allmap",{minZoom:19,maxZoom:19,enableMapClick:false})   // 创建Map实例,设置地图允许的最小/大级别,构造底图时，关闭底图可点功能
    // map.centerAndZoom(new BMap.Point(121.500411,31.345301), 19) // 初始化地图,设置中心点坐标和地图级别
    let map = new BMap.Map("allmap",{minZoom:5,maxZoom:19,enableMapClick:false})   // 创建Map实例,设置地图允许的最小/大级别,构造底图时，关闭底图可点功能
    map.centerAndZoom(new BMap.Point(121.500411,31.345301), 5) // 初始化地图,设置中心点坐标和地图级别

    
    map.setDefaultCursor("default");
    map.setDraggingCursor("default");

    // map.disableDragging()         // 禁用地图拖拽
    // map.disableDoubleClickZoom()	// 禁用双击放大
    // map.disablePinchToZoom()	    //禁用双指操作缩放

    //// 西南角和东北角
    var SW = new BMap.Point(121.499116,31.344579);
    var NE = new BMap.Point(121.502179,31.346002);

    let groundOverlayOptions = {
      opacity: 1,               //图层透明度
      displayOnMinLevel: 19,    //图层显示的最小级别
      displayOnMaxLevel: 19,    //图层显示的最大级别
      imageURL:this.background,  //图层地址
      enableMassClear:false      //clearOverlays时不会清除
    }
    // 初始化GroundOverlay
    var groundOverlay = new BMap.GroundOverlay(new BMap.Bounds(SW, NE), groundOverlayOptions);

    // 添加GroundOverlay
    map.addOverlay(groundOverlay);


    var myDis = new BMapLib.DistanceTool(map);
    this.Dis = myDis

    //拾取坐标
    let myrefs = this.$refs;
    map.addEventListener("click",function(e){
      myrefs.position.value = e.point.lng+','+e.point.lat
    });
    
    this.groundOverlay = groundOverlay
    this.map = map

    // 随机向地图添加10个标注
    var points = [
      {'x':120.985287,'y':28.622918},
      {'x':120.985287,'y':28.622918},
      {'x':120.985287,'y':28.622918},
      {'x':120.985287,'y':28.622918},
      {'x':120.985287,'y':28.622918},
      {'x':102.661579,'y':25.075623},
      {'x':102.661579,'y':25.075623},
      {'x':102.661579,'y':25.075623},
      {'x':102.661579,'y':25.075623},
      {'x':102.661579,'y':25.075623},
    ]//addMarker2
    var bounds = map.getBounds();
    var sw = bounds.getSouthWest();
    var ne = bounds.getNorthEast();
    var lngSpan = Math.abs(sw.lng - ne.lng);
    var latSpan = Math.abs(ne.lat - sw.lat);
    for (var i = 0; i < points.length; i++) {
      //var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7)); //addMarker1
      var point = new BMap.Point(points[i].x,points[i].y); //addMarker2
      
      this.addMarker2(point,(Array(3).join(0) + i).slice(-3),Math.floor(Math.random() * 3 + 1));//随机颜色
    }

    var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:this.markers});//addMarker2

  },
  methods: {
    //将覆盖物添加到地图中，一个覆盖物实例只能向地图中添加一次
    add_overlay(Overlay){
      this.map.addOverlay(Overlay);
    },
    //清除地图上所有覆盖物
    clear_Overlays(){
      this.map.clearOverlays();
    },
    //从地图中移除覆盖物。如果覆盖物从未被添加到地图中，则该移除不起任何作用
    remove_Overlay(Overlay){
      this.map.removeOverlay(Overlay);
    },
    //隐藏overlay
    hide_Overlay(Overlay){
      Overlay.hide();
    },
    //显示overlay
    show_Overlay(Overlay){
      Overlay.show();
    },
    attribute(e) {
      var p = e.target;  //获取marker的位置
      console.log(p.getPosition())
      console.log(p.getPosition().lng)
      console.log(p.getPosition().lat)
      this.getData();
    },
    getData(){
      console.log('getData success')
    },
    handle1() {
      var marker = new BMap.Marker(new BMap.Point(121.501489,31.345221)); // 创建点普通点
      marker.addEventListener("click",this.attribute);

      
      var pt = new BMap.Point(121.50139,31.345127);
	    var myIcon = new BMap.Icon(this.redpoint, new BMap.Size(30,30));//自定义图片
	    var marker2 = new BMap.Marker(pt,{icon:myIcon}); 
      marker2.addEventListener("click",this.attribute);
      var label = new BMap.Label("001",{offset:new BMap.Size(5,9)});
      label.setStyle({
        color : "white",
        background:"transparent",
        border:"none"
      });
	    marker2.setLabel(label);

      this.marker = marker2;

      this.add_overlay(marker2);
      
    },
    handle2() {
      //this.marker.hide();
      this.clear_Overlays();
    },
    handle3() {
      this.Dis.open();  //开启鼠标测距
    },
    handle4() {
      this.Dis.close();  //关闭鼠标测距
    },
    handle5() {
      var polyline = new BMap.Polyline([
        new BMap.Point(121.499432,31.345046),
        new BMap.Point(121.499872,31.345058),
        new BMap.Point(121.500276,31.345139),
        new BMap.Point(121.501022,31.345216),
        new BMap.Point(121.501498,31.345228)
      ], {strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5});   //创建折线
      this.map.addOverlay(polyline);   //增加折线

    },
    //显示工程图,设置透明度来实现功能
    handle6() {
      this.groundOverlay.setOpacity(1);  
    },
    //隐藏工程图,设置透明度来实现功能
    handle7() {
      this.groundOverlay.setOpacity(0);  
    },
    // 编写自定义函数,创建标注
	  addMarker1(point,num,color){
      var pointcolor = null;
      switch(Number(color)){
        case 1: pointcolor=this.redpoint;break;
        case 2: pointcolor=this.yellowpoint;break;
        case 3: pointcolor=this.greenpoint;break;
      }

      var myIcon = new BMap.Icon(pointcolor, new BMap.Size(30,30));//自定义图片
      var marker = new BMap.Marker(point,{icon:myIcon}); //new BMap.Marker(point);
      this.map.addOverlay(marker);
      var label = new BMap.Label(num,{offset:new BMap.Size(5,9)});
      label.setStyle({
        color : "white",
        background:"transparent",
        border:"none"
      });
      marker.setLabel(label);
      marker.addEventListener("click",this.attribute);
    },
    addMarker2(point,num,color){
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
    handle8() {
      var allOverlay = this.map.getOverlays();
      for (var i = 1; i < allOverlay.length; i++){
        if(allOverlay[i].getLabel().content == "001"){
          console.log(allOverlay[i]);
          var pt = allOverlay[i].getPosition();
          this.map.removeOverlay(allOverlay[i]);
          this.addMarker(pt,'001',Math.floor(Math.random() * 3 + 1))//随机颜色

          return false;
        }
      }
    },
    

    
  }
}
</script>

<style>

.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.tool{
  position: fixed;
  top: 1vh;
  display:flex;
  justify-content: center;
  align-items: center;
}

.tool button{
  flex: 1;
}

</style>
