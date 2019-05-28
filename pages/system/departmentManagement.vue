<template lang="html">
  <div>
    
    <Col span="12">
      <h4 style="padding:10px;">部门管理</h4>
    </Col>
    <Col span="12" style="text-align:right;">
      <router-link class="" to="/system/editdepartment"><Button type="primary">添加</Button></router-link>
    </Col>
    <Divider />
    <Input search enter-button="搜索" placeholder="请输入搜索内容" v-model="keyWord" @on-search="search(keyWord)" />
    <Divider />
    <Table :columns="listColumns" :data="listData" style="margin-top:20px;">
      <template slot-scope="{ row, index }" slot="action">
        <div>
          <Button type="warning" :departmentid="row.Id" @click="edit($event)">修改</Button>
          <Button type="error" :departmentid="row.Id" @click="del($event)">删除</Button>
        </div>
      </template>
    </Table>
    <div class="pageBox"><Page :total="totalCount" size="small" /></div>
  </div>
</template>

<script>
import {
  mapState
} from 'vuex'
export default {
  layout: 'withLeftMenu',
  data() {
    return {
      listColumns:[
        {
            title: '部门名称',
            key: 'DepartmentName'
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
  },
  methods: {
    loadlist(keyword){
      let that = this;

      this.$axios.post('/api/Home/SelectDepartment', {
          DepartmentName:keyword,
          pageIndex:this.currentPage,
          pageSize:this.pageSize,
          CompanyId:this.account.CompanyId
      }).then(rs => {
          if (rs.data.success) {
            that.totalCount=rs.data.data.RowCount;
            that.listData=rs.data.data.list;

          } else {
              that.totalCount=0;
              that.listData=[];
              //this.$Message.error(rs.data.message)
          }
      })




    },
    edit(e){
      let ID = e.currentTarget.getAttribute("departmentid")

      this.$router.push({path: '/system/editdepartment', query: {id: ID}})

    },
    del(e){
      let ID = e.currentTarget.getAttribute("departmentid")
      let that = this;

        this.$Modal.confirm({
            title: '是否确认删除?',
            onOk: () => {
              this.$Loading.start()
              this.$axios.post('/api/Home/DelDepartment', {
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
