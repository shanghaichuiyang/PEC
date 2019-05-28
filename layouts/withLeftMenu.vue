<template>
    <div class="layout">
        
        <leftMenu></leftMenu>
        <Layout :style="{marginLeft: '200px',minHeight:'99vh'}">
            <!-- <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}"></Header> -->
            <Content :style="{padding: '16px'}">
                <!-- <Breadcrumb :style="{margin: '16px 0 16px 16px'}">
                    <BreadcrumbItem>Home</BreadcrumbItem>
                    <BreadcrumbItem>Components</BreadcrumbItem>
                    <BreadcrumbItem>Layout</BreadcrumbItem>
                </Breadcrumb> -->
                <Card class="fullscreen">
                    <nuxt/>
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
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    
</style>

