<template lang="html">
  <div>
    <Card>
      <h4 style="padding:10px;">进度汇总</h4>
      <Divider />
      <DatePicker v-model="dateTop" ref="datetop" type="date" @on-change="change"></DatePicker>
      <Row style="padding-top:10px;">
        <Col span="6" style="padding-right:1%;">
          <Card>
            <Row>桩数完成度</Row>
            <Row class="cardrow"><Progress :percent="objectData.FinishInfo.Percent?objectData.FinishInfo.Percent:0" :stroke-width="15"/></Row>
          </Card>
        </Col>
        <Col span="6" style="padding-right:1%;">
          <Card>
            <Row>工作总量</Row>
            <Row class="cardrow"><span>{{objectData.totalDays?objectData.totalDays:0}}</span>天</Row>
          </Card>
        </Col>
        <Col span="6" style="padding-right:1%;">
          <Card>
            <Row>项目消耗费用¥</Row>
            <Row class="cardrow">¥<span>{{objectData.TotalCost?objectData.TotalCost:0}}</span></Row>
          </Card>
        </Col>
        <Col span="6" style="padding-right:1%;">
          <Card>
            <Row>桩机使用天数</Row>
            <Row class="cardrow"><span>{{objectData.pileUseDays?objectData.pileUseDays:0}}</span>天</Row>
          </Card>
        </Col>
      </Row>
      <Row style="padding-top:10px;">
        <Col span="16" style="padding-right:1%;">
          <Card>
            <h4 style="float:left;padding:10px;width:80%;">消耗对比图</h4>
            <h4 style="float:left;padding:10px;width:10%;text-align:right;">
              <i-Switch size="large" v-model="weekOrMonth" @on-change="showCharts">
                <span slot="open">按月</span>
                <span slot="close">按周</span>
              </i-Switch>
            </h4>
            
            <Divider />
            <div id="leftCharts" class="charts">

            </div>
          </Card>
        </Col>
        <Col span="8" style="padding-right:1%;">
          <Card>
            <h4 style="padding:10px;">总体进度统计</h4>
            <Divider />
            <div id="rightCharts" class="charts">

            </div>
          </Card>
        </Col>

      </Row>

    </Card>
  </div>
</template>

<script>
import echarts from 'echarts'
import {
  mapState
} from 'vuex'
export default {
  layout: 'withLeftMenu',
  data() {
    return {
      dateTop: new Date(),

      dataTop1: 0,
      dataTop2: 0,
      dataTop3: 0,
      dataTop4: 0,

      leftChartsData: null,
      rightChartsData: null,

      objectData:{
        FinishInfo: {
            FinishCount: 0,
            TotalCount: 0,
            UnStartCount: 0,
            WorkingCount: 0,
            Percent: 0
        },
        TotalCost: 0,
        totalDays: 0,
        pileCount: 0,
        pileUseDays: 0
      },

      weekOrMonth:true,

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
    this.loadData();
    
    
  },
  methods: {
    loadData(date){
      let that = this;

      that.$axios.post('/api/Home/StatisticsFinishCostWorkValue', {
          ProjectId:this.projectid?this.projectid:'',
          time:date?date:this.dateTop,
      }).then(rs => {
          if (rs.data.success) {
            this.objectData = rs.data.data;
            
          } else {
            
          }
      })

      that.loadLeftCharts(that.weekOrMonth);
      that.loadRightCharts();
    },
    loadLeftCharts(status) {
      let xData=[];
      let yData=[];
      if(status){
        this.$axios.post('/api/Home/ProjectCost', {
            ProjectId:this.projectid?this.projectid:'',
            Type:1,
        }).then(rs => {
            if (rs.data.success) {
              rs.data.data.map(function (item) {
                xData.push(item.Month);
                yData.push(item.TotalCost);
              });
            }
            this.setLeftChartsOption(xData,yData);
        })
        
      }else{
        this.$axios.post('/api/Home/ProjectCost', {
            ProjectId:this.projectid?this.projectid:'',
            Type:0,
        }).then(rs => {
            if (rs.data.success) {
              rs.data.data.map(function (item) {
                xData.push(item.Weeks);
                yData.push(item.TotalCost);
              });
            }
            this.setLeftChartsOption(xData,yData);
        })
        
      }
      
    },
    setLeftChartsOption(xData,yData){
      let leftCharts = echarts.init(document.getElementById('leftCharts'))
      leftCharts.setOption({
            tooltip: {},
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: yData,
                type: 'bar',
                color:'#2d8cf0'
            }]
        })
    },
    loadRightCharts() {
      let rightCharts = echarts.init(document.getElementById('rightCharts'))
      rightCharts.setOption({
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
              orient: 'vertical',
              x: 'left',
              data:['已完成','进行中','未完成']
          },
          series: [
              {
                  name:'访问来源',
                  type:'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      normal: {
                          show: false,
                          position: 'center'
                      },
                      emphasis: {
                          show: true,
                          textStyle: {
                              fontSize: '30',
                              fontWeight: 'bold'
                          }
                      }
                  },
                  labelLine: {
                      normal: {
                          show: false
                      }
                  },
                  data:[
                      {value:this.objectData.FinishInfo.FinishCount, name:'已完成'},
                      {value:this.objectData.FinishInfo.WorkingCount, name:'进行中'},
                      {value:this.objectData.FinishInfo.UnStartCount, name:'未完成'}
                  ]
              }
          ],
          color:['#2d8cf0','#555','#aaaaaa']
      })
    },
    change(a,b){
      this.loadData(a.toString());
    },
    showCharts(status){
      this.loadLeftCharts(status);
    }

  },
  
}
</script>

<style lang="scss" scoped>

.cardrow{

  padding-top: 10px;
  font-size: 18px;
  font-weight: bold;
}
.charts{
  min-height:555px;
}

</style>
