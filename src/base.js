const common = {
    /* 接口 */
    // 测试
    path:"http://120.79.42.13:8080/",
    // 飞华
    // path:"http://172.16.20.151:8080/",
    // 开哥
    // path:"http://192.168.1.141:8000/",
    /* 富文本 */
    path1:"http://172.16.20.151:8080/",
    // path1:"http://120.79.42.13:8080/",
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
                    name:"品牌服务",
                    hasChildList: false,
                    href:"/service/brandService"
                },
                {
                    name:"门店自营服务",
                    hasChildList: false,
                    href:"/service/storeBrandService"
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
                    name:"客服介入订单",
                    hasChildList: false,
                    href:"/order/customerOrder"
                },
                {
                    name:"评论管理",
                    hasChildList: false,
                    href:"/order/commentManage"
                }
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
                    name:"操作日志",
                    hasChildList: false,
                    href:"/manage/operationLog"
                }
            ]
        },
    ],
    formatDate :function(value){
        let date = new Date(value);
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
    },
    baseFormatDate: function(date){
        let d = new Date(date);
        let time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
        return time;
    }
}
export default common