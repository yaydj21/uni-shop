export default {
	// 为当前模块开启命名空间
	namespaced: true,

	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		// 将本地存储的数据放到cart中，如果不存在本地存储的数据就给一个空数组
		cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
	}),

	mutations: {
		addToCart(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id);

			// 购物车中没有商品 将商品添加到购物车数组
			if (!findResult) {
				state.cart.push(goods);
			} else {
				// 如果有这个商品 就数量+1
				findResult.goods_count++;
			}
			// 通过commit方法调用saveToStorage方法
			this.commit('m_cart/saveToStorage');
		},
		// 将购物车的数据持久化存储到本地
		saveToStorage(state){
			uni.setStorageSync('cart',JSON.stringify(state.cart));
		},
		// 更新购物车中商品的勾选状态
		updateGoodsState(state,goods){
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			
			if(findResult){
				findResult.goods_state = goods.goods_state;
				
				this.commit('m_cart/saveToStorage');
			}
		},
		// 更新商品的数量
		updateGoodsCount(state,goods){
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id);
			if(findResult){
				findResult.goods_count = goods.goods_count;
				
				this.commit('m_cart/saveToStorage');
			}
		},
		removeGoodsById(state,goods_id){
			// 过滤出不需要删除的商品形成新数组重新赋值给数组
			state.cart = state.cart.filter(x => x.goods_id !== goods_id);
			
			this.commit('m_cart/saveToStorage');
		},
		// 更新购物车中所有商品的勾选状态
		updateAllGoodsState(state,newState){
			state.cart.forEach(x => x.goods_state = newState);
			
			this.commit('m_cart/saveToStorage');
		}
	},
	getters: {
		// 购物车中所有商品的总数量
		total(state) {
			// // 购物车总数 c
			// let c = 0;
			// // x代表商品  把商品数量累加到c上
			// state.cart.forEach(x => c += x.goods_count)
			// return c;
			
			// 0只会在第一次循环生效 相当于c
			return state.cart.reduce((total,item) => total += item.goods_count,0);
		},
		// 购物车中已勾选商品的总数量
		checkedCount(state){
			return state.cart.filter(x => x.goods_state).reduce((total,item) => total += item.goods_count,0)
			
		},
		// 已勾选商品的总价格
		checkedGoodsAmount(state){
			return state.cart.filter(x => x.goods_state).reduce((total,item) => total +=item.goods_count * item.goods_price,0).toFixed(2);
			//toFixed保留两位小数
		}
	}
}
