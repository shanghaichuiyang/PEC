<template lang="html">
  <div>
    <Card>
      <h4 style="padding:10px;">进度管理</h4>
      <Divider />
      <Input search enter-button="搜索" placeholder="请输入桩号" v-model="keyWord" @on-search="search(keyWord)" />
      <Divider />
      <Table :columns="listColumns" :data="listData" style="margin-top:20px;">
        <template slot-scope="{ row, index }" slot="action">
            <Button type="info" @click="edit(row.Id)">修改</Button>
            <Button type="error" @click="disable(row.Id)">作废</Button>
        </template>
      </Table>
      <div class="pageBox"><Page :total="totalCount" size="small" @on-change="handlePage" /></div>

    </Card>
    <Modal
        v-model="modal"
        @on-ok="ok"
        @on-cancel="cancel"
        width="800">
        <div slot="header" class="info-title">
            <span :class="titleClass">桩号:{{dataObject.PileCode}}</span>
        </div>
        <div style="text-align:center;">
          <Row class="row">
              <Col span="12" class="col-left">开始时间</Col>
              <Col span="12" class="col-left">结束时间</Col>
          </Row>
          <Row class="row">
              <Col span="12" class="col-left"><DatePicker v-model="dataObject.PlanStartTime" ref="sd" type="date"></DatePicker></Col>
              <Col span="12" class="col-left"><DatePicker v-model="dataObject.PlanEndTime" ref="sd" type="date"></DatePicker></Col>
          </Row>
          <Row class="row">
              <Col span="12" class="col-left">打桩人数</Col>
              <Col span="12" class="col-left">费用/元</Col>
          </Row>
          <Row class="row">
              <Col span="12" class="col-left"><Input v-model="dataObject.PlanJoinPerson" ref="fx" style="padding-right:5%;"/></Col>
              <Col span="12" class="col-left"><Input v-model="dataObject.Costs" ref="fx" style="padding-right:5%;"/></Col>
          </Row>
          <Row class="row">
              <Col span="24" class="col-left">桩机</Col>
          </Row>
          <Row class="row">
              <Col span="24" class="col-left">
                <Select v-model="dataObject.PileDriverID">
                    <Option v-for="item in selectList" :value="item.Id" :key="item.Id">{{ item.Name }}</Option>
                </Select>
              </Col>
          </Row>
          <Row class="row">
              <Col span="24" class="col-left">材料和机械设备</Col>
          </Row>
          <Row class="">
              <Col span="24" class="col-left">
                <Input v-model="dataObject.MaterialsAndEquipment" type="text" />
              </Col>
          </Row>
          <Row class="row">
              <Col span="24" class="col-left">其他</Col>
          </Row>
          <Row class="">
              <Col span="24" class="col-left">
                <Input v-model="dataObject.Remarks" type="textarea" :rows="4" />
              </Col>
          </Row>


          

        </div>
        <div slot="footer">
          <Button type="success" @click="doSubmit">保存</Button>
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
        listColumns:[
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
      listData:[],
      totalCount:0,
      currentPage:1,
      pageSize:10,
      keyWord:null,

      modal:false,

      dataObject:{
        
      },
      selectList:[],
      index: null,

    }
  },
  components: {

  },
  computed: {
    ...mapState('app', {
      account:'account',
      projectid: 'projectid'
    })
  },
  watch: {

  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData(){
      let that = this;

      that.$Loading.start()
      that.$axios.get('/api/Home/PilePosition?ProjectId='+(this.projectid?this.projectid:'')+'&PageIndex='+that.currentPage+'&PageSize='+that.pageSize).then(rs => {
            that.$Loading.finish()
            let result = rs.data
            if (result.success) {
              that.listData=result.data.list;
              that.totalCount=result.data.rowCount;

            } else {
              that.$Message.error(result.message)
            }
        })

    },
    search(value){
        if(value){
            console.log(value);
        }
        
    },
    edit(index){
      let that = this;
      
      that.$axios.post('/api/Home/Pile?UserId='+this.account.Id,{
          PageIndex:1,
          PageSize:999
      }).then(rs => {
            that.$Loading.finish()
            let result = rs.data
            if (result.success) {
              that.selectList=result.data.list;
            } else {
              that.selectList=[];
              that.$Message.error(result.message)
            }

            that.$axios.post('/api/Home/GetOnePilePosition?UserId='+this.account.Id,{
                Id:index         
            }).then(rs => {
                    let result = rs.data
                    if (result.success) {
                    that.dataObject=result.data;
                    this.modal=true;
                    } else {
                    that.$Message.error(result.message)
                    }
                })

        })

    },
    disable(index){
      this.index=index;


    },
    ok(){

    },
    cancel(){

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
                    this.modal=false;
                    that.loadData();
                    that.$Message.success(result.message)
                } else {
                    that.$Message.error(result.message)
                }
            })

    },
    closeModal(){
      this.modal=false;
    },
    handlePage(index){
      this.currentPage=index;
      this.loadData();
      
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

.col{
  height: 9vh;
  line-height: 9vh;
  img{
      height:100%;
  }
}
.row{
    height: 4.5vh;
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
