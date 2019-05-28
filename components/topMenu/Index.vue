<template lang="html">
     <div>
        <div class="userInfo">
              <div>
        
                <Poptip trigger="hover" placement="bottom">
                    <div style="width:100%;">
                        <Avatar v-if="this.account.Face" size="large" :src="picUrl+this.account.Face" />
                        <Avatar v-else icon="ios-person" size="large"/>
                        <span>{{username}}</span>
                    </div>

                    <div class="api" slot="content">
                        <div style="height:30px;line-height:30px;">
                            <router-link class="" to="/account/editaccount"><span>修改个人信息</span></router-link>
                        </div>
                        <div style="height:30px;line-height:30px;">
                            <router-link class="" to="/account/editpsd"><span>修改密码</span></router-link>
                        </div>
                        <div style="height:30px;line-height:30px;" @click="logout">
                            <span style="cursor:pointer;">退出登录</span>
                        </div>
                    </div>
                </Poptip> 
              </div>
              <div>
                  <div style="height:25px;line-height:25px;padding-top:10px;">{{this.account.UserName}}</div>
                  <div style="height:25px;line-height:25px;padding-top:5px;">{{identity}}</div>
              </div>  
          </div>


              <Menu   :active-name="activeName"  @on-select="handleSelect">

        <div class="layout-logo">LOGO</div>
             <MenuItem name="/">
               <Icon type="ios-paper" />
              首页
             </MenuItem>

             

             <Submenu name='projectlist'>
                 
                 <template slot="title">
                  <Icon type="ios-people" />
                    项目列表
                 </template>
                 <MenuItem name="/projectmanagement/list/projectlist">列表模式</MenuItem>   
                 <MenuItem name="/projectmanagement/list/projectlist">地图模式</MenuItem> 
             </Submenu>  

             <Submenu name="system">
                   <template slot="title">
                   <Icon type="ios-stats" /> 
                      系统管理
                   </template>
                   <MenuItem name="/system/editdepartment">部门管理</MenuItem>   
                   <MenuItem name="/system/editperson">人员管理</MenuItem>
                   <MenuItem name="/system/permissionManagement">权限管理</MenuItem>    
                    
             </Submenu> 
             

       
             
    

       </Menu>
     
     
     
     </div>
    
    





</template>
<script>
import config from '~/app.config.js'
import {
  mapState
} from 'vuex'
export default {
  data() {
    return {
      username: '',
      activeName: '',
      openNames:['1','2','3','4'],
      menuList:[],
      identity:'',
      IsManage:2,
      picUrl:null,
      

    }
  },
  created() {
    this.getCustomerList();

      
  },
  computed: {
    ...mapState('app', {
      account: 'account'
    }),  
  },
  mounted(){
      this.picUrl = config.apihost+'/'
      
      this.init();
          
      this.getCustomerList()
      
  },
  methods: {
    init() { 
    
      switch(this.account.IsManage){
          case 1:
              this.identity='平台管理员';
              break;
          case 3:
              this.identity='公司管理员';
              break;
          other:
              this.identity='普通用户';
              break;
      }
      this.IsManage=this.account.IsManage;

      let path = this.$route.path;

      this.activeName = path;
    },
   
    getCustomerList(){
 
        this.$axios.post('api/Platform/GetCustomerList',{
             Id: this.account.Id,
             pageIndex: 1,
             pageSize: 10,
             CompanyID:  this.account.CompanyID
        }).then(rs => {
        let result = rs.data
     
        if (result.success) {
         
            this.username = result.data.list[0].DepartmentName;
        } else {
          this.$Message.error(result.message)
        }
      })
        
    },
    handleSelect(path){
        this.$router.push({path: path});
    },
    // 退出登录
    logout() {
      this.$store.commit('app/logout')
      this.$router.push('/account/login')
    },
  },watch:{

  }
}
</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";

.layout-logo{
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: white;
    color:$lightblue;
    border-radius: 3px;
    text-align: center;
    align-items: center;
    font-size:30px;
    font-weight: bold;

}
.ivu-menu-vertical{
    width:200px !important;
}
.userInfo{
    height:70px;
    width:200px;
    line-height: 70px;
    border:1px solid #f2f2f2;
    position: fixed;
    bottom: 10px;
}

</style>