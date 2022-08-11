<template>
	<view>
		<!-- 选择收获地址的盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
			<button type='primary' size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
		</view>
		<!-- 渲染收货地址的盒子 -->
		<view class="address-info-box" v-else @click="chooseAddress">
			<view class="row1">
				<view class="row1-left">
					<view class="username">
						收货人：{{address.userName}}
					</view>
				</view>
				<view class="row1-right">
					<view class="phone">
						电话：{{address.telNumber}}
					</view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="row2-left">
					收货地址：
				</view>
				<view class="row2-right">
					{{addstr}}
				</view>
			</view>
		</view>
		<!-- 底部边框线 -->
		<image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	import {mapState,mapMutations,mapGetters} from 'vuex';
	export default {
		name: "my-address",
		data() {
			return {
			};
		},
		methods: {
			...mapMutations('m_user',['updateAddress']),
			async chooseAddress() {
		 		// 此处更新之后需要在manifest.js中的"mp-weixin"添加"requiredPrivateInfos":["chooseAddress"]
				// 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
				//    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
				const [err, succ] = await uni.chooseAddress().catch(err => err)
				// 2. 用户成功的选择了收货地址
				if (err === null && succ.errMsg === 'chooseAddress:ok') {
					// 为vuex中收货地址赋值
					this.updateAddress(succ);
				}
			}
		},
		computed:{
			...mapState('m_user',['address']),
			...mapGetters('m_user',['addstr']),
		}
	}
</script>

<style lang="scss">
	.address-border {
		display: block;
		width: 100%;
		height: 5px;
	}

	.address-choose-box {
		display: flex;
		height: 90px;
		justify-content: center;
		align-items: center;
	}

	.address-info-box {
		display: flex;
		flex-flow: column;
		justify-content: center;
		font-size: 12px;
		height: 90px;
		padding: 0 5px;

		.row1 {
			display: flex;
			justify-content: space-between;

			.row1-right {
				display: flex;
				justify-content: space-between;
			}
		}

		.row2 {
			display: flex;
			align-items: center;
			margin-top: 10px;

			.row2-left {
				// 文本不换行
				white-space: nowrap;
			}
		}
	}
</style>
