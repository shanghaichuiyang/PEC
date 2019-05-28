import JsCookies from 'js-cookie'
import config from './../app.config.js'
// 通过cookie 获取用户
var getAccoutFromReqCookie = function(req) {
  // 检测是否有cookie
  if (!req.headers.cookie) return false
  // 获取登录状态
  const Cookies = req.headers.cookie.split(';').find(c => c.trim().startsWith('account='))
  if (!Cookies) return false
  let account = Cookies.split('=')[1]
  // 替换双引号
  account = JSON.parse(account.replace(/%22/g, '"'))
  if (account) {
    return true
  } else {
    return false
  }
}

// 通过本地存储获取用户
var getAccoutFromBrowserCookie = function() {
  let account = null
  try {
    account = JSON.parse(JsCookies.get('account'))
  } catch (e) {}
  if (account) {
    return true
  } else {
    return false
  }
}

// 校验url是否需要登录
var checkurl = function(req, route) {
  let url
  req && req.url ? url = req.url : url = route.path
  let exemptionAuthUrls = config.exemptionAuthUrls
  // 默认登录页面为免授权登录页面
  console.log(config.loginurl)
  exemptionAuthUrls.push(config.loginurl)
  let exist = false
  for (let path of exemptionAuthUrls) {
    if (path === url) {
      exist = true
    }
  }
  return !exist
}

export default function({
  isServer,
  store,
  req,
  redirect,
  route
}) {
  // 如果没有请求则返回
  if (isServer && !req) return
  // 获取账户
  const islogin = process.server ? getAccoutFromReqCookie(req) : getAccoutFromBrowserCookie()
  // 如果当前用户没有登录则跳转到登录界面
  if (!islogin && checkurl(req, route)) {
    redirect(config.loginurl)
  }
}
