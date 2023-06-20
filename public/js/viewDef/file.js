const _fileContentViewDef=[
  {
    _tag:"div",
    _attr:{
      class:"bz-panel-header"
    },
    _items:[
      {
        _tag:"button",
        _attr:{
          class:function(){
            let c="btn btn-icon "
            if(!k8s._data._curFile._loading){
              c+="bz-file"
            }else{
              c+="bz-small-loading"
            }
            return c
          },
          style:function(){
            let c="cursor:default;";
            if(!k8s._data._curFile._loading){
              c+="margin-top:0;margin-right:5px;"
            }else{
              c+="margin-top:8px;margin-right:8px;"
            }
            return c
          }
        }
      },
      {
        _tag:"header",
        _text:"k8s._data._curFile._name"
      },
      {
        _tag:"button",
        _attr:{
          class:"btn btn-icon bz-none-border bz-save bz-right-space-10"
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
          class:"btn btn-icon bz-none-border bz-refresh",
          title:"_k8sMessage._method._refresh"
        },
        _jqext:{
          click:function(){
            let d=k8s._data._curFile
            k8s._openFile(d._pod,d)
          }
        }
      },
      // {
      //   _tag:"button",
      //   _attr:{
      //     class:"btn btn-icon bz-small-btn bz-none-border bz-delete",
      //     style:"margin-left:10px;position: relative;top: 3px;",
      //     title:"_k8sMessage._method._delete"
      //   },
      //   _jqext:{
      //     click:function(){
      //       let d=k8s._data._curFile
      //       k8s._deleteFile(d._pod,d)
      //     }
      //   }
      // },
      {
        _if:"k8s._uiSwitch._curPodDetails=='_file'",
        _tag:"button",
        _attr:{
          class:"btn btn-icon bz-none-border bz-close bz-left-space-10",
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
      disabled:"k8s._data._curFile._loading"
    },
    _dataModel:"k8s._data._curFile._content"
  }
];
const _fileViewDef={
  _if:"k8s._uiSwitch._curMainTab=='_pods'&&k8s._data._curFile&&k8s._uiSwitch._curPodDetails=='_file'",
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
      _items:_fileContentViewDef
    }
  ]
}