const _alarmViewDef={
  _if:"k8s._uiSwitch._curMainTab=='_alarm'",
  _tag:"div",
  _after:function(){
    k8s._getAlarmInfo()
  },
  _update:function(){
    k8s._saveSetting()
  },
  _attr:{
    class:"bz-v-panel"
  },
  _items:[
    {
      _tag:"div",
      _attr:{
        style:"display:flex;"
      },
      _items:[
        {
          _tag:"button",
          _attr:{
            class:"btn bz-none-border btn-primary bz-plus bz-txt-icon bz-space-10 bz-bottom-space-5",
            style:"width:150px;height:40px;"
          },
          _text:"_k8sMessage._method._addAlarm",
          _jqext:{
            click:function(){
              let as=k8s._data._config.alarms,
                  n=k8s._data._config.ns
                  as[n]=as[n]||[],
                  scv={}
              k8s._data._config.filter[k8s._data._config.ns].split("|").forEach(x=>scv[x]="on")
              let v=_Util._clone(as[n]._last()||{type:"cpu",content:"total",value:90,scope:scv})
              as[n].push(v)
              k8s._saveSetting()
            }
          }
        },
        {
          _tag:"div",
          _attr:{
            style:"flex:1"
          }
        },
        {
          _tag:"div",
          _attr:{
            class:"input-group bz-space-15 bz-bottom-space-5",
            style:"width:150px;height:27px;"
          },
          _items:[
            {
              _tag:"label",
              _attr:{
                class:"input-group-addon"
              },
              _text:"_k8sMessage._common._frequency+'(s)'"
            },
            {
              _tag:"input",
              _attr:{
                class:"form-control",
                type:"number",
                step:60,
                min:0
              },
              _dataModel:"k8s._data._config.alarmFrequency"
            },
            {
              _if:"k8s._uiSwitch._alarmWait&&Date.now()<k8s._uiSwitch._alarmWait",
              _tag:"div",
              _attr:{
                class:"bz-precentage-bar",
                style:function(){
                  k8s._uiSwitch._alarmWaitUpdate
                  let c=parseInt((1-(k8s._uiSwitch._alarmWait-Date.now())/(k8s._data._config.alarmFrequency*1000))*100)+"%"
                  setTimeout(function(){
                    k8s._uiSwitch._alarmWaitUpdate=Date.now()
                  },1000)
                  return "height:30px;width:"+c
                },
                precentage:function(){
                  k8s._uiSwitch._alarmWaitUpdate
                  return parseInt((k8s._data._config.alarmFrequency*1000-k8s._uiSwitch._alarmWait+Date.now())/1000)+"s"
                }
              }
            }
          ]
        },
        {
          _tag:"button",
          _attr:{
            disabled:"!(k8s._data._config.alarms||{})[k8s._data._config.ns].length",
            class:"'btn btn-icon bz-none-border bz-space-15 bz-bottom-space-5 '+(k8s._uiSwitch._alarmPlay?'bz-stop':'bz-play')",
            title:"k8s._uiSwitch._alarmPlay?_k8sMessage._method._stop:_k8sMessage._method._play"
          },
          _jqext:{
            click:function(){
              if(k8s._uiSwitch._alarmPlay){
                k8s._stopAlarm()
              }else{
                k8s._startAlarm()
              }

            }
          }
        },
        {
          _tag:"button",
          _attr:{
            disabled:"!(k8s._data._config.alarms||{})[k8s._data._config.ns].length",
            class:"btn btn-icon bz-none-border bz-space-15 bz-bottom-space-5 bz-refresh",
            title:"_k8sMessage._method._refresh"
          },
          _jqext:{
            click:function(){
              k8s._getAlarmInfo()

            }
          }
        }
      ]
    },
    "<hr/>",
    {
      _tag:"div",
      _attr:{
        class:"bz-list-box"
      },
      _items:[
        {
          _tag:"table",
          _attr:{
            class:"bz-data-table"
          },
          _items:[
            {
              _tag:"thead",
              _items:[
                {
                  _tag:"tr",
                  _items:[
                    {
                      _tag:"th",
                      _text:"_k8sMessage._common._type"
                    },
                    {
                      _tag:"th",
                      _text:"_k8sMessage._common._content"
                    },
                    {
                      _tag:"th",
                      _text:">= (%)"
                    },
                    {
                      _tag:"td",
                      _text:"_k8sMessage._common._scope+' (group)'"
                    },
                    {
                      _tag:"td"
                    }
                  ]
                }
              ]
            },
            {
              _tag:"tbody",
              _items:[
                {
                  _tag:"tr",
                  _items:[
                    //type
                    {
                      _tag:"td",
                      _items:[
                        {
                          _tag:"select",
                          _attr:{
                            class:"form-control"
                          },
                          _items:[
                            {
                              _tag:"option",
                              _attr:{
                                value:"_data._key"
                              },
                              _text:"_data._item",
                              _dataRepeat:"_k8sMessage._alarm._type"
                            }
                          ],
                          _dataModel:"k8s._data._config.alarms[k8s._data._config.ns][_data._idx].type"
                        }
                      ]
                    },
                    //content
                    {
                      _tag:"td",
                      _items:[
                        {
                          _tag:"select",
                          _attr:{
                            class:"form-control"
                          },
                          _items:[
                            {
                              _tag:"option",
                              _attr:{
                                value:"_data._key"
                              },
                              _text:"_data._item",
                              _dataRepeat:"_k8sMessage._alarm._content"
                            }
                          ],
                          _dataModel:"k8s._data._config.alarms[k8s._data._config.ns][_data._idx].content"
                        }
                      ]
                    },
                    //value
                    {
                      _tag:"td",
                      _items:[
                        {
                          _tag:"input",
                          _attr:{
                            class:"form-control",
                            type:"number",
                            step:5,
                            min:0,
                            max:100
                          },
                          _dataModel:"k8s._data._config.alarms[k8s._data._config.ns][_data._idx].value"
                        }
                      ]
                    },
                    //scope
                    {
                      _tag:"td",
                      _items:[
                        {
                          _if:function(d){
                            if(d._item._refresh){
                              setTimeout(()=>{
                                d._item._refresh=0
                                delete d._item._refresh
                              },100)
                            }
                            return !d._item._refresh
                          },
                          _tag:"div",
                          _attr:{
                            style:"padding: 0 5px;overflow: auto;height: 29px;"
                          },
                          _items:[
                            {
                              _tag:"label",
                              _attr:{
                                style:function(d){
                                  let c="color:var(--disable-color);"
                                  if(k8s._data._config.alarms[k8s._data._config.ns][d._supData._idx].scope[d._item]){
                                    c="color:unset;"
                                  }
                                  return c
                                },
                                class:"pull-left bz-alarm-item",
                                cv:function(d,c,o){
                                  let s=d._supData._item,
                                      r=s._result,
                                      u=s.type=="cpu"?"m":s.type=="memory"?"Mi":""
                                  if(r&&r[d._item]){
                                    let v= r[d._item]._curValue
                                    if(v&&typeof v=="object"){
                                      if(v._percentage===undefined){
                                        v= `${v._alarm?'🔔 ':''}${v._value}%`
                                      }else{
                                        v= `${v._alarm?'🔔 ':''}${v._percentage}% (${v._value+u})`
                                      }
                                      if(o&&v!=$(o).attr("cv")){
                                        $(o).addClass("bz-updating")
                                        setTimeout(()=>{
                                          $(o).removeClass("bz-updating")
                                        },4000)
                                      }
                                      return v
                                    }
                                  }
                                },
                                title:function(d){
                                  let r=d._supData._item._result
                                  if(r&&r[d._item]){
                                    return r[d._item]._title
                                  }
                                }
                              },
                              _items:[
                                {
                                  _tag:"input",
                                  _attr:{
                                    type:"checkbox"
                                  },
                                  _dataModel:"k8s._data._config.alarms[k8s._data._config.ns][_data._supData._idx].scope[_data._item]",
                                  _jqext:{
                                    click:function(){
                                      this._data._supData._item._refresh=1
                                    }
                                  }
                                },
                                {
                                  _text:"_data._item"
                                }
                              ],
                              _dataRepeat:function(d){
                                let c=k8s._data._config,
                                    s=c.ns
                                let vs= c.filter[s].split("|")
                                let sc=c.alarms[s][d._idx].scope
                                vs=vs.sort((a,b)=>{
                                  if(sc[a]==sc[b]){
                                    if(a>b){
                                      return 1
                                    }else{
                                      return -1
                                    }
                                  }else if(sc[a]){
                                    return -1
                                  }else if(sc[b]){
                                    return 1
                                  } 
                                })
                                return vs
                              }
                            }
                          ]
                        }
                      ]
                    },
                    //delete
                    {
                      _tag:"td",
                      _attr:{
                        style:"padding: 5px;text-align:center;"
                      },
                      _items:[
                        {
                          _tag:"button",
                          _attr:{
                            class:"btn btn-icon bz-none-border bz-delete",
                            style:"margin-top: -10px;"
                          },
                          _jqext:{
                            click:function(){
                              k8s._data._config.alarms[k8s._data._config.ns].splice(this._data._idx,1)
                              k8s._saveSetting()
                            }
                          }
                        }
                      ]
                    }
                  ],
                  _dataRepeat:function(){
                    return (k8s._data._config.alarms||{})[k8s._data._config.ns]
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};