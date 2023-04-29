//Machine learn
const k8s={
  _uiSwitch:_CtrlDriver._buildProxy({_curMainTab:"_pods"}),
  _data:_CtrlDriver._buildProxy({_curCtrl:0,_config:{stars:[]}}),
  _getKey:function(){
    k8s._key=k8s._key||Date.now()
    return k8s._key++
  },
  _getInitData:function(){
    let d=k8s._data
    d._loading=1
    d._podList=0
    d._serviceList=0

    k8s._getNameSpaceList(function(){
      if(!k8s._data._config.defaultNS){
        k8s._getConfig(function(){
          _loadData()
        })
      }else{
        _loadData()
      }
    })

    function _loadData(){
      k8s._getServices(function(){
        k8s._getPods(function(){
          k8s._loadStar()
        })
      })
    }
  },
  _getShowList:function(s,f){
    f=f||k8s._data._config.filter
    if(f){
      s=s.filter(x=>k8s._isShowItem(x,f))
    }
    return s
  },
  _openFunSetting:function(t){
    k8s._data._config[t]=k8s._data._config[t]||[];
    k8s._uiSwitch._configList=k8s._data._config[t];
    if(t=="api"){
      k8s._uiSwitch._configList=k8s._uiSwitch._configList.filter(x=>x.podGroup==k8s._data._curGroup)
    }

    _Util._confirmMessage({
      _tag:"div",
      _update:function(){
        setTimeout(()=>{
          k8s._saveSetting()
        })
      },
      _attr:{
        class:"bz-fun-setting-dialog"
      },
      _items:[
        {
          _tag:"div",
          _attr:{
            class:"bz-panel-header"
          },
          _items:[
            {
              _tag:"header",
              _text:"_k8sMessage._setting._list"
            },
            {
              _tag:"button",
              _attr:{
                class:"btn btn-icon bz-plus bz-none-border bz-small-btn",
                style:"margin-top:2px;"
              },
              _jqext:{
                click:function(ex){
                  let d={}
                  if(t=="api"){
                    d.podGroup=k8s._data._curGroup
                  }
                  k8s._uiSwitch._configList.push(d)
                  if(t=="api"){
                    k8s._data._config.api.push(k8s._uiSwitch._configList[k8s._uiSwitch._configList.length-1])
                  }
                  let ls=k8s._uiSwitch._configList
                  k8s._uiSwitch._configList=[]
                  k8s._uiSwitch._configList=ls
                  _Util._resizeModelWindow()
                  setTimeout(()=>{
                    let os=$(".bz-fun-setting-dialog input")
                    $(os[os.length-2]).focus()
                  },100)
                }
              }
            }
          ]
        },
        {
          _tag:"div",
          _attr:{
            class:"bz-panel-content",
            style:"margin-bottom:10px;max-height:600px;"
          },
          _items:[
            {
              _tag:"div",
              _attr:{
                class:"bz-item-row"
              },
              _items:[
                {
                  _if:function(d){
                    return !d._idx||(t=="cmd")
                  },
                  _tag:"hr",
                  _attr:{
                    style:"width:99%"
                  }
                },
                {
                  _tag:"div",
                  _attr:{
                    style:"display:flex;margin-top:5px;"
                  },
                  _items:[
                    {
                      _tag:"input",
                      _attr:{
                        style:"flex:1;",
                        class:"form-control bz-oneline-input",
                        placeholder:"_k8sMessage._common._name"
                      },
                      _dataModel:`k8s._uiSwitch._configList[_data._idx].name`
                    },
                    {
                      _if:function(){
                        return t=="link"
                      },
                      _tag:"input",
                      _attr:{
                        style:"flex:1;margin-left:10px;",
                        class:"form-control bz-oneline-input",
                        placeholder:"_k8sMessage._common._value"
                      },
                      _dataModel:`k8s._uiSwitch._configList[_data._idx].value`
                    },
                    {
                      _if:function(){
                        return t=="api"
                      },
                      _tag:"select",
                      _attr:{
                        style:"flex:1;margin-left:10px;",
                        class:"form-control bz-oneline-input"
                      },
                      _items:[
                        {
                          _tag:"option",
                          _attr:{
                            value:"_data._item"
                          },
                          _text:"_data._item",
                          _dataRepeat:"k8s._data._config.filter.split('|')"
                        }
                      ],
                      _dataModel:`k8s._uiSwitch._configList[_data._idx].podGroup`
                    },
                    {
                      _if:function(){
                        return t=="api"
                      },
                      _tag:"button",
                      _attr:{
                        class:"btn btn-icon bz-play bz-none-border",
                        title:"_k8sMessage._method._try"
                      },
                      _jqext:{
                        click:function(){
                        }
                      }
                    },{
                      _tag:"button",
                      _attr:{
                        title:"_k8sMessage._method.delete",
                        class:"btn btn-icon bz-delete bz-none-border"
                      },
                      _jqext:{
                        click:function(){
                          let o=k8s._uiSwitch._configList.splice(this._data._idx,1);
                          if(t=="api"){
                            k8s._data._config.api.splice(k8s._data._config.api.indexOf(o),1)
                          }
                          let ls=k8s._uiSwitch._configList
                          k8s._uiSwitch._configList=[]
                          k8s._uiSwitch._configList=ls
        
                          _saveList()
                        }
                      }
                    }
                  ]
                },
                {
                  _if:function(){
                    return t=="cmd"
                  },
                  _tag:"textarea",
                  _attr:{
                    style:"height:100px;",
                    class:"form-control bz-oneline-input",
                    placeholder:"_k8sMessage._common._value"
                  },
                  _dataModel:`k8s._uiSwitch._configList[_data._idx].value`
                },
                {
                  _if:function(){
                    return t=="api"
                  },
                  _tag:"div",
                  _attr:{
                    style:"display:flex;flex-direction:column;"
                  },
                  _items:[
                    {
                      _tag:"div",
                      _attr:{
                        style:"display:flex;"
                      },
                      _items:[
                        {
                          _tag:"select",
                          _attr:{
                            class:"form-control",
                            style:"width:unset;"
                          },
                          _items:[
                            {
                              _tag:"option",
                              _text:"_data._item",
                              _attr:{
                                value:"_data._item"
                              },
                              _dataRepeat:["GET","POST","PUT","DELETE","PATCH"]
                            }
                          ],
                          _dataModel:`k8s._uiSwitch._configList[_data._idx].method`
                        },
                        {
                          _tag:"input",
                          _attr:{
                            class:"form-control",
                            style:"flex:1",
                            placeholder:"URL"
                          },
                          _dataModel:`k8s._uiSwitch._configList[_data._idx].url`
                        }
                      ]
                    },
                    {
                      _tag:"textarea",
                      _attr:{
                        placeholder:"headers (JSON)",
                        style:"height:50px"
                      },
                      _dataModel:`k8s._uiSwitch._configList[_data._idx].headers`
                    },
                    {
                      _tag:"textarea",
                      _attr:{
                        placeholder:"body (JSON)",
                        style:"height:150px"
                      },
                      _dataModel:`k8s._uiSwitch._configList[_data._idx].body`
                    }
                  ]
                }
              ],
              _dataRepeat:function(){
                return k8s._uiSwitch._configList
              }
            }
          ]
        }
      ]
    },[],_k8sMessage._setting[t],t=="cmd"?"80%":0,1)
  
    function _saveList(){
      k8s._saveSetting()
      _Util._resizeModelWindow()
    }
  },
  _addFile:function(d,p,f){
    _Util._promptMessage({
      _msg:_k8sMessage._info._askFileName,
      _fun:function(c,v){
        _k8sProxy._send({
          _data:{
            method:"addFile",
            data:{
              serverName:d._name,
              path:p._path+"/"+v,
              folder:f
            }
          },
          _success:function(r){
            k8s._getFileList(d,p)
            c._ctrl._close()
          }
        })
      }
    })
  },
  _loadStar:function(pp){
    if(!k8s._data._loading&&k8s._data._serviceList&&k8s._data._podList){
      if(k8s._data._config.stars.length){
        let gs={},s=k8s._getShowList(k8s._data._podList)
        k8s._data._config.stars.forEach(x=>{
          gs[x.s]=gs[x.s]||[]
          gs[x.s].push(x.p)
        })
        Object.keys(gs).forEach(x=>{
          let k=x
          if(!s.find(z=>z._name==x)){
            x=0
            let ss=k8s._getServiceByPod(k)
            if(ss){
              ss=k8s._getPodByService(ss)//.filter(y=>s.includes(y))
              if(ss.length){
                x=ss.find(y=>y._ready)
                if(x){
                  x=x._name
                  k8s._data._config.stars.forEach(y=>{
                    if(y.s==k){
                      y.s=x
                    }
                  })
                  k8s._saveSetting()
                }
              }
            }
          }
          if(x&&(!pp||pp.includes(x))){
            x=k8s._data._podList.find(y=>y._name==x)
            _searchStars(x,gs[k])
          }
        })
      }
      return
    }
    setTimeout(()=>{
      k8s._loadStar()
    },1000)

    function _searchStars(d,s){
      d._loading=1
      d._subList=[]
      let r=""
      _k8sProxy._send({
        _data:{
          method:"searchStars",
          data:{
            serverName:d._name,
            stars:s
          }
        },
        _success:function(v){
          if(!v.startsWith("COMPLETE: ")){
            r+=v+"\n"
            return
          }
          v=r
          v=v.trim().split("\n").filter(x=>x&&!x.startsWith("ls: ")&&!x.startsWith("command terminated with")).map(x=>x.trim().split(/\s+/))

          let i=0,gs={},g,k,os=[]
          v.forEach(x=>{
            if(x.length<9){
              g=[]
              if(x[0].endsWith(":")){
                k=x[0].substring(0,x[0].length-1)
              }else{
                k=s.shift()
              }
              gs[k]=g
            }else{
              let n=x.pop()
              if(x[x.length-1]=="->"){
                x.pop()
                n=x.pop()
              }
              n= {
                _name:n,
                _date:([x.pop(),x.pop(),x.pop()]).reverse().join(" "),
                _size:x.pop(),
                _folder:x[0][0]=="d",
                _chmod:x[0],
                _pod:d,
                _path:n
              }
              if(s.includes(n._name)){
                os.push(n)
                s.splice(s.indexOf(n._name),1)
              }else{
                g.push(n)
              }
              n._name=n._name.replace("etc/../","")
            }
          })
          
          Object.keys(gs).map(k=>{
            gs[k].forEach(x=>x._path=k+"/"+x._path)
            let o={
              _name:k.replace("etc/../",""),
              _date:"xxx",
              _size:"xxx",
              _folder:1,
              _chmod:"xxx",
              _pod:d,
              _path:k,
              _subList:gs[k],
              _open:1
            }
            os.push(o)
          })

          d._subList=os
          k8s._orderFileList(d)
        }
      })
    }  
  },
  _orderFileList:function(d){
    d._subList.sort((a,b)=>{
      if(a._folder){
        if(b._folder){
          return a._name>b._name?1:-1
        }else{
          return -1
        }
      }else if(b._folder){
        return 1
      }else{
        return a._name>b._name?1:-1
      }
    })
    d._open=1
    d._loading=0
  },
  _searchFile:function(d){
    _Util._promptMessage({
      _msg:_k8sMessage._info._askSearchFile,
      _fun:function(c,sv){
        d._loading=1
        d._subList=[]
        let s=(d._pod||d)._name,p=d._path||"/"
        _k8sProxy._send({
          _data:{
            method:"searchFile",
            data:{
              serverName:s,
              path:p.replace("etc/../","")||"/",
              file:sv
            }
          },
          _success:function(v){
            v=v.trim().split("\n").map(x=>x.trim().split(/\s+/))
            v=v.filter(x=>x.length>=11)
            v=v.map(x=>{
              x.shift()
              x.shift()
              let n=x.pop()
              if(x[x.length-1]=="->"){
                x.pop()
                n=x.pop()
              }
              return {
                _name:n,
                _date:([x.pop(),x.pop(),x.pop()]).reverse().join(" "),
                _size:x.pop(),
                _folder:x[0][0]=="d",
                _chmod:x[0],
                _pod:d._pod||d,
                _path:n
              }
            })
            d._subList.push(...v)
            k8s._orderFileList(d)
            c._ctrl._close()
          }
        })
      }
    })

  },
  _getServiceByPod:function(d){
    return k8s._data._serviceList.find(x=>(d._name||d).includes(x._name))
  },
  _getPodByService:function(d){
    return k8s._data._podList.filter(x=>x._name.includes(d._name||d))
  },
  _setStar:function(d){
    let c=k8s._data._config
    c.stars=c.stars||[]
    let v={s:d._pod._name,p:d._path}
    if(!k8s._isStar(d)){
      c.stars.push(v)
    }else{
      c.stars=c.stars.filter(x=>x.s!=v.s||x.p!=v.p)
    }
    k8s._saveSetting()
  },
  _isStar:function(d){
    let c=k8s._data._config
    let v={s:d._pod._name,p:d._path}
    return c.stars.find(x=>x.s==v.s&&x.p==v.p)
  },
  _getConfig:function(_fun){
    _k8sProxy._send({
      _data:{
        method:"getConfig"
      },
      _success:function(v){
        for(let k in v){
          k8s._data._config[k]=v[k]
        }

        _logHandler._data._setting=v.log
        setTimeout(()=>{
          _CtrlDriver._refreshData(k8s._data._config,"defaultNS")
        },500)
        _fun&&_fun()
      }
    })
  },
  _saveSetting:function(){
    _k8sProxy._send({
      _data:{
        method:"saveConfig",
        data:k8s._data._config
      }
    })
  },
  _getPods:function(_fun,_noloading){
    clearTimeout(k8s._loadPodsTime)
    _k8sProxy._send({
      _noloading:_noloading,
      _data:{
        method:"getList",
        data:{
          type:"pods"
        }
      },
      _success:function(v){
        v=v.trim().split("\n").map(x=>x.split(/\s+/))
        v.shift()
        v=v.filter(x=>x[2]!="Completed")
        v=v.map(x=>{
          return {
            _name:x[0],
            _ready:x[1][0]!="0",
            _status:x[2],
            _age:x.pop(),
            _path:"etc/.."
          }
        })
        if(!k8s._data._podList){
          k8s._data._podList=v
          k8s._assignPSList()
        }else{
          let _toLoadStar
          k8s._data._podList.forEach(x=>{
            v.find((y,i)=>{
              if(y._name==x._name){
                x._status=y._status
                if(x._ready!=y._ready&&y._ready){
                  _toLoadStar=_toLoadStar||[]
                  _toLoadStar.push(x._name)
                }
                x._ready=y._ready
                x._age=y._age
                v[i]=x
              }
            })
          })
          k8s._data._podList=v
          if(_toLoadStar){
            k8s._loadStar(_toLoadStar)
          }
        }
        _fun&&_fun()
      }
    })
  },
  _autoMonitor:function(){
    clearTimeout(k8s._loadPodsTime)
    k8s._loadPodsTime=setTsimeout(()=>{
      console.log("refresh pods")
      k8s._getPods(0,1)
    },5000)
  },
  _assignPSList:function(){
    _k8sProxy._send({
      _data:{
        method:"getPSList",
        data:"1"
      },
      _success:function(v){
        v.trim().split("\n").map(x=>x.split(/\s+/)).forEach(x=>{
          let p=x.pop()
          x=x.pop()
          k8s._data._podList.find(y=>{
            if(y._name==x){
              y._forwarding=p
              return 1
            }else if(y._name==p){
              if(!y._log){
                _k8sProxy._send({
                  _data:{
                    method:"killProcess",
                    data:"logs -f --tail=100 "+p
                  },
                  _success:function(v){}
                })
              }
              return 1
            }
          })
        })
      }
    })
  },
  _getServices:function(_fun){
    _k8sProxy._send({
      _data:{
        method:"getList",
        data:{
          type:"services"
        }
      },
      _success:function(v){
        v=v.trim().split("\n").map(x=>x.split(/\s+/))
        v.shift()
        v=v.map(x=>{
          return {
            _name:x[0],
            _type:x[1],
            _cip:x[2],
            _eip:x[3],
            _port:x[4],
            _age:x[5]
          }
        })
        k8s._data._serviceList=v
        _fun&&_fun()
      }
    })
  },
  _exeItem:function(t,d){
    if(t._key=="link"){
      window.open(t._item._host+d.value)
    }else if(t._key=="cmd"){
      k8s._uiSwitch._response=""

      _Util._confirmMessage({
        _tag:"div",
        _items:[
          {
            _tag:"textarea",
            _attr:{
              readonly:1,
              placeholder:'_k8sMessage._common._waiting',
              style:'width:calc(100% - 10px);height:650px;'
            },
            _dataModel:'k8s._uiSwitch._response'
          },
          {
            _tag:"div",
            _attr:{
              class:"input-group",
              style:"width:calc(100% - 10px);"
            },
            _items:[
              {
                _tag:"label",
                _attr:{
                  class:"input-group-addon",
                  style:"min-width: 0;font-family: monospace;font-size: 12px;font-weight: bold;"
                },
                _text:"˃"
              },
              {
                _tag:"input",
                _attr:{
                  class:"form-control"
                },
                _jqext:{
                  keydown:function(e){
                    if(e.keyCode==13){
                      _sendCmd(this.value,t._item._name)
                    }
                  }
                }
              },
              {
                _tag:"div",
                _attr:{
                  class:"input-group-btn",
                  style:"left: 12px;"
                },
                _items:[
                  {
                    _tag:"button",
                    _attr:{
                      class:"bz-none-border btn btn-icon bz-delete bz-small-btn",
                      style:"width: 24px;height:24px;margin:2px;",
                      title:"_k8sMessage._method._clean"
                    },
                    _jqext:{
                      click:function(){
                        k8s._uiSwitch._response=""
                      }
                    }
                  }
                ]
              }
            ]
          }
        ]
      },[],_k8sMessage._common._message,"80%",1)
      _k8sProxy._send({
        _data:{
          method:"exeCmd",
          data:{
            cmd:d.value,
            name:t._item._name
          }
        },
        _success:_updateResponse
      })
    }else if(t._key=="api"){
      _sendAPI(t._item,d)
    }
    function _updateResponse(v){
      _Util._autoScrollToBottom($("textarea")[0],function(){
        k8s._uiSwitch._response+=v
      },20)
    }
    function _sendCmd(v,n){
      _k8sProxy._send({
        _data:{
          method:"exeCmd",
          data:{
            cmd:v,
            name:n,
            split:1
          }
        },
        _success:_updateResponse
      })
    }
    function _sendAPI(t,d){
      k8s._uiSwitch._response=""
      let s=_Util._jsonToCurl(t,d)
      if(s){
        _Util._confirmMessage({
          _tag:"div",
          _items:[
            {
              _tag:"textarea",
              _attr:{
                readonly:1,
                placeholder:'_k8sMessage._common._waiting',
                style:'width:calc(100% - 10px);height:440px;'
              },
              _dataModel:'k8s._uiSwitch._response'
            }
          ]
        },[{
          _title:_k8sMessage._method._execute,
          _click:function(){
            _doSend()
          }
        }],_k8sMessage._common._message,0,"_close")
        
        _doSend()
        function _doSend(){
          _k8sProxy._send({
            _data:{
              method:"exeAPI",
              data:{
                api:s
              }
            },
            _success:function(v){
              _updateResponse(v)
            }
          })  
        }
      }
    }
  },
  _forward:function(d){
    if(d._forwarding){
      _Util._confirmMessage(_k8sMessage._info._confirmStopForwarding+d._name,[{
        _title:_k8sMessage._method._yes,
        _class:"btn btn-warn",
        _click:function(c){
          _k8sProxy._send({
            _data:{
              method:"killProcess",
              data:"port-forward "+d._name
            },
            _success:function(v){
              d._forwarding=0
            },
            _error:function(){
              d._forwarding=0
            }
          })
          c._ctrl._close()
        }
      }])

      return
    }
    let s=k8s._getServiceByPod(d)
    if(s){
      s=s._port.split("/")[0]
      let ss=_findPort(s)
      _Util._promptMessage({
        _msg:_k8sMessage._info._askPort,
        _value:ss,
        _btnText:_k8sMessage._method._forward,
        _fun:function(c,sv){
          _k8sProxy._send({
            _data:{
              method:"forward",
              data:{
                serverName:d._name,
                port:sv+":"+s
              }
            },
            _success:function(v){
              if(v.startsWith("Forwarding from")||v.startsWith("Handling connection")){
                if(!d._forwarding){
                  d._forwarding=sv+":"+s
                  alert(v)
                }
              }else{
                d._forwarding=0
                alert(v)
              }
            }
          })
    
          c._ctrl._close()
        }
      })
    }

    function _findPort(v){
      let f=k8s._data._podList.find(x=>{
        if(x._forwarding&&x._forwarding.startsWith(v+":")){
          return 1
        }
      })
      if(!f){
        return v
      }else{
        return _findPort(parseInt(v)+1)
      }
    }
  },
  _isShowItem:function(x,v){
    return !v||x._name.match(new RegExp(v,"i"))
  },
  _getNameSpaceList:function(_fun){
    _k8sProxy._send({
      _data:{
        method:"getNamespaceList"
      },
      _success:function(v){
        v=v.trim().split("\n").map(x=>x.split(/\s+/))
        v.shift()
        v=v.filter(x=>x[1]=="Active").map(x=>x[0])
        k8s._data._namespaceList=v
        _fun&&_fun()
      }
    })
  },
  _getLog:function(d,p){
    _logHandler._data._showLog=1
    k8s._data._curFile=0
    let ls=_logHandler._data._logList,
        pl=p._log||{
          _name:p._name,
          gk:p.gk
        },
        k=k8s._data._config.log.groupMerge?"gk":"_name"

    if(!ls.find((x,i)=>{
      if(x[k]==pl[k]){
        if(p._log){
          ls.splice(i,1)
          k8s._data._podList.forEach(y=>{
            if(y._log&&y._log[k]==pl[k]){
              y._log=0
            }
          })
        }else{
          p._log=x
        }
        return 1
      }
    })){
      p._log=pl
      ls.push(p._log)
    }
    if(p._log){
      _k8sProxy._send({
        _data:{
          method:"getLog",
          data:{
            serverName:p._name
          }
        },
        _success:function(v){
          _logHandler._addLog(v,p._log)
        }
      })
    }
  },
  _getFileList:function(d,p){
    p._loading=1
    _k8sProxy._send({
      _data:{
        method:"getFileList",
        data:{
          serverName:d._name,
          path:p._path
        }
      },
      _success:function(v){
        if(v=="COMPLETE: 0"){
          return
        }
        v=v.trim().split("\n").map(x=>x.split(/\s+/))
        v.shift()
        v=v.map(x=>{
          let n=x.pop()
          if(x[x.length-1]=="->"){
            x.pop()
            n=x.pop()
          }
          return {
            _name:n,
            _date:([x.pop(),x.pop(),x.pop()]).reverse().join(" "),
            _size:x.pop(),
            _folder:x[0][0]=="d",
            _chmod:x[0],
            _pod:d,
            _path:p._path+"/"+n,
            _parent:p
          }
        })
        p._subList=v
        p._loading=0
        k8s._orderFileList(p)        
      }
    })
  },
  _openFile:function(d,p,_fun){
    p._loading=1
    _k8sProxy._send({
      _data:{
        method:"openFile",
        data:{
          serverName:d._name,
          path:p._path
        }
      },
      _success:function(v){
        p._loading=0
        p._content=v
        _fun&&_fun(v)
      }
    })
  },
  _download:function(d,p){
    let _fun=function(v){
      _Util._downloadFile(p._name,v)
    }
    if(!p._content){
      if(p._folder){
        p._loading=1
        _k8sProxy._send({
          _data:{
            method:"downloadFolder",
            data:{
              serverName:d._name,
              path:p._path
            }
          },
          _success:function(v){
            p._loading=0
            alert(_k8sMessage._info._downloadInBG)
          }
        })
      }else{
        k8s._openFile(d,p,_fun)
      }
    }else{
      _fun(p._content)
    }
  },
  _removePod:function(d){
    _Util._confirmMessage(_k8sMessage._info._confirmDelete,[
      {
        _title:_k8sMessage._method._yes,
        _class:"btn btn-warn",
        _click:function(c){
          _k8sProxy._send({
            _data:{
              method:"removePod",
              data:{
                serverName:d._name
              }
            },
            _success:function(r){
              k8s._data._podList=k8s._data._podList.filter(x=>x!=d)
              c._ctrl._close()
            }
          })
        }
      }
    ])
  },
  _deleteFile:function(d,p){
    _Util._confirmMessage(_k8sMessage._info._confirmDelete,[{
      _title:_k8sMessage._method._yes,
      _class:"btn btn-warn",
      _click:function(c){
        _k8sProxy._send({
          _data:{
            method:"deleteFile",
            data:{
              serverName:d._name,
              path:p._path,
              folder:p._folder
            }
          },
          _success:function(r){
            k8s._getFileList(d,p._parent||d)
            c._ctrl._close()
          }
        })
      }
    }])
  },
  _saveFile:function(d,p,_fun){
    p._loading=1
    _k8sProxy._send({
      _data:{
        method:"saveFile",
        data:{
          serverName:d._name,
          path:p._path,
          content:p._content
        }
      },
      _success:function(r){
        if(_fun){
          _fun()
        }else{
          k8s._openFile(d,p)
        }
      }
    })
  },
  _uploadFiles:function(d,vs){
    d._loading=1

    let v=vs.shift()
    if(v){
      v._path=d._path+"/"+v._name
      this._saveFile(d._pod||d,v,function(){
        k8s._uploadFiles(d,vs)
      })
    }else{
      d._loading=0
      d._subList=0
      k8s._getFileList(d._pod||d,d)
    }
  },
  _ondragover:function(o,e){
    e.preventDefault();
    e.stopPropagation();
    let d=o._data._item
    if(e.dataTransfer.types[0]=="Files"&&(d._folder||!d._pod)){
      if($(o).hasClass("bz-ondropping")){
        return
      }
      $($(o).addClass("bz-ondropping"))
      if(d._subList){
        d._open=1
      }else{
        clearTimeout(k8s._openTime)
        console.log("cleanTimeout: "+k8s._openTime)
        k8s._openTime=setTimeout(()=>{
          k8s._getFileList(d._pod||d,d)
        },2000)
        console.log("setTimeout: "+k8s._openTime)
      }
    }
  },
  _ondragleave:function(o,e){
    e.preventDefault();
    e.stopPropagation();
    $($(o).removeClass("bz-ondropping"))
    clearTimeout(k8s._openTime)
    console.log("cleanTimeout: "+k8s._openTime)
  },
  _ondrop:function(o,e){
    clearTimeout(k8s._openTime)
    e.preventDefault();
    e.stopPropagation();
    $($(o).removeClass("bz-ondropping"))
    let fs=e.dataTransfer.files
    _Util._loadTextFromFiles(fs,function(vs){
      k8s._uploadFiles(o._data._item,vs)
    })
  }
}
$(document).keydown(x=>{
  if(x.keyCode==27){
    $(".bz-modal-bg").click()
    // if(!_Util._isStdInputElement($(":focus")[0]||document.body)){
      
    // }
  }
})