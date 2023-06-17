const _deploymentsViewDef={
  _if:"k8s._uiSwitch._curMainTab=='_deployments'",
  _tag:"div",
  _attr:{
    class:"bz-v-panel"
  },
  _items:[
    {
      _tag:"div",
      _items:[
        {
          _tag:"div",
          _attr:{
            class:"bz-list-row"
          },
          _items:[
            {
              _tag:"a",
              _attr:{
                class:"bz-node-title"
              },
              _items:[
                //open/close
                {
                  _tag:"button",
                  _attr:{
                    class:function(d){
                      let c='btn btn-icon bz-small-btn bz-none-border '
                      d=d._item
                      if(d._open){
                        if(d._subList){
                          c+="bz-open-item"
                        }else{
                          c+="bz-small-loading"
                        }
                      }else{
                        c+="bz-close-item"
                      }
                      return c
                    },
                    style:"'font-size: 18px;font-family: monospace;visiablity:'+(_data._item._status=='Running'?'visible':'hidden')"
                  }
                },
                //info
                {
                  _tag:"a",
                  _attr:{
                    style:"margin-left:5px;"
                  },
                  _items:[
                    //name
                    {
                      _tag:"span",
                      _html:function(d){
                        return _attachHighlight(d._item._name,k8s._data._config.filter[k8s._data._config.ns])
                      }
                    },
                    //age
                    {
                      _tag:"i",
                      _attr:{
                        style:"margin-left:10px;color:grey;"
                      },
                      _text:"'('+_data._item._age+')'"
                    }
                  ]
                }
              ],
              _jqext:{
                click:function(){
                  let d=this._data._item
                  if(d._status=="Running"){
                    d._open=!d._open
                    if(d._open){
                      if(!d._path){
                        d._path="etc/.."
                        k8s._getFileList(d,d)
                      }
                    }
                  }
                }
              }
            },
            {
              _tag:"div",
              _attr:{
                class:"bz-ex-ctl-panel"
              },
              _items:[
                {
                  _tag:"input",
                  _attr:{
                    class:"form-control",
                    style:"margin-left:10px;padding:5px;padding: 4px;margin-top: -3px;",
                    placeholder:"_k8sMessage._method._filter"
                  },
                  _dataModel:"_data._item.filter"
                },
                {
                  _tag:"button",
                  _attr:{
                    title:"_k8sMessage._method[_data._item]",
                    style:"margin-right:10px;",
                    class:"'btn btn-icon bz-small-btn bz-none-border bz-'+_data._item"
                  },
                  _jqext:{
                    click:function(){
                      let d=this._data._supData._item
                      switch(this._data._item){
                        case "forward":
                          k8s._forward(d)
                        case "search":
                        case "restart":
                      }
                    }
                  },
                  _dataRepeat:["forward","search","restart"]
                }
              ]
            }
          ]
        },
        _buildTreeNode()
      ],
      _dataRepeat:function(){
        return (k8s._data._podList||[]).filter(x=>k8s._isShowItem(x,k8s._data._config.filter[k8s._data._config.ns]))
      }
    }
  ]
};