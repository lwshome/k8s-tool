const _servicesViewDef={
  _if:function(){
    if(k8s._uiSwitch._curMainTab=='_alarms'){
      k8s._getAlarmInfo()
      return 1
    }
  },
  _tag:"div",
  _attr:{
    class:"bz-v-panel"
  },
  _items:[
    {
      _tag:"div",
      _attr:{
        class:"bz-list-row"
      },
      _items:[
        {
          _tag:"button",
          _attr:{
            class:function(d){
              let c="btn btn-icon bz-none-border "
              if(d._item){
                c+="bz-press"
              }
              return c
            }
          }
        },
        {
          _tag:"a",
          _attr:{
            class:"bz-node-title"
          },
          _items:[
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
                  _html:"_data._item.name"
                },
                //percentage
                {
                  _tag:"span",
                  _attr:{
                    style:"margin-left:10px;color:grey;"
                  },
                  _text:"_data._item.percentage"
                }
              ]
            }
          ]
        }
      ],
      _dataRepeat:function(){
        return (k8s._data._config.alarms||{})[k8s._data._config.ns]
      }
    }
  ]
};