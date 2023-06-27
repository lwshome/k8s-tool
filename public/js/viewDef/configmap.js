const _configMapViewDef={
  _if:"k8s._uiSwitch._curMainTab=='_config'",
  _tag:"div",
  _after:function(){
    if(!k8s._data._configMap){
      k8s._getConfigMap()
    }
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
                class:function(d){
                  let c=k8s._data._curConfig,
                      v="bz-list-row";
                  if(c&&c._name==d._item._name){
                    v+= " bz-highlight"
                  }
                  return v
                }
              },
              _items:[
                {
                  _tag:"a",
                  _attr:{
                    class:"bz-node-title"
                  },
                  _html:function(d){
                    return _attachHighlight(d._item._name,k8s._data._config.filter[k8s._data._config.ns],d._item)
                  },
                  _jqext:{
                    click:function(){
                      k8s._data._curConfig=this._data._item
                      if(!k8s._data._curConfig._content){
                        k8s._getConfigDetails(this._data._item._name)
                      }else{
                        k8s._data._curConfgItem=Object.keys(k8s._data._curConfig._content.data)[0]
                      }
                    }
                  }
                },
                {
                  _tag:"button",
                  _attr:{
                    class:"btn btn-icon bz-none-border bz-copy bz-hover-item"
                  },
                  _jqext:{
                    click:function(e){
                      let o=this.previousSibling
                      _Util._copyText(o.innerText.trim(),document,o)
                      e.stopPropagation()
                    }
                  }
                }
              ]
            }
          ],
          _dataRepeat:"k8s._data._configMap"
        }
      ]
    }
  ]
};