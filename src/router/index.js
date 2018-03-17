import Vue from 'vue'
import Router from 'vue-router'


/* 个人中心 */
import Ownspace from '@/components/ownSpace/Ownspace'
/* 消息管理 */
import Newsmanage from '@/components/newsManage/Newsmanage'
/* 首页 */
import Home from '@/components/Home'
/* 登陆 */
import Login from '@/components/Login'
/* 框 */
import Main from '@/components/Main'
/*======================================门店=============================*/
//门店审核
import StoreExamine from '@/components/store/storeExamine/list'
//门店管理
import StoreManage from '@/components/store/storeManage/list'
//店铺等级
import StoreGrade from '@/components/store/storeGrade/list'
//连锁品牌管理
import BrandManage from '@/components/store/brandManage/list'

/*=====================================服务管理=========================*/
//品牌服务
import BrandService from '@/components/service/brandService/list'
//门店自营服务
import StoreBrandService from '@/components/service/storeBrandService/list'
//审核服务
import ExamineService from '@/components/service/examineService/list'
//分类管理
import ClassifyManage from '@/components/service/classifyManage/list'
//平台佣金方案
import CommissionPlan from '@/components/service/commissionPlan/list'
//平台自营服务
import PlatformPlan from '@/components/service/platformPlan/list'
/*==================================产品管理============================*/
// 产品管理
import ProductManage from '@/components/product/productManage/list'
// 运费模板
import FreightTemplate from '@/components/product/freightTemplate/list'


/*==================================订单管理============================*/
//服务订单
import ServiceOrder from '@/components/order/serviceOrder/list'
//客服介入订单
import CustomerOrder from '@/components/order/customerOrder/list'
//评论管理
import CommentManage from '@/components/order/commentManage/list'
//产品订单
import GoodsOrder from '@/components/order/goodsOrder/list'
/*=====================================权限管理==========================*/
//用户管理
import UserManage from '@/components/manage/userManage/list'
//角色管理
import DepartmentManage from '@/components/manage/departmentManage/list'
//操作日志
import OperationLog from '@/components/manage/operationLog/list'
//短信模板
import NewsTemplate from '@/components/manage/newsTemplate/list'
//菜单权限管理
import MenuManage from '@/components/manage/menuManage/list'
//菜单列表管理
import MenuList from '@/components/manage/menuList/list'
/*=====================================财务管理=========================*/
//交易流水
import TradeWater from '@/components/financeManage/tradeWater/list'
//店铺交易统计
import StoreCount from '@/components/financeManage/storeCount/list'
//提现管理
import CashManage from '@/components/financeManage/cashManage/list'
//通知公告
import NoticeBulletin from '@/components/financeManage/noticeBulletin/list'
//佣金费用设置
import CommissionCost from '@/components/financeManage/commissionCost/list'
/*=====================================员工管理=========================*/
//员工管理
import WorkerManage from '@/components/worker/workerManage/list'
//员工等级
import WorkerGrade from '@/components/worker/workerGrade/list'
//实名认证
import RealnameCertification from '@/components/worker/realnameCertification/list'
/*=====================================营销管理=========================*/
//首页装修
import DecorateHome from '@/components/marketing/decorateHome/index'
//活动商家分组
// import ActivityShop from '@/components/marketing/activityShop/list'
/*=====================================会员卡=========================*/
//会员卡列表
import CardManage from '@/components/memberCard/cardManage/card/list'
//售卡记录
// import CardHistory from '@/components/memberCard/cardHistory/list'
//卡面模板
import CardTpl from '@/components/memberCard/cardTpl/list'

Vue.use(Router)

