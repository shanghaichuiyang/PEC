import Cookies from 'js-cookie'
export const state = () => ({
  version: 'v1.0',
  // 储存用户登录信息
  account: {},
  userInfo:{},

  // 页面浏览历史
  history: {
    list: []
  },
  projectid:null
})

export const mutations = {
  // 将url存入history中
  pushUrl(state, params) {
    state.history.list.push(params.url)
  },
  // 储存账户信息
  setAccount(state, params) {
    state.account = params

    // 同步到cookie里面
    let account = {
      islogin: true
    }

    Cookies.set('account', account)
  },

  setUserInfo(state,params) {
    state.userInfo = params;
    
    Cookies.set('userInfo', userInfo)
  }, 

  // 储存账户信息
  
  editAccount(state, params) {
 
    state.account = params

  },
  logout(state, params) {
    state.account = {}
    state.userInfo = {}
    Cookies.remove('account','userInfo');

  },
  setProjectid(state, params) {
    state.projectid = params

  }
}
