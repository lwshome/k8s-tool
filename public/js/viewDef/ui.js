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
          _tag:"div",
          _attr:{
            class:"bz-namespace-box"
          },
          _items:[
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
            class:"'bz-tab '+(k8s._uiSwitch._curMainTab==_data._item&&'active')"
          },
          _jqext:{
            click:function(){
              k8s._uiSwitch._curMainTab=this._data._item
            }
          },
          _text:"_k8sMessage._main._tabs[_data._item]",
          _dataRepeat:["_pods","_services","_deployments"]
        },
        {
          _tag:"div",
          _attr:{
            style:"flex:1"
          }
        },
        {
          _tag:"button",
          _attr:{
            style:"position: relative;top: 5px;margin-right: 5px;",
            class:"btn btn-icon bz-none-border bz-cmd"
          },
          _jqext:{
            click:function(e){
              k8s._uiSwitch._showMenu={
                _key:'sys-cmd',
                _element:this,
                _item:{}
              }
              e.stopPropagation()
            }
          }
        },
        {
          _if:"k8s._uiSwitch._showMenu._key=='sys-cmd'",
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
                        class:"btn btn-icon bz-small-btn bz-none-border bz-cmd",
                        style:"margin-right:10px;"
                      }
                    },
                    {
                      _tag:"span",
                      _text:"_data._item.name"
                    }
                  ],
                  _dataRepeat:function(d){
                    return k8s._data._config.cmd.filter(x=>x.podGroup=='bz-node-system')
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
              _if:"k8s._data._config[k8s._uiSwitch._showMenu._key].length",
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
                  k8s._openFunSetting(k8s._uiSwitch._showMenu._key)
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
        _logViewDef,
        _detailsViewDef,
        _servicesViewDef
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
