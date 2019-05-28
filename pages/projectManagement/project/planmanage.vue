<template lang="html">
  <div>
    <h4 style="padding:10px;">计划管理</h4>
    <Divider />
    <Row>
        <Col span="14">
          <Card>
            <h4 style="padding:10px;">桩号计划</h4>
            <Divider />
            <Input search enter-button="搜索" placeholder="请输入项目名称" v-model="leftKeyWord" @on-search="leftSearch(leftKeyWord)" />
            <Divider />
            <Table :columns="leftListColumns" :data="leftListData" style="margin-top:20px;">
              <template slot-scope="{ row, index }" slot="action">
                  <Button type="primary" @click="leftEdit(row.Id)">修改</Button>
              </template>
            </Table>
            <div class="pageBox"><Page :total="leftTotalCount" size="small" @on-change="lefthandlePage"  /></div>

          </Card>
        </Col>
        <Col span="9" offset="1">
          <Card>
              <Row>
                  <Col span="12">
                    <h4 style="padding:10px;">桩机</h4>
                  </Col>
                  <Col span="12" style="text-align:right;">
                    <Button type="primary" @click="rightAdd">添加</Button>
                  </Col>
              </Row>
            
            <Divider />
            <Input search enter-button="搜索" placeholder="请输入项目名称" v-model="rightKeyWord" @on-search="rightSearch(rightKeyWord)" />
            <Divider />
            <Card style="width:100%;margin-top:20px;" v-for="item in rightListData">
              <div style="text-align:center">
                  <Row>
                      <Col span="5" class-name="col">
                          <img src="~/static/images/pic.png"/>
                      </Col>
                      <Col span="15" type="flex" align="middle">
                          <Row class-name="row">桩机名称:<span>{{item.Name}}</span></Row>
                          <Row class-name="row">备注:<span>{{item.Remark}}</span></Row>
                      </Col>
                      <Col span="4" type="flex" align="middle">
                          <Row class-name="row"><Button type="info" :PileName="item.Name" :PileRemark="item.Remark" :PileId="item.Id" @click="rightEdit($event)">修改</Button></Row>
                          <Row class-name="row"><Button type="error">删除</Button></Row>
                      </Col>


                  </Row>
              </div>
            </Card>
            <div class="pageBox"><Page :total="rightTotalCount" size="small" @on-change="righthandlePage" /></div>

          </Card>
          
        </Col>
    </Row>
    <Modal
        v-model="leftModal"
        @on-ok="leftOk"
        @on-cancel="leftCancel">
        <div slot="header" class="info-title">
            <span :class="titleClass">{{dataObject.PileCode}}</span>
        </div>
        <div style="text-align:center;">
          <Row class="row">
              <Col span="11" class="col-left">桩号</Col>
              <Col span="13" class="col-right" style="padding-right:7px">{{dataObject.PileCode}}</Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">开始时间</Col>
              <Col span="13" class="col-right"><DatePicker v-model="dataObject.PlanStartTime" ref="PlanStartTime" type="date"></DatePicker></Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">结束时间</Col>
              <Col span="13" class="col-right"><DatePicker v-model="dataObject.PlanEndTime" ref="PlanEndTime" type="date"></DatePicker></Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">桩机</Col>
              <Col span="13" class="col-right">
                <Select v-model="dataObject.PileDriverID" clearable>
                    <Option v-for="item in PileDriverList" :value="item.Id" :key="item.Id">{{ item.Name }}</Option>
                </Select>
              </Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">人数</Col>
              <Col span="13" class="col-right"><Input v-model="dataObject.PlanJoinPerson" ref="PlanJoinPerson"/></Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">费用</Col>
              <Col span="13" class="col-right"><Input v-model="dataObject.Costs" ref="Costs"/></Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">材料及设备</Col>
              <Col span="13" class="col-right"><Input v-model="dataObject.MaterialsAndEquipment" ref="MaterialsAndEquipment"/></Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">其他</Col>
              <Col span="13" class="col-right"><Input v-model="dataObject.Remarks" ref="Remarks"/></Col>
          </Row>
        </div>
        <div slot="footer">
          <Button type="success" @click="doSubmit">保存</Button>
          <Button type="error" @click="closeModal">关闭</Button>
        </div>
    </Modal>

    <Modal
        v-model="rightModal"
        @on-ok="rightOk"
        @on-cancel="rightCancel">
        <div slot="header" class="info-title">
            <span>桩机设置</span>
        </div>
        <div style="text-align:center;">
          <Row class="row">
              <Col span="11" class="col-left">桩机名称</Col>
              <Col span="13" class="col-right"><Input v-model="PileName" ref="PileName"/></Col>
          </Row>
          <Row class="row">
              <Col span="11" class="col-left">备注</Col>
              <Col span="13" class="col-right"><Input type="textarea" :rows="4" v-model="PileRemark" ref="PileRemark"/></Col>
          </Row>
        </div>
        <div slot="footer">
          <Button type="success" @click="doSubmitII">保存</Button>
          <Button type="error" @click="closeModal">关闭</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'
