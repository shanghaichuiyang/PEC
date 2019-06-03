<template lang="html">
  <div>
    <div class="top-right-button">
        <!-- <div>value {{this.$route.query.value}} </div> -->
      <Button type="primary" @click="handleAddClick($event)">添加</Button>
    </div>
    <Tabs  :value="actName"  @on-click="tabcontrol">
      <TabPane label="地图模式" name="map">
        <myMap ref="map"></myMap>
      </TabPane>
      <TabPane label="列表模式" name="list">
        <myList ref="list"></myList>
      </TabPane>

    </Tabs>
  </div>
</template>

<script>
import myMap from './mapForList.vue'
import myList from './listForList.vue'

export default {
  layout: 'withTopMenu',
  data() {
    return {
      isload: false,
      actName:''
    }
  },
  components: {
    myMap,
    myList
  },
  watch: {
     isload() {
      this.loadlist();
    },
    $route(to,from){
      console.log('to',to)
      console.log('from',from)
     
      this.actName = to.query.value;
    }
  },
  mounted() {
    this.$refs.map.load();  

  },
  methods: {
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

    handleAddClick(e) {
      console.log(e,'e');
      //let projectID = e.currentTarget.getAttribute("projectID");
      //this.$router.push({path: '/projectManagement/list/projectEdit', query: {pid: projectID}});
       this.$router.push({path: '/projectManagement/list/projectAdd'});
    },
    tabcontrol (name) {
      if(name=='list'){
        this.$refs.list.load();
      }else{
        this.$refs.map.load();
      }
      
    }
  },
  
}
</script>

<style lang="scss" scoped>
.top-right-button{
  width:auto;
  position:absolute;
  right:16px;
  top:16px;
  z-index:1;
}
</style>
