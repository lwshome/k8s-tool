const _logHandler={
  _data:_CtrlDriver._buildProxy({_logList:[],_setting:{highlights:[],cleanDynamicRegex:"([0-9 -:\/.]{17,23}|@[0-9a-f]{7,32})"}}),
  _init:function(){
    _logHandler._data._setting=JSON.parse(localStorage.getItem("logSetting")||'{"highlights":[],"cleanDynamicRegex":"([0-9 -:\/.]{17,23}|@[0-9a-f]{7,32})"}')
  },
  _saveSetting:function(){
    localStorage.setItem("logSetting",JSON.stringify(_logHandler._data._setting))
  },
  _showSetting:function(){
    _Util._confirmMessage({
      _tag:"div",
      _update:function(){
        _logHandler._saveSetting()
        _Util._resizeModelWindow()
      },
      _attr:{
        class:"bz-v-panel"
      },
      _items:[
        {
          _tag:"div",
          _attr:{
            style:"line-height:30px"
          },
          _items:[
            {
              _tag:"label",
              _items:[
                {
                  _tag:"input",
                  _attr:{
                    type:"checkbox"
                  },
                  _dataModel:"_logHandler._data._setting.autoMerge"
                },
                {
                  _tag:"span",
                  _text:"_k8sMessage._log._autoMerge"
                }
              ]
            }
          ]
        },
        {
          _if:"_logHandler._data._setting.autoMerge",
          _tag:"div",
          _attr:{
          },
          _items:[
            {
              _tag:"textarea",
              _attr:{
                placeholder:"_k8sMessage._log._cleanDynamicRegex",
                style:"width:calc(100% - 10px);height:50px;"
              },
              _dataModel:"_logHandler._data._setting.cleanDynamicRegex"
            }
          ]
        },
        {
          _tag:"div",
          _items:[
            {
              _tag:"div",
              _attr:{
                class:"bz-panel-header"
              },
              _items:[
                {
                  _tag:"header",
                  _text:"_k8sMessage._log._highlightTitle"
                },
                {
                  _tag:"button",
                  _attr:{
                    class:"btn btn-icon bz-plus bz-none-border",
                    style:"margin-top:5px;"
                  },
                  _jqext:{
                    click:function(ex){
                      _logHandler._data._setting.highlights==_logHandler._data._setting.highlights||[]
                      _logHandler._data._setting.highlights.push({css:"background-color:yellow;"})
                      _Util._resizeModelWindow()
                    }
                  }
                }
              ]
            },
            {
              _tag:"div",
              _attr:{
                class:"bz-panel-content"
              },
              _items:[
                {
                  _tag:"div",
                  _attr:{
                    style:"display:flex;margin-top:5px;"
                  },
                  _items:[
                    {
                      _tag:"input",
                      _attr:{
                        style:"flex:1",
                        class:"form-control",
                        placeholder:"_k8sMessage._log._regexValue"
                      },
                      _dataModel:"_logHandler._data._setting.highlights[_data._idx].value"
                    },
                    {
                      _tag:"input",
                      _attr:{
                        style:"flex:1;margin-left:-1px;",
                        class:"form-control",
                        placeholder:"_k8sMessage._log._style"
                      },
                      _dataModel:"_logHandler._data._setting.highlights[_data._idx].css"
                    },
                    {
                      _tag:"div",
                      _attr:{
                        style:"'margin-left:10px;margin-right:10px;line-height:21px;'+_data._item.css"
                      },
                      _text:"_k8sMessage._log._example"
                    },
                    {
                      _tag:"button",
                      _attr:{
                        class:"btn btn-icon bz-small-btn bz-delete bz-none-border"
                      },
                      _jqext:{
                        click:function(){
                          _logHandler._data._setting.highlights.splice(this._data._idx,1);
                          _Util._resizeModelWindow()
                        }
                      }
                    }
                  ],
                  _dataRepeat:"_logHandler._data._setting.highlights"
                }
              ]
            }
          ]
        }
      ]
    },[],_k8sMessage._log._title)
  },
  _closeLog:function(p) {
    let s=_logHandler._data._logList
    s.splice(s.indexOf(p),1)
    p._log=0
    _k8sProxy._send({
      _data:{
        method:"killProcess",
        data:"logs -f --tail=100 "+p._name
      },
      _success:function(v){
        _logHandler._data._showLog=s.length
      }
    })
  },
  _addLog:function(v,p){
    let _regex;
    try{
      _regex=_logHandler._data._setting.autoMerge?new RegExp(_logHandler._data._setting.cleanDynamicRegex,"gi"):0
    }catch(ex){}
    try{
      let e=p._element,_setTop
      if(e){
        if(e.scrollHeight-e.getBoundingClientRect().height-e.scrollTop<30){
          _setTop=1
        }

        v=v.split("\n").filter(x=>x).map(x=>{
          return {
            v:x,
            r:0,
            k:_regex?x.replace(_regex,""):x
          }
        })
        let os=e.children
        if(_regex&&!v.find(x=>{
          for(let i=os.length-1;i>=0&&os.length-i<1000;i--){
            let o=e.children[i]
            if(o.d.k==x.k){
              x.m=o
              return
            }
          }
          return 1
        })){
          v.forEach(x=>{
            x.m.d.r+=1
            let r=$(x.m).find("span.bz-log-repeat")[0]
            if(r){
              r.innerText=x.m.d.r
            }else{
              $(x.m).append($(`<span class="bz-log-repeat">${x.m.d.r}</span>`)[0])
            }
          })
        }else{
          v.forEach(x=>{
            if(x){
              if(p._even){
                p._even=""
              }else{
                p._even="even"
              }
              let r=""
              if(x.r){
                r=`<span class="bz-log-repeat">${x.r}</span>`
              }

              let o=$(`<pre class="${p._even}">${_highlight(x.v)}${r}</pre>`)[0]
              o.d=x
              delete x.m
              e.append(o)
            }
          })
        }
        while(e.children.length>5000){
          e.children[0].remove()
        }
        if(_setTop){
          e.scrollTop=e.scrollHeight
        }
      }
    }catch(ex){}

    function _highlight(v){
      let w=""
      _logHandler._data._setting.highlights.forEach(x=>{
        let ms=v.match(new RegExp(x.value,"gi"))||[]
        ms.forEach(y=>{
          if(y){
            let i=v.indexOf(y)
            w+=v.substring(0,i)+`<span style='${x.css}'>${y}</span>`
            v=v.substring(i+y.length)
          }
        })
      })
      return w+v
    }
  }
}
_logHandler._init()