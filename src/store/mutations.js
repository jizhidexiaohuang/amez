import * as types from './type'
/* ===============================状态值============================ */
const state = {
	footerCode:true,
	shanPingShow:true,
	loading:false,
	bannerShow:true,
	headerShow:true,
	userInfo:"",
	msgModal:false,
	//是否存在页签菜单
	TabType:true,
	//用户登录信息
	adminInfo:"",
	businessId:[],
	storeList:[],
	tohomeList:[],
	recruitList:[],
	serviceId:[],
	tabCtrl:'',
	cardName:'',
	cityList:[],
	serviceStoreList:[],
};
/* =========================改变状态的唯一方法======================= */
const mutations = {
	[types.FOOTER_HIDE](state){
		state.footerCode = false;
	},
	[types.FOOTER_SHOW](state){
		state.footerCode = true;
	},
	[types.SLIDER_HIDE](state){
		state.shanPingShow = false;
	},
	[types.LOADING_SHOW](state){
		state.loading = true;
	},
	[types.LOADING_HIDE](state){
		state.loading = false;
	},
	[types.BANNER_SHOW](state){
		state.bannerShow = true;
	},
	[types.BANNER_HIDE](state){
		state.bannerShow = false;
	},
	[types.HEADER_SHOW](state){
		state.headerShow = true;
	},
	[types.HEADER_HIDE](state){
		state.headerShow = false;
	},
	[types.USER_INFO](state,userInfo){
		console.log(userInfo);
		state.userInfo = userInfo;
	},
	[types.MSG_SHOW](state){
		state.msgModal = true;
	},
	[types.MSG_HIDE](state){
		state.msgModal = false;
	},
	[types.TAB_TRUE](state){
		state.TabType = true;
	},
	[types.TAB_FALSE](state){
		state.TabType = false;
	},
	[types.ADMIN_INFO](state,adminInfo){
		console.log(adminInfo);
		state.adminInfo = adminInfo;
	},
	[types.BUSINESS_ID](state,businessId){
		console.log(businessId);
		state.businessId = businessId;
	},
	[types.STORE_LIST](state,storeList){
		console.log(storeList);
		state.storeList = storeList;
	},
	[types.TOHOME_LIST](state,tohomeList){
		state.tohomeList = tohomeList;
	},
	[types.RECRUIT_LIST](state,recruitList){
		console.log(recruitList);
		state.recruitList = recruitList;
	},
	[types.CITY_LIST](state,cityList){
		console.log(cityList);
		state.cityList = cityList;
	},
	[types.SERVICE_STORE_LIST](state,serviceStoreList){
		console.log(serviceStoreList);
		state.serviceStoreList = serviceStoreList;
	},
	[types.SERVICE_ID](state,serviceId){
		console.log(serviceId);
		state.serviceId = serviceId;
	},
	[types.TAB_CTRL](state,tabCtrl){
		console.log(tabCtrl);
		state.tabCtrl = tabCtrl;
	},
	[types.CARD_NAME](state,cardName){
		console.log(cardName);
		state.cardName = cardName;
	},
}
/* ====================对状态进行处理再输出=========================== */
const getters = {
	footerShow(state){
		return state.footerCode
	},
	shanPingShow(state){
		return state.shanPingShow
	},
	loading(state){
		return state.loading
	},
	bannerShow(state){
		return state.bannerShow
	},
	headerShow(state){
		return state.headerShow
	},
	userInfo(state){
		return state.userInfo
	},
	msgShow(state){
		return state.msgModal
	},
	tabTrue(state){
		return state.TabType
	},
	adminInfo(state){
		return state.adminInfo
	},
	businessId(state){
		return state.businessId
	},
	storeList(state){
		return state.storeList
	},
	tohomeList(state){
		return state.tohomeList
	},
	recruitList(state){
		return state.recruitList
	},
	cityList(state){
		return state.cityList
	},
	serviceStoreList(state){
		return state.serviceStoreList
	},
	serviceId(state){
		return state.serviceId
	},
	tabCtrl(state){
		return state.tabCtrl
	},
	cardName(state){
		return state.cardName
	},
}
export default{
	state,
	mutations,
	getters
}