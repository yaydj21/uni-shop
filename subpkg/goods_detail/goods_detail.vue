<template>
	<!-- 解决商品价格闪烁的问题 -->
	<!-- 在商品详情数据请求回来之前，data 中 goods_info 的值为 {}，因此初次渲染页面时，会导致 商品价格、商品名称 等闪烁的问题。 -->
	<!-- 判断 goods_info.goods_name 属性的值是否存在，从而使用 v-if 指令控制页面的显示与隐藏 -->
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,i) in goods_info.pics" :key="i">
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
		</swiper>

		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">
				￥{{goods_info.goods_price}}
			</view>
			<!-- 商品信息主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名字 -->
				<view class="goods-name">
					{{goods_info.goods_name}}
				</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">
				快递：免运费
			</view>
		</view>
		<!--  富文本 渲染html结构 介绍商品 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>

		<!-- 商品导航区域 -->
		<view class="goods_nav">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex';
	export default {
		computed: {
			// 映射m_cart模块中的total属性
			...mapState('m_cart', []),
			...mapGetters('m_cart', ['total']),
		},
		watch: {
			// 监听total值的变化，通过形参得到变化后的新值
			total: {
				handler(newVal) {
					// find方法找到购物车按钮的对象
					const findResult = this.options.find(x => x.text === '购物车');
					// 如果findResult存在 就为info赋新值
					if (findResult) {
						findResult.info = newVal;
					}
				},
				// immediate 让页面初次加载完毕后立即调用。
				immediate: true,
			}
		},
		data() {
			return {
				goods_info: {},
				options: [{
					icon: 'shop',
					text: '店铺',
					infoBackgroundColor: '#007aff',
					infoColor: "red"
				}, {
					icon: 'cart',
					text: '购物车',
					info: 0
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
			};
		},
		onLoad(options) {
			const goods_id = options.goods_id;
			this.getGoodsDetail(goods_id);
		},
		methods: {
			// （模块,映射的方法)
			...mapMutations('m_cart', ['addToCart']),
			async getGoodsDetail(goods_id) {
				const [, {
					data: res
				}] = await uni.request({
					url: '/api/public/v1/goods/detail',
					data: {
						goods_id
					},
				})
				if (res.meta.status !== 200) {
					return uni.$showMsg();
				}
				// 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
				// /<img表示要替换的字符串 /g是全部替换 替换成后面字符串的样子
				// webp 替换成jpg 因为ios对webp支持不太好 会加载不出来图片
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,
					'<img style="display:block;" ').replace(/webp/g, 'jpg');

				this.goods_info = res.message;
			},
			preview(i) {
				uni.previewImage({
					current: i,
					// 把pics循环添加到一个新数组里
					urls: this.goods_info.pics.map(x => x.pics_big)
				})
			},
			onClick(e) {
				if (e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			buttonClick(e) {
				if (e.content.text === '加入购物车') {
					// 组织商品的信息对象
					//{ goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
					const goods = {
						goods_id: this.goods_info.goods_id,
						goods_name: this.goods_info.goods_name,
						goods_price: this.goods_info.goods_price,
						goods_count: 1,
						goods_small_logo: this.goods_info.goods_small_logo,
						goods_state: true,
					}
					//调用addToCart方法
					this.addToCart(goods);
				}
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.goods-info-box {
		padding: 10px;
		padding-right: 0;

		.price {
			color: #C00000;
			font-size: 18px;
			margin: 10px 0;
		}

		.goods-info-body {
			display: flex;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
				margin-right: 10px;
			}

			.favi {
				display: flex;
				flex-flow: column;
				align-items: center;
				justify-content: center;
				border-left: 1px solid #efefef;
				color: gray;
				width: 120px;
				font-size: 12px;
			}
		}

		.yf {
			font-size: 12px;
			color: gray;
			margin: 10px 0;
		}
	}

	.goods_nav {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.goods-detail-container {
		padding-bottom: 50px;
	}
</style>
