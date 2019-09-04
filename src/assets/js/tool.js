// 得到网址上面的参数名及参数值
function getUrlParams () {
    let index = decodeURI(window.location.href).indexOf('?');
    let url = decodeURI(window.location.href).substr(index+1);
    let arr = url.split('&');
    let obj = {};
    for(var i=0; i< arr.length; i++) {
        obj[arr[i].split("=")[0]]=unescape(arr[i].split("=")[1]);
    };
    return obj
}
// 把getUrlParams封装好的给导入出去
export {getUrlParams}



/**
 * 把时间转化成2017-05-28类似这样的时间格式
 */
function changeday(num) {
    let date = new Date(num);
    let z = date.getFullYear() + '-',
        b = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1)  : date.getMonth() + 1) + '-',
        n = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) ;
    return z+b+n;
}
export {changeday}


/**
 * 把时间转化成2017-05-28 00:00:00 类似这样的时间格式
 */
function changeTime(time){
    let date = new Date(time);
    let z = date.getFullYear() + '-',
    b = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
    n = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + " " ,
    h = (date.getHours() < 10 ? '0'+ (date.getHours()) : date.getHours()) + ":",
    m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ":",
    s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return z+b+n+h+m+s;
}
export {changeTime}



/**
 * 数组求和函数
 */
function getNumBox(arr) {
    var a = 0;
    for(var i = 0;i < arr.length; i++){
        a += arr[i];
    }
    return a;
}
export {getNumBox}



/**
 * 根据一个数组数据，过滤另一个数组数据
 * @param {Array}  arr 被过滤的数组
 * @param {Array}  filterArr 过滤的数组
 * @param {String} id 对象的属性名（根据哪个字段）
 * 
 */
function arrFilter(arr, filterArr, id) {
    let filterIds = filterArr.map(item => item[id]);
    return arr.filter(item => !filterIds.includes(item[id]));
}
export {arrFilter}



/**
 *  由对象组成的数组按字母进行排序
 *  @param {Array} arr 对象数组的数组
 *  @param {String} eachName 数组里对象里的属性 按照这个属性的字母顺序进行排序
 */
function sortName(arr,eachName) {
    arr.forEach(function(item) {
        let temp = item[eachName];
        item.sortName = temp;
    })
    let resultArray = arr.sort(
        function compareFunction(param1, param2) {
            return param1.sortName.localeCompare(param2.sortName,"zh")
        }
    )
    return resultArray
}
export {sortName}