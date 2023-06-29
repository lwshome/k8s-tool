const ui={
  _tag:"div",
  _after:function(){
    k8s._getInitData()
  },
  _attr:{
    class:"bz-v-panel",
  },
  _items:[
    {
      _tag:"div",
      _attr:{
        style:"display:flex;border-bottom: var(--bz-border);padding: 5px;"
      },
      _items:[
        {
          _tag:"span",
          _attr:{
            class:function(){
              let c="bz-main btn btn-icon bz-main bz-small-btn bz-none-border "
              if(k8s._data._loading){
                c+="bz-loading"
              }else{
                c+="bz-logo"
              }
              return c
            }
          }
        },
        {
          _tag:"div",
          _attr:{
            class:"bz-main-header"
          },
          _text:"_k8sMessage._info._title"
        },
        {
          _tag:"button",
          _attr:{
            class:"'btn btn-icon bz-light bz-none-border '+(k8s._data._config.css=='light'?'bz-press':'')",
            style:"position: relative;top: 5px;left: -22px;"
          },
          _jqext:{
            click:function(){
              $(document.body).removeClass("bz-in-dark")
              $(document.body).removeClass("bz-in-light")
              if(k8s._data._config.css=="light"){
                k8s._data._config.css=""
              }else{
                k8s._data._config.css='light'
                $(document.body).addClass("bz-in-light")
              }
              k8s._saveSetting()
            }
          }
        },
        {
          _tag:"button",
          _attr:{
            class:"'btn btn-icon bz-dark bz-none-border '+(k8s._data._config.css=='dark'?'bz-press':'')",
            style:"position: relative;top: 5px;left: -14px;"
          },
          _jqext:{
            click:function(){
              $(document.body).removeClass("bz-in-dark")
              $(document.body).removeClass("bz-in-light")
              if(k8s._data._config.css=="dark"){
                k8s._data._config.css=""
              }else{
                k8s._data._config.css='dark'
                $(document.body).addClass("bz-in-dark")
              }
              k8s._saveSetting()
            }
          }
        },
        {
          _tag:"div",
          _attr:{
            class:"bz-namespace-box"
          },
          _items:[
            //namespace
            {
              _tag:"div",
              _attr:{
                class:"input-group",
                style:"flex:1"
              },
              _items:[
                {
                  _tag:"label",
                  _attr:{
                    class:"input-group-addon",
                    style:"width:0;"
                  },
                  _text:"NS"
                },
                {
                  _tag:"select",
                  _attr:{
                    class:"form-control",
                    title:"_k8sMessage._common._namespace"
                  },
                  _update:function(){
                    k8s._saveSetting()
                    k8s._getInitData()
                  },
                  _items:[
                    {
                      _tag:"option",
                      _attr:{
                        value:"_data._item"
                      },
                      _text:"_data._item",
                      _dataRepeat:function(){
                        let d=k8s._data._namespaceList||[],
                            f=k8s._data._config.NSFilter
                        if(f){
                          f=new RegExp(f,"i")
                          d=d.filter(x=>f.test(x))
                        }
                        return d
                      }
                    }
                  ],
                  _dataModel:"k8s._data._config.ns"
                }
              ]
            },
            {
              _tag:"button",
              _attr:{
                class:"btn btn-icon bz-delete bz-none-border bz-middle-btn",
                title:"_k8sMessage._method._deleteNameSpace"
              },
              _jqext:{
                click:function(){
                  k8s._deleteNS()
                }
              }
            },
            //filter
            {
              _tag:"div",
              _attr:{
                class:"input-group",
                style:"margin-right:15px;margin-left: -1px;flex:1",
                title:"_k8sMessage._method._nsFilter"
              },
              _items:[
                {
                  _tag:"label",
                  _attr:{
                    class:"input-group-addon",
                    style:"width:0;"
                  },
                  _items:[
                    {
                      _tag:"span",
                      _attr:{
                        class:"btn btn-icon bz-none-border bz-filter"
                      }
                    }
                  ]
                },    
                {
                  _tag:"input",
                  _update:function(){
                    k8s._saveSetting()
                  },
                  _attr:{
                    placeholder:"_k8sMessage._method._nsFilter",
                    class:"form-control"
                  },
                  _dataModel:"k8s._data._config.NSFilter"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      _tag:"div",
      _attr:{
        class:"bz-tab-bar"
      },
      _items:[
        {
          _tag:"div",
          _attr:{
            class:"'bz-tab '+(k8s._uiSwitch._curMainTab==_data._item&&'active')",
            title:function(d){
              if(d._item=="_alarm"){
                return k8s._getAlarmSummary()
              }
            }
          },
          _jqext:{
            click:function(){
              k8s._uiSwitch._curMainTab=this._data._item
            }
          },
          _items:[
            {
              _tag:"span",
              _attr:{
                style:function(d){
                  if(d._item=='_alarm'&&k8s._hasAlarm()){
                    return "color:var(--alarm-color);"
                  }else{
                    return "color:var(--word-color);"
                  }
                }
              },
              _text:function(d){
                k8s._uiSwitch._updateAlarm
                return _k8sMessage._main._tabs[d._item]
              }    
            },
            {
              _if:"_data._item=='_alarm'&&k8s._hasAlarm()",
              _tag:"span",
              _attr:{
                class:"bz-swing"
              },
              _text:"🔔"
            }
          ],
          _dataRepeat:["_pods","_services","_deployments","_nodes","_config","_alarm"]
        },
        {
          _tag:"div",
          _attr:{
            style:"flex:1;text-align:center;white-space: nowrap;overflow: hidden;"
          },
          _items:[
            {
              _tag:"span",
              _attr:{
                class:"btn bz-none-border bz-space-5 bz-hover-btn",
                style:"position: relative;top: 5px;",
                title:function(d){
                  d=d._item
                  let w=d._value.name+":\n"
                  if(d._type=='api'){
                    d=_Util._clone(d._value)
                    delete d.name
                    w+=JSON.stringify(d,0,2)
                  }else{
                    w+=d._value.value
                  }
                  return w
                }
              },
              _items:[
                {
                  _tag:"span",
                  _attr:{
                    class:"'bz-samll-icon bz-'+_data._item._type",
                    style:"display:inline-block;margin-top:3px;"
                  }
                },
                {
                  _tag:"span",
                  _attr:{
                    style:"font-size: 9px;margin-left: -3px;position: relative;top: -12px;"
                  },
                  _text:function(d){
                    return _Util._getShortName(d._item._value.name)
                  }
                }
              ],
              _jqext:{
                click:function(){
                  let o=this._data._item
                  k8s._exeItem(o,o._value)
                }
              },
              _dataRepeat:function(){
                let c=k8s._data._config,vs=[]

                if(c.cmd){
                  c.cmd.forEach(x=>{
                    if(x.faver){
                      vs.push({
                        _type:"cmd",
                        _value:x
                      })
                    }
                  })
                }

                if(c.api){
                  c.api.forEach(x=>{
                    if(x.faver){
                      vs.push({
                        _type:"api",
                        _value:x
                      })
                    }
                  })
                }

                if(c.link){
                  c.link.forEach(x=>{
                    if(x.faver){
                      vs.push({
                        _type:"link",
                        _value:x
                      })
                    }
                  })
                }
                return vs
              }
            }
          ]
        },
        {
          _tag:"button",
          _attr:{
            style:"position: relative;top: 5px;margin-right: 10px;",
            class:"btn btn-icon bz-none-border bz-cmd",
            title:"_k8sMessage._method.cmd+' ('+_k8sMessage._common._system+')'"
          },
          _jqext:{
            click:function(e){
              k8s._uiSwitch._showMenu={
                _key:'sys',
                _type:"cmd",
                _element:this,
                _item:{}
              }
              e.stopPropagation()
            }
          }
        },
        {
          _tag:"button",
          _attr:{
            style:"position: relative;top: 5px;margin-right: 10px;",
            class:"btn btn-icon bz-none-border bz-link",
            title:"_k8sMessage._method.request+' ('+_k8sMessage._common._system+')'"
          },
          _jqext:{
            click:function(e){
              k8s._uiSwitch._showMenu={
                _key:'sys',
                _type:"link",
                _element:this,
                _item:{}
              }
              e.stopPropagation()
            }
          }
        },
        {
          _if:"k8s._uiSwitch._showMenu._key=='sys'",
          _tag:"div",
          _attr:{
            style:function(){
              let r=k8s._uiSwitch._showMenu._element.getBoundingClientRect()
              return `top:${r.top+20}px;right:${window.innerWidth-r.right}px;`
            },
            class:"bz-menu-panel"
          },
          _items:[
            {
              _tag:"div",
              _items:[
                {
                  _tag:"div",
                  _attr:{
                    class:"bz-menu-item"
                  },
                  _items:[
                    {
                      _tag:"button",
                      _attr:{
                        class:"'btn btn-icon bz-small-btn bz-none-border bz-'+k8s._uiSwitch._showMenu._type",
                        style:"margin-right:10px;"
                      }
                    },
                    {
                      _tag:"span",
                      _text:"_data._item.name"
                    }
                  ],
                  _dataRepeat:function(d){
                    return k8s._data._config[k8s._uiSwitch._showMenu._type].filter(x=>x.podGroup=='bz-node-system')
                  },
                  _jqext:{
                    click:function(){
                      k8s._exeItem(k8s._uiSwitch._showMenu,this._data._item)
                    }
                  }
                }
              ]
            },
            {
              _tag:"hr"
            },
            //setting 
            {
              _tag:"div",
              _attr:{
                class:"bz-menu-item"
              },
              _items:[
                {
                  _tag:"button",
                  _attr:{
                    class:"btn btn-icon bz-small-btn bz-setting bz-none-border",
                    style:"margin-right:10px;"
                  }
                },
                {
                  _tag:"span",
                  _text:"_k8sMessage._setting._title"
                }
              ],
              _jqext:{
                click:function(){
                  k8s._data._curGroup="bz-node-system"
                  k8s._openFunSetting(k8s._uiSwitch._showMenu._type)
                }
              }
            }
          ]
        },
        {
          _tag:"div",
          _attr:{
            class:"input-group bz-item-filter",
            title:"_k8sMessage._method._itemFilter"
          },
          _items:[
            {
              _tag:"label",
              _attr:{
                class:"input-group-addon"
              },
              _items:[
                {
                  _tag:"span",
                  _attr:{
                    class:"btn btn-icon bz-none-border bz-filter"
                  }
                }
              ]
            },
            {
              _tag:"input",
              _update:function(){
                setTimeout(()=>{
                  k8s._saveSetting()
                },100)
              },
              _attr:{
                class:"form-control",
                placeholder:"_k8sMessage._method._itemFilter"
              },
              _dataModel:"k8s._data._config.filter[k8s._data._config.ns]"
            }
          ]
        }
      ]
    },
    {
      _tag:"div",
      _attr:{
        class:"bz-tab-content",
        style:"display:flex;"
      },
      _items:[
        _listViewDef,
        _configMapViewDef,
        _servicesViewDef,
        _nodesViewDef,
        _deploymentsViewDef,
        _Util._getSplitter("v",function(){
          let d=Math.max(...$(".bz-details-panel").toArray().map(x=>parseInt($(x).css("flex"))),1),
              l=Math.max(...$(".bz-list-box").toArray().map(x=>parseInt($(x).css("flex"))))
          if(k8s._uiSwitch._curMainTab=='_config'){
            if(!k8s._data._curConfig){
              // $(".bz-list-box").css({flex:1})
              return
            }
          }else if(k8s._uiSwitch._curMainTab=='_pods'){
            if(_logHandler._data._showLog&&k8s._uiSwitch._curPodDetails=='_log'){

            }else if(k8s._data._curFile&&k8s._uiSwitch._curPodDetails=='_file'){

            }else if(k8s._data._curPodDetails&&k8s._uiSwitch._curPodDetails=='_details'){

            }else{
              // $(".bz-list-box").css({flex:1})
              return
            }
          }else if(k8s._uiSwitch._curMainTab=='_deployments'){
            if(!k8s._data._curDeployment){
              // $(".bz-list-box").css({flex:1})
              return
            }
          }else if(k8s._uiSwitch._curMainTab=='_services'){
            if(!k8s._data._curService){
              // $(".bz-list-box").css({flex:1})
              return
            }
          }else if(k8s._uiSwitch._curMainTab=='_nodes'){
            if(!k8s._data._curNode){
              // $(".bz-list-box").css({flex:1})
              return
            }
          }else{
            return
          }
          setTimeout(()=>{
            $(".bz-details-panel").css({flex:d})
            $(".bz-list-box").css({flex:l})
          },20)
          return 1
        }),
        _logViewDef,
        _fileViewDef,
        _podDetailsViewDef,
        _configDetailsViewDef,
        _deploymentDetailsViewDef,
        _nodeDetailsViewDef,
        _serviceDetailsViewDef,
        _alarmViewDef
      ]
    }
  ]
}
setTimeout(()=>{
  _CtrlDriver._execute(k8s,0,ui,document.body)
  $(document.body).click(function(){
    k8s._uiSwitch._showMenu=0
  })
})
