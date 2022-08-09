<template>
	<view>
		<view class="search-box">
			<uni-search-bar @confirm="search" @input="input" :radius='100' cancelButton='none' :focus="true">
			</uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !==0">
			<view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item)">
				<view class="goods-name">
					{{item.goods_name}}
				</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>

		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clean"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item,i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw')||'[]');
		},
		data() {
			return {
				// 定时器
				timer: null,
				// 关键词
				kw: '',
				// 搜索的结果列表
				searchResults: [],
				// 搜索历史的数据
				historyList: []
			}
		},
		methods: {
			// input 输入事件的处理函数
			input(e) {
				// 防抖操作 每触发一次就清除一次定时器 再设置新的定时器在500ms后触发
				clearTimeout(this.timer);
				this.timer = setTimeout(() => {
					this.kw = e;
					this.getSearchList();
				}, 500)
			},
			async getSearchList() {
				// 判断搜索关键词是否为空
				if (this.kw.trim().length === 0) {
					this.searchResults = [];
					return
				}

				const [, {
					data: res
				}] = await uni.request({
					url: '/api/public/v1/goods/qsearch',
					data: {
						query: this.kw
					}
				})
				if (res.meta.status !== 200) {
					return uni.$showMsg();
				}
				this.searchResults = res.message;
				this.saveSearchHistory();
			},
			gotoDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id,
				})
			},
			saveSearchHistory(){
				// unshift从前面插入数据 会影响key的索引，导致v-for顺序紊乱
				// this.historyList.push(this.kw);
				const set = new Set(this.historyList);
				set.delete(this.kw);//删除数组当前跟输入相同的值
				set.add(this.kw);//再在末尾插入数组当前跟输入相同的值
				//将Set对象转化为Array数组
				this.historyList = Array.from(set);
				// 对搜索历史数据，进行持久化存储
				uni.setStorageSync('kw',JSON.stringify(this.historyList));
			},
			clean(){
				this.historyList = [];
				uni.setStorageSync('kw','[]');
			},
			gotoGoodsList(kw){
				console.log(kw);
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?query='+kw,
				})
			},
		},
		computed:{
			histories(){
				//反转数组数据
				return [...this.historyList].reverse();
			}
		}
	}
</script>

<style lang="scss">
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;

			.goods-name {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
			}
		}
	}
.history-box{
	padding: 0 5px;
	.history-title{
		display: flex;
		justify-content: space-between;
		height: 40px;
		align-items: center;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
	}
	.history-list{
		display: flex;
		flex-wrap: wrap;
		.uni-tag{
			margin: 5px 5px 0 0;
		}
	}
}
</style>
