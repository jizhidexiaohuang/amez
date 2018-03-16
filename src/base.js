const common = {
    /* 接口 */
    /*
    1.测试
    2.飞华
    */
    path: (function(i){
        switch (i) {
            case 1:
                return "http://120.79.42.13:8080/"  // 非系统和服务
                break;
            case 2:
                return "http://192.168.1.32:8081/"
                break;
            case 3:
                return "http://mrb.amez999.com/pc/"  
                break;
            default:
                return "http://mrb.amez999.com/pc/"
        } 
    })(1),
    path2: (function(i){
        switch (i) {
            case 1:
                return "http://120.79.42.13:8081/"
                break;
            case 2:
                // 联合 飞华
                return "http://192.168.1.32:8081/"
                break;
            case 3:
                return "http://mrb.amez999.com/pc/"  
                break;
            case 4:
                // 艾美 飞华
                return "http://172.16.20.151:8081/"
                break;
            default:
                return "http://mrb.amez999.com/pc/"  
        } 
    })(3),
    /* 富文本 */
    
    // path1:"http://172.16.20.151:8081/",
    path1:"http://mrb.amez999.com/pc/",
    // path1:"http://120.79.42.13:8081/",
    /* 用户信息 */
    u: (function(){
        let data = JSON.parse(window.localStorage.getItem("userInfo"));
        return data;
    })(),
    /* 菜单 */
    menuList:[
        {
            name:"门店管理",
            hasChildList:true,
            href:"",
            type:"toggle",
            childList: [
                {
                    name:"门店审核",
                    hasChildList: false,
                    href:"/store/storeExamine"
                },
                {
                    name:"门店管理",
                    hasChildList: false,
                    href:"/store/storeManage"
                },
                {
                    name:"店铺等级",
                    hasChildList: false,
                    href:"/store/storeGrade"
                },
                {
                    name:"连锁品牌管理",
                    hasChildList: false,
                    href:"/store/brandManage"
                }
            ]
        },
        {
            name:"服务管理",
            hasChildList:true,
            href:"",
            type:"ios-people",
            childList: [
                {
                    name:"门店自营服务",
                    hasChildList: false,
                    href:"/service/brandService"
                },
                {
                    name:"品牌服务",
                    hasChildList: false,
                    href:"/service/storeBrandService"
                },
                {
                    name:"平台自营服务",
                    hasChildList: false,
                    href:"/service/platformPlan"
                },
                /* {
                    name:"审核服务",
                    hasChildList: false,
                    href:"/service/examineService"
                }, */
                {
                    name:"分类管理",
                    hasChildList: false,
                    href:"/service/classifyManage"
                },
                /* {
                    name:"平台佣金方案",
                    hasChildList: false,
                    href:"/service/commissionPlan"
                }, */
            ]
        },
        {
            name:"产品管理",
            hasChildList:true,
            href:"",
            type:"laptop",
            childList: [
                {
                    name:"产品管理",
                    hasChildList: false,
                    href:"/product/productManage"
                },
                {
                    name:"运费模板",
                    hasChildList: false,
                    href:"/product/freightTemplate"
                },
            ]
        },
        {
            name:"订单管理",
            hasChildList:true,
            href:"",
            type:"laptop",
            childList: [
                {
                    name:"服务订单",
                    hasChildList: false,
                    href:"/order/serviceOrder"
                },
                {
                    name:"退款订单客服介入",
                    hasChildList: false,
                    href:"/order/customerOrder"
                },
                {
                    name:"评论管理",
                    hasChildList: false,
                    href:"/order/commentManage"
                },
                {
                    name:"产品订单",
                    hasChildList: false,
                    href:"/order/goodsOrder"
                }
            ]
        },
        {
            name:"员工管理",
            hasChildList:true,
            href:"",
            type:"laptop",
            childList: [
                {
                    name:"员工管理",
                    hasChildList: false,
                    href:"/worker/workerManage"
                },
                {
                    name:"员工等级",
                    hasChildList: false,
                    href:"/worker/workerGrade"
                },
                {
                    name:"实名认证",
                    hasChildList: false,
                    href:"/worker/realnameCertification"
                }
            ]
        },
        {
            name:"财务管理",
            hasChildList:true,
            href:"",
            type:"social-python",
            childList: [
                {
                    name:"交易流水",
                    hasChildList: false,
                    href:"/financeManage/tradeWater"
                },
                {
                    name:"店铺交易统计",
                    hasChildList: false,
                    href:"/financeManage/storeCount"
                },
                {
                    name:"提现管理",
                    hasChildList: false,
                    href:"/financeManage/cashManage"
                },
                {
                    name:"通知公告",
                    hasChildList: false,
                    href:"/financeManage/noticeBulletin"
                },
                {
                    name:"佣金费用设置",
                    hasChildList: false,
                    href:"/financeManage/commissionCost"
                }
            ]
        },
        {
            name:"会员卡",
            hasChildList:true,
            href:"",
            type:"social-python",
            childList: [
                {
                    name:"会员卡列表",
                    hasChildList: false,
                    href:"/memberCard/cardManage"
                },
                // {
                //     name:"售卡记录",
                //     hasChildList: false,
                //     href:"/memberCard/cardHistory"
                // },
                {
                    name:"卡面模板",
                    hasChildList: false,
                    href:"/memberCard/cardTpl"
                }
            ]
        },
        {
            name:"营销管理",
            hasChildList:true,
            href:"",
            type:"social-python",
            childList: [
                {
                    name:"首页装修",
                    hasChildList: false,
                    href:"/marketing/decorateHome"
                },
                // {
                //     name:"活动商家分组",
                //     hasChildList: false,
                //     href:"/marketing/activityShop"
                // }
            ]
        },
        {
            name:"权限管理",
            hasChildList:true,
            href:"",
            type:"social-python",
            childList: [
                {
                    name:"用户管理",
                    hasChildList: false,
                    href:"/manage/userManage"
                },
                {
                    name:"角色管理",
                    hasChildList: false,
                    href:"/manage/departmentManage"
                },
                {
                    name:"菜单权限管理",
                    hasChildList: false,
                    href:"/manage/menuManage"
                },
                {
                    name:"操作日志",
                    hasChildList: false,
                    href:"/manage/operationLog"
                },
                {
                    name:"短信模板",
                    hasChildList: false,
                    href:"/manage/newsTemplate"
                }
            ]
        },
    ],
    formatDate :function(value){
        let date = new Date(value);
        let year = date.getFullYear();
        let month = (date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1;
        let day = date.getDate()<10?'0'+date.getDate():date.getDate();
        let hour = date.getHours()<10?'0'+date.getHours():date.getHours();
        let minute = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
        let second = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
        return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
    },
    baseFormatDate: function(date){
        let d = new Date(date);
        let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
        return time;
    },
    simpleFormatDate: function(date,num){
        let d = new Date(date);
        let time = ''
        if(num==1){
            time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); 
        }else if(num==2){
            time = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
        }else if(num==3){
            let year = date.getFullYear();
            let month = (date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1;
            let day = date.getDate()<10?'0'+date.getDate():date.getDate();
            time = year+'-'+month+'-'+day
        }
        return time;
    },
}
export default common