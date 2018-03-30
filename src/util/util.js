/*===================================== 菜单权限配置 ==================================*/
export const operatorsEdit = (vm) =>{
    function fnGetDatas (id,vm) {
        let list = [];
        let menuArrs = []; // 相同menuId的数组
        let strArrs = []; // 权限数组 ["add","edit"]
        /* 菜单对应的权限组 */
        if(!!JSON.parse(window.localStorage.getItem("userInfo")).operator.list){
            list = JSON.parse(window.localStorage.getItem("userInfo")).operator.list;
        }
        /* 每个用户有可能被分配了多个角色，所以需要合并相同menuId的权限组 */
        for(var c = 0;c<list.length;c++){
            if(list[c].menuId == id){
                menuArrs.push(list[c]);
            }
        }
        for(var j = 0;j<menuArrs.length;j++){
            if(!!menuArrs[j].operCode){
                fnChangeOperators(menuArrs[j].operCode.split(","));
            }
        }
    }
    function fnChangeOperators (arrs) {
        arrs.forEach(function(item,index){
            vm.operators[item] = true;
        })
    }
    /* 得到所有的菜单 */
    let arrs = JSON.parse(window.localStorage.getItem("userInfo")).menu;
    for(var i = 0;i<arrs.length;i++){
        if(!!arrs[i].hasChildList){
            for(var j = 0;j<arrs[i].childList.length;j++){
                if(arrs[i].childList[j].href == vm.$route.path){
                    fnGetDatas(arrs[i].childList[j].menuId,vm)
                }
            }
        }else{
            if(arrs[i].href == vm.$route.path){
                fnGetDatas(arrs[i].menuId,vm)
            }
        }
    }
}







const BASE_UTIL = {
    operatorsEdit
};

export default BASE_UTIL;
