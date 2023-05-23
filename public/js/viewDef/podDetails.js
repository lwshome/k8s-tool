const _podDetailsViewDef={
  _if:"k8s._uiSwitch._curMainTab=='_pods'&&k8s._data._curPodDetails&&k8s._uiSwitch._curPodDetails=='_details'",
  _tag:"div",
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
                class:"btn btn-icon bz-small-btn bz-computer",
                style:"cursor:default;margin-right:5px;"
              }
            },
            {
              _tag:"header",
              _text:"k8s._data._curPodDetails._name"
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
                  let d=k8s._data._curFile
                  k8s._openFile(d._pod,d)
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
                  k8s._uiSwitch._curPodDetails=''
                }
              }
            }
          ]
        },
        {
          _tag:"textarea",
          _attr:{
            style:"flex:1;margin-bottom:-5px;",
            readonly:1
          },
          _dataModel:"k8s._data._curPodDetails._content"
        }
      ]
    }    
  ]
}