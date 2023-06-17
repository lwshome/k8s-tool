var _Util={
  _getSplitter:function(t,_if){
    return {
      _if:_if,
      _tag:"div",
      _attr:{
        class:"bz-splitter-"+t,
      },
      _jqext:{
        mousedown:function(e){
          let o=this
          o._start=_Util._getMouseXY(e,this)
          let a=this.previousElementSibling,
              b=this.nextElementSibling,
              ar=a.getBoundingClientRect(),
              br=b.getBoundingClientRect()
          if(t=="v"){
            ar=ar.width
            br=br.width
          }else{
            ar=ar.height
            br=br.height
          }
          o.style.backgroundColor="var(--active-color)"
          let _onmousemove=document.body.onmousemove
          document.body.onmousemove=function(e){
            if(o._start&&e.buttons){
              let xy=_Util._getMouseXY(e,o)
              if(!$(document.body).hasClass("prevent-select")){
                $(document.body).addClass("prevent-select")
              }
              if(t=="v"){
                a.style.width="unset"
                b.style.width="unset"
                a.style.flex=ar+(xy.x-o._start.x)
                b.style.flex=br-(xy.x-o._start.x)
              }else{
                a.style.height="unset"
                b.style.height="unset"
                a.style.flex=ar+(xy.y-o._start.y)
                b.style.flex=br-(xy.y-o._start.y)
              }
            }else{
              o._start=0
              document.body.onmousemove=_onmousemove
              $(document.body).removeClass("prevent-select")
              o.style.backgroundColor="transparent"
            }
          }
        }
      }
    }
  },
  _clone:function(o){
    if($.type(o)=="array"){
      return $.extend(true,[],o);
    }else if($.type(o)=="object"){
      return $.extend(true,{},o);
    }
    return o;
  },
  _testPerformance:function(_fun){
    let t=Date.now()
    _fun()
    console.log(Date.now()-t)
  },
  _loadTextFromFile:function(_file,_fun){
    let _reader = new FileReader();

    _reader.readAsText(_file);

    _reader.onload = function() {
      _fun(_reader.result)
    };

    _reader.onerror = function() {
      alert(_k8sMessage._info._importFileError,_reader.error);
    };
  },
  _loadTextFromFiles:function(_files,_fun){
    let _reader = new FileReader(),
        rs=[];
    

    function _readFile(i) {
      if( i >= _files.length ) {
        return _fun(rs);
      }
      var _file = _files[i];
      _reader.onload = function(e) {  
        rs.push({_name:_file.name,_content:e.target.result});
        _readFile(i+1)
      }
      _reader.readAsText(_file);
    }
    _readFile(0);

    _reader.onerror = function() {
      alert(_k8sMessage._info._importFileError,_reader.error);
    };
  },
  _getZipFileContent:function(v,f){
    zip.createReader(new zip.BlobReader(v), function(zipReader) {
      zipReader.getEntries(function(_entries) {
        f(_entries)
			});
    }, function(a){alert(a)});
  },
  _insertTxtToEditor:function(o,w,_idx,_event){
    if($(o).hasClass("bz-js-editor")){
      return o._replaceSelectedText(o,w)
    }
    var start = o.selectionStart;
    var end = o.selectionEnd;
    _idx=_idx||w.length

    var $this = $(o);
    var value = $this.val();
    
    if(_idx<0){
      start+=_idx;
      _idx=w.length
    }

    $this.val(value.substring(0, start)+ w+ value.substring(end));

    o.selectionStart = o.selectionEnd = start + _idx;
    $(o).change();
    if(_event){
      _event.preventDefault()
    }
    if($(":focus")[0]!=o){
      $(o).focus();
    }
  },
  _copyText:function(w,_doc,ui){
    _doc=_doc||document
    let _isInput=["INPUT","TEXTAREA"].includes(w.tagName)
    let el =_isInput?w:$("<textarea readonly style='position:absolute;left:-9999px'></textarea>").appendTo(_doc.body);
    if(!_isInput){
      w=w.innerText||w
      if([Object,Array].includes(w.constructor)){
        w=JSON.stringify(w,0,2)
      }
      el.val(w)
    }
    el.select();
    _doc.execCommand('copy');
    if(!_isInput){
      el.remove();
    }
    w=ui||w
    if(w.constructor!=String){
      if(_isInput){
        w.select();
        w.focus()
      }else{
        let pu=w.parentElement||w,
            c="bz-enable-select"
        if(!$(pu).hasClass(c)){
          $(pu).addClass(c)
        }else{
          c=0
        }
        let _range = new Range(),
            _sel = w.ownerDocument.defaultView.getSelection();
            _sel.removeAllRanges();
            _range.collapse(true);
        _range.setStart(w, 0);
        _range.setEnd(w, 1);
        _sel.addRange(_range);
        setTimeout(()=>{
          _sel.removeAllRanges();
          if(c){
            $(pu).removeClass(c)
          }
        },100)
      }
    }
  },
  _copyData:function(o,_doc){
    _doc=_doc||document
    let d=$("<textarea readonly style='position:absolute;left:-9999px'></textarea>")
    d.appendTo(_doc.body);
    d.val(JSON.stringify(o))
    _Util._copyText(d[0],_doc)
    d.remove()
  },
  _getClipboardValue:function(_fun){
    try{
      let x=navigator.clipboard.readText();
      x.then(text => {
        try{
          _fun(text);
        }catch(ex){}
      })
    }catch(e){}
  },
  _selectText:function(o) {
    if (document.selection) {
      var range = document.body.createTextRange();
      range.moveToElementText(o);
      range.select();
    } else if (window.getSelection) {
      var range = document.createRange();
      range.selectNode(o);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  },
  _isXMLData:function(v){
    return v&&v.constructor==String&&v.trim().match(/^<([^ ]+).+<([^>]+)>$/s);
  },
  _formatMiniXML:function(v){
    let xx="",vv=v
    try{
      _handleStart("")
      _handleEnd("")
    }catch(ex){
      console.log(ex.stack)
      return vv
    }

    return xx.trim()

    function _handleStart(t){
      let x=v.match(/^<[^/][^>]*>/)
      if(x){
        x=x[0]
        v=v.substring(x.length)
        xx+=t+x
        if(x.endsWith("/>")){
          xx+=t+x+"\n"
          v=v.trim()
          _handleStart(t)
        }else{
          _handleContent(t)
          _handleStart(t)
        }
      }else if(v){
        xx+=t.substring(2)
        _handleEnd(t.substring(2))
      }
    }

    function _handleContent(t){
      let c=v.match(/^[^<]+/)||""
      if(c){
        c=c[0]
        if(c.trim()){
          xx+=c
        }
      }
      v=v.substring(c.length)
      _handleEnd(t)
    }

    function _handleEnd(t){
      let e=v.match(/^<\/[^>]+>/)
      if(e){
        e=e[0]
        xx+=e+"\n"
        v=v.substring(e.length)
      }else{
        xx+="\n"
        _handleStart(t+"  ")
      }

    }
  },
  _formatMessage:function(_msg,_value){
    if(_value&&_value.constructor!=Array){
      _value=[_value]
    }
    _msg=(_msg||"")+""
    for(var i=0;_value && i<_value.length;i++){
      var s=new RegExp("\\{"+i+"\\}","g");
      _msg=_msg.replace(s,_value[i])
    }
    return _msg;
  },
  _findKeyOuterBlock:function(vs){
    bs=bs||_Util.bd
    let ks=[],b,c,s="",ss="",_inComment1,_inComment2,i=0;
    if(_start){
      vs=vs.push?vs.splice(_start):vs.substring(_start)
    }
    for(i=0;i<vs.length;i++){
      c=vs[i]
      if(_inComment1){
        _inComment1=c!="\n"&&c!="\r"
      }else if(_inComment2){
        if(c=="/"&&vs[i-1]=="*"){
          _inComment2=0
        }
      }else if(c=="\\"||b){
        b=!b
      }else if(c=="/"&&"*/".includes(vs[i+1])&&(!ks.length||!"\"'`/".includes(ks[0].l))){
        _inComment1=vs[i+1]==c
        _inComment2=vs[i+1]=="*"
      }else if(c=="/"&&ss.trim().match(/[._$\wÀ-Üà-øoù-ÿŒœ\u4E00-\u9FCC\]\)]$/)){
      }else if(ks.length){
        let k=ks[0]
        if(k.r==c){
          if(k.n){
            k.n--
          }else{
            ks.shift()
          }
          s+=c;
          ss+=c;
          continue
        }else if(k.l==c){
          k.n++
          s+=c;
          ss+=c;
          continue
        }
      }
      if(bs[c]){
        ks.unshift({l:c,r:bs[c],n:0,p:{k:c}})
      }
      if(!_inComment1&&!_inComment2){
        ss+=c
      }
      s+=c;
    }
  },
  _isFunction:function(s){
    s=s.trim()
    return s.match(/^\(?(function|\([^\)]*\) *=> *)/)
  },
  _scrollToTop:function(o){
    while(o.parentElement){
      o=o.parentElement
      o.scrollTop=0
      o.scrollLeft=0
    }
  },
  _autoScrollToBottom:function(e,_setValueFun,_delay){
    if(_Util._autoScrollToBottomTime){
      return setTimeout(()=>{
        _Util._autoScrollToBottom(e,_setValueFun,_delay)
      },1)
    }
    try{
      _Util._autoScrollToBottomTime=1
      let _setTop
      if(e.scrollHeight-e.getBoundingClientRect().height-e.scrollTop<80){
        _setTop=1
      }
      _setValueFun()
      if(_setTop){
        setTimeout(()=>{
          e.scrollTop=e.scrollHeight
        },_delay||0)
      }
    }finally{
      _Util._autoScrollToBottomTime=0
    }
  },
  _jsonToCurl:function(d,v){
    try{
      let h="",b="";
      if(v.headers){
        h=JSON.parse(_Util._parseDynamicText(v.headers))
        h=Object.keys(h||{}).map(k=>{
          return `--header '${k}: ${h[k]}'`
        }).join(" ")
      }
      if(v.body){
        b=`--data-raw '${_Util._parseDynamicText(v.body)}'`
      }
      let s=`curl --location --request ${v.method} 'http://localhost:${d._forwarding.split(":")[0]}${v.url}' ${h} ${b}`
      return s
    }catch(ex){
      alert(ex.stack)
    }
  },
  _parseDynamicText:function(v){
    try{
      return eval("`"+v+"`")
    }catch(e){
      return v
    }
  },
  _focusElement:function(o){
    var r1=o.getBoundingClientRect()
    o.focus()
    var r2=o.getBoundingClientRect()
    if(r1.x==r2.x&&r1.y==r2.y){
      
      window.scrollTo(r1.x+window.scrollX-window.innerWidth/2,r1.y+window.scrollY-window.innerHeight/2)
    }
  },
  _setMoveWindow:function(_noMove){
    $(".bz-modal-window").toArray().forEach(o=>{
      if(o._data){
        o._data._noMoveable=_noMove
      }
    })
  },
  _closeModelWindow:function(o){
    if(o){
      return o._ctrl._close()
    }
    setTimeout(function(){
      if($(".bz-large-editor")[0]){
        $(".bz-textarea-ctr").click()
      }else if($(".bz-large")[0]){
        $(".bz-ui-switch").click()
      }else{
        while(_dialogList.find((v,i)=>{
          if(v&&!v._noEsc){
            v._close()
            return v
          }
        })&&Date.now()-_lastCloseDlgTime<50){}
        _lastCloseDlgTime=Date.now()
     }
   },10)
  },
  _checkKeycode:function(e) {
    var _keycode;
    if (window.event) {
      _keycode = window.event.keyCode;
    }else if (e) {
      _keycode = e.which;
    }
    return _keycode;
  },
  _trimSpace:function(v){
    return v.trim().replace(/\s+/g," ");
  },
  _checkBrowserType:function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name:"ie",version:(tem[1] || "")};
    }
    if(M[1]=== "Chrome"){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return {name:tem.slice(1).join(" ").replace("OPR", "Opera")};
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, "-?"];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return {name:M[0],version:M[1],letterWidth:M[0]=="firefox"?9:8};
  },
  _downloadFile:function(_name,_content,_type){
    if(_Util._checkBrowserType().name=="ie"){
      var blobObject = new Blob([_content],_type?{type:_type}:undefined); 
      
      window.navigator.msSaveBlob(blobObject, _name);
    }else{
      var a=$("<a></a>");
      $(document.body).append(a[0]);
      a.attr("download",_name).attr("href","data:application/octet-stream," + encodeURIComponent(_content))[0].click();
      a.remove();
    }
  },
  _downloadAsHtmlFile:function(_name,_content){
    if(!_content.startsWith("<!DOCTYPE html>")){
      _content="<!DOCTYPE html><html><header><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'></header><body>"+_content+"</body></html>"
    }
    if(_Util._checkBrowserType().name=="ie"){
      var blobObject = new Blob([_content]); 
      
      window.navigator.msSaveBlob(blobObject, _name);
    }else{
      var a=$("<a></a>");
      $(document.body).append(a[0]);
      a.attr("download",_name).attr("href","data:application/octet-stream," + encodeURIComponent(_content))[0].click();
      a.remove();
    }
  },
  //w: doc content 
  //n: file name
  _downloadAsWordFile:function(_name,_content){
    let w1="http:/"+"/schemas.microsoft.com/office/2004/12/omml"
    let w2="http:/"+"/www.w3.org/TR/REC-html40"
    let _sourceHTML = `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns:m="${w1}" xmlns="${w2}">

      <head>
          <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:TrackMoves>false</w:TrackMoves><w:TrackFormatting/><w:ValidateAgainstSchemas/><w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid><w:IgnoreMixedContent>false</w:IgnoreMixedContent><w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText><w:DoNotPromoteQF/><w:LidThemeOther>EN-US</w:LidThemeOther><w:LidThemeAsian>ZH-CN</w:LidThemeAsian><w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript><w:Compatibility><w:BreakWrappedTables/><w:SnapToGridInCell/><w:WrapTextWithPunct/><w:UseAsianBreakRules/><w:DontGrowAutofit/><w:SplitPgBreakAndParaMark/><w:DontVertAlignCellWithSp/><w:DontBreakConstrainedForcedTables/><w:DontVertAlignInTxbx/><w:Word11KerningPairs/><w:CachedColBalance/><w:UseFELayout/></w:Compatibility><w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="off"/><m:dispDef/><m:lMargin m:val="0"/> <m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr></w:WordDocument></xml><![endif]-->

          <meta charset='utf-8'/>
          <title>${_name}</title>
          <style>
          @page {
            size: 4in 6in landscape;
          }
          @media print {
            html, body {
              width: 210mm;height: 297mm;
            }
          }
          page[size="A4"] {
            background: white;
            width: 21cm;
            height: 29.7cm;
            display: block;
            margin: 0 auto;
            margin-bottom: 0.5cm;
            box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
          }
tbody td:first-child,tbody td:last-child{
  text-align:center;
}
          </style>
      </head>
      <body>${_content}</body></html>`;
     
     var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(_sourceHTML);
     var _fileDownload = document.createElement("a");
     document.body.appendChild(_fileDownload);
     _fileDownload.href = source;
     _fileDownload.download = _name;
     _fileDownload.click();
     document.body.removeChild(_fileDownload);
  },
  _downloadAsPdfFile:function(title,o) {
    let w= window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');
    let d=w.document,
        _txt=`<html><head><title>${title}</title></head><body>${o}</body></html>`;
    d.write(_txt);

    d.close(); // necessary for IE >= 10
    w.focus(); // necessary for IE >= 10
    setTimeout(function(){
      w.print();
      w.close();
    },100)

    return true;
  },
  _downloadAsZip:function(_files,_zipFileName,_fun){
    zip.createWriter(new zip.BlobWriter("application/zip"), function(_zipWriter) {
      _addFile(_zipWriter,0)
    }, function(_msg){
      alert(_msg)
    });

    function _addFile(_zipWriter,i){
      let f=_files[i]
      if(f){
        _zipWriter.add(f._name, new zip.BlobReader(f._data), function() {
          _addFile(_zipWriter,i+1)
        });
      }else{
        _zipWriter.close(function(blob) {
					var blobURL =URL.createObjectURL(blob);
          var _clickEvent = document.createEvent("MouseEvent");
          _clickEvent.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          let _downloadButton=$("<a></a>").appendTo(document.body)[0]
          
          _downloadButton.href = blobURL;
          _downloadButton.download = _zipFileName;
          _downloadButton.dispatchEvent(_clickEvent);
					zipWriter = null;
          $(_downloadButton).remove()
				});
      }
    }
  },
  _getNewPanelFromNewElements:function(os){
    return os.find(o=>{
      return $(o).find(os).length>os.length/2
    })
  },
  _splitWords:function(w,s){
    w=w.trim()
    s=s||"\n;,"
    for(var i=0;i<s.length;i++){
      if(w.includes(s[i])){
        s= w.split(s[i]);
        w=[]
        for(var i=0;i<s.length;i++){
          var ss=s[i].trim()
          if(ss){
            w.push(s)
          }
        }
        return w
      }
    }
    return [w]
  },
  _catchData:function(d,_level){
    if(!d||typeof d!="object"){
      return typeof d=="function"?undefined:d
    }
    let o=d.constructor==Array?[]:{}
    for(let k in d){
      let v=d[k]
      if(v!==undefined||typeof v=="function"){
        continue
      }else if(!_level&&v&&typeof v=="object"){
        continue
      }
      
      o[k]=_Util._catchData(v,_level-1)
    }
    return o
  },
  _alertMessage:function(_msg){
    if($(".alert-msg").toArray().find(a=>{
      if(a.innerText==_msg){
        let v=$(a).attr("repeat")
        if(v){
          v=parseInt(v.split(":")[1])+1
        }else{
          v=1
        }
        $(a).attr("repeat","("+_k8sMessage._common._repeat+": "+v+")")
        return 1
      }
    })){
      return
    }
    
    _msg="<div class='alert-msg'>"+_msg+"</div>"


    var _extraPara={};
    for(var i=1;i<arguments.length;i++) {
      var o=arguments[i];
      if ($.isFunction(o)) {
        _extraPara._fun=o;
      }else{
        _extraPara._exception=o;
      }
    }
    var d=_Util._clone(_Dialog),
        _winTagClass="bz-alert-window";
    d._viewDef._items[0]._attr.class+=" "+_winTagClass

    var _dialog={
      _title:_k8sMessage._common._message,
      // _modal:true,
      _moveable:true,
      _destroyOnClose:true,
      _buttons:[
        {
          _title:_k8sMessage._common._ok,
          _class:"btn btn-primary bz-alert-btn",
          _click:function(){
            d._close()
          }
        }
      ],
      _afterClose:function(){
        _Util._alertContent=""
        if (_extraPara._fun) {
          _extraPara._fun();
        }
      }
    };
    _msg+=_extraPara._exception?"\n\nStack:"+_extraPara._exception.stack:"";

    if(_msg.indexOf("</")<0 && _msg.length<=50){
      _msg="<nobr>"+_msg+"</nobr>";
    }
    if(_Util._alertContent && _Util._alertContent!=_msg){
      _msg=_Util._alertContent+"\n<hr/>\n"+_msg
    }
    
    _Util._alertContent=_msg;
    var o=$("<div style='min-width:150px;max-width:100%;word-break:break-all;margin:0;float:left;white-space: pre-wrap;'></div>")
    if(_msg.includes("</html>")){
      o=o.text(_msg);
    }else{
      o=o.html(_msg);
    }
    try{
      d._showMe(o[0],_dialog,window.document.body,_winTagClass);
    }catch(e){}
  },
  _promptMessage:function(d){
    k8s._uiSwitch._tmpValue=d._value||"";
    _Util._confirmMessage({
      _tag:"div",
      _items:[
        {
          _tag:"div",
          _text:d._msg
        },
        {
          _tag:"input",
          _attr:{
            class:"form-control",
            style:"width:calc(100% - 10px);margin:10px 0;padding:5px;"
          },
          _dataModel:"k8s._uiSwitch._tmpValue"
        }
      ]
    },[{
      _title:d._btnText||_k8sMessage._method._save,
      _class:"btn btn-primary",
      _click:function(e){
        d._fun(e,k8s._uiSwitch._tmpValue)
      }
    }],d._title||_k8sMessage._common._question,400)
  },
  _getParentElementByCss:function(p,o){
    p=$(p).toArray();
    return p.find(a=>{
      return $(a).find(o)[0]
    })
  },
  _confirmMessage:function(_msg,_btns,_title,_width,_noCancel,_cancelFun,_noModal,_body,_noMoreAsk){
    let _loading=_msg
    var d=_Util._clone(_Dialog),
        _winTagClass="bz-confirm-window";
    d._viewDef._items[0]._attr.class+=" "+_winTagClass
    let ww=window.innerWidth*0.618
    if(ww<400){
      ww=400
    }else if(_msg&&_msg.constructor==String){
      ww=Math.min(_msg.split("\n").filter(x=>x).sort((a,b)=>b.length-a.length)[0].length*8,ww)
    }
    _width=(_width||ww)+"";
    if(!_width.match(/\%/)){
      _width+="px"
    }
    _btns=_btns||[]
    _btns.forEach(b=>{
      b._class=b._class||"btn-primary "+(b._exClass||"")
      b._class+=" bz-left-space-10 btn pull-right"
      b._title=b._title
    })
    var _dialog=_CtrlDriver._buildProxy({
      _title:_title?_title:_k8sMessage._method._confirm,
      _width:400,
      _height:200,
      _modal:!_noModal,
      _moveable:1,
      _destroyOnClose:true,
      _cancelFun:_cancelFun,
      _buttons:_noCancel&&_noCancel!='_close'?[]:[
        {
          _title:_btns.length?_k8sMessage._method[_noCancel||!_btns.length?"_close":'_cancel']:_k8sMessage._method._close,
          _class:"btn-cancel btn btn-secondary bz-pull-right",
          _style:function(d){
            return "margin-right:5px;"
          },
          _click:function(_this){
            if(_cancelFun){
              if(_cancelFun()===0){
                return
              }
            }
            _this._ctrl._close();
          }
        }
      ]
    });

    var _content=$("<pre class='pull-left bz-dlg-content' style='word-break: break-word;white-space: pre-wrap;max-width:100%;width:100%;margin: 0;'></pre>")
    
    try{
      if(!_body&&window.event&&window.event.target){
        _body=window.event.target.ownerDocument.body
      }
    }catch(e){}
    if(!_body){
      _body=window.document.body
    }
  
    if(_msg.constructor==String){
      _content.html(_msg); 
    }else if(_msg.constructor==Object){
      _msg=_CtrlDriver._execute({},{},_msg,_body);
      _content.append(_msg); 
    }else{
      _content.append(_msg); 
    }
    if(_noMoreAsk){
      _content.append("<label style='display:block;margin:20px 0;'><input type='checkbox' onclick='this.checked?localStorage.setItem(\"BZ:"+_noMoreAsk+"\",1):localStorage.clear()'/>"+_k8sMessage._info._noMoreAsk+"</label>")
    }
    _content.css({opacity:0,position:"fixed"})
    $(_body).append(_content[0]);
    // $(document.body).append(_content[0]);
    var dm=_Util._getDomSize(_content[0]);
    _dialog._width=_width
    
    _dialog._height=parseInt(dm._height)+150;

    _dialog._height-=10

    _btns.forEach(b=>{
      b&&_dialog._buttons.unshift(b);
    })
    if(!_dialog._buttons.length){
      _dialog._height-=55
    }
    d._showMe(_content[0],_dialog,_body,_winTagClass);
    _dialog=$(d._window).find(".bz-modal-window")[0]
    _content.css({opacity:1,position:"unset"})

    _waitExe()
    _chkSize()
    _Util._setToTop(_dialog)
    function _waitExe(i){
      var _timer=$(_body).find(".bz-dlg-timmer-btn")
      if(_timer[0]){
        var s=_timer.find(".bz-second-num")[0]
        if(!s){
          s=$(_body).find("<span class='bz-second-num'> (31 s)</span>")[0];
          _timer.append(s)
        }
        var v=parseInt(s.innerText.substring(2))-1
        if(!v){
          return _timer.click()
        }
        s.innerText=" ("+v+" s)"
        setTimeout(_waitExe,1000)
      }
    }

    function _chkSize(){
      if(_loading&&_loading._load){
        return setTimeout(()=>{
          _chkSize()
        },100)
      }
      _Util._resizeModelWindow(_dialog,_body.ownerDocument)
    }
  },
  _attachResizeWindow:function(w){
    let o=$("<div class='bz-corner-resize'></div>").appendTo(w)
    let p,wr=w.getBoundingClientRect();
    $(w).css({"max-width":"unset",left:wr.left+"px",top:wr.top+"px",transform:"unset"})
    o.mousedown(function(e){
      let x=this
      o.p=_Util._getMouseXY(e)
      wr=w.getBoundingClientRect()
      e.preventDefault()
      e.stopPropagation()


      let _onmousemove=document.body.onmousemove
      document.body.onmousemove=function(e){
        if(o.p&&e.buttons){
          if(!$(document.body).hasClass("prevent-select")){
            $(document.body).addClass("prevent-select")
          }
          let q=_Util._getMouseXY(e)
          let wl=(q.x-o.p.x),
              wh=(q.y-o.p.y)

          wl+=wr.width
          wh+=wr.height
          $(w).css({width:wl+"px",height:wh+"px"})
        }else{
          o.p=0
          document.body.onmousemove=_onmousemove
          $(document.body).removeClass("prevent-select")
        }
      }
    })
  },
  _getTopZIndex:function(_curDom){
    _curDom=_curDom||document.body
    var os=$(_curDom.ownerDocument).find("*"),zz=100;
    for(var i=0;i<os.length;i++){
      var o=os[i];
      try{
        var z=parseInt($(o).css("z-index"))||0;
        if(z>=zz && z<100000 && !$(o).hasClass("bz-modal-bg")){
          zz=z+1;
        }
      }catch(e){}
    }
    if(zz<=100){
      zz=200;
    }
    return zz;
  },
  _isEventElement:function(v){
    return _Util._isInputObj(v)||$("[contenteditable=true]").find(v)[0]|| ["OPTION","BUTTON","A"].includes(v.tagName)
  },
  _isStdInputElement:function(v){
    return this._isInputTag(v.tagName) && !["image","button","reset","submit","hidden"].includes(v.type);
  },
  _isInContentEditable:function(e){
    if($(e).attr("contenteditable")){
      return 1;
    }
    if(e && e.tagName!="BODY"){
      return this._isInContentEditable(e.parentNode);
    }
  },
  _isInputTag:function(v){
    return ["INPUT","SELECT","TEXTAREA"].includes(v);
  },
  _isInputObj:function(e,_chkReadonly){
    if(e.nodeType!=1){
      return
    }
    if((!_chkReadonly||!$(e).attr("readonly")||e.type=="file")&&this._isStdInputElement(e)||this._isInContentEditable(e)){
      return 1
    }
    let z=(e.dataset.bz||"").includes("$field")
    if(z){
      return $(":bz($form)").toArray().find(x=>{
        if($(x).find(e)[0]){
          return 1
        }
      })
    }
  },
  _setDrag:function(_handlers,_curDom, _except,_fun){
    _curDom._position=$(_curDom).css("position")
    let _nsSlider=$(_curDom).css("cursor")=="row-resize"
    let _ewSlider=$(_curDom).css("cursor")=="col-resize"
    var _dPos,_mPos,_dSize,_tmpMouseMove,_tmpMouseUp,_tmpSelect,
        _uiSwitch=k8s._uiSwitch;
    for(var i=0;i<_handlers.length;i++){
      var h=_handlers[i];
      if(!h){
        continue;
      }
      h.onmousedown=function(e){
        _Util._setToTop(_curDom);
        let c=this.parentElement.getBoundingClientRect(),
            r=this.getBoundingClientRect()
        // $(this).css({position:"fixed"})
        if(_ewSlider){
          $(this).css({top:c.top+"px",height:c.height+"px",left:r.left+"px"})
        }else if(_nsSlider){
          console.log("left:"+c.left+", top:"+r.top)
          $(this).css({left:c.left+"px",width:c.width+"px",top:r.top+"px"})
        }

        if(_curDom._data&&_curDom._data._noMoveable){
          return
        }
        if(_Util._isEventElement(e.target)){
          return;
        }
        if(_except){
          if(_except.constructor==String){
            if($(_except).find(e.target).length||$(_except).is(e.target)){
              return;
            }
          }else{
            for(var i=0;i<_except.length;i++){
              if(_except[i]==e.target || $(_except[i]).find("*").is(e.target)){
                return;
              }
            }
          }
        }
        _uiSwitch._inHandleSize=1
        
        
        _mPos=_Util._getMouseXY(e);
        _dPos=_Util._getDomXYForDrag(_curDom);
        _dSize=_Util._getDomSize(_curDom);
        
        if(this.ownerDocument.onmousemove!=_mousemove){
          _tmpMouseMove=this.ownerDocument.onmousemove;
        }
        
        if(this.ownerDocument.onmouseup!=_mouseup){
          _tmpMouseUp=this.ownerDocument.onmouseup;
        }
        if(this.ownerDocument.body.onselectstart!=_selectText){
          _tmpSelect=this.ownerDocument.body.onselectstart;
        }
        
        this.ownerDocument.onmousemove=_mousemove;
        this.ownerDocument.onmouseup=_mouseup;
        this.ownerDocument.body.onselectstart=_selectText;
      }
    }
    var _mousemove=function(e){
      if(_uiSwitch._inHandleSize && e.buttons){
        var _newMPos=_Util._getMouseXY(e);
        var x=_newMPos.x-_mPos.x+_dPos.x
        var y=_newMPos.y-_mPos.y+_dPos.y
        var _hSize=50;
        var ww=_curDom.ownerDocument.defaultView.innerWidth;
        var wh=_curDom.ownerDocument.defaultView.innerHeight;
        $(_curDom).css({transform:"unset"})
        if(x>0 && x+_hSize<ww&& y>0 && y+_hSize<wh){
          return _setNewPos(_curDom,x,y)
        }
        if(x>0 && x+_hSize>ww){
          x=ww-_hSize;
        }
        if(y>0 && y+_hSize>wh){
          y=wh-_hSize;
        }
        // if(x<0){
        //   x=0;
        // }
        // if(y<0){
        //   y=0;
        // }
        return _setNewPos(_curDom,x,y)
      }else if(_uiSwitch._inHandleSize){
        this.onmouseup()
      }
    };
    var _mouseup=function(e){
      _uiSwitch._inHandleSize=0;
      this.onmousemove=_tmpMouseMove;
      this.onmouseup=_tmpMouseUp;
      this.body.onselectstart=_tmpSelect;
      
      $(_curDom).css({position:_curDom._position})
      if(_nsSlider){
        $(_curDom).css({width:"100%"})
      }
      var _newMPos=_Util._getMouseXY(e);
      _fun&&_fun(_newMPos.x,_newMPos.y,_curDom,1)
    }
    
    function _setNewPos(o,x,y){
      if(!_fun||_fun(x,y,o)){
        if(_nsSlider){
          $(o).css({top:y+"px"});
        }else if(_ewSlider){
          $(o).css({left:x+"px"});
        }else{
          $(o).css({left:x+"px",top:y+"px"});
        }
      }
    }
    
    var _selectText=function(){return false};
    setTimeout(function(){
      _Util._setToTop(_curDom);
    },100)
  },
  _getMouseXY:function(e) {
    var _posx = 0;
    var _posy = 0;
    var _doc=e.target.ownerDocument;
    if (e.pageX || e.pageY)   {
      _posx = e.pageX;
      _posy = e.pageY;
    }else if (e.clientX || e.clientY)   {
      _posx = e.clientX;
      _posy = e.clientY;
    }
    _posx -= _doc.scrollingElement.scrollLeft;
    _posy -= _doc.scrollingElement.scrollTop;
    return {x:_posx,y:_posy};
  },
  _setToTop:function(_curDom){
    if($(_curDom.parentElement).hasClass("bz-modal-bg")){
      _curDom=_curDom.parentElement
    }

    var z=this._getTopZIndex(_curDom)||200;
    var zz=parseInt($(_curDom).css("z-index"))||200;
    if(!zz || z>zz){
      $(_curDom).css({"z-index":z})
    }
  },
  _getDomXYForDrag:function(obj){
    let _nsSlider=$(obj).css("cursor")=="row-resize"
    let _ewSlider=$(obj).css("cursor")=="col-resize"
    if(obj.defaultView){
      return {x:0,y:0};
    }
    var o=obj.getBoundingClientRect()
    var x=o.x,
        y=o.y,
        t=$(obj).css("transform");
    if(!t||t=="none"){
      if(_nsSlider){
        $(obj).css({top:y+"px"})
      }else if(_ewSlider){
        $(obj).css({left:x+"px"})
      }else{
        $(obj).css({left:x+"px",top:y+"px"})
      }
      o=obj.getBoundingClientRect()
      var x1=o.x,
          y1=o.y;
      
      if(x1!=x||y1!=y){
        x=x+x-x1
        y=y+y-y1
        if(_nsSlider){
          $(obj).css({top:y+"px"})
        }else if(_ewSlider){
          $(obj).css({left:x+"px"})
        }else{
          $(obj).css({left:x+"px",top:y+"px"})
        }
      }
    }
    return {"x":x, "y":y};    
  },
  _getDomSize:function(_dom){
    var _tmp=false;
    if(!_dom.parentElement){
      _tmp=$("<div></div>").appendTo(document.body)
      $(_dom).appendTo(_tmp);
    }
    var _size={_width:_dom.offsetWidth,_height:_dom.offsetHeight};
    if(_tmp){
      $(_tmp).remove();
    }
    return _size;
  },
  _resizeModelWindow:function(o,_doc){
    clearTimeout(_Util._resizeWindowTimer)
    _Util._resizeWindowTimer=setTimeout(function(){
      _doc=_doc||window.document
      let os=$(_doc).find(".bz-modal-window").toArray()
      if(o){
        o=os.find(oi=>{
          return $(oi).find(o).length
        })
        _doIt(o)
      }else{
        os.forEach(o=>{
          _doIt(o)
        })
      }
    },10)
    
    function _doIt(o,i){
      i=i||0
      o=$(o)
      let v=o.find(".bz-dlg-content")[0]
      if(v){
        let r=o[0].getBoundingClientRect(),
            wh=_doc.defaultView.innerHeight,_resize;

        if(r.top>wh-r.bottom){
          _resize=wh-r.bottom>20
        }

        o.css({height:"100px"})
        let h=100+v.scrollHeight-v.getBoundingClientRect().height+40
        if(!$(v.parentElement.parentElement).find(".bz-modal-footer")[0]){
          h-=40
        }
        o.css({height:h+"px"})
        if(!v.innerText&&i<10&&v.getBoundingClientRect().height<10){
          return setTimeout(()=>{
            _doIt(o,i+1)
          },100)
        }
        if(_resize){
          r=o[0].getBoundingClientRect()
          if(r.top>wh-r.bottom){
            if(wh-r.bottom<20){
              o.css({top:r.top-20+wh-r.bottom+"px"})
            }
          }
        }
      }
    }
  },
  _takeScreenshot:function(o,e){
    let r=o.getBoundingClientRect()
    if(e.x>r.x+r.width-30&&e.y<r.y+30){
      $(o).removeClass("bz-camera-panel")
      $(o).addClass("bz-taking-picture")
      html2canvas(o).then(canvas => {
        canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({'image/png': blob})]));
        $(o).addClass("bz-camera-panel")
        $(o).removeClass("bz-taking-picture")
      });
    }
  }
};

