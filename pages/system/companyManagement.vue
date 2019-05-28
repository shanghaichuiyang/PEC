<template lang="html">
  <div>
    
    <Col span="12">
      <h4 style="padding:10px;">单位管理</h4>
    </Col>
    <Col span="12" style="text-align:right;">
      <router-link class="" to="/system/editcompany"><Button type="primary">添加</Button></router-link>
    </Col>
    <Divider />
    <Input search enter-button="搜索" placeholder="请输入搜索内容" v-model="keyWord" @on-search="search(keyWord)" />
    <Divider />
    <Table :columns="listColumns" :data="listData" style="margin-top:20px;">
      <template slot-scope="{ row, index }" slot="action">
        <div>
          <Button type="warning" :companyid="row.Id" @click="edit($event)">修改</Button>
          <Button type="error" :companyid="row.Id" @click="del($event)">删除</Button>
        </div>
      </template>
    </Table>
    <div class="pageBox"><Page :total="totalCount" size="small" /></div>
  </div>
</template>

<script>

export default {
  layout: 'withTopMenu',
  data() {
    return {
      listColumns:[
        {
            title: '单位名称',
            key: 'UnitName'
        },
        {
            title: '单位类型',
            key: 'UnitType',
            align: 'center',
            render: (h, params) => {
              switch(params.row.UnitType){
                case 1:
                  return h('span', '设计单位');
                  break;
                case 2:
                  return h('span', '监理单位');
                  break;
                case 3:
                  return h('span', '施工单位');
                  break;
                default:
                  return h('span', '其他单位');
              }
            }
        },
        {
            title: '备注',
            key: 'Remark'
        },
        {
            title: '操作',
            slot: 'action',
            align: 'center'
        },

      ],
      listData:[
        
      ],
      totalCount:0,
      currentPage:1,
      pageSize:10,
      keyWord:null,

    }
  },
  components: {

  },
  watch: {

  },
  mounted() {
    this.loadlist();
  },
  methods: {
    loadlist(keyword){
      let that = this;

      this.$axios.post('/api/Home/SelectUnitInfo', {
          UnitName:keyword,
          pageIndex:this.currentPage,
          pageSize:this.pageSize
      }).then(rs => {
          if (rs.data.success) {
            that.totalCount=rs.data.data.RowCount;
            that.listData=rs.data.data.t_Units;

          } else {
              that.totalCount=0;
              that.listData=[];
              //this.$Message.error(rs.data.message)
          }
      })



    },
    edit(e){
      let ID = e.currentTarget.getAttribute("companyid")

      this.$router.push({path: '/system/editcompany', query: {id: ID}})

    },
    del(e){
      let ID = e.currentTarget.getAttribute("companyid")
      let that = this;

        this.$Modal.confirm({
            title: '是否确认删除?',
            onOk: () => {
              this.$Loading.start()
              this.$axios.post('/api/Home/DelUnitInfo', {
                'Id':ID
              }).then(rs => {
                let result = rs.data
                this.$Loading.finish()
                if (result.success) {
                  this.loadlist()
                  this.$Message.success(result.message)
                } else {
                  this.$Message.error(result.message)
                }
              })


            },
            onCancel: () => {}
        });


    },
    search(keyword){
        this.loadlist(keyword);
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
