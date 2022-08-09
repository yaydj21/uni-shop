<template>
	<view class="goods-item">
		<!-- 左侧盒子 -->
		<view class="goods-item-left">
			<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
		</view>
		<!-- 右侧盒子 -->
		<view class="goods-item-right">
			<!-- 商品的名字 -->
			<view class="goods-name">{{goods.goods_name}}</view>
			<view class="goods-info-box">
				<!-- |管道符调用过滤器 -->
				<view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-goods",
		props: {
			goods: {
				type: Object,
				default: {}
			}
		},
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
			};
		},
		// 过滤器
		filters: {
			tofixed(num) {
				return Number(num).toFixed(2);
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goods-item-left {
			margin-right: 5px;

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex-flow: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.goods-info-box {
				.goods-price {
					color: #C00000;
					font-size: 16px
				}
			}
		}
	}
</style>
