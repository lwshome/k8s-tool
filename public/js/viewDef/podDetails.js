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
        //
        {
          _tag:"div",
          _items:[
            {
              _tag:"div",
              _attr:{
                class:"bz-panel-header"
              },
              _items:[
                '<span class="btn btn-icon bz-small-btn bz-star on" style="cursor:default;margin-right:5px;"></span>',
                '<header>_k8sMessage._common._favor</header>',
                `<button _if='k8s._uiSwitch._showFavorFile' style='position: relative;top:3px;margin-right:10px;' onclick='k8s._uiSwitch._showFavorFile=0' class='btn btn-icon bz-none-border bz-small-btn bz-pod'></button>`,
                `<button onclick='k8s._uiSwitch._curPodDetails=0' style='position: relative;top:3px;' class='btn btn-icon bz-small-btn bz-none-border bz-close'></button>`
              ]
            },
            {
              _tag:"div",
              _attr:{
                class:"bz-list-row"
              },
              _items:[
                {
                  _tag:"button",
                  _attr:{
                    class:"'btn btn-icon bz-none-border '+(_data._item.fd?'bz-folder-close':'bz-file')",
                    style:"position: relative;top: -1px;"
                  }
                },
                {
                  _tag:"a",
                  _attr:{
                    style:"margin-left:5px;line-height:25px;"
                  },
                  _text:function(d){
                    return d._item.p.replace("/etc/..","")
                  },
                  _jqext:{
                    click:function(){
                      let d=this._data._item
                      d._pod=k8s._data._curPodDetails._pod
                      d._name=d.p.split("/").pop()
                      if(d.fd){
                        k8s._searchStars(d._pod,[d.p])
                      }else{
                        k8s._data._curFile=d
                        k8s._uiSwitch._showFavorFile=1
                        if(!d._content){
                          k8s._openFile(d._pod,d)
                        }
                      }
                    }
                  }
                }
              ],
              _dataRepeat:function(){
                return k8s._data._config.stars.filter(x=>x.s==k8s._data._curPodDetails.gk)
              }
            }
          ]
        },
        {
          _if:"!k8s._uiSwitch._showFavorFile",
          _tag:"div",
          _attr:{
            class:"bz-v-panel",
            style:"flex:1;"
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
        },
        {
          _if:"k8s._uiSwitch._showFavorFile",
          _tag:"div",
          _attr:{
            class:"bz-v-panel",
            style:"flex:1;"
          },
          _items:_fileContentViewDef
        }
      ]
    }    
  ]
}