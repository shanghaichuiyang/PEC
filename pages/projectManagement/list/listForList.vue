<template lang="html">
  <section class="listforlist">
    <div class="searchBox"><Input search enter-button="搜索" placeholder="请输入项目名称"  @on-search="search(keyWord)" /></div>
    <div :style="listStyle">
        <div v-if="!hasData" class="nodata">暂无数据</div>
        <Card style="width:100%;margin-top:20px;" v-for="item in projectList">
            <div style="text-align:center">
                <Row>
                    <Col span="3" class-name="col">
                        <img src="~/static/images/pic.png"/>
                    </Col>
                    <Col span="3" type="flex" align="middle">
                        <Row class-name="row">项目名称: <span>{{item.ProjectName}}</span></Row>
                        <Row class-name="row">业主名称: <span>{{item.OwnerName}}</span></Row>
                    </Col>
                    <Col span="3" type="flex" align="middle">
                        <Row class-name="row">项目经理: <span>{{item.ProjectManager}}</span></Row>
                        <Row class-name="row">施工单位: <span>{{item.ConstructionUnitName}}</span></Row>
                    </Col>
                    <Col span="7" type="flex" align="middle">
                        <Row class-name="row">设计单位: <span>{{item.DesignUnitName}}</span></Row>
                        <Row class-name="row">监理单位: <span>{{item.SupervisorUnitName}}</span></Row>
                    </Col>
                    <Col span="3" type="flex" align="middle">
                        <Row class-name="row">经度区域: <span>W12-W13</span></Row>
                        <Row class-name="row">纬度区域: <span>E100-E120</span></Row>
                    </Col>
                    <Col span="3" type="flex" align="middle">
                        <Row class-name="row">项目状态: <span class="statSpan">{{item.Stats==1?"未开工":item.Stats==2?"施工中":item.Stats==3?"已完成":item.Stats==4?"滞后":"提前完成"}}</span></Row>
                        <Row class-name="row">项目进度: <span class="procSpan">{{item.Percent?item.Percent.toFixed(2)*100:0}}%</span></Row>
                    </Col>
                    <Col span="2" type="flex" align="middle">
                        <Row class-name="row"><Button type="info" :ProjectID="item.ProjectID" @click="handleClick($event)">详情</Button></Row>
                        <Row class-name="row"><Button type="error" :ProjectID="item.ProjectID" @click="handleEdit($event)">修改</Button></Row>
                    </Col>


                </Row>
            </div>
        </Card>
        <div class="pageBox" v-show="hasData"><Page :total="totalCount" size="small" /></div>
        
    </div>
  </section>
</template>

<script>

import {
  mapState
} from 'vuex'
export default {

  data() {
    return {
        listStyle:{
            width:'100%',
            height:'calc(100% - 32px)',
            
        },
        projectList:[],
        hasData:false,
        totalCount:0,
        currentPage:1,
        isload: false,
        pageIndex:1,
        pageSize:10,

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
      this.loadlist();
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
      loadlist(){
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
                this.projectList=result.data.list;
                that.hasData=true;
            } else {
                this.projectList=[];
                that.hasData=false;
                this.$Message.error(result.message)
            }
        })

      },
      handleClick(e) {
        let id = e.currentTarget.getAttribute("ProjectID")
        
        this.$router.push({path: '/projectmanagement/project/home', query: {'ProjectID': id}})
      },
      handleEdit(e) {
        let id = e.currentTarget.getAttribute("ProjectID")
        
        this.$router.push({path: '/projectmanagement/list/projectEdit', query: {'ProjectID': id}})
      },
      search(keyword){
        this.loadlist(keyword);
      },
     
    
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.listforlist{
    width:100%;
    height:$map-for-list-height;

    .searchBox{
        padding-bottom:0;
    }

    .nodata{
        text-align:center;
        height:30;
        line-height:30px;
        font-size:24px;
        padding-top: 20px;
    }
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
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
    }
    span{
        padding: 5px;
        margin-left:5px;
        border-radius: 5px;
    }
    .statSpan{
        background:lightblue;
    }
    .procSpan{
        background:khaki;
    }
    .pageBox{
        margin-top:20px;
    }

}
</style>
