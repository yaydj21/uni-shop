
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

import store from '@/store/store.js';


uni.addInterceptor('request',{
	// 请求前触发
	invoke(args) {
		uni.showLoading({
			title:'数据加载中...'
		})
		args.url = 'https://api-ugo-web.itheima.net'+args.url;
	},
	success(args) {
		// 请求成功后触发
		uni.hideLoading();
	},
	fail(err) {
		
	}
})

// 封装弹窗的方法
uni.$showMsg = function(title='数据请求失败！',duration=1500){
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif