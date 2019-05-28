<template lang="html">
  <div>
    <h4 style="padding:10px;">权限分配</h4>
    <Divider />
    <Input search enter-button="搜索" placeholder="请输入搜索内容" v-model="keyWord" @on-search="search(keyWord)" />
    <Divider />
    <Row>
      <Col span="8">
        <Menu style="width:90%;" :active-name="activeMenu" @on-select="select">
          <template v-for="item in listData">
            <MenuItem :name="item.Id">{{item.DepartmentName}}</MenuItem>
          </template>
        </Menu>
      </Col>
      <Col span="16">
        <Row v-show="flag">
          <Tree ref="tree" :data="treeData" show-checkbox></Tree>
        </Row>
        <Row v-show="flag">
          <Button :disabled="loading" @click="doSubmit">保存</Button>
        </Row>        
      </Col>
    </Row>
  </div>
</template>

<script>
import config from '~/app.config.js'
import {
  mapState
} from 'vuex'
export default {
  layout: 'withLeftMenu',
  data() {
    return {
      loading:false,
      listColumns:[
        {
            title: '桩号',
            key: 'name1'
        },
        {
            title: 'X坐标',
            key: 'name2'
        },
        {
            title: 'Y坐标',
            key: 'name3'
        },
        {
            title: '计划开始时间',
            key: 'name4'
        },
        {
            title: '计划结束时间',
            key: 'name5'
        },

      ],
      listData:[
        
      ],
      totalCount:0,
      currentPage:1,
      pageSize:999,
      activeMenu:'',
      keyWord:'',
      treeData:[],
      flag:false,
      DepartmentId:0
    }
  },
  components: {

  },
  watch: {

  },
  computed: {
    ...mapState('app', {
      account: 'account'
    }),  
  },
  mounted() {
    this.loadlist();
    this.loadAllPermission();
    
  },
  methods: {
    loadlist(keyWord){
      let that = this;

      this.$axios.post('/api/Home/SelectDepartment', {
          DepartmentName:keyWord?keyWord:'',
          pageIndex:this.currentPage,
          pageSize:this.pageSize,
          CompanyId:this.account.CompanyId
      }).then(rs => {
          let result= rs.data
          if (result.success) {
            this.totalCount=result.data.RowCount;
            this.listData=result.data.list;
          } else {
              this.totalCount=0;
              this.listData=[];
          }
      })

      
      

    },
    search(keyWord){
      this.loadlist(keyWord);
    },
    select(name){
      this.activeMenu=name;
      this.DepartmentId=name;
      console.log(name);
      if(name){
        this.flag=true;
        this.loadPermission(name);
      }
    },
    loadAllPermission(){
      this.treeData = JSON.parse(JSON.stringify(this.$config.permissionTree));
    },
    loadPermission(DepartmentId){
      let that = this;
      this.$axios.post('/api/Home/DepartmentPermissionInfo', {
          DepartmentId:DepartmentId
      }).then(rs => {
        let result= rs.data
          if (result.success) {
            let templist = [];//仅包含权限id的数组
            let templist2 = [];//叶子节点对象数组
            if(result.data){
              if(result.data.length){
                result.data.map(function (item) {
                  templist.push(item.PermissionId);
                  if(item.IsLeaf){
                    templist2.push(item);
                  }
                })
              }else{
                this.treeData = JSON.parse(JSON.stringify(this.$config.permissionTree));
              }
            }
            if(templist.length){
              this.changObject(templist,templist2)
            }
          } else {
              
          }
      })
    },
    doSubmit(){
      let that = this;
      let Ids = this.$refs.tree.getCheckedAndIndeterminateNodes();
      // console.log(this.$refs.tree.getCheckedNodes(),'this.$refs.tree.getCheckedNodes()');
      // console.log(this.$refs.tree.getSelectedNodes(),'this.$refs.tree.getSelectedNodes()');
      
      Ids=this.getIds(Ids);

      this.loading=true;
      this.$axios.post(('/api/Home/DepartmentPermissionAdd?userId='+this.account.Id), {
          DepartmentId:this.DepartmentId,
          Permissions:Ids
      }).then(rs => {
        this.loading=false;
        let result= rs.data
          if (result.success) {
            this.$Message.success(result.message)
          } else {
            this.$Message.error(result.message)
          }
      })
      
    },
    getIds(ids){
      let result = [];
      
      ids.map(function (itemA) {
          if(itemA.root){
            let objectA = {};
            objectA.PermissionId=itemA.code;
            result.push(objectA);
            if(itemA.children){
              itemA.children.map(function (itemB) {
                let objectB = {};
                objectB.PermissionId = itemB.code;
                if(itemB.children){
                  itemB.children.map(function (itemC) {
                    switch(itemC.code){
                      case 1:
                        objectB.Opt_Add=true;
                        break;
                      case 2:
                        objectB.Opt_Remove=true;
                        break;
                      case 3:
                        objectB.Opt_Modify=true;
                        break;
                      case 4:
                        objectB.Opt_Select=true;
                        break;
                    }
                  })
                }
                result.push(objectB);
              })
            }
          }
      });




      //return result;
      return JSON.stringify(result);
    },
    changObject(listOwn,objectListOwn){
      let listAll=JSON.parse(JSON.stringify(this.$config.permissionTree));
      listAll.map(function (itemA) {
        if(listOwn.indexOf(itemA.code)!=-1){
          itemA.checked=true;
        }
        if(itemA.children){
          itemA.children.map(function (itemB,index) {
            if(listOwn.indexOf(itemB.code)!=-1){
              itemB.checked=true;
              itemB.children[0].checked=objectListOwn[index].Opt_Add?true:false;
              itemB.children[1].checked=objectListOwn[index].Opt_Remove?true:false;
              itemB.children[2].checked=objectListOwn[index].Opt_Modify?true:false;
              itemB.children[3].checked=objectListOwn[index].Opt_Select?true:false;
            }
          })
        }
      })
      
      this.treeData = JSON.parse(JSON.stringify(listAll));
    }



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
