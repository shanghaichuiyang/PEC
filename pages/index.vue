<template lang="html">
  <div>
      <div class="layout-banner">
      </div>
    <Row>
      <Col span="16" style="padding-right:1%;">
        <span style="font-weight:bold;">参与项目</span>
        <Divider />
      </Col>
      <Col span="8">
        <span style="font-weight:bold;">个人信息</span>
        <Divider />
      </Col>
    </Row>
    <Row>
      <Col span="16" style="padding-right:1%;">
        <Card>
          <h4 style="padding:10px;">项目进度</h4>
          <Divider />
          <div v-if="projectList.length==0"><span style="padding:10px;">暂无数据</span></div>
          <div id="myapp" class="charts">
            
          </div>
          <Divider />
          <div style="width:100%;margin-top:20px;" v-for="item in projectList">
              <div style="text-align:center">
                  <Row>
                      <Col span="5" class-name="col">
                          <img src="~/static/images/pic.png"/>
                      </Col>
                      <Col span="4" type="flex" align="middle">
                          <Row class-name="row">项目名称: <span>{{item.ProjectName}}</span></Row>
                          <Row class-name="row">业主名称: <span>{{item.OwnerName}}</span></Row>
                          <Row class-name="row">项目经理: <span>{{item.ProjectManager}}</span></Row>
                      </Col>
                      <Col span="10" type="flex" align="middle">
                          <Row class-name="row">施工单位: <span>{{item.ConstructionUnitName}}</span></Row>
                          <Row class-name="row">设计单位: <span>{{item.DesignUnitName}}</span></Row>
                          <Row class-name="row">监理单位: <span>{{item.SupervisorUnitName}}</span></Row>
                      </Col>
                      <Col span="3" type="flex" align="middle">
                          <Row class-name="row">项目状态: <span class="statSpan">{{item.Stats==1?"未开工":item.Stats==2?"施工中":item.Stats==3?"已完成":item.Stats==4?"滞后":"提前完成"}}</span></Row>
                          <Row class-name="row">项目进度: <span class="procSpan">{{item.Percent?item.Percent.toFixed(2)*100:0}}%</span></Row>
                      </Col>
                      <Col span="2" type="flex" align="middle">
                          <Row class-name="row"><Button icon="ios-alert-outline" :ProjectID="item.ProjectID" @click="handleClick($event)">详情</Button></Row>
                          <!-- <Row class-name="row"><Button type="error">修改</Button></Row> -->
                      </Col>
                  </Row>
              </div>
          </div>
        </Card>
      </Col>
      <Col span="8">
        <Card style="padding:10px;">
          <Row class-name="row" style="margin-top:20px;border-bottom: 1px solid #eee;">
            <Col span="7" class-name="col">
              <span>姓名</span>
            </Col>
            <Col span="17" class-name="col">
              <span>{{this.userInfo.Contact}}</span>
            </Col>
          </Row>
          <Row v-if="this.account.IsManage!=1" class-name="row" style="margin-top:20px;border-bottom: 1px solid #eee;">
            <Col span="7" class-name="col">
              <span>所属部门</span>
            </Col>
            <Col span="17" class-name="col">
              <span>{{this.userInfo.DepartmentName}}</span>
            </Col>
          </Row>
          <Row v-if="this.account.IsManage!=1" class-name="row" style="margin-top:20px;border-bottom: 1px solid #eee;">
            <Col span="7" class-name="col">
              <span>公司名称</span>
            </Col>
            <Col span="17" class-name="col">
              <span>{{this.account.Company}}</span>
            </Col>
          </Row>
          <Row class-name="row" style="margin-top:20px;border-bottom: 1px solid #eee;">
            <Col span="7" class-name="col">
              <span>联系电话</span>
            </Col>
            <Col span="17" class-name="col">
              <span>{{this.account.PhoneNumber}}</span>
            </Col>
          </Row>
          <Row class-name="row" style="margin-top:20px;border-bottom: 1px solid #eee;">
            <Col span="7" class-name="col">
              <span>可见项目数</span>
            </Col>
            <Col span="17" class-name="col">
              <span>{{projectList.length}}</span>
            </Col>
          </Row>
          <Row class-name="row" style="margin-top:20px;border-bottom: 1px solid #eee;">
            <Col span="7" class-name="col">
              <span>加入时间</span>
            </Col>
            <Col span="17" class-name="col">
              <span>{{this.account.StartTime}}</span>
            </Col>
          </Row>
          <Row class-name="row" style="margin-top:20px;border-bottom: 1px solid #eee;">
            <Col span="7" class-name="col">
              <span>账号状态</span>
            </Col>
            <Col span="17" class-name="col">
              <span>激活</span>
            </Col>
          </Row>
          
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import echarts from 'echarts'
import {
  mapState
} from 'vuex'
export default {
  layout: 'withTopMenu',
  data() {
    return {

      projectList:[],
      pageIndex:1,
      pageSize:10,
      total:0,

      IsManage:2,
    }
  },
  components: {

  },
  computed: {
    ...mapState('app', {
      account: 'account',
      userInfo: 'userInfo'
    }),
      
  },
  watch: {

  },
  mounted() {

    this.loadProjectList();


    
  },
  methods: {
      loadProjectList(){
  
      this.$axios.post('/api/Home/GetUserParticipationProject', {
        
        UserID:this.account.Id,
        pageIndex:this.pageIndex,
        pageSize:this.pageSize,
      }).then(rs => {
        let result = rs.data
        if (result.success) {
          this.projectList=result.data.list;
          this.loadLeftCharts(result.data.list);
          this.domLine()
        } else {
          //this.$Message.error(result.message)
        }
      })
    },
    loadLeftCharts(data) {
      // console.log(data);
   
      let xData = [];
      let yData = [];
      if(data){
        data.forEach(val => {
          // console.log(val,'val');
          xData.push(val.ProjectName);
          yData.push(val.Percent?val.Percent.toFixed(2)*100:0);

        })
      }
      // console.log(yData)
      
    },
    domLine() {
   
      var dom = document.getElementById("myapp");
      
      var myChart = echarts.init(dom);

      var app = {};
      let ptList = this.projectList;

      let ptName = [];
      let ptNum= [];

      for(var i =0;i<ptList.length;i++){
        
        ptName.push(ptList[i].ProjectName)
        
        ptNum.push(ptList[i].Percent !=null ? (ptList[i].Percent.toFixed(2))*100 :0)
           
      }
      // console.log(ptName)
      app.title = "项目进度";

      var option = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow" 
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ptName,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel:{
               show: true,
               interval: 'auto',
               formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: "完成度",
            type: "bar",
            barWidth: "30%",
            data: ptNum
          }
        ]
      };
      myChart.setOption(option, true);
    },
    handleClick(e) {
        let id = e.currentTarget.getAttribute("ProjectID")
        
        this.$router.push({path: '/projectmanagement/project/home', query: {'ProjectID': id}})
    },
  },
  
}
</script>

<style lang="scss" scoped>



.charts{
  min-height:555px;
}
.col{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    img{
        height:100%;
    }
}
.row{
    height: 4.5vh;
    line-height: 4.5vh;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    
}
.layout-banner{
    width:100%;
    height:18vh;
    display:block;
    background: url("~static/images/banner.png") no-repeat center ;
    background-size: cover;
}

</style>
