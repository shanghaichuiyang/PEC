<template>
    <div class="layout">
        <Layout>
            <Header>
                <!-- <Menu mode="horizontal" theme="light" active-name="1">
                    <div class="layout-logo">LOGO</div>
                    <div class="layout-nav">
                        <MenuItem name="1">
                            首页
                        </MenuItem>
                        <MenuItem name="2">
                            项目列表
                        </MenuItem>
                        <MenuItem name="3">
                            平台用户信息
                        </MenuItem>
                        
                    </div>
                </Menu> -->
                <topMenu></topMenu>
            </Header>
            <Content :style="{width: '100%',height:'18vh'}">
                <div class="layout-banner">
                </div>
            </Content>
            <Content :style="{padding: '30px 50px'}">
                <Card>
                    <div style="min-height: 200px;">
                        <nuxt/>
                    </div>
                </Card>
            </Content>

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

</style>

