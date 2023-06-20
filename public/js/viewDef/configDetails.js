const _configDetailsViewDef={
  _if:"k8s._uiSwitch._curMainTab=='_config'&&k8s._data._curConfig",
  _tag:"div",
  _after:function(){
    $(".bz-list-box").addClass("bz-in-details")
  },
  _attr:{
    class:"bz-details-panel"
  },
  _items:[
    {
      _tag:"div",
      _attr:{
        class:"bz-v-panel"
      },
      _items:[
        {
          _tag:"div",
          _attr:{
            class:"bz-panel-header"
          },
          _items:[
            {
              _tag:"span",
              _attr:{
                class:"btn btn-icon bz-small-btn bz-setting",
                style:"cursor:default;margin-right:5px;"
              }
            },
            {
              _tag:"header",
              _items:[
                {
                  _text:"k8s._data._curConfig._name"
                },
                {
                  _tag:"button",
                  _attr:{
                    class:"btn btn-icon bz-none-border bz-edit bz-left-space-10 bz-small-btn bz-hover-item"
                  },
                  _jqext:{
                    click:function(){
                      _Util._copyText("kubectl -n mycac edit configmap "+this._data._curConfig._name,document,this.parentElement)
                    }
                  }
                }
              ]
            },
            {
              _tag:"button",
              _attr:{
                class:"btn btn-icon bz-small-btn bz-none-border bz-refresh",
                style:"position: relative;top: 3px;",
                title:"_k8sMessage._method._refresh"
              },
              _jqext:{
                click:function(){
                  k8s._data._curConfig._content=""
                  k8s._getConfigDetails(k8s._data._curConfig._name)
                }
              }
            },
            {
              _tag:"button",
              _attr:{
                class:"btn btn-icon bz-small-btn bz-none-border bz-close",
                style:"margin-left:10px;position: relative;top: 3px;",
                title:"_k8sMessage._method._close"
              },
              _jqext:{
                click:function(){
                  k8s._data._curConfig=0
                }
              }
            }
          ]
        },
        {
          _tag:"textarea",
          _attr:{
            style:"flex:1;margin-bottom:-5px;"
          },
          _dataModel:"k8s._data._curConfig._content"
        }
      ]
    }    
  ]
}