export default {
  layout: 'withLeftMenu',
  data() {
    return {
      leftListColumns:[
        {
            title: '桩号',
            key: 'PileCode'
        },
        {
            title: '计划开始时间',
            key: 'PlanStartTime',
            render: (h, params) => {
              return h('span', params.row.PlanStartTime?this.formatDate(params.row.PlanStartTime):params.row.PlanStartTime);;
            }
        },
        {
            title: '计划结束时间',
            key: 'PlanEndTime',
            render: (h, params) => {
              return h('span', params.row.PlanEndTime?this.formatDate(params.row.PlanEndTime):params.row.PlanEndTime);;
            }
        },
        {
            title: '桩机',
            key: 'Name'
        },
        {
            title: '人数',
            key: 'PlanJoinPerson'
        },
        {
            title: '费用',
            key: 'Costs'
        },
        {
            title: '材料和机械设备',
            key: 'MaterialsAndEquipment',
            width: '120px'
        },
        {
            title: '操作',
            slot: 'action',
            align: 'center'
        },
      ],
      leftListData:[],
      leftTotalCount:0,
      leftCurrentPage:1,
      leftPageSize:10,

      rightListData:[],
      rightTotalCount:0,
      rightCurrentPage:1,
      rightPageSize:5,

      leftModal:false,
      rightModal:false,
      
      leftKeyWord:null,
      rightKeyWord:null,

      dataObject:{
        id:'001',
        x:'200',
        y:'300',
        fx:'400',
        fy:'500',
        sd:'2019-01-22',
        ed:'2019-01-22',
        ss:'2019-01-22',
        es:'2019-01-22'
      },
      titleClass:'',
      PileName:'',
      PileRemark:'',
      PileId:'',
      PileDriverList:[],

    }
  },
  components: {

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
    this.loadData();
  },
  methods: {
    loadData(){
      this.loadLeft();
      this.loadRight();
    },
    loadLeft(){
      let that = this;

      that.$Loading.start()
      that.$axios.get('/api/Home/PilePosition?ProjectId='+(this.projectid?this.projectid:'')+'&PageIndex='+that.leftCurrentPage+'&PageSize='+that.leftPageSize).then(rs => {
            that.$Loading.finish()
            let result = rs.data
            if (result.success) {
              that.leftListData=result.data.list;
              that.leftTotalCount=result.data.rowCount;

            } else {
              that.leftListData=[];
              that.leftTotalCount=0;
              that.$Message.error(result.message)
            }
        })
    },
    loadRight(keyword){
      let that = this;

      that.$Loading.start()
      that.$axios.post('/api/Home/Pile?UserId='+this.account.Id,{
          Name:keyword?keyword:'',
          PageIndex:this.rightCurrentPage,
          PageSize:this.rightPageSize
      }).then(rs => {
            that.$Loading.finish()
            let result = rs.data
            if (result.success) {
              that.rightListData=result.data.list;
              that.rightTotalCount=result.data.rowCount;
            } else {
              that.rightListData=[];
              that.$Message.error(result.message)
            }
        })
    },
    leftEdit(index){
      let that = this;

      that.$axios.post('/api/Home/Pile?UserId='+this.account.Id,{
          PageIndex:1,
          PageSize:999
      }).then(rs => {
            that.$Loading.finish()
            let result = rs.data
            if (result.success) {
              that.PileDriverList=result.data.list;
            } else {
              that.PileDriverList=[];
              that.$Message.error(result.message)
            }

            that.$axios.post('/api/Home/GetOnePilePosition?UserId='+this.account.Id,{
                Id:index         
            }).then(rs => {
                    let result = rs.data
                    if (result.success) {
                    that.dataObject=result.data;
                    this.leftModal=true;
                    } else {
                    that.$Message.error(result.message)
                    }
                })

        })

      
    },
    leftOk(){

    },
    leftCancel(){

    },
    leftSearch(value){
        console.log(value);
    },
    lefthandlePage(index){
      this.leftCurrentPage=index;
      this.loadLeft();
      
    },
    rightSearch(value){
        this.loadRight(value);
    },
    closeModal(){
        this.leftModal=false;
        this.rightModal=false;
    },
    rightEdit(e){

        this.PileName=e.currentTarget.getAttribute("PileName");
        this.PileRemark=e.currentTarget.getAttribute("PileRemark");
        this.PileId=e.currentTarget.getAttribute("PileId");
        this.rightModal=true;

    },
    doSubmit(){
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
                    that.leftModal=false;
                    that.loadLeft();
                    that.$Message.success(result.message)
                } else {
                    that.$Message.error(result.message)
                }
            })


    },
    doSubmitII(){
        let that = this;
        if(!this.PileName){
            that.$Message.error('请输入桩机名称');
        }else if(!this.PileRemark){
            that.$Message.error('请输入备注');
        }else{
            if(!that.PileId){
                that.$axios.post('/api/Home/PileAdd?UserId='+this.account.Id,{
                    Name:this.PileName,
                    Remark:this.PileRemark
                }).then(rs => {
                        let result = rs.data
                        if (result.success) {
                            this.rightModal=false;
                            this.loadRight();
                            that.$Message.success(result.message)
                        } else {
                            that.$Message.error(result.message)
                        }
                    })
            }else{
                that.$axios.post('/api/Home/PileModify?UserId='+this.account.Id,{
                    Id:this.PileId,
                    Name:this.PileName,
                    Remark:this.PileRemark
                }).then(rs => {
                        let result = rs.data
                        if (result.success) {
                            this.rightModal=false;
                            this.loadRight();
                            that.$Message.success(result.message)
                        } else {
                            that.$Message.error(result.message)
                        }
                    })

            }
        }



        
    },
    rightOk(){

    },
    rightCancel(){

    },
    rightAdd(){
        this.PileName='';
        this.PileRemark='';
        this.PileId='';
        this.rightModal=true;
    },
    righthandlePage(index){
      this.rightCurrentPage=index;
      this.loadRight();
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

.rightCol{
  margin-left:10px;
}
.col{
  height: 9vh;
  line-height: 9vh;
  img{
      height:100%;
  }
}
.row{
    height: auto;
    line-height: 4.5vh;
    text-align: left;
}
.pageBox{
  margin-top:20px;
  text-align: right;
}
.col-left{
  text-align: left;
  font-weight: bold;
}
.col-right{
  text-align: right;
}
</style>
