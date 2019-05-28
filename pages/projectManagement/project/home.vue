<template lang="html">
  <div>
      <div id="allmap" :style="mapStyle"></div>
      <template>
        <Button v-show="!drawerFlag" @click="drawerFlag=true;" type="primary" class="top-right-button">展开侧标栏</Button>
        <Drawer :title="drawerTitle" :mask="false" :width="300" v-model="drawerFlag">
            <Row class="row">
              <Col span='12'>
                <span>地图:</span>
              </Col>
              <Col span='12'>
                <i-switch v-model="switch1" @on-change="change1" />
              </Col>
            </Row>
            <Row class="row">
              <Col span='12'>
                <span>背景图:</span>
              </Col>
              <Col span='12'>
                <i-switch v-model="switch2" @on-change="change2" />
              </Col>
            </Row>
            <Row class="row">
              <Col span='12'>
                <span>文字:</span>
              </Col>
              <Col span='12'>
                <i-switch v-model="switch3" @on-change="change3" />
              </Col>
            </Row>
            <Row class="row">
              <Col span='12'>
                <span>计划行走路线:</span>
              </Col>
              <Col span='12'>
                <i-switch v-model="switch4" @on-change="change4" />
              </Col>
            </Row>
            <Row class="row">
              <Col span='12'>
                <span>实际行走路线:</span>
              </Col>
              <Col span='12'>
                <i-switch v-model="switch5" @on-change="change5" />
              </Col>
            </Row>
            <Divider />
            <Row class="row2">
              <Col span='6'>
                <img :src='greenpoint'>
              </Col>
              <Col span='12'>
                <span>已完成桩</span>
              </Col>
            </Row>
            <Row class="row2">
              <Col span='6'>
                <img :src='redpoint'>
              </Col>
              <Col span='12'>
                <span>未进行桩</span>
              </Col>
            </Row>
            <Row class="row2">
              <Col span='6'>
                <img :src='yellowpoint'>
              </Col>
              <Col span='12'>
                <span>正在进行桩</span>
              </Col>
            </Row>
            <Row class="row2">
              <Col span='6'>
                <img :src='blackpoint'>
              </Col>
              <Col span='12'>
                <span>作废桩位</span>
              </Col>
            </Row>
            <Divider />
            <h3 class="titleLeft">项目状态</h3><span class="titleRight">{{statObject.Stats==1?"未开工":statObject.Stats==2?"施工中":statObject.Stats==3?"已完成":statObject.Stats==4?"滞后":"提前完成"}}</span>
            <Divider />
            <Row class="row">
              <Col span='24'>
                <h4>进行中</h4>
              </Col>
            </Row>
            <Row class="row">
              <Col span='12'>
                <span class="titleLeft">桩位数量:</span><span class="titleRight">{{statObject.WorkingPileCount?statObject.WorkingPileCount:0}}</span>
              </Col>
              <Col span='12'>
                <span class="titleLeft">所占比例:</span><span class="titleRight">{{((statObject.WorkingPileCount?statObject.WorkingPileCount:0)/(statObject.PileCount?statObject.PileCount:1)).toFixed(2)*100}}%</span>
              </Col>
            </Row>
            <Divider />
            <Row class="row">
              <Col span='24'>
                <h4>已完成</h4>
              </Col>
            </Row>
            <Row class="row">
              <Col span='12'>
                <span class="titleLeft">桩位数量:</span><span class="titleRight">{{statObject.FinishPileCount?statObject.FinishPileCount:0}}</span>
              </Col>
              <Col span='12'>
                <span class="titleLeft">所占比例:</span><span class="titleRight">{{((statObject.FinishPileCount?statObject.FinishPileCount:0)/(statObject.PileCount?statObject.PileCount:1)).toFixed(2)*100}}%</span>
              </Col>
            </Row>
            <Divider />
            <Row class="row">
              <Col span='24'>
                <h4>未完成</h4>
              </Col>
            </Row>
            <Row class="row">
              <Col span='12'>
                <span class="titleLeft">桩位数量:</span><span class="titleRight">{{statObject.UnStartPileCount?statObject.UnStartPileCount:0}}</span>
              </Col>
              <Col span='12'>
                <span class="titleLeft">所占比例:</span><span class="titleRight">{{((statObject.UnStartPileCount?statObject.UnStartPileCount:0)/(statObject.PileCount?statObject.PileCount:1)).toFixed(2)*100}}%</span>
              </Col>
            </Row>
            <Divider />
            
        </Drawer>
        <Modal
            v-model="infoFlag"
            draggable
            width="300"
            :closable="false"
            @on-ok="ok"
            @on-cancel="cancel">
            <div slot="header" class="info-title">
                <span :class="titleClass">{{dataObject.PileCode}}</span>
            </div>
            <div style="text-align:center;">
              <Row class="row">
                  <Col span="11" class="col-left">X坐标</Col>
                  <Col span="13" class="col-right" style="padding-right:7px">{{dataObject.XAxis}}  </Col>
              </Row>
              <Row class="row">
                  <Col span="11" class="col-left">Y坐标</Col>
                  <Col span="13" class="col-right" style="padding-right:7px">{{dataObject.YAxis}}  </Col>
              </Row>
              <Row class="row">
                  <Col span="11" class="col-left">复测X坐标</Col>
                  <Col span="13" class="col-right"><Input v-model="dataObject.fx" ref="fx" style="margin-right:2px;width:90%;"/><Icon type="md-create" @click="handleEdit($event,'fx')" /></Col>
              </Row>
              <Row class="row">
                  <Col span="11" class="col-left">复测Y坐标</Col>
                  <Col span="13" class="col-right"><Input v-model="dataObject.fy" ref="fy" style="margin-right:2px;width:90%;"/><Icon type="md-create" @click="handleEdit($event,'fy')" /></Col>
              </Row>
              <Row class="row">
                  <Col span="11" class="col-left">计划开始时间</Col>
                  <Col span="13" class="col-right"><DatePicker v-model="dataObject.PlanStartTime" ref="sd" type="date" style="margin-right:2px;width:90%;"></DatePicker><Icon type="md-create" @click="handleEdit($event,'sd')" /></Col>
              </Row>
              <Row class="row">
                  <Col span="11" class="col-left">计划结束时间</Col>
                  <Col span="13" class="col-right"><DatePicker v-model="dataObject.PlanEndTime" ref="ed" type="date" style="margin-right:2px;width:90%;"></DatePicker><Icon type="md-create" @click="handleEdit($event,'ed')" /></Col>
              </Row>
              <Row class="row">
                  <Col span="11" class="col-left">实际开始时间</Col>
                  <Col span="13" class="col-right"><DatePicker v-model="dataObject.ActualStartTime" ref="ss" type="date" style="margin-right:2px;width:90%;"></DatePicker><Icon type="md-create" @click="handleEdit($event,'ss')" /></Col>
              </Row>
              <Row class="row">
                  <Col span="11" class="col-left">实际结束时间</Col>
                  <Col span="13" class="col-right"><DatePicker v-model="dataObject.ActualEndTime" ref="es" type="date" style="margin-right:2px;width:90%;"></DatePicker><Icon type="md-create" @click="handleEdit($event,'es')" /></Col>
              </Row>
            </div>
            <div slot="footer">
              <!-- <Button type="success" @click="doSubmit">保存</Button> -->
              <Button type="error" long @click="closeModal">关闭</Button>
            </div>
        </Modal>

      </template>
  </div>
