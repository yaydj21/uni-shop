<template>
	<view>
		<!-- 搜索组件 -->
		<view class="search-box">
			<my-search @click="gotoSearch"></my-search>
		</view>
		<!-- 轮播图区域 -->
		<!-- usw 快捷生成  circular到最后一张图片再回到第一张-->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1500" :circular="true">
			<swiper-item v-for="(item,i) in swiperList" key="i">
				<!-- /代表项目根目录 -->
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		
		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		
		<!-- 楼层区域 -->
		<!-- 楼层的容器 -->
		<view class="floor-list">
			<!-- 每一个楼层的item项 -->
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<!-- 楼层的标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层的图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧大图的盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<!-- widthFix 宽度不变，高度自动变化，保持原图宽高比不变  -->
						<image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧小图的盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2,i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.url">
							<image :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" mode="widthFix"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tarbar-badge.js';
	export default {
		mixins:[badgeMix],
		data() {
			return {
				// 轮播图数据列表
				swiperList:[],
				// 分类导航的数据列表
				navList:[],
				floorList:[],
			};
		},
		onLoad() {
			// 调用方法获取轮播图数据
			this.getSwiperList();
			this.getNavList();
			this.getFloorList();
		},
		methods:{
			async getSwiperList(){
				// 数组结构 逗号前可忽略 data对象再解构赋值给res
				const [,{data : res}] = await uni.request({
					 url:'/api/public/v1/home/swiperdata'
				})
				// 请求失败
				if(res.meta.status != 200){
					return uni.$showMsg();
				}
				
				this.swiperList = res.message;
				uni.$showMsg('数据请求成功！');
			},
			// 返回值是promise 使用async await优化
			async getNavList(){
				const [,{data : res}] = await uni.request({
					url:'/api/public/v1/home/catitems'
				})
				if(res.meta.status != 200){
					return uni.$showMsg();
				}
				this.navList = res.message;
			},
			navClickHandler(item){
				if(item.name === '分类'){
					uni.switchTab({
						url:'/pages/cate/cate'
					})
				}
			},
			// 获取首页楼层数据的方法
			async getFloorList(){
				const [,{data : res}] = await uni.request({
					url:'/api/public/v1/home/floordata'
				})
				if(res.meta.status != 200){
					return uni.$showMsg();
				}
				res.message.forEach(floor =>{
					floor.product_list.forEach(prod =>{
						prod.url ='/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.message;
			},
			gotoSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
swiper{
	height: 330rpx;
	/deep/ .swiper-item,image{
		width: 100%;
		height: 100%;
	}
}
.nav-list{
	display: flex;
	justify-content: space-around;
	margin: 15px 0;
	.nav-img{
		width: 128rpx;
		height: 140rpx;
	}
}
.floor-img-box{
	display: flex;
	padding-left: 10rpx;
}
.floor-title{
	width: 100%;
	height: 60rpx;
}
.right-img-box{
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}
.search-box{
	position: sticky;
	top:0;
	z-index: 999;
}
</style>
