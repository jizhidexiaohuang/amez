import * as types from './type'

export default{
	/* 底部条 */
	hideFooter:({commit})=>{
		commit(types.FOOTER_HIDE);
	},
	showFooter:({commit})=>{
		commit(types.FOOTER_SHOW);
	},
	/* 闪屏页 */
	hideSlider:({commit})=>{
		commit(types.SLIDER_HIDE);
	},
	/* loading */
	showLoading:({commit})=>{
		commit(types.LOADING_SHOW);
	},
	hideLoading:({commit})=>{
		commit(types.LOADING_HIDE);
	},
	/* banner */
	showBanner:({commit})=>{
		commit(types.BANNER_SHOW);
	},
	hideBanner:({commit})=>{
		commit(types.BANNER_HIDE);
	},
	/* header */
	showHeader:({commit})=>{
		commit(types.HEADER_SHOW);
	},
	hideHeader:({commit})=>{
		commit(types.HEADER_HIDE);
	},
	/* 用户信息 */
	userInfo:({commit},data)=>{
		commit(types.USER_INFO,data.userInfo);
	},
	/* msg提示框 */
	msgHide:({commit})=>{
		commit(types.MSG_HIDE);
	},
	msgShow:({commit})=>{
		commit(types.MSG_SHOW);
	},
	/* 是否存在页签 */
	tabTrue:({commit})=>{
		commit(types.TAB_TRUE);
	},
	tabFalse:({commit})=>{
		commit(types.TAB_FALSE);
	},
	/* 用户信息 */
	adminInfo:({commit},data)=>{
		commit(types.ADMIN_INFO,data.adminInfo);
	},
	businessId:({commit},data)=>{
		console.log(data)
		commit(types.BUSINESS_ID,data.businessId);
	},
	serviceId:({commit},data)=>{
		console.log(data)
		commit(types.SERVICE_ID,data.serviceId);
	},
	tabCtrl:({commit},data)=>{
		console.log(data)
		commit(types.TAB_CTRL,data.tabCtrl);
	},
	cardName:({commit},data)=>{
		console.log(data)
		commit(types.CARD_NAME,data.cardName);
	},
	storeList:({commit},data)=>{
		console.log(data)
		commit(types.STORE_LIST,data.storeList);
	},
	tohomeList:({commit},data)=>{
		console.log(data)
		commit(types.TOHOME_LIST,data.tohomeList);
	},
	recruitList:({commit},data)=>{
		console.log(data)
		commit(types.RECRUIT_LIST,data.recruitList);
	},
	cityList:({commit},data)=>{
		console.log(data)
		commit(types.CITY_LIST,data.cityList);
	},
	serviceStoreList:({commit},data)=>{
		console.log(data)
		commit(types.SERVICE_STORE_LIST,data.serviceStoreList);
	},
}