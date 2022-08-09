<template>
	<view>
		<view class="my-search-container" :style="{'background-color': bgcolor}" @click="searchBoxHandler">
			<view class="my-search-box" :style="{'border-radius' : radius+'px'}">
				<!-- 使用uni-ui提供的图标组件 -->
				<uni-icons type="search" size="17"></uni-icons>
				<text class="placeholder">搜索</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			// 背景颜色
			bgcolor:{
				type:String,
				default:'#C00000'
			},
			// 圆角尺寸
			radius:{
				type:Number,
				default:18//px
			}
		},
		name:"my-search",
		data() {
			return {
				
			};
		},
		methods:{
			searchBoxHandler(){
				console.log('~');
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
.my-search-container{
	display: flex;
	align-items: center;
	padding: 0 10px;
	height: 50px;
	// background-color: #c00000;
	.my-search-box{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 36px;
		background-color: #fff;
		// border-radius: 18px;
		.placeholder{
			font-size: 15px;
			margin-left: 5px;
		}
	}
}
</style>