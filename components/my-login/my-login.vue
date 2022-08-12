<template>
	<view class="login-container">
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
		<text class="tips-text">登录后享受更多权益</text>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex';
	export default {
		name: "my-login",
		data() {
			return {

			};
		},
		computed: {
			...mapState('m_user', ['redirectInfo']),
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			// 用户授权后，获取用户的基本信息
			async getUserProfile(e) {

				const res = await uni.getUserProfile({
					desc: '登录授权',
				})
				if (res.length === 1) {
					if (res[0].errMsg.search(/fail/g) !== -1) {
						return uni.$showMsg('您取消了登录授权！')
					}
				}
				// console.log(res[1]);
				// 将用户的基本信息存储到 vuex 中
				this.updateUserInfo(res[1].userInfo);

				this.getToken(res[1]);
			},
			async getToken(info) {
				//获取code对应的值
				const [err, res] = await uni.login({

				}).catch(err => err)
				if (err || res.errMsg != 'login:ok') {
					return uni.$showMsg('登录失败');
				}

				// 准备参数
				const query = {
					encryptedData: info.encryptedData,
					rawData: info.rawData,
					iv: info.iv,
					signature: info.signature,
					code: res.code,
				}
				// console.log(query);
				const loginResult = await uni.request({
					url: '/api/public/v1/users/wxlogin',
					method: 'POST',
					data: this.query
				})
				if (!(loginResult[1].data.meta.status === 200 || loginResult[1].data.meta.status === 400)) {
					return uni.$showMsg('登录失败');
				}

				console.log(loginResult);
				// 直接把token保存到vuex中
				this.updateToken(
					'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
					);
				// uni.$showMsg('登录成功');
				this.navigateBack()
			},
			// 返回登录之前的页面
			navigateBack() {
				// redirectInfo 不为 null，并且导航方式为 switchTab
				if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					// 调用小程序提供的 uni.switchTab() API 进行页面的导航
					uni.switchTab({
						// 要导航到的页面地址
						url: this.redirectInfo.from,
						// 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		height: 750rpx;
		background-color: #F8F8F8;
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		position: relative;
		overflow: hidden;

		&::after {
			content: '';
			display: block;
			width: 100%;
			height: 40px;
			background-color: white;
			position: absolute;
			bottom: 0;
			left: 0;
			border-radius: 100%;
			transform: translateY(50%);
		}

		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #C00000;
		}

		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