/* 登录页 */
const LoginPage = {
  path: '/login',
  name: 'login',
  component: Login
}
/* 左侧菜单 */
const menuRouter = [
  {
    path: '/store',
    name: '门店管理',
    title: '门店管理',
    component: Main,
    children: [
      {
        path: '/store/storeExamine',
        name: '门店审核',
        title: '门店审核',
        component: StoreExamine,
        meta:{
          type:"菜单",
          name:"门店审核"
        }
      },
      {
        path: '/store/storeManage',
        name: '门店管理',
        title: '门店管理',
        component: StoreManage,
        meta:{
          type:"菜单",
          name:"门店管理"
        }
      },
      {
        path: '/store/storeGrade',
        name: '店铺等级',
        title: '店铺等级',
        component: StoreGrade,
        meta:{
          type:"菜单",
          name:"店铺等级"
        }
      },
      {
        path: '/store/brandManage',
        name: '连锁品牌管理',
        title: '连锁品牌管理',
        component: BrandManage,
        meta:{
          type:"菜单",
          name:"连锁品牌管理"
        }
      },
    ]
  },
  {
    path: '/service',
    name: '服务管理',
    title: '服务管理',
    component: Main,
    children: [
      {
        path: '/service/brandService',
        name: '门店自营服务',
        title: '门店自营服务',
        component: BrandService,
        meta:{
          type:"菜单",
          name:"门店自营服务"
        }
      },
      {
        path: '/service/storeBrandService',
        name: '品牌服务',
        title: '品牌服务',
        component: StoreBrandService,
        meta:{
          type:"菜单",
          name:"品牌服务"
        }
      },
      {
        path: '/service/examineService',
        name: '审核服务',
        title: '审核服务',
        component: ExamineService,
        meta:{
          type:"菜单",
          name:"审核服务"
        }
      },
      {
        path: '/service/classifyManage',
        name: '分类管理',
        title: '分类管理',
        component: ClassifyManage,
        meta:{
          type:"菜单",
          name:"分类管理"
        }
      },
      {
        path: '/service/commissionPlan',
        name: '平台佣金方案',
        title: '平台佣金方案',
        component: CommissionPlan,
        meta:{
          type:"菜单",
          name:"平台佣金方案"
        }
      },
      {
        path: '/service/platformPlan',
        name: '平台自营服务',
        title: '平台自营服务',
        component: PlatformPlan,
        meta:{
          type:"菜单",
          name:"平台自营服务"
        }
      },
    ]
  },
  {
    path: '/product',
    name: '产品管理',
    title: '产品管理',
    component: Main,
    children: [
      {
        path: '/product/productManage',
        name: '产品管理',
        title: '产品管理',
        component: ProductManage,
        meta:{
          type:"菜单",
          name:"产品管理"
        }
      },
      {
        path: '/product/freightTemplate',
        name: '运费模板',
        title: '运费模板',
        component: FreightTemplate,
        meta:{
          type:"菜单",
          name:"运费模板"
        }
      }
    ]
  },
  {
    path: '/worker',
    name: '员工管理',
    title: '员工管理',
    component: Main,
    children: [
      {
        path: '/worker/workerManage',
        name: '员工管理',
        title: '员工管理',
        component: WorkerManage,
        meta:{
          type:"菜单",
          name:"员工管理"
        }
      },
      {
        path: '/worker/workerGrade',
        name: '员工等级',
        title: '员工等级',
        component: WorkerGrade,
        meta:{
          type:"菜单",
          name:"员工等级"
        }
      },
      {
        path: '/worker/realnameCertification',
        name: '实名认证',
        title: '实名认证',
        component: RealnameCertification,
        meta:{
          type:"菜单",
          name:"实名认证"
        }
      }
    ]
  },
  {
    path: '/order',
    name: '订单管理',
    title: '订单管理',
    component: Main,
    children: [
      {
        path: '/order/serviceOrder',
        name: '服务订单',
        title: '服务订单',
        component: ServiceOrder,
        meta:{
          type:"菜单",
          name:"服务订单"
        }
      },
      {
        path: '/order/customerOrder',
        name: '退款订单客服介入',
        title: '退款订单客服介入',
        component: CustomerOrder,
        meta:{
          type:"菜单",
          name:"退款订单客服介入"
        }
      },
      {
        path: '/order/commentManage',
        name: '评论管理',
        title: '评论管理',
        component: CommentManage,
        meta:{
          type:"菜单",
          name:"评论管理"
        }
      },
      {
        path: '/order/goodsOrder',
        name: '产品订单',
        title: '产品订单',
        component: GoodsOrder,
        meta:{
          type:"菜单",
          name:"产品订单"
        }
      },
    ]
  },
  {
    path: '/manage',
    name: '权限管理',
    title: '权限管理',
    component: Main,
    children: [
      {
        path: '/manage/userManage',
        name: '用户管理',
        title: '用户管理',
        component: UserManage,
        meta:{
          type:"菜单",
          name:"用户管理"
        }
      },
      {
        path: '/manage/departmentManage',
        name: '角色管理',
        title: '角色管理',
        component: DepartmentManage,
        meta:{
          type:"菜单",
          name:"角色管理"
        }
      },
      {
        path: '/manage/operationLog',
        name: '操作日志',
        title: '操作日志',
        component: OperationLog,
        meta:{
          type:"菜单",
          name:"操作日志"
        }
      },
      {
        path: '/manage/newsTemplate',
        name: '短信模板',
        title: '短信模板',
        component: NewsTemplate,
        meta:{
          type:"菜单",
          name:"短信模板"
        }
      },
      {
        path: '/manage/MenuManage',
        name: '菜单权限管理',
        title: '菜单权限管理',
        component: MenuManage,
        meta:{
          type:"菜单",
          name:"菜单权限管理"
        }
      },
      {
        path: '/manage/MenuList',
        name: '菜单列表管理',
        title: '菜单列表管理',
        component: MenuList,
        meta:{
          type:"菜单",
          name:"菜单权限管理"
        }
      }
    ]
  },
  {
    path: '/financeManage',
    name: '财务管理',
    title: '财务管理',
    component: Main,
    children: [
      {
        path: '/financeManage/tradeWater',
        name: '交易流水',
        title: '交易流水',
        component: TradeWater,
        meta:{
          type:"菜单",
          name:"交易流水"
        }
      },
      {
        path: '/financeManage/storeCount',
        name: '店铺交易统计',
        title: '店铺交易统计',
        component: StoreCount,
        meta:{
          type:"菜单",
          name:"店铺交易统计"
        }
      },
      {
        path: '/financeManage/cashManage',
        name: '提现管理',
        title: '提现管理',
        component: CashManage,
        meta:{
          type:"菜单",
          name:"提现管理"
        }
      },
      {
        path: '/financeManage/noticeBulletin',
        name: '通知公告',
        title: '通知公告',
        component: NoticeBulletin,
        meta:{
          type:"菜单",
          name:"通知公告"
        }
      },
      {
        path: '/financeManage/commissionCost',
        name: '佣金费用设置',
        title: '佣金费用设置',
        component: CommissionCost,
        meta:{
          type:"菜单",
          name:"佣金费用设置"
        }
      }
    ]
  },
  {
    path: '/marketing',
    name: '营销管理',
    title: '营销管理',
    component: Main,
    children: [
      {
        path: '/marketing/decorateHome',
        name: '首页装修',
        title: '首页装修',
        component: DecorateHome,
        meta:{
          type:"菜单",
          name:"首页装修"
        }
      },
      // {
      //   path: '/marketing/activityShop',
      //   name: '活动商家分组',
      //   title: '活动商家分组',
      //   component: ActivityShop,
      //   meta:{
      //     type:"菜单",
      //     name:"活动商家分组"
      //   }
      // }
    ]
  },
  {
    path: '/memberCard',
    name: '会员卡',
    title: '会员卡',
    component: Main,
    children: [
      {
        path: '/memberCard/cardManage',
        name: '会员卡列表',
        title: '会员卡列表',
        component: CardManage,
        meta:{
          type:"菜单",
          name:"会员卡列表"
        }
      },
      // {
      //   path: '/memberCard/cardHistory',
      //   name: '售卡记录',
      //   title: '售卡记录',
      //   component: CardHistory,
      //   meta:{
      //     type:"菜单",
      //     name:"售卡记录"
      //   }
      // },
      {
        path: '/memberCard/cardTpl',
        name: '卡面模板',
        title: '卡面模板',
        component: CardTpl,
        meta:{
          type:"菜单",
          name:"卡面模板"
        }
      },
    ]
  }
]
/* 非左侧菜单 */
const otherRouter = {
  path: '/',
  name: 'otherRouter',
  component: Main,
  children: [
    { path: 'home',title: '首页',name: '首页',component: Home,meta: {type:"菜单",name:"首页"} },
    { path: 'ownspace',title: '个人中心',name: '个人中心',component: Ownspace,meta: {type:"菜单",name:"个人中心"} },
    { path: 'newsmanage',title: '消息管理',name: '消息管理',component: Newsmanage,meta: {type:"菜单",name:"消息管理"} }
  ]
}
export default new Router({
  //mode: 'history', //切换路径模式，变成history模式
  scrollBehavior: () => ({ y: 0 }), // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
  routes: [
    LoginPage,
    otherRouter,
    ...menuRouter
  ]
})