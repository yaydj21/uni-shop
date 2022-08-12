export default {
	// 开启命名空间
	namespaced: true,

	// 数据
	state: () => ({
		// 收货地址
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		token: uni.getStorageSync('token') || '',
		// 用户的信息对象
		userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		// 重定向的 object 对象 { openType, from }
		redirectInfo: null
	}),

	// 方法
	mutations: {
		// 更新收货地址
		updateAddress(state, address) {
			state.address = address;

			this.commit('m_user/saveAddressToStorage');
		},
		// 持久化存储 address
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address));
		},
		updateUserInfo(state, userinfo) {
			state.userinfo = userinfo;

			this.commit('m_user/saveUserInfoToStorage');
		},
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo));
		},
		updateToken(state, token) {
			state.token = token;
			this.commit('m_user/saveTokenToStorage');
		},
		saveTokenToStorage(state) {
			uni.setStorageSync('token', state.token)
		},
		// 更新重定向的信息对象
		updateRedirectInfo(state, info) {
			state.redirectInfo = info
		}
	},

	getters: {
		addstr(state) {
			if (!state.address.provinceName) {
				return '';
			}
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address
				.detailInfo;
		}
	}
}
