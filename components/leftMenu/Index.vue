<template lang="html">
  <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
      <div class="layout-logo">LOGO</div>
      <Menu :active-name="activeName" @on-select="handleSelect" :open-names="openNames" theme="light" width="auto" style="margin-bottom:80px;">
          <template v-for="item in menuList">
            <Submenu :name="item.name">
                <template slot="title">
                    <span><Icon :type="item.icon" />{{item.content}}</span>
                </template>
                <template v-for="child in item.children">
                    <MenuItem :name="child.name">
                        <span>{{child.content}}</span>
                    </MenuItem>
                </template>
            </Submenu>
          </template>

      </Menu>
      <div style="width:180px;height:80px;display:flex;align-items:center;padding-left:20px;position:fixed;bottom:0;z-index:900;background:#fff;">
          <div>
              <div style="float:left;">
                <Poptip trigger="hover" placement="top">
                    <div style="width:100%;margin-top:10px;">
                        <Avatar v-if="this.account.Face" size="large" :src="picUrl+this.account.Face" />
                        <Avatar v-else icon="ios-person" size="large"/>
                    </div>
                    <div class="api" slot="content">
                        <div style="height:30px;line-height:30px;">
                            <router-link class="" to="/"><span>返回首页</span></router-link>
                        </div>
                        <!-- <div style="height:30px;line-height:30px;">
                            <router-link class="" to="/account/editaccount"><span>修改个人信息</span></router-link>
                        </div> -->
                        <div style="height:30px;line-height:30px;">
                            <router-link class="" to="/account/editpsd"><span>修改密码</span></router-link>
                        </div>
                        <div style="height:30px;line-height:30px;" @click="logout">
                            <span style="cursor:pointer;">退出登录</span>
                        </div>
                    </div>
                </Poptip> 
              </div>
              <div style="float:left;">
                  <div style="height:25px;line-height:25px;padding-top:10px;">{{this.account.UserName}}</div>
                  <div style="height:25px;line-height:25px;padding-top:5px;">{{identity}}</div>
              </div>  
          </div>
             
      </div>
      
  </Sider>



</template>
<script>
import {
  mapState
} from 'vuex'
import config from '~/app.config.js'

export default {
  data() {
    return {
      activeName: '',
      openNames:['1','2','3','4','5','6'],
      menuList:[],
      identity:'',
      IsManage:2,

    }
  },
  computed: {
    ...mapState('app', {
      account: 'account'
    }),  
  },
  created() {
     this.picUrl = config.apihost+'/'

      this.init();
  },
  methods: {
    init() {
      // 深拷贝模块
      let menuList = JSON.parse(JSON.stringify(this.$config.leftmenu));

      this.IsManage=this.account.IsManage;
      let tempmenuList=[];
      for (let menu of menuList) {
          if(menu.show){
              tempmenuList.push(menu);
          }else{
              if(this.account.IsManage!=2){
                  tempmenuList.push(menu);
              }
          }
      }

      this.menuList = tempmenuList;


      let path = this.$route.path;
      this.activeName = path;
      //this.activeName = menuList[0].children[0].name;
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
    height: 10vh;
    line-height: 10vh;
    background: white;
    color:$lightblue;
    border-radius: 3px;
    //float: left;
    position: relative;
    // top: 15px;
    // left: 20px;
    display:flex;
    align-items: center;
    justify-content: center;
    font-size:30px;
    font-weight: bold;
}
</style>
