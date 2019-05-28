<template lang="html">
  <div>
    
    <Col span="12">
      <h4 style="padding:10px;">月报</h4>
    </Col>
    <Col span="12" style="text-align:right;">
      <router-link class="" to="/user/edituser"><Button type="primary">添加</Button></router-link>
    </Col>
    <Divider />
    <Input search enter-button="搜索" placeholder="请输入搜索内容" v-model="keyWord" @on-search="search(keyWord)" />
    <Divider />
    <Table :columns="listColumns" :data="listData" style="margin-top:20px;">
      
      <template slot-scope="{ row, index }" slot="accountType">
          <span>{{row.IsFree==0?'免费':'付费'}}</span>
      </template>
      <template slot-scope="{ row, index }" slot="action">
        <div>
          <Button type="warning" :userid="row.UserID" @click="edit($event)">修改</Button>
          <Button type="error" :userid="row.UserID" @click="del($event)">删除</Button>
        </div>
      </template>
    </Table>
    <div class="pageBox"><Page :total="totalCount" size="small" /></div>
  </div>
  
</template>

<script>

export default {
  layout: 'withLeftMenu',
  data() {
    return {
      listColumns:[
        {
            title: '序号',
            key: 'UserID',
            align: 'center'
        },
        {
            title: '账号',
            key: 'Phone',
            align: 'center'
        },
        {
            title: '姓名',
            key: 'UserName',
            align: 'center'
        },
        {
            title: '联系电话',
            key: 'Phone',
            align: 'center'
        },
        {
            title: '注册公司',
            key: 'CompanyName',
            align: 'center'
        },
        {
            title: '公司类型',
            key: 'CompanyType',
            align: 'center',
            render: (h, params) => {
              switch(params.row.companyType){
                case 1:
                  return h('span', '投资方');
                  break;
                case 2:
                  return h('span', '建设方');
                  break;
                case 3:
                  return h('span', '设计院');
                  break;
                case 4:
                  return h('span', '监理单位');
                  break;
                default:
                  return h('span', '其他');
              }
              
              return h('span', '投资方');
            }
        },
        {
            title: '注册时间',
            key: 'CreateTime',
            align: 'center',
            render: (h, params) => {
              return h('span', this.formatDate(params.row.CreateTime));;
            }
        },
        {
            title: '账号状态',
            key: 'Stats',
            align: 'center',
            render: (h, params) => {
              switch(params.row.Stats){
                case 1:
                  return h('span', '正常');
                  break;
                case 2:
                  return h('span', '禁用');
                  break;
                case 3:
                  return h('span', '删除');
                  break;
                default:
                  return h('span', '其他');
              }
            }
        },
        {
            title: '账号类型',
            slot: 'accountType',
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

      this.$axios.post('/api/Login/SelectAllUserInfo', {
          UserName:keyWord,
      }).then(rs => {
            if (rs.data.success) {
              that.totalCount=rs.data.data.RowCount;
              that.listData=rs.data.data.VarList;
            } else {
              that.totalCount=0;
              that.listData=[];
            }
        })


      
    },
    AddUser(){

    },
    formatDate: function (value) {
        var date = new Date(value);
        let Y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let H = date.getHours();
        let i = date.getMinutes();
        let s = date.getSeconds();
        if (m < 10) {
            m = '0' + m;
        }
        if (d < 10) {
            d = '0' + d;
        }
        if (H < 10) {
            H = '0' + H;
        }
        if (i < 10) {
            i = '0' + i;
        }
        if (s < 10) {
            s = '0' + s;
        }
        //var t = Y + '-' + m + '-' + d + ' ' + H + ':' + i;
        let t = Y + '-' + m + '-' + d;
        console.log(t)
        return t;
    },
    edit(e){
      let ID = e.currentTarget.getAttribute("userid")

      this.$router.push({path: '/user/edituser', query: {userID: ID}})

    },
    del(e){
      let ID = e.currentTarget.getAttribute("userid")
      let that = this;

        this.$Modal.confirm({
            title: '是否确认删除?',
            onOk: () => {
              this.$Loading.start()
              this.$axios.post('/api/Login/DelUserInfo', {
                'Id':ID
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
