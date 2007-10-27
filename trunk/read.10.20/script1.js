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
  function (win) { // diefine����������һ��һ����������
//	win = win || window.scope || window;
    this.init();//����init����
    this.win = win;//��win���Ը�ֵΪwin
    this.setUrl(win.location.href);//����setUrl����������Ϊwin������Ӷ���location��href����
  },
  null, {//diefine���������Զ�

    init : function (win) { //��init������ֵΪ������win�ĺ���
      this.commands = {};//��commands���Ը�ֵ
      this.executor = {};//��executor���Ը�ֵ
      this.win = null;//��win���Ը�ֵΪnull
      this.url = null;//��url���Ը�ֵnull
      this.cmdPattern = "cmd:{$cmdName}({$param})";//��cmdPattern���Ը�ֵΪһ���ַ���
    },
	
	/*����������þ�1������ �����Ƕ��󣬶���������2������ Ȼ����storeCommand����������ȡ��������������2����������*/
    setCommand : function (cmd, params){ //��setCommand������ֵΪ������cmd, params�ĺ���
      this.storeCommand({//�� storeCommand���������� ����һ�����󣬶���������2������
          cmdName : cmd,//cmdName����ֵΪsetCommand�����Ĳ��� cmd
          param : params//param����ֵΪsetCommand�����Ĳ��� params
        });
    },
/*�����õ���1��д����ķ�������������������1������*/


    storeCommand : function (cmd){//storeCommand ������ֵΪ������cmd�ĺ���
      this.commands[cmd.cmdName] = cmd;//��俴������ɶ��˼�������Ӧ���Ǹ� commands���Ը�ֵ======[]�����治֪����ʲô��˼
    },

    setUrl : function (url) { //setUrl������ֵΪ������url�ĺ���
      this.url = new URL(url);//url���Ը�ֵΪ ����Ϊurl��URL����======new.....����ʲô�õģ�����
      this.parseAnchorCommands();//����parseAnchorCommands����
    },

    getUrlObject : function (){//getUrlObject������ֵΪ����url���Ե�ֵ
      return this.url;
    },

/*��һ�κ�ģ�� ��ʼ*/
    serializeCmdToUrl : function (){//serializeCmdToUrl ������ֵ
      for (var i in this.commands){//for in ѭ�� commands����
        var tmp = this.commands[i];//������tmp��ֵ commands���飿����commands��������
        var cmd = { //����cmd����
          cmdName : tmp.cmdName,//��������cmdName ֵΪ������cmdName�Ķ���tmp======
          param   : tmp.param.join(",")//��������param ֵΪtmp������Ӷ���param��ֵΪ,��join����======
        };
		/*����һ������cmdStr ��ֵΪ������replace������ΪcmdPattern�Ķ���replace����������������
		��һ��/\{\$i(\w+)\}/��������ʲô���ڶ�����һ������Ϊa ,b �ĺ���*/
        var cmdStr = this.cmdPattern.replace(/\{\$i(\w+)\}/, function (a, b){
            return cmd[b]; //����ֵcmd[b]
          });
        this.url.anchor[cmdStr] = null;	/* add command to url as param name without value */
      }
    }, 


    getUrlStr : function (){ //getUrlStr������ֵ
      this.serializeCmdToUrl();//����serializeCmdToUrl����
      var str = this.getUrlObject().toStr();//����һ��str���� ��ֵΪtoStr������getUrlObjiect�����Ķ���
      this.setUrl(str);//����setUrl������ֵΪstr����
      return str;//����str������ֵ
    },

    parseAnchorCommands : function () {//parseAnchorCommands ������ֵ
      if (!this.url) return;//���this����û��url���ԵĻ� ����

      var anchors = this.url.anchor;// ����anchors��������ֵΪ����anchors��url���ԵĶ���

      for (var i in anchors){ //anchorsѭ��
        if (i.indexOf("cmd:") == 0){ //���i�Ĳ���Ϊ'cmd:'��indexOf����ֵΪ0
          var cmdStr = i.substr(4);//����cmdStr ��ֵΪֵ��4��substr����
          if (cmdStr == "") continue;//���cmdStr ֵΪ�� continue ִ����1��ѭ��

          var cmd = cmdStr.split("(");//����cmd��ֵΪ �����ǣ��ķ�����cmdStr����
            var cmdName = cmd[0];//cmdName���� ��ֵΪcmd[0]=====�����ǲ���һ�����飿
            var cmdParam = cmd[1].substr(0, cmd[1].length-1).split(",");//cmdParam������ֵΪ������,��split�����ģ�����Ϊ0, cmd[1].length-1��substr������cmd[1]���Ե�һ������
            this.setCommand(cmdName, cmdParam);//���ò���ΪcmdName, cmdParam��setCommand����

            delete anchors[i];//ɾ������anchors���������ݣ�����=====================
          }
        }
      },


	clearCommand : function (name){ //�� clearCommand ������ֵΪ������name�ĺ���
	if (this.commands[name]) //�������this.commands[name]������
	  delete this.commands[name];//ɾ��this.commands[name]���������ݣ�������==============
	}, 
	
	clearAllCommands : function (){//�� clearAllCommands ������ֵ
	this.commands = {};//����commands����
	},
	
	refreshUrl : function (){//�� refreshUrl ������ֵ
	this.win.location.hash = this.url.getHashStr(true);
	//��thisָ������win�Ӷ����location�Ӷ����hash���Ը�ֵΪthisָ��Ķ����url�Ӷ���Ĳ���Ϊtrue��getHashStr����
	}, 
	
	runCommands : function () { //�� runcommands ������ֵ
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
/*ģ������*/

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