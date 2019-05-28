<template lang="html">
  <section class="mapforlist">
    <div><Input search enter-button="搜索" placeholder="请输入项目名称"  @on-search="search(keyWord)" /></div>
    <div id="allmap" :style="mapStyle"></div>
    <Modal
        v-model="infoFlag"
        draggable
        width="300"
        :closable="false"
        @on-ok="ok"
        @on-cancel="cancel">
        <div slot="header" class="info-title">
            <h3>项目详情</h3>
        </div>
        <div style="text-align:center;">
          <Row class="row">
              <Col span="11" class="col-left">项目名称</Col>
              <Col span="13" class="col-right" style="padding-right:7px">{{dataObject.ProjectName}}  </Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">业主名称</Col>
              <Col span="13" class="col-right" style="padding-right:7px">{{dataObject.OwnerName}}  </Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">项目经理</Col>
              <Col span="13" class="col-right" style="padding-right:7px">{{dataObject.ProjectManager}}  </Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">施工单位</Col>
              <Col span="13" class="col-right" style="padding-right:7px">{{dataObject.ConstructionUnitName}}  </Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">设计单位</Col>
              <Col span="13" class="col-right" style="padding-right:7px">{{dataObject.DesignUnitName}}  </Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">监理单位</Col>
              <Col span="13" class="col-right" style="padding-right:7px">{{dataObject.SupervisorUnitName}}  </Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">项目状态</Col>
              <Col span="13" class="col-right" style="padding-right:7px">{{dataObject.Stats==1?"未开工":dataObject.Stats==2?"施工中":dataObject.Stats==3?"已完成":dataObject.Stats==4?"滞后":"提前完成"}}  </Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">进度</Col>
              <Col span="13" class="col-right" style="padding-right:7px">{{dataObject.Percent?dataObject.Percent:0}}%</Col>
          </Row>
          
        </div>
        <div slot="footer">
          <!-- <Button type="success" @click="doSubmit">保存</Button> -->
          <Button type="error" long @click="closeModal">关闭</Button>
        </div>
    </Modal>
  </section>
</template>

<script>
import redpoint from '~/static/images/red.png'
import yellowpoint from '~/static/images/yellow.png'
import greenpoint from '~/static/images/green.png'
import {
  mapState
} from 'vuex'
export default {
  head: {
    // script: [
    //   { src: 'http://api.map.baidu.com/api?v=2.0&ak=Qk4XGHvmWkjCTcYYjopw6jyYcvDm1sOm' },//百度地图api
    //   { src: 'http://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js' },//点聚合
    //   { src: 'http://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js' },//点聚合
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
        redpoint,
        yellowpoint,
        greenpoint,
        isload: false,

        infoFlag:false,
        dataObject:{
          ProjectName:'EPC项目',
          OwnerName:'许三多',
          ProjectManager:'王宝强',
          DesignUnit:'A单位',
          SupervisorUnit:'B单位',
          ConstructionUnit:'C单位',
          Stats:'项目状态',
          Percent:'2019-01-22'
        },
    }
  },
  computed: {
    ...mapState('app', {
      account: 'account'
    }),    
  },
  props: {

  },
  watch: {
    isload() {
      this.loadmap(true);
    }
  },
  mounted() {

  },
  methods: {
      load() {
        if (!this.isload) {
          this.isload = true
        }
      },
      loadmap(flag){
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
        if(flag){
            this.loadlist();
        }
      },
      loadlist(){
        // 随机向地图添加10个标注
        let points=[];
        // var points = [
        // {'x':120.985287,'y':28.622918},
        // {'x':120.985287,'y':28.622918},
        // {'x':120.985287,'y':28.622918},
        // {'x':120.985287,'y':28.622918},
        // {'x':120.985287,'y':28.622918},
        // {'x':102.661579,'y':25.075623},
        // {'x':102.661579,'y':25.075623},
        // {'x':102.661579,'y':25.075623},
        // {'x':102.661579,'y':25.075623},
        // {'x':102.661579,'y':25.075623},
        // ]//addMarker2
        let that = this;
        this.$Loading.start()
        this.$axios.post('/api/Home/GetUserParticipationProject', {
            UserID:this.account.Id,
            pageIndex:this.pageIndex,
            pageSize:this.pageSize,
        }).then(rs => {
            this.$Loading.finish()
            let result = rs.data
            if (result.success) {
                result.data.list.forEach(val => {
                  console.log(val,'val');
                  points.push({'x':val.LatitudeStart,'y':val.LatitudeEnd,'name':val.ProjectName,'id':val.ProjectID});
                })
            } else {
                points=[];
                this.$Message.error(result.message)
            }
            console.log(points);
            var bounds = this.map.getBounds();
            var sw = bounds.getSouthWest();
            var ne = bounds.getNorthEast();
            var lngSpan = Math.abs(sw.lng - ne.lng);
            var latSpan = Math.abs(ne.lat - sw.lat);
            for (var i = 0; i < points.length; i++) {
                var point = new BMap.Point(points[i].x,points[i].y); 
                // this.addMarker2(point,(Array(3).join(0) + i).slice(-3),Math.floor(Math.random() * 3 + 1));//随机颜色
                this.addMarker2(point,'','',points[i].id);//随机颜色
            }
            var markerClusterer = new BMapLib.MarkerClusterer(this.map, {markers:this.markers});

        })


        

      },
      addMarker2(point,num,color,id){//color 1红色 2黄色 3绿色
        var pointcolor = this.redpoint;
        // switch(Number(color)){
        //     case 1: pointcolor=this.redpoint;break;
        //     case 2: pointcolor=this.yellowpoint;break;
        //     case 3: pointcolor=this.greenpoint;break;
        // }

        var myIcon = new BMap.Icon(pointcolor, new BMap.Size(30,30));//自定义图片
        var marker = new BMap.Marker(point,{icon:myIcon}); //new BMap.Marker(point);
        var label = new BMap.Label(num,{offset:new BMap.Size(5,9)});
        label.setStyle({
            color : "white",
            background:"transparent",
            border:"none"
        });
        marker.setLabel(label);
        marker.customData = {'projectid': id }
        marker.addEventListener("click",this.attribute);
        this.markers.push(marker);
      },
      attribute(e) {
        var p = e.target;  //获取marker的位置
        console.log(e)
        console.log(p.getPosition())
        console.log(p.getPosition().lng)
        console.log(p.getPosition().lat)
        console.log(e.currentTarget.customData.projectid)
        this.getData(e.currentTarget.customData.projectid);
        
      },
      getData(id){
        console.log('getData success')

        this.$axios.post('/api/Home/GetProjectInfo', {
            ProjectID:id
        }).then(rs => {
            let result = rs.data
            if (result.success) {
                this.dataObject=result.data[0];
            } else {
                this.dataObject={};
                this.$Message.error(result.message)
            }

        })



        
        this.titleClass="yellowbackground";
        this.dataObject.id="002";
        this.infoFlag=true;
      },
      closeModal(){
        this.infoFlag=false;
      },
      search(keyword){
        this.loadlist(keyword);
      },
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.mapforlist{
    width:100%;
    height:$map-for-list-height;
}
.row{
  height: 36px;
  line-height: 36px;
  
}
.col-left{
  text-align: left;
  font-weight: bold;
}
.col-right{
  text-align: right;
}
</style>
