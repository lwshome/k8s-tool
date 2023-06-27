const _configDetailsViewDef={
  _if:"k8s._uiSwitch._curMainTab=='_config'&&k8s._data._curConfig",
  _tag:"div",
  _after:function(){
    _Util._setInDetailsCss()
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
              _tag:"button",
              _attr:{
                class:"btn btn-icon bz-none-border bz-setting",
                style:"cursor:default;margin-right:5px;"
              }
            },
            {
              _tag:"header",
              _items:[
                {
                  _text:"k8s._data._curConfig._name"
                }
              ]
            },
            {
              _tag:"button",
              _attr:{
                class:"btn btn-icon bz-none-border bz-save",
                title:"_k8sMessage._method._refresh"
              },
              _jqext:{
                click:function(){
                  k8s._updateK8sItem(JSON.stringify(k8s._data._curConfig._content,0,2),function(){
                    k8s._getConfigDetails(k8s._data._curConfig._name)
                  })
                }
              }
            },
            {
              _tag:"button",
              _attr:{
                class:"btn btn-icon bz-none-border bz-refresh bz-left-space-10",
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
                class:"btn btn-icon bz-none-border bz-close bz-left-space-10",
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
          _if:"k8s._data._curConfig._content",
          _tag:"div",
          _attr:{
            style:"flex:1;margin-bottom:-5px;display:flex;flex-direction:column;"
          },
          _items:[
            {
              _tag:"div",
              _attr:{
                class:"input-group"
              },
              _items:[
                {
                  _tag:"label",
                  _attr:{
                    class:"input-group-addon"
                  },
                  _text:"_k8sMessage._common._items"
                },
                {
                  _tag:"select",
                  _attr:{
                    class:"form-control"
                  },
                  _dataModel:"k8s._data._curConfgItem",
                  _items:[
                    {
                      _tag:"option",
                      _attr:{
                        value:"_data._key"
                      },
                      _text:"_data._key",
                      _dataRepeat:"k8s._data._curConfig._content.data"
                    }
                  ]
                }
              ]
            },
            {
              _tag:"textarea",
              _attr:{
                style:"flex:1;margin-top:5px;"
              },
              _dataModel:"k8s._data._curConfig._content.data[k8s._data._curConfgItem]"
            }
          ]
        }
      ]
    }    
  ]
}