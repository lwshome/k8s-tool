const _detailsViewDef={
  _if:"k8s._data._curFile",
  _tag:"div",
  _attr:{
    class:"bz-details-panel",
    style:"flex:1"
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
            style:"line-height:30px;display:flex;"
          },
          _items:[
            {
              _tag:"header",
              _text:"k8s._data._curFile._name",
              _attr:{
                style:"flex:1;padding-left:10px;"
              }
            },
            {
              _tag:"button",
              _attr:{
                style:"position: relative;top: 3px;margin-right:10px;",
                class:function(d){
                  let c="btn btn-icon bz-small-btn bz-none-border "
                  if(!k8s._data._curFile._loading){
                    c+="bz-save"
                  }else{
                    c+="bz-loading"
                  }
                  return c
                }
              },
              _jqext:{
                click:function(){
                  let d=k8s._data._curFile
                  k8s._saveFile(d._pod,d)
                }
              }
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
                class:"btn btn-icon bz-small-btn bz-none-border bz-delete",
                style:"margin-left:10px;position: relative;top: 3px;",
                title:"_k8sMessage._method._delete"
              },
              _jqext:{
                click:function(){
                  let d=k8s._data._curFile
                  k8s._deleteFile(d._pod,d)
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
                  k8s._data._curFile=0
                }
              }
            }
          ]
        },
        {
          _tag:"textarea",
          _attr:{
            style:"flex:1;margin-bottom:-5px;",
            disabled:"k8s._data._curFile._loading"
          },
          _dataModel:"k8s._data._curFile._content"
        }
      ]
    }    
  ]
}