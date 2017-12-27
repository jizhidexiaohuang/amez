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
/*==================================订单管理============================*/
//服务订单
import ServiceOrder from '@/components/order/serviceOrder/list'
//客服介入订单
import CustomerOrder from '@/components/order/customerOrder/list'
//评论管理
import CommentManage from '@/components/order/commentManage/list'
/*=====================================权限管理==========================*/
//用户管理
import UserManage from '@/components/manage/userManage/list'
//角色管理
import DepartmentManage from '@/components/manage/departmentManage/list'
//操作日志
import OperationLog from '@/components/manage/operationLog/list'
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
        name: '品牌服务',
        title: '品牌服务',
        component: BrandService,
        meta:{
          type:"菜单",
          name:"品牌服务"
        }
      },
      {
        path: '/service/storeBrandService',
        name: '门店自营服务',
        title: '门店自营服务',
        component: StoreBrandService,
        meta:{
          type:"菜单",
          name:"门店自营服务"
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
        name: '客服介入订单',
        title: '客服介入订单',
        component: CustomerOrder,
        meta:{
          type:"菜单",
          name:"客服介入订单"
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
      }
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
      }
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

