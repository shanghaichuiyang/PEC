<template lang="html">
  <div>
    <div class="top-right-button">
      <Button type="primary" @click="handleAddClick($event)">添加</Button>
    </div>
    <Tabs value="list" @on-click="tabcontrol">
      <TabPane label="列表模式" name="list">
        <myList ref="list"></myList>
      </TabPane>
      <TabPane label="地图模式" name="map">
        <myMap ref="map"></myMap>
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

    }
  },
  components: {
    myMap,
    myList
  },
  watch: {

  },
  mounted() {
    this.$refs.list.load();
  },
  methods: {
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
