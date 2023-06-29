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
              _tag:"button",
              _attr:{
                class:"btn btn-icon  bz-right-space-5 bz-log",
                style:"cursor:default;"
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
                style:"font-weight: 100;font-size: 13px;margin-top:3px;"
              },
              _items:[
                {
                  _tag:"label",
                  _attr:{
                    title:function(){
                      if(_logHandler._data._setting.highlightOnly){
                        return _Util._formatMessage(_k8sMessage._log._passLogAfterHighlight,[k8s._data._highlightCount])
                      }
                    }
                  },
                  _items:[
                    {
                      _tag:"input",
                      _attr:{
                        type:"checkbox"
                      },
                      _dataModel:"_logHandler._data._setting.highlightOnly",
                      _jqext:{
                        click:function(){
                          k8s._data._highlightCount=0
                        }
                      }
                    },
                    {
                      _tag:"span",
                      _text:function(){
                        let c=_k8sMessage._log._highlightOnly
                        if(_logHandler._data._setting.highlightOnly){
                          c+=" ("+k8s._data._highlightCount+")"
                        }
                        return c
                      }
                    }
                  ]
                }
              ],
            },
            //download
            {
              _tag:"button",
              _attr:{
                class:"btn btn-icon bz-none-border bz-download bz-left-space-10",
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
                class:"btn btn-icon bz-left-space-10 bz-none-border bz-delete",
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
                class:"btn btn-icon bz-left-space-10 bz-none-border bz-setting",
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
                class:"btn btn-icon bz-left-space-10 bz-none-border bz-close",
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