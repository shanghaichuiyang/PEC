<template lang="html">
  <div>
      <div id="allmap" :style="mapStyle"></div>
      <template>
        <Button v-show="!drawerFlag" @click="drawerFlag=true;" type="primary" class="top-right-button">展开侧标栏</Button>
        <Drawer :title="drawerTitle" :mask="false" :width="300" v-model="drawerFlag">
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            
        </Drawer>
        <Modal v-model="listFlag" :closable="false" :mask-closable="false" :mask="false" :styles="{marginRight:'16px',width: 'calc(100vw - 232px)'}">
          <p slot="header" style="text-align:left;height:auto;">
            <Row>
              <Col span="12" style="padding-right:10px;">
                <Input search enter-button="搜索" placeholder="请输入桩号" v-model="keyWord" @on-search="search(keyWord)" />
              </Col>
              <Col span="12">
                <Button type="info" @click="add">添加</Button>
                <Button type="error" @click="exportOut">导出</Button>
              </Col>
            </Row>
              
              
          </p>
          <div style="text-align:center">
            <Table :columns="listColumns" :data="listData" style="margin:10px 0;">
              <template slot-scope="{ row, index }" slot="action">
                  <Button type="info" @click="detail(row.Id)">详情</Button>
                  <Button type="error" @click="delete(row.Id)">删除</Button>
              </template>
            </Table>
          </div>
          <div slot="footer">
              <div class="pageBox"><Page :total="totalCount" size="small" /></div>
          </div>
        </Modal>

        <Modal v-model="detailFlag" :closable="true" :mask-closable="false" :mask="false" :styles="{marginRight:'16px',width: 'calc(100vw - 232px)'}" @on-cancel="cancel">
          <p slot="header" style="text-align:center">
              <span>复测详情</span>
          </p>
          <div style="text-align:left">
            <Row class-name="row">
                <Col span="6">复测时间:<span>{{dataObject.OwnerName}}</span></Col>
                <Col span="6">规范偏差要求:<span>{{dataObject.ProjectManager}}</span></Col>
                <Col span="6">复测桩位总数:<span>{{dataObject.OwnerName}}</span></Col>
                <Col span="6">超出根数:<span>{{dataObject.ProjectManager}}</span></Col>
            </Row>
            <Row class-name="row">
                <Col span="24">相关处理联系单:<span>{{dataObject.Percent}}</span></Col>
            </Row>

          </div>
          <div slot="footer">
            <Table :columns="detailColumns" :data="detailData" style="margin:20px 0;">
              
            </Table>
          </div>
        </Modal>

        <Modal
            v-model="infoFlag"
            draggable
            width="400"
            :closable="false"
            :mask="false"
            :styles="{marginRight:'16px'}"
            @on-ok="ok"
            @on-cancel="cancel">
            <div slot="header">
                <span style="font-weight:bold;">添加桩位复测</span>
            </div>
            <div style="text-align:left;">
              <Row class="row">
                  <Col span="24">复测时间</Col>
              </Row>
              <Row class="row">
                  <Col span="24"><DatePicker v-model="RetestTime" ref="sd" type="date"></DatePicker></Col>
              </Row>
              <Row class="row">
                  <Col span="24">上传相关处理单</Col>
              </Row>
              <Row class="row">
                  <Col span="24">
                        <Upload
                            :before-upload="handleUpload"
                            action="">
                            <Button>选择文件</Button>
                            <p ref="ProcessSheet"></p>
                        </Upload>
                  </Col>
              </Row>
              <Row class="row">
                  <Col span="24">
                    选择桩号
                  </Col>
              </Row>
              <Row class="row">
                  <Col span="24">
                    <Select
                        style="width:350px;"
                        v-model="seachPileId"
                        filterable
                        label-in-value=true
                        @on-change="selectChange">
                        <Option v-for="(option, index) in options" :value="option.Id" :key="index">{{option.PileCode}}</Option>
                    </Select>
                  </Col>
              </Row>
              
              <Row class="row" style="height:330px;overflow-x:hidden;overflow-y:auto;margin-top:10px;">
                  <Col span="24">
                    <Table :columns="infoColumns" :data="infoData" style="margin:20px 0;width:350px;">
              
                    </Table>
                  </Col>
              </Row>
              
              
            </div>
            <div slot="footer">
              <Button type="success" @click="doSubmit">添加</Button>
              <Button type="error" @click="closeModal">取消</Button>
            </div>
        </Modal>

        <Modal
            v-model="addFlag"
            draggable
            width="400"
            :closable="false"
            :mask="false"
            :styles="{margin:'auto'}"
            @on-ok="ok"
            @on-cancel="cancel">
            <div slot="header">
                <span style="font-weight:bold;">添加桩位复测</span>
            </div>
            <div style="text-align:left;">
              <Row class="row">
                  <Col span="6">桩号</Col>
                  <Col span="12">{{pcode}}</Col>
              </Row>
              <Row class="row">
                  <Col span="6">X坐标</Col>
                  <Col span="18"><Input type="number" v-model="fx" ref="fx"/></Col>
              </Row>
              <Row class="row">
                  <Col span="6">Y坐标</Col>
                  <Col span="18"><Input type="number" v-model="fy" ref="fx"/></Col>
              </Row>
              
              
            </div>
            <div slot="footer">
              <Button type="success" @click="doOneSubmit">添加</Button>
              <Button type="error" @click="closeOneModal">取消</Button>
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
      marker:null,
      groundOverlay:null,
      markers:[],

      drawerFlag:false,
      drawerTitle:'EPC项目',

      infoFlag:false,
      listFlag:true,
      detailFlag:false,
      addFlag:false,

      dataObject:{
        
      },

      listColumns:[
        {
            title: '序号',
            key: 'Id'
        },
        {
            title: '复测时间',
            key: 'RetestTime',
            render: (h, params) => {
              return h('span', params.row.RetestTime?this.formatDate(params.row.RetestTime):params.row.RetestTime);;
            }
        },
        {
            title: '规范偏差',
            key: 'StandardDeviation'
        },
        {
            title: '复测桩位总数',
            key: 'RetestStationCount'
        },
        {
            title: '超出根数',
            key: 'OverCount'
        },
        {
            title: '相关联系处理单',
            key: 'ProcessSheet'
        },
        {
            title: '操作',
            slot: 'action',
            align: 'center'
        },
      ],
      listData:[],
      totalCount:0,
      currentPage:1,
      pageSize:10,

      keyWord:'',

      index:null,

      detailColumns:[
        {
            title: '桩号',
            key: 'name1'
        },
        {
            title: '原位置',
            key: 'name2'
        },
        {
            title: '复测位置',
            key: 'name3'
        },
        {
            title: 'X偏差',
            key: 'name4'
        },
        {
            title: 'Y偏差',
            key: 'name5'
        },
        
      ],
      detailData:[],

      modalStyle:'{width: calc(100vw - 200px),height:100%}',
      //modalStyle:'calc(100vw - 200px)',

      infoColumns:[
        {
            title: '桩号',
            key: 'PileId'
        },
        {
            title: 'X坐标',
            key: 'RetestXPosition'
        },
        {
            title: 'Y坐标',
            key: 'RetestYPosition'
        },
      ],
      infoData:[],
      idData:[],
      fx:'',
      fy:'',
      detilid:0,
      pcode:0,
      RetestTime:new Date(),
      seachPileId:0,
      options:[],
      ProcessSheet:null

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
      account: 'account',
      projectid: 'projectid'
    })
  },
  mounted() {
      this.loadMap();
      this.loadData();
  },
  methods: {
    //加载地图
    loadMap(){
      let map = new BMap.Map("allmap",{minZoom:1,maxZoom:19,enableMapClick:false})   // 创建Map实例,设置地图允许的最小/大级别,构造底图时，关闭底图可点功能
      map.centerAndZoom(new BMap.Point(120.98330097903558,31.21130578355703), 15) // 初始化地图,设置中心点坐标和地图级别
      
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

      var points = [];
      
      let that = this;
      this.$Loading.start()
      this.$axios.get('/api/Home/PilePosition?ProjectId='+(this.projectid?this.projectid:'')).then(rs => {
          this.$Loading.finish()
          let result = rs.data
          if (result.success) {
              result.data.list.forEach(val => {
                points.push({'x':val.XAxis,'y':val.YAxis,'id':val.Id,'code':val.PileCode});
                that.options.push(val);
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
            this.addMarker1(point,points[i].code,Math.floor(Math.random() * 3 + 1),points[i].id);
          }

      })


      // 随机向地图添加10个标注
      // var points = [
      //   {'x':120.985287,'y':28.622918},
      //   {'x':120.985287,'y':28.622918},
      //   {'x':120.985287,'y':28.622918},
      //   {'x':120.985287,'y':28.622918},
      //   {'x':120.985287,'y':28.622918},
      //   {'x':102.661579,'y':25.075623},
      //   {'x':102.661579,'y':25.075623},
      //   {'x':102.661579,'y':25.075623},
      //   {'x':102.661579,'y':25.075623},
      //   {'x':102.661579,'y':25.075623},
      // ];
      // var bounds = map.getBounds();
      // var sw = bounds.getSouthWest();
      // var ne = bounds.getNorthEast();
      // var lngSpan = Math.abs(sw.lng - ne.lng);
      // var latSpan = Math.abs(ne.lat - sw.lat);
      // for (var i = 0; i < points.length; i++) {
      //   var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7)); //addMarker1
      //   this.addMarker1(point,(Array(3).join(0) + i).slice(-3),Math.floor(Math.random() * 3 + 1),1);//随机颜色
      // }
    },
    // 编写自定义函数,创建标注
	  addMarker1(point,num,color,id){
      var pointcolor = null;
      switch(Number(color)){
        case 1: pointcolor=this.redpoint;break;
        case 2: pointcolor=this.yellowpoint;break;
        case 3: pointcolor=this.greenpoint;break;
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
      // var p = e.target;  //获取marker的位置
      // console.log(p.getPosition())
      // console.log(p.getPosition().lng)
      // console.log(p.getPosition().lat)
      this.getData(e.currentTarget.customData.pid);
      
    },
    getData(id){
      let that = this;
      console.log('getData success')
      if(this.infoFlag){
        //let flag = true;
        if(this.checkId(id)){
          this.addFlag=true;
          that.$axios.post('/api/Home/PilePositionInfo',{
                    Id:id
          }).then(rs => {
                  that.$Loading.finish()
                  let result = rs.data
                  if (result.success) {
                    that.detilid=id;
                    that.pcode=result.data.PileCode;
                  } else {
                    that.$Message.error(result.message);
                  }
              })

        }else{
          that.$Message.error('不能重复添加');
        }

        
      }
      
      // this.infoData.forEach((item) => {
      //   if(item.name1=='001'){
      //     flag=false;
      //   }
      // });
      // if(flag){
      //   this.infoData.push({"name1":"001","name2":"123","name3":"321"})
      // }      
      
      
    },
    closeModal(){
      this.listFlag=true;
      this.infoFlag=false;
      this.detailFlag=false;
      this.addFlag=false;
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
      let that = this;
      // setTimeout(() => {
      //   this.$Modal.remove();
      //   this.$Message.info('保存成功');
        

      // }, 1000);
      that.$axios.post('/api/Home/PileRetestAdd',{
            ProjectId:that.projectid,
            RetestTime:that.RetestTime,
            ProcessSheet:that.ProcessSheet,
            RetestDetail:JSON.stringify(that.infoData)
          }).then(rs => {
                  this.$Modal.remove();
                  let result = rs.data
                  if (result.success) {
                    that.loadData();
                    this.$Message.info(result.message);
                    that.listFlag=true;
                    that.infoFlag=false;
                    that.detailFlag=false;
                    that.addFlag=false;
                  } else {
                    that.$Message.error(result.message);
                  }
              })
    


    },  
    ok(){

    },
    cancel(){
      
        this.infoFlag=false;
        this.detailFlag=false;
        this.listFlag=true;
        this.addFlag=false;
    },
    loadData(){
      let that = this;
      // let list = [
      //   {'name1':'001','name2':'2019-01-22','name3':'2019-01-22','name4':'桩机名','name5':'22','name6':'2019','id':1},
      //   {'name1':'001','name2':'2019-01-22','name3':'2019-01-22','name4':'桩机名','name5':'22','name6':'2019','id':11},
      //   {'name1':'001','name2':'2019-01-22','name3':'2019-01-22','name4':'桩机名','name5':'22','name6':'2019','id':111},
      //   {'name1':'001','name2':'2019-01-22','name3':'2019-01-22','name4':'桩机名','name5':'22','name6':'2019','id':1111},
      //   {'name1':'001','name2':'2019-01-22','name3':'2019-01-22','name4':'桩机名','name5':'22','name6':'2019','id':11111},
      // ];
      // that.listData=list;

      that.$Loading.start()
      that.$axios.post('/api/Home/PileRetest',{
        ProjectId:this.projectid,
        PageIndex:this.currentPage,
        PageSize:this.pageSize
      }).then(rs => {
            that.$Loading.finish()
            let result = rs.data
            if (result.success) {
              that.listData=result.data.list;
            } else {
              that.listData=[];
              that.$Message.error(result.message)
            }
        })



    },
    detail(index){
      this.listFlag=false;
      this.infoFlag=false;
      this.detailFlag=true;
      this.addFlag=false;
      this.index= index;
      this.loadDetail(index);
    },
    delete(index){
      
      this.index= index;
    },
    loadDetail(index){
      let that = this;
      that.$axios.post('/api/Home/PileRetestInfo',{
        Id:index
      }).then(rs => {
            that.$Loading.finish()
            let result = rs.data
            if (result.success) {
              that.detailData=result.data.list;
            } else {
              that.detailData=[];
              that.$Message.error(result.message)
            }
        })




    },
    add(){
      this.listFlag=false;
      this.infoFlag=true;
      this.detailFlag=false;
      this.addFlag=false;
      this.infoData=[];
      this.idData=[];
      this.RetestTime=new Date();
      this.seachPileId=0;
      this.ProcessSheet=null;
    },
    exportOut(){

    },
    doOneSubmit(){
      let that = this;
      if(that.fx!='' && that.fy!=''){
        if(that.checkId(that.detilid)){
          that.infoData.push({"PileId":that.detilid,"RetestXPosition":that.fx,"RetestYPosition":that.fy});
          that.idData.push(that.detilid);
          that.closeOneModal();
        }
      }else{
        that.$Message.error('坐标不能为空')
      }


    },
    closeOneModal(){
      this.addFlag=false;
      this.fx='';
      this.fy='';
    },
    checkId(id){
      if(this.idData.indexOf(id)==-1){
        return true;
      }else{
        return false;
      }
    },
    selectChange(value){
      let that = this;
      if(value){
        that.addFlag=true;
        that.detilid=value.value;
        that.pcode=value.label;
      }
    },
    handleUpload (file) {
        let that = this;
        console.log(file,'file');
        that.pictureSrc = null;
        that.pictureSrc = window.URL.createObjectURL(file);
        that.file = file;

        let data = new FormData()
        if(that.file){
            data.append('File', that.file)
        }
        data.append('FileType', 5)
        data.append('Remarks', '')
        that.$Loading.start()
        that.$axios2.post('/api/Home/Upload', data).then(rs => {
            that.$Loading.finish()
            if (rs.data.success) {
                that.hasUploadpng=true;

                // let result = Object.assign({}, that.formData);
                // result.Face =  rs.data.data;
                // that.$store.commit('app/editAccount', result)
                console.log(rs.data.data,'pic');
                that.ProcessSheet = rs.data.data.FileId;
                that.$Message.success(rs.data.message);
                
            } else {
              that.$Message.error(rs.data.message)
            }
        })

    },
    formatDate: function (value) {
        var date = new Date(value);
        let Y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let H = date.getHours();
        let i = date.getMinutes();
        let s = date.getSeconds();
        if (m < 10) {
            m = '0' + m;
        }
        if (d < 10) {
            d = '0' + d;
        }
        if (H < 10) {
            H = '0' + H;
        }
        if (i < 10) {
            i = '0' + i;
        }
        if (s < 10) {
            s = '0' + s;
        }
        //var t = Y + '-' + m + '-' + d + ' ' + H + ':' + i;
        let t = Y + '-' + m + '-' + d;
        console.log(t)
        return t;
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
  height: 30px;
  line-height: 30px;
  padding:0 10px;
}
.col-left{
  text-align: left;
  font-weight: bold;
}
.col-right{
  text-align: right;
}



</style>