</template>

<script>
import background from '~/static/images/background.png'
import redpoint from '~/static/images/red.png'
import yellowpoint from '~/static/images/yellow.png'
import greenpoint from '~/static/images/green.png'
import blackpoint from '~/static/images/black.png'

import {
  mapState
} from 'vuex'
export default {
  layout: 'withLeftMenu',
  head: {
    // script: [
    //   { src: 'http://api.map.baidu.com/api?v=2.0&ak=Qk4XGHvmWkjCTcYYjopw6jyYcvDm1sOm' },//百度地图api
    //   //{ src: 'http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js' },//测距js
    //   { src: 'http://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js' },//点聚合
    //   { src: 'http://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js' },//点聚合
    // ]
  },
  data() {
    return {
      mapStyle:{
        width:'100%',
        height:'calc(99vh - 64px)'
      },
      map:null,
      background,
      redpoint,
      yellowpoint,
      greenpoint,
      blackpoint,
      marker:null,
      groundOverlay:null,
      markers:[],

      drawerFlag:false,
      drawerTitle:'EPC项目',

      infoFlag:false,

      titleClass:"redbackground",
      dataObject:{

      },
      switch1:false,
      switch2:false,
      switch3:false,
      switch4:false,
      switch5:false,

      statObject:{},

    }
  },
  components: {
    // myMap,
    // myList
  },
  watch: {

  },
  computed: {
    ...mapState('app', {
      account:'account',
      projectid: 'projectid'
    })
  },
  mounted() {
    let pid = this.$route.query.ProjectID;
    if(pid){
      this.$store.commit('app/setProjectid', this.$route.query.ProjectID)
    }    
    this.loadMap();
    this.loadStat();
  },
  methods: {
    //加载地图
    loadMap(){
      let map = new BMap.Map("allmap",{minZoom:1,maxZoom:19,enableMapClick:false})   // 创建Map实例,设置地图允许的最小/大级别,构造底图时，关闭底图可点功能
      map.centerAndZoom(new BMap.Point(120.983,31.2113), 15) // 初始化地图,设置中心点坐标和地图级别
      
      map.disableDragging()         // 禁用地图拖拽
      map.disableDoubleClickZoom()	// 禁用双击放大
      map.disablePinchToZoom()	    //禁用双指操作缩放

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

      this.groundOverlay = groundOverlay
      this.map = map

      // 随机向地图添加10个标注
      var points = [];
      // var points =[
      //   {'x':120.98330097903558,'y':31.21130578355703},
      //   {'x':120.98330097903558,'y':31.21130578355703},
      //   {'x':120.99274216994544,'y':31.225588847010581},
      //   {'x':120.98330996209069,'y':31.25968373998726},
      //   {'x':121.00217437780022,'y':31.25968373998726},
      //   {'x':120.98330996209069,'y':31.275888395658786},
      //   {'x':121.00217437780022,'y':31.275888395658786},
      //   {'x':120.98330996209069,'y':31.393865989964794},
      //   {'x':121.00217437780022,'y':31.324485493491679},
      //   {'x':120.98330996209069,'y':31.340678900356465},
      // ];

      let that = this;
        this.$Loading.start()
        this.$axios.get('/api/Home/PilePosition?ProjectId='+(this.projectid?this.projectid:'')+'&PageIndex=1&PageSize=999').then(rs => {
            this.$Loading.finish()
            let result = rs.data
            if (result.success) {
                result.data.list.forEach(val => {
                  points.push({'x':val.XAxis,'y':val.YAxis,'id':val.Id,'code':val.PileCode,'stats':val.Stats});
                })
                
            } else {
                points=[];
                this.$Message.error(result.message)
            }
            var bounds = map.getBounds();
            var sw = bounds.getSouthWest();
            var ne = bounds.getNorthEast();
            var lngSpan = Math.abs(sw.lng - ne.lng);
            var latSpan = Math.abs(ne.lat - sw.lat);
            for (var i = 0; i < points.length; i++) {
              // var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7)); //addMarker1
              var point = new BMap.Point(points[i].x,points[i].y); //addMarker1
              // this.addMarker1(point,(Array(3).join(0) + i).slice(-3),Math.floor(Math.random() * 3 + 1));//随机颜色
              this.addMarker1(point,points[i].code,points[i].stats,points[i].id);
            }

        })



      
    },
    // 编写自定义函数,创建标注
	  addMarker1(point,num,color,id){
      var pointcolor = null;
      switch(Number(color)){
        case 1: pointcolor=this.redpoint;break;
        case 2: pointcolor=this.yellowpoint;break;
        case 3: pointcolor=this.greenpoint;break;
        default: pointcolor=this.blackpoint;break;
      }

      var myIcon = new BMap.Icon(pointcolor, new BMap.Size(30,30));//自定义图片
      var marker = new BMap.Marker(point,{icon:myIcon}); //new BMap.Marker(point);
      this.map.addOverlay(marker);
      var label = new BMap.Label(num,{offset:new BMap.Size(0,9)});
      label.setStyle({
        color : "white",
        background:"transparent",
        border:"none"
      });
      marker.setLabel(label);
      marker.customData = {'pid': id }
      marker.addEventListener("click",this.attribute);

    },
    attribute(e) {
      var p = e.target;  //获取marker的位置
      // console.log(e)
      // console.log(p.getPosition())
      // console.log(p.getPosition().lng)
      // console.log(p.getPosition().lat)
      this.getData(e.currentTarget.customData.pid);
      
    },
    getData(id){
      console.log('getData success:'+id)

      let that = this;
      that.$axios.post('/api/Home/GetOnePilePosition?UserId='+this.account.Id,{
          Id:id         
      }).then(rs => {
            let result = rs.data
            if (result.success) {
              that.dataObject=result.data;
              // this.titleClass="yellowbackground";
              // this.dataObject.id="002";
              this.infoFlag=true;
            } else {
              that.$Message.error(result.message)
            }
        })
    },
    closeModal(){
      this.infoFlag=false;
    },
    doSubmit(obj){
      this.$Modal.confirm({
          title: '提示',
          content: '<p>是否确定保存当前数据</p>',
          loading: true,
          onOk: () => {

              this.doSave(obj);
              
          }
      });
      
    },
    doSave(obj){
      this.doSubmitii()
      // setTimeout(() => {
      //   this.$Modal.remove();
      //   this.$Message.info('保存成功');
      //   this.$refs[obj].disabled= this.$refs[obj].disabled?false:true;
        
      // }, 1000);

    },
    doSubmitii(){
        let that = this;
        let data = {};
        //加工数据
        let obj = that.dataObject;
        Object.keys(obj).forEach(function(key){
            data[key]=obj[key];
        });


        that.$axios.post('/api/Home/PilePositionModify?UserId='+that.account.Id,data).then(rs => {
                let result = rs.data
                if (result.success) {
                  that.$Modal.remove();
                  that.$Message.info(result.message);
                  // that.$refs[o].disabled= this.$refs[o].disabled?false:true;  
                } else {
                    that.$Message.error(result.message)
                }
            })


    },
    handleEdit(e,obj){
      this.doSubmit(obj);

      // console.log(this.$refs[obj]);
      // if(!this.$refs[obj].disabled){
      //   this.doSubmit(obj);
      // }else{
      //   this.$refs[obj].disabled= this.$refs[obj].disabled?false:true;
      // }

    },
    ok(){

    },
    cancel(){

    },
    change1 (status) {
        this.$Message.info('地图' + status);
    },
    change2 (status) {
        this.$Message.info('背景图' + status);
    },
    change3 (status) {
        this.$Message.info('文字' + status);
    },
    change4 (status) {
        this.$Message.info('计划行走路线' + status);
    },
    change5 (status) {
        this.$Message.info('实际行走路线' + status);
    },
    loadStat(){
      let that = this;
      that.$axios.post('/api/Home/ProjectStatsFinishedInfo?UserId='+that.account.Id,{
        ProjectId:that.projectid
      }).then(rs => {
            let result = rs.data
            if (result.success) {
               that.statObject = result.data[0];
            }
        })
    },

  },
  
}
</script>

<style lang="scss" scoped>
.top-right-button{
  width:auto;
  position:absolute;
  right:32px;
  top:32px;
  z-index:1;

}
.info-title{
  text-align:center;
  span{
    display: block;
    width: 50px;
    height:50px;
    line-height: 50px;
    font-size:16px;
    color:white;
    margin: auto auto;
  }
}
.redbackground{
  background: url("~static/images/red-big.png") no-repeat center ;
  background-size: 50px 50px;
}
.yellowbackground{
  background: url("~static/images/yellow-big.png") no-repeat center ;
  background-size: 50px 50px;
}
.greenbackground{
  background: url("~static/images/green-big.png") no-repeat center ;
  background-size: 50px 50px;
}
.row{
  height: 36px;
  line-height: 36px;
  span{
    font-weight:bold;
  }
}
.col-left{
  text-align: left;
  font-weight: bold;
}
.col-right{
  text-align: right;
}
.row2{
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  span{
    font-weight:bold;
  }
}
.titleLeft{
  width:50%;
  float:left;
}
.titleRight{
  width:50%;
  float:left;
  text-align:center;
  color:lightseagreen;
}


</style>
