<template lang="html">
  <div>
    <h4 style="padding:10px;">基本信息</h4>
    <Divider />
    <Row class-name="row">
        <Col span="24">项目名称:<span>{{dataObject.ProjectName}}</span></Col>
    </Row>
    <Row class-name="row">
        <Col span="6">业主:<span>{{dataObject.OwnerName}}</span></Col>
        <Col span="6">项目经理:<span>{{dataObject.ProjectManager}}</span></Col>
        <Col span="6">施工单位:<span>{{dataObject.ConstructionUnitName}}</span></Col>
        <Col span="6">设计单位:<span>{{dataObject.DesignUnitName}}</span></Col>
    </Row>
    <Row class-name="row">
        <Col span="6">进度:<span>{{dataObject.Percent?dataObject.Percent:0}}%</span></Col>
        <Col span="6">项目状态:<span>{{dataObject.ProjectName}}</span></Col>
        <Col span="6">监理单位:<span>{{dataObject.SupervisorUnitName}}</span></Col>
    </Row>
    <Divider />
    <Table :columns="listColumns" :data="listData"></Table>
    <div class="pageBox"><Page :total="totalCount" size="small" @on-change="handlePage" /></div>
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
            title: 'X坐标',
            key: 'XAxis'
        },
        {
            title: 'Y坐标',
            key: 'YAxis'
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

      ],
      listData:[
        
      ],
      totalCount:0,
      currentPage:1,
      pageSize:10,
      dataObject:{}


    }
  },
  components: {

  },
  watch: {

  },
  computed: {
    ...mapState('app', {
      projectid: 'projectid'
    })
  },
  mounted() {
    this.loadlist();
  },
  methods: {
    loadlist(){

      let that = this;

      console.log(that.projectid)
      that.$Loading.start()
      that.$axios.post('api/Home/GetProjectInfo', {
          ProjectID:that.projectid,
      }).then(rs => {
          if (rs.data.success) {
            that.dataObject = rs.data.data[0];
          } else {
            that.$Message.error(rs.data.message)
          }
          that.$axios.get('/api/Home/PilePosition?ProjectId='+(this.projectid?this.projectid:'')+'&PageIndex='+that.currentPage+'&PageSize='+that.pageSize).then(rs => {
              that.$Loading.finish()
              let result = rs.data
              if (result.success) {
                that.listData=result.data.list;
                that.totalCount=result.data.rowCount;
              } else {
                that.listData=[];
                that.totalCount=0;
                that.$Message.error(result.message)
              }
          })

      })



    },
    handlePage(index){
      this.currentPage=index;
      this.loadlist();
      
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
.row{
  padding: 10px 0 ;
  font-weight: bold;
  span{
    font-weight: normal;
    margin-left:5px;
  }
}
.pageBox{
  margin-top:20px;
  text-align: right;
}

</style>