var _DialogViewDef={
  //modal cover
  id:"_dialog",
  _tag:"div",
  _attr:{
    "class":function(d){
      var c=window.extensionContent?"BZIgnore":""
      return d._modal?"bz-modal-bg "+c:"bz-bg "+c
    }
  },
  _animation:{
    _hide:function(e,_fun){$(e).fadeOut("slow",_fun)}
  },
  _items:[
    {
      //Main window
      _tag:"div", 
      _attr:{
        "class":"bz-modal-window",
        style:function(d,c){
          //if(1||d._moveable&&!d._modal){
          //}
          var _innerSize=_Util._getDomSize(d._content);
          if(!d._width){
            d._width=_innerSize._width+30+"px";
          }else if(!(d._width+"").match(/(\%|px)/)){
            d._width+="px"
          }
          if(!d._height){
            d._height=_innerSize._height+165;
          }
          s=d._inMax?"width:90% !important;height:90% !important;":"width:"+d._width+" !important;max-width:90%;height:"+d._height+"px !important;min-width:450px;";
          if(d._moveable&&!d._modal&&_Dialog._position){
            s+="top:"+_Dialog._position.top+"px;left:"+_Dialog._position.left+"px;transform:unset;"
          }
          return s;
        }
      },
      _after:function(o){
        // var oo=".bz-modal-header";
        if(!o._dragDefined){
          o._dragDefined=true;
          setTimeout(function(){
            _Util._setDrag([o],o);
          },100);
        }
      },
      _items:[
        {
          _tag:"div",
          _attr:{
            "class":"bz-modal-header",
          },
          _items:[
            {
              _text:"_data._title"
            },
            {
              _tag:"button",
              _attr:{
                style:"margin-top:15px;",
                class:"btn btn-icon bz-close bz-none-border pull-right"
              },
              _jqext:{
                click:function(e){
                  _Util._closeModelWindow(this)
                  let f=this._data._cancelFun
                  f&&f.constructor==Function&&f(e)
                }
              }
            }
          ]
        },
        {
          _tag:"div",
          _attr:{
            class:"bz-modal-body disable-select",
            style:function(d){
              if(!d._buttons.length){
                return "bottom:0;"
              }else{
                return "bottom:55px;"
              }
            }
          },
          _html:"_data._content"
        },
        {
          _if:"_data._buttons.length",
          _tag:"div",
          _attr:{
            "class":"bz-modal-footer",
            style:function(d){
              if(d._buttons.length==1){
                return "text-align:center;"
              }
              return "";
            }
          },
          _items:[
            {
              _if:"_data._buttons.find(x=>x._options)",
              _tag:"span",
              _attr:{
                class:"pull-left"
              },
              _items:[
                {
                  _tag:"select",
                  _attr:{
                    class:"form-control",
                    style:"width:150px;"
                  },
                  _items:[
                    {
                      _tag:"option",
                      _attr:{
                        value:"_data._item._value||_data._key"
                      },
                      _text:"_data._item._text||_data._item",
                      _dataRepeat:"_data._item._dataRepeat"
                    }
                  ],
                  _dataModel:function(d){
                    return d._item._dataModel
                  },
                  _dataRepeat:function(d){
                    return d._buttons.filter(x=>x._options).map(x=>x._options)
                  },
                  _jqext:"_data._item._jqext"
                }
              ]
            },
            {
              _tag:"button",
              _dataRepeat:"_data._buttons",
              _attr:{
                disabled:function(d){
                  if(d._item._if){
                    if(d._item._if.constructor==Function){
                      return !d._item._if()
                    }else if(d._item._if.constructor==String){
                      eval("var v="+d._item._if)
                      return !v
                    }
                    return !d._item._if
                  }
                },
                tabindex:"_data._supData._buttons.length-_data._idx",
                "class":"_data._item._class.constructor==Function?_data._item._class(_data):_data._item._class",
                style:"_data._item._style.constructor==Function?_data._item._style(_data):_data._item._style"
              },
              _text:"_data._item._title",
              _jqext:{
                click:function(e){
                  this._data._item._click(this,e);
                }
              }
            }
          ]
        }
      ]
    }
  ],
  _jqext:{
    mousedown:function(e){
      if(e.target==this){
        _Util._closeModelWindow()
      }
    }
  }
};

