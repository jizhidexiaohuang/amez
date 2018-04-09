// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import axios from 'axios'
import Loading from './components/Loading'
import 'iview/dist/styles/iview.css';
import iView from 'iview';
import common from './base.js';

import BASE_UTIL from './util/util.js'

import '../static/sass/common.min.css'
import qs from 'qs'
// 引入 vue-kikindeditor 需要的文件
import VueKindEditor from 'vue-kindeditor'
// import 'kindeditor/kindeditor-all-min.js'
import '../static/js/kindeditor-all-min.js'
import 'kindeditor/themes/default/default.css'
// 注册 vue-kikindeditor plugin
import VueDND from 'awe-dnd'
Vue.use(VueDND)

Vue.use(VueKindEditor)
Vue.prototype.common = common;
Vue.prototype._u = BASE_UTIL;
Vue.config.productionTip = false
Vue.use(iView);
Vue.prototype.qs = qs;
/*
Vue.use(Loading);
//axios的一些配置，比如发送请求显示loading，请求回来loading消失之类的
axios.interceptors.request.use(function (config) {  //配置发送请求的信息
  store.dispatch('showLoading')  
  return config;
}, function (error) {
  return Promise.reject(error);
});
axios.interceptors.response.use(function (response) { //配置请求回来的信息
  store.dispatch('hideLoading')
  return response;
}, function (error) {
  return Promise.reject(error);
});
*/
Vue.prototype.$http = axios  //其他页面在使用axios的时候直接  this.$http就可以了
/* eslint-disable no-new */
/* 路由的前置钩子函数 */
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  console.log("to:"+to.name+" from:"+from.name);
  next();
  //从本地拿存储，如果没有登录过，就跳到登录页，如果登陆过就跳到首页
  if(to.name=="login"){
  }else{
    if(to.name=="首页"&&from.name == "login"){
    }else{
      if(!!!window.localStorage.getItem("userInfo")){
        alert("请先登录");
        router.push("/login");
      }
    }
  }
  iView.LoadingBar.finish();
})
/* 路由的后置钩子函数 */
router.afterEach((to, from) => {
  iView.LoadingBar.finish();
})



/* =================环信================== */
let WebIM = require('easemob-websdk');
WebIM.config = common.imConfig;
Vue.prototype.$webim = WebIM;
// 创建连接
const conn = new WebIM.connection({
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
  url: WebIM.config.xmppURL,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: true
})
Vue.prototype.$imconn = conn
/* ===================环信=============== */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
