<template>
    <div class="layout">
       <Layout>
                <Sider hide-trigger>
                    <topMenu></topMenu>
                </Sider>
                <Layout>
            
                    <Content>
                      
                    </Content>
                    <Content :style="{padding: '30px 50px'}">
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
.ivu-layout-sider{
   

}

</style>
