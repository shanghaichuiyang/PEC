<template lang="html">
  <div>
    
    <Col span="12">
      <h4 style="padding:10px;">指标单位</h4>
    </Col>
    <Col span="12" style="text-align:right;">
      <router-link class="" to="/target/edittargetunit"><Button type="primary">添加</Button></router-link>
    </Col>
    <Divider />
    <Input search enter-button="搜索" placeholder="请输入搜索内容" v-model="keyWord" @on-search="search(keyWord)" />
    <Divider />
    <Table :columns="listColumns" :data="listData" style="margin-top:20px;">
      
      <template slot-scope="{ row, index }" slot="action">
        <div>
          <Button type="warning" :statitemid="row.Id" @click="edit($event)">修改</Button>
          <Button type="error" :statitemid="row.Id" @click="del($event)">删除</Button>
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
            title: 'CId',
            key: 'CId',
            align: 'center'
        },
        {
            title: 'Id',
            key: 'Id',
            align: 'center'
        },
        {
            title: '指标主键Id',
            key: 'StatItemId',
            align: 'center'
        },
        {
            title: '指标单位名称',
            key: 'StatItemUnitName',
            align: 'center'
        },
        {
            title: 'State',
            key: 'State',
            align: 'center'
        },
        {
            title: '操作',
            slot: 'action',
            align: 'center'
        },
      ],
      listData:[],
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
  computed:{
    
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData(keyWord){
      let that = this;

      this.$axios.get(('/api/Home/StatItemUnit?Name='+(keyWord?keyWord:''))).then(rs => {
            if (rs.data.success) {

            //   that.totalCount=rs.data.data.RowCount;
                that.listData=rs.data.data;
            } else {
              that.totalCount=0;
              that.listData=[];
            }
        })


      
    },
    AddUser(){

    },
    edit(e){
      let ID = e.currentTarget.getAttribute("statitemid")

      this.$router.push({path: '/target/edittargetunit', query: {Id: ID}})

    },
    del(e){
      let ID = e.currentTarget.getAttribute("statitemid")
      let that = this;

        this.$Modal.confirm({
            title: '是否确认删除?',
            onOk: () => {
              this.$Loading.start()
              this.$axios.post('/api/Home/StatItemRemove', {
                'ids':ID
              }).then(rs => {
                let result = rs.data
                this.$Loading.finish()
                if (result.success) {
                  this.loadData()
                  this.$Message.success(result.message)
                } else {
                  this.$Message.error(result.message)
                }
              })


            },
            onCancel: () => {}
        });


    },
    search(keyWord){
      this.loadData(keyWord);

    }
    
  },
  
}
</script>

<style lang="scss" scoped>

.pageBox{
  margin-top:20px;
  text-align: right;
}

</style>
