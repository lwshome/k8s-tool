function _buildTreeNode(){
  return {
    _if:"_data._item._open",
    _tag:"div",
    _attr:{
      class:"bz-list-content"
    },
    _items:[
      {
        _tag:"div",
        _items:function(){
          return [
            {
              _tag:"div",
              _attr:{
                class:"bz-list-row"
              },
              _items:[
                {
                  _tag:"a",
                  _attr:{
                    class:"bz-node-title",
                    droppable:"_data._item._folder?1:0",
                    ondragover:"k8s._ondragover(this,event)",
                    ondragleave:"k8s._ondragleave(this,event)",
                    ondrop:"k8s._ondrop(this,event)"
                  },
                  _items:[
                    //folder(open/close)
                    {
                      _tag:"button",
                      _attr:{
                        class:function(d){
                          d=d._item
                          let c='btn btn-icon bz-small-btn bz-none-border '
                          if(d._folder){
                            if(d._open||d._loading){
                              if(!d._subList||d._loading){
                                c+="bz-small-loading"
                              }else{
                                c+="bz-folder-open"
                              }
                            }else{
                              c+="bz-folder-close"
                            }
                          }else{
                            c+="bz-file"
                          }
                          return c
                        }
                      }
                    },
                    //info
                    {
                      _tag:"a",
                      _attr:{
                        style:function(d){
                          let c="margin-left:5px;"
                          if(!parseInt(d._item._size)){
                            c+="color:grey;"
                          }else{
                            c+="color:unset;"
                          }
                          return c
                        }
                      },
                      _items:[
                        //name
                        {
                          _tag:"span",
                          _html:function(d){
                            return _attachHighlight(d._item._name,d._supData._item.filter)
                          }
                        },    
                        //age
                        {
                          _tag:"i",
                          _attr:{
                            style:"margin-left:10px;color:grey;"
                          },
                          _text:"'('+_data._item._date+', '+_Util._formatFileSize(_data._item._size)+', '+_data._item._chmod+')'"
                        }
                      ]
                    }
                  ],
                  _jqext:{
                    click:function(){
                      let d=this._data._item
                      if(d._folder){
                        d._open=!d._open
                        if(d._open){
                          if(!d._subList){
                            k8s._getFileList(d._pod,d)
                          }
                        }
                      }else{
                        k8s._data._curFile=d
                        k8s._uiSwitch._curPodDetails='_file'
                        
                        if(!d._content){
                          k8s._openFile(d._pod,d)
                        }
                      }
                    }
                  }
                },
                {
                  _if:"k8s._isStar(_data._item)",
                  _tag:"div",
                  _attr:{
                    class:"btn btn-icon bz-small-btn bz-star on pull-right bz-none-border bz-row-star",
                    style:"margin-top:5px;margin-right:10px;"
                  }
                },
                {
                  _if:function(d){
                    return k8s._data._curCtrl._data==d._item
                  },
                  _tag:"div",
                  _attr:{
                    class:"bz-ex-ctl-panel"
                  },
                  _items:[
                    {
                      _tag:"button",
                      _attr:{
                        title:"_k8sMessage._method[_data._item]",
                        style:"margin-left:3px !important;margin-right: 0 !important;",
                        class:function(d){
                          let c='btn btn-icon bz-none-border bz-'+d._item
                          if(k8s._isStar(d._supData._item)){
                            c+=" on"
                          }
                          return c
                        }
                      },
                      _items:[
                        {
                          _if:"_data._item=='add-folder'||_data._item=='add-file'",
                          _tag:"span",
                          _text:"＋"
                        }
                      ],
                      _jqext:{
                        click:function(e){
                          let d=this._data._supData._item
                          switch(this._data._item){
                            case "copy":
                              e.stopPropagation()
                              debugger
                              e=this.parentElement.parentElement.children[0].children[1].children[0]
                              _Util._copyText(this._data._supData._item._path.replace("etc/../",""),document,e)
                              return
                            case "download":
                              return k8s._download(d._pod,d)
                            case "star":
                              return k8s._setStar(d)
                            case "filter":
                              return d._showFilter=1
                            case "search":
                              return k8s._searchFile(d)
                            case "refresh":
                              d._subList=0
                              d._open=0
                              $(this.parentElement.parentElement.children[0]).click()
                              return
                            case "delete":
                              return k8s._deleteFile(d._pod,d)
                            case "add-folder":
                              return k8s._addFile(d._pod,d,1)
                            case "add-file":
                              return k8s._addFile(d._pod,d)
                            case "sweap":
                              return k8s._sweap(d._pod,d)
                          }
                        }
                      },
                      _dataRepeat:function(d){
                        let s=["copy","download","star","sweap"]
                        if(!d._item._folder){
                          s.push("delete")
                        }else{
                          s.splice(1,0,"add-folder","add-file")
                          // s.unshift("filter","search","refresh")
                          s.unshift("refresh")
                        }
                        return s
                      }
                    },
                    {
                      _if:"_data._item._showFilter",
                      _tag:"div",
                      _items:[
                        {
                          _tag:"input",
                          _attr:{
                            class:"form-control",
                            style:"margin-left:10px;padding:5px;padding: 4px;width:150px;",
                            placeholder:"_k8sMessage._method._filter"
                          },
                          _dataModel:"_data._item.filter",
                          _jqext:{
                            keydown:function(e){
                              if(e.keyCode==13){
                                this._data._item._showFilter=0
                              }
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ],
              _jqext:{
                mouseover:function(){
                  _setCurCtrl(this)
                },
                click:function(){
                  _setCurCtrl(this,1)
                }
              }
            },
            _buildTreeNode()
          ]
        },
        _dataRepeat:function(d){
          d=d._item
          try{
            return (d._subList||[]).filter(x=>!d.filter||x._name.match(new RegExp(d.filter,"i")))
          }catch(e){}
        }
      }
    ]
  }
}
const _listViewDef={
  _if:"k8s._uiSwitch._curMainTab=='_pods'",
  _tag:"div",
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
                  let c=k8s._data._curPodDetails,
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
                    class:"bz-node-title",
                    droppable:1,
                    ondragover:"k8s._ondragover(this,event)",
                    ondragleave:"k8s._ondragleave(this,event)",
                    ondrop:"k8s._ondrop(this,event)"
                  },
                  _items:[
                    //open/close
                    {
                      _tag:"button",
                      _attr:{
                        class:function(d){
                          let c='btn btn-icon bz-small-btn bz-none-border '
                          d=d._item
                          if(d._open||d._loading){
                            if(!d._subList||d._loading){
                              c+="bz-small-loading"
                            }else{
                              c+="bz-open-item"
                            }
                          }else{
                            c+="bz-close-item"
                          }
                          return c
                        },
                        style:"'font-size: 18px;font-family: monospace;visibility:'+(_data._item._status=='Running'?'visible':'hidden')"
                      },
                      _jqext:{
                        click:function(e){
                          let d=this._data._item
                          if(d._status=="Running"){
                            d._open=!d._open
                            if(d._open&&!d._subList){
                              k8s._getFileList(d,d)
                            }
                          }
                          e.stopPropagation()
                        }
                      }
                    },
                    //icon
                    {
                      _tag:"button",
                      _attr:{
                        class:function(d){
                          let c='btn btn-icon bz-small-btn bz-none-border '
                          d=d._item
                          if(d._ready){
                            c+="bz-computer"
                          }else if(d._status!="Running"){
                            c+="bz-failed"
                          }else{
                            c+="bz-small-loading"
                          }
                          
                          return c
                        },
                        title:"_data._item._forwarding",
                        style:"'font-size: 18px;font-family: monospace;visibility:'+(_data._item._status=='Running'?'visible':'hidden')"
                      },
                      _jqext:{
                        click:function(e){
                          let d=this._data._item
                          if(d._forwarding){
                            e.stopPropagation()
                            window.open(d._host+"/actuator/health")
                          }
                        }
                      }
                    },
                    //info
                    {
                      _tag:"a",
                      _attr:{
                        style:"margin-left:5px;margin-right:5px;"
                      },
                      _items:[
                        //name
                        {
                          _tag:"span",
                          _html:function(d){
                            return _attachHighlight(d._item._name,k8s._data._config.filter[k8s._data._config.ns],d._item)
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
                    },
                    {
                      _if:"_data._item._forwarding&&k8s._data._curCtrl._data!=_data._item",
                      _tag:"button",
                      _attr:{
                        class:"btn btn-icon bz-small-btn bz-none-border bz-press bz-forward",
                        style:"margin:2px;"
                      }
                    },
                    {
                      _if:"_data._item._log&&k8s._data._curCtrl._data!=_data._item",
                      _tag:"button",
                      _attr:{
                        class:"btn btn-icon bz-small-btn bz-none-border bz-press bz-log",
                        style:"margin:2px;"
                      }
                    }
                  ],
                  _jqext:{
                    click:function(){
                      k8s._getPodDetails(this._data._item)
                    }
                  }
                },
                //ctrl-panel
                {
                  _if:function(d){
                    return k8s._data._curCtrl._data==d._item
                  },
                  _tag:"div",
                  _attr:{
                    class:"bz-ex-ctl-panel"
                  },
                  _items:[
                    {
                      _tag:"button",
                      _attr:{
                        style:"margin-left:3px !important;margin-right: 0 !important;",
                        disabled:function(d){
                          return !d._supData._item._forwarding&&(d._item=='link'||d._item=='api')
                        },
                        class:function(d){
                          let c='btn btn-icon bz-none-border bz-'+d._item
                          if((d._item=='forward'&&d._supData._item._forwarding)||(d._item=='log'&&d._supData._item._log)){
                            c+=" bz-press"
                          }
                          return c
                        }
                      },
                      _jqext:{
                        click:function(e){
                          let d=this._data._supData._item
                          switch(this._data._item){
                            case "copy":
                              e.stopPropagation()
                              e=this.parentElement.parentElement.children[0].children[2]
                              _Util._copyText(e.innerText.trim(),document,e)
                              return
                            case "forward":
                              return k8s._forward(d)
                            case "filter":
                              return d._showFilter=1
                            case "search":
                              return k8s._searchFile(d)
                            case "refresh":
                              d._subList=0
                              d._open=1
                              d._loading=1
                              d._path="etc/.."
                              return k8s._getFileList(d,d)
                            case "delete-pod":
                              return k8s._removePod(d)
                            case "cmd":
                            case "api":
                            case "link":
                              k8s._uiSwitch._showMenu={
                                _item:d,
                                _key:this._data._item,
                                _element:this
                              }
                              e.stopPropagation()
                              return
                            case "log":
                              if($(this).hasClass("bz-press")){
                                return _logHandler._closeLog(d)
                              }else{
                                return k8s._getLog(d,d)
                              }
                          }
                        }
                      },
                      _dataRepeat:function(d){
                        return ["copy","refresh","forward","log","cmd","link","api","delete-pod"]
                      }
                    },
                    {
                      _if:"_data._item._showFilter",
                      _tag:"div",
                      _items:[
                        {
                          _tag:"input",
                          _attr:{
                            class:"form-control",
                            style:"margin-left:10px;padding:5px;padding: 4px;width:150px;",
                            placeholder:"_k8sMessage._method._filter"
                          },
                          _dataModel:"_data._item.filter",
                          _jqext:{
                            keydown:function (e) {
                              if(e.keyCode==13){
                                this._data._item._showFilter=0
                              }
                            }
                          }
                        }
                      ]
                    }
                  ]
                },
                //cur-show-items
                {
                  _if:"['cmd','link','api'].includes(k8s._uiSwitch._showMenu._key)&&k8s._uiSwitch._showMenu._item==_data._item",
                  _tag:"div",
                  _attr:{
                    style:function(){
                      let r=k8s._uiSwitch._showMenu._element.getBoundingClientRect()
                      return `top:${r.top+20}px;right:${window.innerWidth-r.right-100}px;`
                    },
                    class:"bz-menu-panel"
                  },
                  _items:[
                    {
                      _if:"k8s._uiSwitch._showMenu._key=='link'",
                      _tag:"div",
                      _attr:{
                        class:"bz-menu-item",
                        title:"_k8sMessage._method._copy"
                      },
                      _items:[
                        {
                          _tag:"span",
                          _text:function(d){
                            d=d._item
                            if(!d._host){
                              d._host="http://localhost:"+d._forwarding.split(":")[0]
                            }
                            return d._host
                          },
                          _attr:{
                            style:"margin-right:10px;cursor:pointer;"
                          },
                          _jqext:{
                            click:function(){
                              window.open(this.innerText.trim())
                            }
                          }
                        },
                        {
                          _tag:"button",
                          _attr:{
                            class:"btn btn-icon bz-none-border bz-copy"
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
                    },
                    {
                      _if:"k8s._uiSwitch._showMenu._key=='link'",
                      _tag:"hr"
                    },
                    {
                      _tag:"div",
                      _items:[
                        {
                          _tag:"div",
                          _attr:{
                            class:"bz-menu-item"
                          },
                          _items:[
                            {
                              _tag:"button",
                              _attr:{
                                class:"'btn btn-icon bz-small-btn bz-none-border bz-'+k8s._uiSwitch._showMenu._key",
                                style:"margin-right:10px;"
                              }
                            },
                            {
                              _tag:"span",
                              _text:function(d){
                                d=d._item
                                let v=d.name
                                if(d.podGroup){
                                  v+=" ("+d.podGroup+")"
                                }
                                return v
                              }
                            }
                          ],
                          _dataRepeat:function(d){
                            return k8s._data._config[k8s._uiSwitch._showMenu._key].filter(x=>!x.podGroup||x.podGroup==d._item.gk)
                          },
                          _jqext:{
                            click:function(){
                              k8s._exeItem(k8s._uiSwitch._showMenu,this._data._item)
                            }
                          }
                        }
                      ]
                    },
                    {
                      _if:"k8s._data._config[k8s._uiSwitch._showMenu._key].length",
                      _tag:"hr"
                    },
                    //setting 
                    {
                      _tag:"div",
                      _attr:{
                        class:"bz-menu-item"
                      },
                      _items:[
                        {
                          _tag:"button",
                          _attr:{
                            class:"btn btn-icon bz-small-btn bz-setting bz-none-border",
                            style:"margin-right:10px;"
                          }
                        },
                        {
                          _tag:"span",
                          _text:"_k8sMessage._setting._title"
                        }
                      ],
                      _jqext:{
                        click:function(){
                          k8s._data._curGroup=k8s._data._curCtrl._data.gk
                          k8s._openFunSetting(k8s._uiSwitch._showMenu._key)
                        }
                      }
                    }
                  ]
                }
              ],
              _jqext:{
                mouseover:function(){
                  _setCurCtrl(this)
                },
                click:function(){
                  _setCurCtrl(this,1)
                }
              }
            },
            _buildTreeNode()
          ],
          _dataRepeat:function(){
            return (k8s._data._podList||[]).filter(x=>k8s._isShowItem(x,k8s._data._config.filter[k8s._data._config.ns]))
          }
        }
      ]    
    }
  ]
};

function _setCurCtrl(o,_focus){
  if(!_focus&&k8s._data._curCtrl&&$(k8s._data._curCtrl._element).find(":focus")[0]){
    return
  }
  k8s._data._curCtrl={
    _element:o,
    _data:o._data._item
  }
}

function _attachHighlight(v,ff,d){
  if(ff){
    ff=k8s._getGroupKey(v,ff)
    if(ff){
      let j=0,w=""

      d.g=ff.g
      d.gk=ff.gk

      let i=v.indexOf(d.gk)
      w+=v.substring(j,i)+"<span class='g-"+d.g+"'>"+d.gk+"</span>"
      v=v.substring(i+d.gk.length)

      v="<span>"+w+v+"</span>"
    }
  }
  return v
}