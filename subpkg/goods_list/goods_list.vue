<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					query: '',
					cid: '',
					pagenum: 1,
					pagesize: 10
				},
				goodsList: [],
				total: 0,
				// 节流阀
				isloading: false,
			};
		},
		onLoad(options) {
			this.queryObj.query = options.query || '';
			this.queryObj.cid = options.cid || '';
			this.getGoodsList();
		},
		methods: {
			// 获取商品列表数据的方法
			async getGoodsList(cb) {
				// 发起请求前打开节流阀
				this.isloading = true;
				const [, {
					data: res
				}] = await uni.request({
					url: '/api/public/v1/goods/search',
					data: this.queryObj,
				})
				// 请求结束后关闭节流阀
				// 短路运算符 如果cb存在 则执行cb()
				cb && cb()
				this.isloading = false;
				if (res.meta.status !== 200) {
					return uni.$showMsg();
				}
				// 上拉触底行为时，用展开运算符拼接新旧数据，添加新数据到数组中。
				this.goodsList = [...this.goodsList, ...res.message.goods];
				this.total = res.message.total;
			},
			gotoDetail(goods) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id,
				})
			},
		},
		// 触底函数，监听上拉触底行为
		onReachBottom() {
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) {
				return uni.$showMsg('没有更多商品了');
			}
			// 如果节流阀为true 表示当前正在请求数据 所以不再请求 return回去
			if (this.isloading) {
				return
			}
			// 让页码值自增+1
			this.queryObj.pagenum++;
			this.getGoodsList();
		},
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum = 1;
			this.total = 0;
			this.isloading = false;
			this.goodsList = [];

			// 重新发起数据请求
			// 传一个停止下拉刷新的回调函数
			this.getGoodsList(() => uni.stopPullDownRefresh());
		}
	}
</script>

<style lang="scss">

</style>
