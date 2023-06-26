const _servicesViewDef={
  _if:"k8s._uiSwitch._curMainTab=='_services'",
  _tag:"div",
  _after:function(){
    k8s._getServices()
  },
  _attr:{
    class:"bz-list-box"
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
          _items:[
            {
              _tag:"div",
              _attr:{
                class:"'bz-list-row '+(_data._item==k8s._data._curService?'bz-highlight':'')"
              },
              _items:[
                {
                  _tag:"a",
                  _attr:{
                    class:"bz-node-title"
                  },
                  _items:[
                    {
                      _tag:"span",
                      _attr:{
                        style:"font-size:11px;margin-right:10px;"
                      },
                      _text:"'['+_data._item._type+']'"
                    },
                    {
                      _tag:"span",
                      _html:function(d){
                        return _attachHighlight(d._item._name,k8s._data._config.filter[k8s._data._config.ns],d._item)
                      }
                    },
                    {
                      _tag:"i",
                      _attr:{
                        class:"bz-attach-info"
                      },
                      _text:function(d){
                        d=d._item
                        return `(${d._clusterIp}, ${d._externalIp}, ${d._port})`
                      }
                    },
                    {
                      _tag:"button",
                      _attr:{
                        class:"btn btn-icon bz-none-border bz-copy"
                      },
                      _jqext:{
                        click:function(e){
                          let o=this.parentElement.children[1]
                          _Util._copyText(o.innerText,document,o)
                          e.stopPropagation()
                        }
                      }
                    }
                  ],
                  _jqext:{
                    click:function(){
                      k8s._data._curService=this._data._item
                      k8s._getService(k8s._data._curService)
                    }
                  }
                }
              ]
            }
          ],
          _dataRepeat:function(){
            let r=k8s._data._config.filter[k8s._data._config.ns]
            r=r&&new RegExp(r)
            return (k8s._data._serviceList||[]).filter(x=>{
              return r?x._name.match(r):1
            })
          }
        }
      ]
    }
  ]
};
