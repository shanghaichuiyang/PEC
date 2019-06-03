<template>
    <div class="layout">
       <Layout>
                <Sider hide-trigger>
                    <topMenu></topMenu>
                </Sider>
                <Layout>
            
                    <Content>
                        <div>
             
                        </div>
                      
                    </Content>
                    <Content :style="{padding: '30px 50px'}">
                        <Card>
                            <div style="min-height: 200px;">
                                <div class="currentCoordinate" v-if="currentCoordinateStatus">
                                    <Icon type="ios-send-outline" size="24" /><span>当前位置</span>     
                                </div> 
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
import {
  mapState
} from 'vuex'
export default {
    data(){
        return{
            currentCoordinateStatus: true
        }
    },
    watch :{
         
    },
    computed: {
    ...mapState('app', {
      account: 'account',
      userInfo: 'userInfo',
      currentCoordinate: 'currentCoordinate'
    }),
      
  },
    mounted(){

        console.log(this.currentCoordinate)
        // this.currentCoordinateStatus = this.currentCoordinate;
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
.currentCoordinate{
    cursor: pointer;
    padding:5px 0;
    span{
        color:#999;
    }
}

</style>