var _dialogList=[];
var _lastCloseDlgTime=0;

var _Dialog={
  _comps:{},
  _viewDef:_DialogViewDef,
  _showMe:function(_content,_data,_area,_winTagClass){
    this._data=_data;
    this._data._content=_content;
    this._area=_area;
    if(!_data._modal){
      let bg=$(_area).find("."+_winTagClass).toArray().pop()
      if(bg){
        if(_winTagClass=="bz-confirm-window"){
          _Dialog._position=bg.getBoundingClientRect()
          $(".bz-confirm-window .btn-cancel").click()
        }
        $(".bz-alert-window .btn-primary").click()
      }
    }
    this._window=_CtrlDriver._execute(this);
    var _this=this;
    setTimeout(function(){
      _this._initLayout();
      // if($(_this._window).hasClass("bz-modal-bg")){
      //   _this._window.style.zIndex=10000000
      // }else{
      //   _Util._setToTop($(_this._window).find(".bz-modal-window")[0])
      // }
    },100);
    return _this._window
  },
  _initLayout:function(){
    var d=this._data;
    var o=this._data._content;
    _dialogList.unshift(this)

    var _input=$(".bz-modal-bg:last").find("input,select,.bz-js-editor-box");
    if(_input.length){
      _input.toArray().find(x=>{
        if(x.getBoundingClientRect().width>10){
          x.focus()
          return 1
        }
      })
    }else{
      var btn=$(".bz-modal-bg:last button.btn-primary:eq(0)");
      if(btn.length){
        btn.focus()
      }else{
        $(".bz-modal-bg button:last").focus();
      }
    }
  },
  _close:function(){
    if (this._data._afterClose) {
      this._data._afterClose();
    }
    $(this._comps._dialog).remove();
    _dialogList.splice(_dialogList.indexOf(this),1)
  },
  _isSameDlg:function(o){
    return $(this._window).find(o).length
  }
};

alert=function(a,b,c,d,e){
  if(a&&[Object,Array].includes(a.constructor)){
    a=JSON.stringify(a,0,2)
  }
  if(a!==undefined&&a!==null&&a.constructor!==String){
    a=a+""
  }
  _Util._alertMessage(_Util._formatMessage(a,[b,c,d,e]));
}
