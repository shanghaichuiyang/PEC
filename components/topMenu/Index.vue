<template lang="html">
  <Menu mode="horizontal" theme="light" :active-name="activeName"  @on-select="handleSelect">
      <div class="layout-logo">LOGO</div>
      <div class="layout-nav">
          <MenuItem name="/">
              首页
          </MenuItem>
          <MenuItem name="/projectmanagement/list/projectlist">
              项目列表
          </MenuItem>
          <MenuItem v-show="IsManage==1" name="/user/userlist">
              平台用户信息
          </MenuItem>
          <MenuItem v-show="IsManage!=2" name="/system/companyManagement">
              单位管理
          </MenuItem>
          <MenuItem name="/target/projecttarget">
              项目指标
          </MenuItem>
          <MenuItem name="/target/targetunit">
              指标单位
          </MenuItem>

      </div>
      <div style="width:20%;position: absolute;right:0;padding-left:2%;">
          <div>
              <div style="float:left;">
                <Poptip trigger="hover" placement="bottom">
                    <div style="width:100%;">
                        <Avatar v-if="this.account.Face" size="large" :src="picUrl+this.account.Face" />
                        <Avatar v-else icon="ios-person" size="large"/>
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
              <div style="float:left;padding-left:5%;">
                  <div style="height:25px;line-height:25px;padding-top:10px;">{{this.account.UserName}}</div>
                  <div style="height:25px;line-height:25px;padding-top:5px;">{{identity}}</div>
              </div>  
          </div>
             
      </div>
  </Menu>



</template>
<script>
import config from '~/app.config.js'
import {
  mapState
} from 'vuex'
export default {
  data() {
    return {
      activeName: '',
      openNames:['1','2','3','4'],
      menuList:[],
      identity:'',
      IsManage:2,
      picUrl:null,

    }
  },
  created() {
      
      
  },
  computed: {
    ...mapState('app', {
      account: 'account'
    }),  
  },
  mounted(){
      this.picUrl = config.apihost+'/'
      
      this.init();
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
    width: 100px;
    height: 30px;
    background: white;
    color:$lightblue;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
    display:flex;
    align-items: center;
    font-size:20px;
    font-weight: bold;
}
.layout-nav{
    float: right;
    margin:0 auto;
    margin-right:20%;

}
</style>
