const _logViewDef={
  _if:"_logHandler._data._showLog",
  _tag:"div",
  _attr:{
    class:"bz-details-panel"
  },
  _items:[
    {
      _tag:"div",
      _attr:{
        style:function(d){
          let i=_logHandler._data._logList.length
          if(i){
            return `height:calc(${100/i}% - ${30/i}px);`
          }
        },
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
                class:"btn btn-icon bz-small-btn bz-log",
                style:"cursor:default;margin-right:5px;"
              }
            },
            {
              _tag:"header",
              _text:"_data._item._name"
            },
            {
              _tag:"button",
              _attr:{
                style:"margin-left:10px;position: relative;top: 2px;",
                class:"btn btn-icon bz-small-btn bz-none-border bz-download",
                title:"_k8sMessage._method._download"
              },
              _jqext:{
                click:function(){
                  _logHandler._saveLog(this._data._item)
                }
              }
            },
            {
              _tag:"button",
              _attr:{
                class:"btn btn-icon bz-small-btn bz-none-border bz-delete",
                style:"margin-left:10px;position: relative;top: 1px;",
                title:"_k8sMessage._method._clean"
              },
              _jqext:{
                click:function(){
                  this._data._item._element.innerHTML=""
                }
              }
            },
            {
              _tag:"button",
              _attr:{
                class:"btn btn-icon bz-small-btn bz-none-border bz-setting",
                style:"margin-left: 8px;position: relative;top: 1px;",
                title:"_k8sMessage._setting._title"
              },
              _jqext:{
                click:function(){
                  _logHandler._showSetting()
                }
              }
            },
            {
              _tag:"button",
              _attr:{
                class:"btn btn-icon bz-small-btn bz-none-border bz-close",
                style:"margin-left:10px;position: relative;top: 1px;",
                title:"_k8sMessage._method._close"
              },
              _jqext:{
                click:function(){
                  _logHandler._closeLog(this._data._item)
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
          _after:function(o){
            o._data._item._element=o
          }
        }
      ],
      _dataRepeat:"_logHandler._data._logList"
    }
  ]
}