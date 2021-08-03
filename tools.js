/**
 * 通用方法库
 * create 2021/07/15
 * update 2021/08/03
 */

/**
 * 日期格式化
 * @param {*} time 时间: 系统时间、时间戳 
 * @param {*} pattern 返回格式: {y}-{m}-{d} {h}:{i}:{s}
 * @returns 返回: 2021-08-02 00:00:00
 */
 export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    } else if (typeof time === "string") {
      time = time.replace(new RegExp(/-/gm), "/");
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

/**
 * 获取时间戳
 * @param {*} time 时间：系统时间、日期
 * @param {*} length 时间戳长度，默认13位
 */
export function getTimestamp(time, length) {
  // 如果日期格式为 2021-08-02 转换成 2021/08/02
  if (time.indexOf('-') != -1) {
    time = time.replace(/-/g, '/')
  }
  let timestamp = new Date(time).getTime()
  if (length && length == '10') {
    timestamp = timestamp / 1000
  }
  return timestamp
}

/**
 * 表单重置
 * @param {*} refName 表单ref名称
 */
 export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 通用下载方法
export function download(url, fileName) {
  window.location.href =
  url +
    "/common/download?fileName=" +
    encodeURI(fileName) +
    "&delete=" +
    true;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || "id";
  parentId = parentId || "parentId";
  children = children || "children";
  rootId =
    rootId ||
    Math.min.apply(
      Math,
      data.map(item => {
        return item[parentId];
      })
    ) ||
    0;
  //对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data));
  //循环所有项
  const treeData = cloneData.filter(father => {
    let branchArr = cloneData.filter(child => {
      //返回每一项的子级数组
      return father[id] === child[parentId];
    });
    branchArr.length > 0 ? (father.children = branchArr) : "";
    //返回第一层
    return father[parentId] === rootId;
  });
  return treeData != "" ? treeData : data;
}

/**
 * Base64转Blob
 */

export function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(",");
  let _arr = arr[1].substring(0, arr[1].length);
  let mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(_arr),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
}

/**
 * file对象转base64
 */

export function fileToBase64(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve, reject) => {
    reader.onload = function(e) {
      //这里是一个异步，所以获取数据不好获取在实际项目中，就用new Promise解决
      if (this.result) {
        resolve(this.result);
      } else {
        reject("err");
      }
    };
  });
}

/**
 * 对象克隆&深拷贝
 * @param obj
 * @returns {{}}
 */
 export  function clone(obj) {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
      var copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
      var copy = [];
      for (var i = 0, len = obj.length; i < len; ++i) {
          copy[i] = clone(obj[i]);
      }
      return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
      var copy = {};
      for (attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
      }
      return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

/**
 * 字符串脱敏
 * @param {*} str 字符串
 * @param {*} beginLen 符串前面保留位数
 * @param {*} endLen 字符串后面保留位数
 * @returns string
 */
 export function desensitization(str, beginLen, endLen){
  beginLen = beginLen ? beginLen : 1
  endLen = endLen ? endLen : 1
  var len = str.length - beginLen - endLen;
  var xing ='';
  for (var i = 0; i < len; i++) {
      xing +='*';
  }
  return str.substring(0, beginLen) + xing + str.substring(str.length - endLen);
}

/**
 * 根据经纬度计算两点距离
 * @param {*} lat1 维度1
 * @param {*} lng1 经度1
 * @param {*} lat2 维度2
 * @param {*} lng2 经度2
 * @returns distance 单位：km
 */
export function getDistance(lat1, lng1, lat2, lng2) {
  // console.log(lat1, lng1, lat2, lng2)
  var radLat1 = (lat1 * Math.PI) / 180.0
  var radLat2 = (lat2 * Math.PI) / 180.0
  var a = radLat1 - radLat2
  var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  s = s * 6378.137 // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000
  return s
}

/**
 * 计算距离当前时间
 * @param {*} 时间 dateTimeStamp 系统时间或13位时间戳 
 * @returns string
 */
export function timeAgo(dateTimeStamp) {
  var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime(); //获取当前时间毫秒
  var diffValue = now - dateTimeStamp; //时间差

  if (diffValue < 0) {
    return;
  }
  var result = '';
  var minC = diffValue / minute; //计算时间差的分，时，天，周，月
  var hourC = diffValue / hour;
  var dayC = diffValue / day;
  var weekC = diffValue / week;
  var monthC = diffValue / month;
  if (monthC >= 1 && monthC <= 3) {
  	result = " " + parseInt(monthC) + "月前"
  } else if (weekC >= 1 && weekC <= 3) {
  	result = " " + parseInt(weekC) + "周前"
  } else if (dayC >= 1 && dayC <= 6) {
      result = ' ' + parseInt(dayC) + '天前';
  } else if (hourC >= 1 && hourC <= 23) {
      result = ' ' + parseInt(hourC) + '小时前';
  } else if (minC >= 1 && minC <= 59) {
      result = ' ' + parseInt(minC) + '分钟前';
  } else if (diffValue >= 0 && diffValue <= minute) {
      result = '刚刚';
  } else {
      var datetime = new Date();
      datetime.setTime(dateTimeStamp);
      var Nyear = datetime.getFullYear();
      var Nmonth =
          datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
      var Ndate = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate();
      var Nhour = datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours();
      var Nminute = datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes();
      var Nsecond = datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds();
      result = Nyear + '-' + Nmonth + '-' + Ndate;
  }
  return result;
}