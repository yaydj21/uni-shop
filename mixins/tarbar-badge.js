//  将设置tabBar 数量上标的代码抽离为 mixins
import {mapGetters} from 'vuex'
export default {
	computed: {
		...mapGetters('m_cart', ['total']),
	},
	watch:{
		total(){
			this.setBadge();
		}
	},
	// 页面刚显示时被调用
	onShow() {
		// 为购物车tarbar设置商标数量
		this.setBadge();
	},
	methods: {
		// 为购物车tarbar设置商标数量
		setBadge() {
			uni.setTabBarBadge({
				index: 2,
				text: this.total + '', //text要为字符串
			})
		}
	}
}
