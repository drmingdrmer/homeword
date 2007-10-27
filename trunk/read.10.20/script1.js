 //定义一个参数为base的loadCSS方法 
window.loadCSS = function (base) {
	//定义一个变量version，并赋值为属性是scope.config.resourceVersion的window对象
	var version = window.scope.config.resourceVersion;
	//将变量version与属性为scope.config.cssVer的对象相加，并将和赋给变量version
		version += "_" + window.scope.config.cssVer;
	//给变量version 赋值为“？”加上变量本身的值
		version = "?" + version;
	//定义一个变量cssSrc,并赋值base参数传过来的值+""字符串的内容+变量version的值
	var cssSrc = base + "css/default.template.css" + version;
	//定义一个变量customSrc,并赋值base参数传过来的值+""字符串的内容+变量version的值
	var customSrc = base + "css/1.5.css" + version;
	//打印参数为cssSrc的css样式地址
	document.write('<link id="defaultCSS" rel="stylesheet" type="text/css" href="' + cssSrc + '" />');
	//打印参数为customSrc的css样式地址
	document.write('<link id="customCSS" rel="stylesheet" type="text/css" href="' + customSrc + '" />');
}


//define方法的调用返回的结果，赋给anchorCommand属性
window.AnchorCommand = Class.define(
  function (win) { // diefine方法的属生一，一个逆名函数
//	win = win || window.scope || window;
    this.init();//调用init方法
    this.win = win;//给win属性赋值为win
    this.setUrl(win.location.href);//调用setUrl方法，参数为win对象的子对象location的href属性
  },
  null, {//diefine方法的属性二

    init : function (win) { //给init方法赋值为参数是win的函数
      this.commands = {};//给commands属性赋值
      this.executor = {};//给executor属性赋值
      this.win = null;//给win属性赋值为null
      this.url = null;//给url属性赋值null
      this.cmdPattern = "cmd:{$cmdName}({$param})";//给cmdPattern属性赋值为一个字符串
    },
	
	/*这个方法调用就1个参数 参数是对象，对象里面有2个属性 然后在storeCommand方法里面再取出这个对象参数的2个属性来用*/
    setCommand : function (cmd, params){ //给setCommand方法赋值为参数是cmd, params的函数
      this.storeCommand({//给 storeCommand方法传参数 ，是一个对象，对象里面有2个属性
          cmdName : cmd,//cmdName属性值为setCommand方法的参数 cmd
          param : params//param属性值为setCommand方法的参数 params
        });
    },
/*经常用到的1种写程序的方法，将多个参数打包成1个对象*/


    storeCommand : function (cmd){//storeCommand 方法赋值为参数是cmd的函数
      this.commands[cmd.cmdName] = cmd;//介句看不懂是啥意思。。大概应该是给 commands属性赋值======[]这里面不知道是什么意思
    },

    setUrl : function (url) { //setUrl方法赋值为参数是url的函数
      this.url = new URL(url);//url属性赋值为 参数为url的URL方法======new.....是做什么用的？？？
      this.parseAnchorCommands();//调用parseAnchorCommands方法
    },

    getUrlObject : function (){//getUrlObject方法赋值为返回url属性的值
      return this.url;
    },

/*这一段很模糊 开始*/
    serializeCmdToUrl : function (){//serializeCmdToUrl 方法赋值
      for (var i in this.commands){//for in 循环 commands属性
        var tmp = this.commands[i];//给变量tmp赋值 commands数组？＝＝commands是数组吗？
        var cmd = { //定义cmd对象
          cmdName : tmp.cmdName,//对象属性cmdName 值为属性是cmdName的对象tmp======
          param   : tmp.param.join(",")//对象属性param 值为tmp对象的子对象param的值为,的join方法======
        };
		/*定义一个变量cmdStr 赋值为方法是replace的属性为cmdPattern的对象，replace方法有两个参数，
		第一个/\{\$i(\w+)\}/看不懂是什么，第二个是一个参数为a ,b 的函数*/
        var cmdStr = this.cmdPattern.replace(/\{\$i(\w+)\}/, function (a, b){
            return cmd[b]; //返回值cmd[b]
          });
        this.url.anchor[cmdStr] = null;	/* add command to url as param name without value */
      }
    }, 


    getUrlStr : function (){ //getUrlStr方法赋值
      this.serializeCmdToUrl();//调用serializeCmdToUrl方法
      var str = this.getUrlObject().toStr();//定义一个str变量 赋值为toStr方法的getUrlObjiect方法的对象
      this.setUrl(str);//调用setUrl方法赋值为str变量
      return str;//返回str变量的值
    },

    parseAnchorCommands : function () {//parseAnchorCommands 方法赋值
      if (!this.url) return;//如果this里面没有url属性的话 返回

      var anchors = this.url.anchor;// 定义anchors变量，赋值为属性anchors的url属性的对象

      for (var i in anchors){ //anchors循环
        if (i.indexOf("cmd:") == 0){ //如果i的参数为'cmd:'的indexOf方法值为0
          var cmdStr = i.substr(4);//变量cmdStr 赋值为值是4的substr方法
          if (cmdStr == "") continue;//如果cmdStr 值为空 continue 执行下1轮循环

          var cmd = cmdStr.split("(");//变量cmd赋值为 参数是（的方法的cmdStr属性
            var cmdName = cmd[0];//cmdName变量 赋值为cmd[0]=====这里是不是一个数组？
            var cmdParam = cmd[1].substr(0, cmd[1].length-1).split(",");//cmdParam变量赋值为参数是,的split方法的，参数为0, cmd[1].length-1的substr方法的cmd[1]属性的一个对象
            this.setCommand(cmdName, cmdParam);//调用参数为cmdName, cmdParam的setCommand方法

            delete anchors[i];//删除变量anchors的所有内容？？？=====================
          }
        }
      },


	clearCommand : function (name){ //给 clearCommand 方法赋值为参数是name的函数
	if (this.commands[name]) //如果满足this.commands[name]的条件
	  delete this.commands[name];//删除this.commands[name]的所有内容？？？？==============
	}, 
	
	clearAllCommands : function (){//给 clearAllCommands 方法赋值
	this.commands = {};//调用commands属性
	},
	
	refreshUrl : function (){//给 refreshUrl 方法赋值
	this.win.location.hash = this.url.getHashStr(true);
	//给this指向对象的win子对象的location子对象的hash属性赋值为this指向的对象的url子对象的参数为true的getHashStr方法
	}, 
	
	runCommands : function () { //给 runcommands 方法赋值
	for (var i in this.commands){//
	  var cmd = this.commands[i];
	  if (this.executor[i]){
		try {
		  this.executor[i].apply(null, cmd.param);
		  this.clearCommand(i);
		  this.refreshUrl();
		} catch (err) {
		  confirm("error occur when call comand : " + i + "\n error : " + err);
		}
	  }
	}
	},
	
	setExecutor : function (cmdName, func) {
	this.executor[cmdName] = func;
	}, 
	
	getExecutor : function (cmdName){
	return this.executor[cmdName];
	}

    }
  );
/*模糊结束*/

//定义一个window的each方法,参数为ar和insp
  window.each = function (ar, insp){
//定义一个变量r赋值为[]
    var r = [];
//for 循环 循环条件 i=0, i<ar对象length的值
    for(var i=0;i<ar.length;i++){
//循环内容 定义一个变量x,赋值为函数insp.
      var x = insp(i);
//判断 如果x 不等于空，执行r的push方法.
      if (x != null) r.push(x);
    }
//如果x等于空，将r变量返回.
    return r;
  }


//
var response = function (id, txt){
//定义一个变量entity赋值为 某对象的requestTable属性
	var entity = this.requestTable;
//判断 entity 
	if (entity){
//定义一个变量doc赋值为$Xml.Parser.fromString （txt）
		var doc = $Xml.Parser.fromString(txt);
//
		entity.option.onComplete(txt, doc);
	}
}

var q = {
	xp : response
};
q.xp();
var f = q.xp

/*
第1个函数看完后在它前面加注释，写出它的功能描述
解释里面每个对象，属性，变量的作用。

最后2个也是函数。
中间那个大的可以先留到最后


一个函数可以做为另外一个函数的方法
*/