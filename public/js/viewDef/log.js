const _logViewDef={
  _if:"k8s._uiSwitch._curMainTab=='_pods'&&_logHandler._data._showLog&&k8s._uiSwitch._curPodDetails=='_log'",
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
        style:function(d){
          let i=_logHandler._data._logList.length
          if(i){
            return `height:${100/i}%;`
          }
        },
        class:"bz-v-panel"
      },
      _items:[
        {
          _tag:"div",
          _attr:{
            class:"'bz-panel-header '+(_logHandler._data._setting.highlightOnly?'bz-highlight':'')"
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
              _text:function(d){
                return d._item[k8s._data._config.log.groupMerge?"gk":"_name"]
              }
            },
            {
              _if:"_logHandler._data._setting.highlights.length",
              _tag:"i",
              _attr:{
                style:"font-weight: 100;font-size: 13px;"
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
                      _dataModel:"_logHandler._data._setting.highlightOnly"
                    },
                    {
                      _tag:"span",
                      _text:"_k8sMessage._log.highlightOnly"
                    }
                  ]
                }
              ],
            },
            //download
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
            //delete
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
            //setting
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
            //close
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