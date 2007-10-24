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



window.AnchorCommand = Class.define(
  function (win) {
    win = win || window.scope || window;
    this.init();
    this.win = win;
    this.setUrl(win.location.href);
  },
  null, {

    init : function (win) {
      this.commands = {};
      this.executor = {};
      this.win = null;
      this.url = null;
      this.cmdPattern = "cmd:{$cmdName}({$param})";
    },

    setCommand : function (cmd, params){
      this.storeCommand({
          cmdName : cmd,
          param : params
        });
    },

    storeCommand : function (cmd){
      this.commands[cmd.cmdName] = cmd;
    },

    setUrl : function (url) {
      this.url = new URL(url);
      this.parseAnchorCommands();
    },

    getUrlObject : function (){
      return this.url;
    },

    serializeCmdToUrl : function (){
      for (var i in this.commands){
        var tmp = this.commands[i];
        var cmd = {
          cmdName : tmp.cmdName,
          param   : tmp.param.join(",")
        };
        var cmdStr = this.cmdPattern.replace(/\{\$i(\w+)\}/, function (a, b){
            return cmd[b];
          });
        this.url.anchor[cmdStr] = null;	/* add command to url as param name without value */
      }
    }, 

    getUrlStr : function (){
      this.serializeCmdToUrl();
      var str = this.getUrlObject().toStr();
      this.setUrl(str);
      return str;
    },

    parseAnchorCommands : function () {
      if (!this.url) return;
      var anchors = this.url.anchor;

      for (var i in anchors){
        if (i.indexOf("cmd:") == 0){
          var cmdStr = i.substr(4);
          if (cmdStr == "") continue;

          var cmd = cmdStr.split("(");
            var cmdName = cmd[0];
            var cmdParam = cmd[1].substr(0, cmd[1].length-1).split(",");
            this.setCommand(cmdName, cmdParam);

            delete anchors[i];
          }
        }
      },

      clearCommand : function (name){
        if (this.commands[name])
          delete this.commands[name];
      }, 

      clearAllCommands : function (){
        this.commands = {};
      },

      refreshUrl : function (){
        this.win.location.hash = this.url.getHashStr(true);
      }, 

      runCommands : function () {
        for (var i in this.commands){
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


  window.each = function (ar, insp){
    var r = [];
    for(var i=0;i<ar.length;i++){
      var x = insp(ar[i],i);
      if (x != null) r.push(x);
    }
    return r;
  }

  response = function (id, txt){
    var entity = this.requestTable;
    if (entity){
      var doc = $Xml.Parser.fromString(txt);
      entity.option.onComplete(txt, doc);
    }
  }

/*
xp 说:
第1个函数看完后在它前面加注释，写出它的功能描述
解释里面每个对象，属性，变量的作用。


xp 说:

最后2个也是函数。
中间那个大的可以先留到最后
*/