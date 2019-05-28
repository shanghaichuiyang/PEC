<template lang="html">
  <div>
    
    <Col span="12">
      <h4 style="padding:10px;">日志</h4>
    </Col>
    <Col span="12" style="text-align:right;">
      <router-link class="" to="/projectManagement/log/editdaily"><Button type="primary">添加</Button></router-link>
    </Col>
    <Divider />
    <Input search enter-button="搜索" placeholder="请输入搜索内容" v-model="keyWord" @on-search="search(keyWord)" />
    <Divider />
    <Table :columns="listColumns" :data="listData" style="margin-top:20px;">
      <template slot-scope="{ row, index }" slot="action">
        <div>
          <!-- <Button type="warning" :userid="row.Id" @click="edit($event)">修改</Button> -->
          <!-- <Button type="error" :userid="row.Id" @click="del($event)">删除</Button> -->
          <!-- <Button type="primary" :userid="row.Id" @click="view($event)">查看</Button> -->
          
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
            title: '项目名称',
            key: 'ProjectId',
            align: 'center'
        },
        {
            title: '日志时间',
            key: 'DeclareDate',
            align: 'center',
            render: (h, params) => {
              return h('span', this.formatDate(params.row.DeclareDate));;
            }
        },
        {
            title: '形象进度',
            key: 'ImageProgress',
            align: 'center'
        },
        {
            title: '天气',
            key: 'Weathers',
            align: 'center',
            render: (h, params) => {
              switch(params.row.Weathers){
                case 1:
                  return h('span', '晴');
                  break;
                case 2:
                  return h('span', '多云');
                  break;
                case 3:
                  return h('span', '阴天');
                  break;
                case 3:
                  return h('span', '雷阵雨');
                  break;
                case 3:
                  return h('span', '小雨');
                  break;
                case 3:
                  return h('span', '中雨');
                  break;
                case 3:
                  return h('span', '大雨');
                  break;
                case 3:
                  return h('span', '暴雨');
                  break;
                case 3:
                  return h('span', '雨夹雪');
                  break;
                case 3:
                  return h('span', '小雪');
                  break;
                case 3:
                  return h('span', '中雪');
                  break;
                case 3:
                  return h('span', '大雪');
                  break;
                case 3:
                  return h('span', '暴雪');
                  break;
                case 3:
                  return h('span', '冰雹');
                  break;
                case 3:
                  return h('span', '冻雨');
                  break;
                default:
                  return h('span', '其他');
              }
            }
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
  computed: {
    ...mapState('app', {
      account: 'account',
      projectid: 'projectid'
    })
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData(keyWord){
      let that = this;

      this.$axios.post('/api/Home/FinishProcess', {
          //UserName:keyWord?keyWord:'',
          ProjectId:this.projectid,
          PageIndex:this.currentPage,
          PageSize:this.pageSize
      }).then(rs => {
            if (rs.data.success) {
              that.totalCount=rs.data.data.RowCount;
              that.listData=rs.data.data;
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

      this.$router.push({path: '/projectManagement/log/editdaily', query: {userID: ID}})

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
