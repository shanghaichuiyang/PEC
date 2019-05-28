<template lang="html">
  <div>
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
          <div id="leftCharts" class="charts">
            
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
            <Col span="5" class-name="col">
              <span>姓名</span>
            </Col>
            <Col span="19" class-name="col">
              <span>{{this.account.UserName}}</span>
            </Col>
          </Row>
          <Row v-if="this.account.IsManage!=1" class-name="row" style="margin-top:20px;border-bottom: 1px solid #eee;">
            <Col span="5" class-name="col">
              <span>所属部门</span>
            </Col>
            <Col span="19" class-name="col">
              <span>技术部</span>
            </Col>
          </Row>
          <Row v-if="this.account.IsManage!=1" class-name="row" style="margin-top:20px;border-bottom: 1px solid #eee;">
            <Col span="5" class-name="col">
              <span>公司名称</span>
            </Col>
            <Col span="19" class-name="col">
              <span>上海垂杨信息科技有限公司</span>
            </Col>
          </Row>
          <Row class-name="row" style="margin-top:20px;border-bottom: 1px solid #eee;">
            <Col span="5" class-name="col">
              <span>联系电话</span>
            </Col>
            <Col span="19" class-name="col">
              <span>{{this.account.Phone}}</span>
            </Col>
          </Row>
          <Row class-name="row" style="margin-top:20px;border-bottom: 1px solid #eee;">
            <Col span="5" class-name="col">
              <span>可见项目数</span>
            </Col>
            <Col span="19" class-name="col">
              <span>{{projectList.length}}</span>
            </Col>
          </Row>
          <Row class-name="row" style="margin-top:20px;border-bottom: 1px solid #eee;">
            <Col span="5" class-name="col">
              <span>加入时间</span>
            </Col>
            <Col span="19" class-name="col">
              <span>{{this.account.CreateTime}}</span>
            </Col>
          </Row>
          <Row class-name="row" style="margin-top:20px;border-bottom: 1px solid #eee;">
            <Col span="5" class-name="col">
              <span>账号状态</span>
            </Col>
            <Col span="19" class-name="col">
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
      account: 'account'
    }),
    // identity(){
    //     let result='';
    //     switch(this.account.IsManage){
    //         case 1:
    //             result='平台管理员';
    //             break;
    //         case 3:
    //             result='公司管理员';
    //             break;
    //         other:
    //             result='普通用户';
    //             break;
    //     }        
    //     return result;
    // }    
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
        } else {
          //this.$Message.error(result.message)
        }
      })
    },
    loadLeftCharts(data) {
      console.log(data);
      let leftCharts = echarts.init(document.getElementById('leftCharts'))
      let xData = [];
      let yData = [];
      if(data){
        data.forEach(val => {
          console.log(val,'val');
          xData.push(val.ProjectName);
          yData.push(val.Percent?val.Percent.toFixed(2)*100:0);

        })
      }
      console.log(yData)

      leftCharts.setOption({
        color: ['#3398DB'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            //formatter:'{c}%'
            formatter: '{b}<br />{a}: {c}%'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : xData,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel: {  
                  show: true,  
                  interval: 'auto',  
                  formatter: '{value} %'  
                },
                max:100
            }
        ],
        series : [
            {
                name:'项目进度',
                type:'bar',
                barWidth: '8%',
                data:yData,
                
            }
        ]
      })
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

</style>
