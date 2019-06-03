<template>
    <div class="layout">
       <Layout>
                <Sider hide-trigger>
                    <!-- 左边LOGO、首页... -->
                    <topMenu></topMenu>
                </Sider>
                <Layout>
            
                    <Content :style="{padding: '30px 50px'}">
                        <Icon type="ios-flag" style= "font-size:28px"></Icon><br>
                        <h2 id="one">一级菜单</h2>
                        <Icon type="ios-arrow-forward"></Icon>
                        <h2 id="two">二级菜单</h2>
                     
                    </Content>
                    
                  

                       
                    
                    <Content :style="{padding: '30px 50px'}">

                        <!-- <Button type="primary" id="add">添加</Button>
                         <Tabs :animated="false">
                            
                            <Tab-pane label="标签一" class="a13">
                                 
                                <Card>
                                    <div style="min-height: 200px;">
                                        <nuxt/>
                                    </div>
                                </Card>
                            </Tab-pane>
                            <Tab-pane label="标签二" class="a13">标签二的内容</Tab-pane>
                            <Tab-pane label="标签三" class="a13">标签三的内容</Tab-pane>
                        </Tabs> -->

                        <!-- <Menu mode="horizontal" active-name="1">
                            <MenuItem name="1">
                                <Icon type="ios-paper" />
                                部门管理
                            </MenuItem>
                            <MenuItem name="/system/editperson">
                                <Icon type="ios-people" />
                                人员管理
                            </MenuItem>
                            <MenuItem name="3">
                                <Icon type="ios-construct" />
                                权限分配
                            </MenuItem>
                            <div style="text-align:right;margin-right:10px;">
                                <Button type="primary" >添加</Button>
                            </div>
                            
                        </Menu> -->
                       
                        <div style="background-color:red"> 
                            <div style="width:49%;float:left;">
                                <nuxt-link to="/system/departmentManagement2"><h3 id="a">部门管理</h3></nuxt-link>&nbsp;&nbsp;&nbsp;
                                <nuxt-link to="/system/personManagement"><h3 id="b">人员管理</h3></nuxt-link>&nbsp;&nbsp;&nbsp;
                                <nuxt-link to="/"><h3 id="c">权限分配</h3></nuxt-link>
                            </div>
                            <div style="text-align:right;float:left;width:49.9%;margin-top:-11px" > 
                                <Button type="primary" id="add">添加</Button>
                            </div>
                        </div> 

                        <br>
                        <br>
                        <hr>
                        <br>
                        <Card>
                            <div style="min-height: 200px;">
                                <nuxt/>
                            </div>
                        </Card>
                       
                    </Content>

                    <Footer></Footer>

                </Layout>
       </Layout>

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
    }
  },
 
  mounted(){

  },
  methods: {
    select(path){
        this.$router.push({path: path});
    },
    
  },
  watch:{

  }
}
</script>

<style lang="scss" scoped>
@import "~assets/themes/default/colors.scss";
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}

.layout-banner{
    width:100%;
    height:18vh;
    display:block;
    background: url("~static/images/banner.png") no-repeat center ;
    background-size: cover;
}
#one,#two{
    display: inline-block;
}
#a,#b,#c{
    display: inline-block;
}

.a13{
    display:inline-block;
}


</style>
