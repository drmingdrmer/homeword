 //����һ������Ϊbase��loadCSS���� 
window.loadCSS = function (base) {
	//����һ������version������ֵΪ������scope.config.resourceVersion��window����
	var version = window.scope.config.resourceVersion;
	//������version������Ϊscope.config.cssVer�Ķ�����ӣ������͸�������version
		version += "_" + window.scope.config.cssVer;
	//������version ��ֵΪ���������ϱ��������ֵ
		version = "?" + version;
	//����һ������cssSrc,����ֵbase������������ֵ+""�ַ���������+����version��ֵ
	var cssSrc = base + "css/default.template.css" + version;
	//����һ������customSrc,����ֵbase������������ֵ+""�ַ���������+����version��ֵ
	var customSrc = base + "css/1.5.css" + version;
	//��ӡ����ΪcssSrc��css��ʽ��ַ
	document.write('<link id="defaultCSS" rel="stylesheet" type="text/css" href="' + cssSrc + '" />');
	//��ӡ����ΪcustomSrc��css��ʽ��ַ
	document.write('<link id="customCSS" rel="stylesheet" type="text/css" href="' + customSrc + '" />');
}


//define�����ĵ��÷��صĽ��������anchorCommand����
window.AnchorCommand = Class.define(
  function (win) { //��������
//	win = win || window.scope || window;
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


//����һ��window��each����,����Ϊar��insp
  window.each = function (ar, insp){
//����һ������r��ֵΪ[]
    var r = [];
//for ѭ�� ѭ������ i=0, i<ar����length��ֵ
    for(var i=0;i<ar.length;i++){
//ѭ������ ����һ������x,��ֵΪ����insp.
      var x = insp(i);
//�ж� ���x �����ڿգ�ִ��r��push����.
      if (x != null) r.push(x);
    }
//���x���ڿգ���r��������.
    return r;
  }


//
var response = function (id, txt){
//����һ������entity��ֵΪ ĳ�����requestTable����
	var entity = this.requestTable;
//�ж� entity 
	if (entity){
//����һ������doc��ֵΪ$Xml.Parser.fromString ��txt��
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
��1���������������ǰ���ע�ͣ�д�����Ĺ�������
��������ÿ���������ԣ����������á�

���2��Ҳ�Ǻ�����
�м��Ǹ���Ŀ������������


һ������������Ϊ����һ�������ķ���
*/