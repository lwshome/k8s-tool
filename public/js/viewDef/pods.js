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
                class:function(d){
                  let c="bz-list-row"
                  if(d._item==k8s._data._curCtrl){
                    c+= " bz-highlight-row"
                  }
                  return c
                }
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
                                c+="bz-loading"
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
                        },
                        style:"position: relative;top: -3px;"
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
                            return _attachHighlight(d._item._name,d._supData._item.filter)
                          }
                        },    
                        //age
                        {
                          _tag:"i",
                          _attr:{
                            style:"margin-left:10px;color:grey;"
                          },
                          _text:"'('+_data._item._date+', '+_data._item._size+', '+_data._item._chmod+')'"
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
                        _logHandler._data._showLog=0
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
                    return k8s._data._curCtrl==d._item
                  },
                  _tag:"div",
                  _attr:{
                    class:"bz-ex-ctl-panel"
                  },
                  _items:[
                    {
                      _if:"_data._item._folder",
                      _tag:"input",
                      _attr:{
                        class:"form-control",
                        placeholder:"_k8sMessage._method._filter"
                      },
                      _dataModel:"_data._item.filter"
                    },
                    {
                      _tag:"button",
                      _attr:{
                        title:"_k8sMessage._method[_data._item]",
                        style:"margin-right:10px;",
                        class:function(d){
                          let c='btn btn-icon bz-small-btn bz-none-border bz-'+d._item
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
                        click:function(){
                          let d=this._data._supData._item
                          switch(this._data._item){
                            case "download":
                              return k8s._download(d._pod,d)
                            case "star":
                              return k8s._setStar(d)
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
                          }
                        }
                      },
                      _dataRepeat:function(d){
                        let s=["download","delete","star"]
                        if(d._item._folder){
                          s.splice(1,0,"add-folder","add-file")
                          s.unshift("search","refresh")
                        }
                        return s
                      }
                    }
                  ]
                }
              ],
              _jqext:{
                mouseover:function(){
                  k8s._data._curCtrl=this._data._item
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
    style:"flex:1;overflow:auto;"
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
                  let c="bz-list-row"
                  if(d._item==k8s._data._curCtrl){
                    c+= " bz-highlight-row"
                  }
                  return c
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
                              c+="bz-loading"
                            }else{
                              c+="bz-open-item"
                            }
                          }else{
                            c+="bz-close-item"
                          }
                          return c
                        },
                        style:"'font-size: 18px;font-family: monospace;visiablity:'+(_data._item._status=='Running'?'visible':'hidden')"
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
                            if(d._forwarding){
                              c+="bz-network"
                            }else{
                              c+="bz-computer"
                            }
                          }else if(d._status!="Running"){
                            c+="bz-failed"
                          }else{
                            c+="bz-loading"
                          }
                          
                          return c
                        },
                        title:"_data._item._forwarding",
                        style:"'font-size: 18px;font-family: monospace;visiablity:'+(_data._item._status=='Running'?'visible':'hidden')"
                      },
                      _jqext:{
                        click:function(e){
                          let d=this._data._item
                          if(d._forwarding){
                            e.stopPropagation()
                            window.open("http://localhost:"+d._forwarding.split(":")[0]+"/actuator/health")
                          }
                        }
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
                            return _attachHighlight(d._item._name,k8s._data._config.filter)
                          }
                        },
                        //age
                        {
                          _tag:"i",
                          _attr:{
                            style:"margin-left:10px;color:grey;"
                          },
                          _text:"'('+_data._item._age+')'"
                        },
                        {
                          _if:"_data._item==k8s._data._curCtrl",
                          _tag:"button",
                          _attr:{
                            class:"btn btn-icon bz-small-btn bz-none-border bz-copy",
                            title:"_k8sMessage._method._copy"
                          },
                          _jqext:{
                            click:function(e){
                              e.stopPropagation()
                              _Util._copyText(this.parentElement.children[0].innerText.trim(),document,this.parentElement.children[0])
                            }
                          }
                        }
                      ]
                    }
                  ],
                  _jqext:{
                    click:function(){
                      let d=this._data._item
                      if(d._status=="Running"){
                        d._open=!d._open
                        if(d._open&&!d._subList){
                          k8s._getFileList(d,d)
                        }
                      }
                    }
                  }
                },
                {
                  _if:function(d){
                    return k8s._data._curCtrl==d._item
                  },
                  _tag:"div",
                  _attr:{
                    class:"bz-ex-ctl-panel"
                  },
                  _items:[
                    {
                      _tag:"input",
                      _attr:{
                        class:"form-control",
                        style:"margin-left:10px;padding:5px;padding: 4px;margin-top: -3px;width:150px;",
                        placeholder:"_k8sMessage._method._filter"
                      },
                      _dataModel:"_data._item.filter"
                    },
                    {
                      _tag:"button",
                      _attr:{
                        title:"_k8sMessage._method[_data._item]",
                        style:"margin-right:10px;",
                        class:function(d){
                          let c='btn btn-icon bz-small-btn bz-none-border bz-'+d._item
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
                            case "forward":
                              return k8s._forward(d)
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
                      _dataRepeat:["search","refresh","delete-pod","forward","log","cmd","link"]
                    }
                  ]
                },
                {
                  _if:"['cmd','link'].includes(k8s._uiSwitch._showMenu._key)&&k8s._uiSwitch._showMenu._item==_data._item",
                  _tag:"div",
                  _attr:{
                    style:function(){
                      let r=k8s._uiSwitch._showMenu._element.getBoundingClientRect()
                      return `top:${r.top+20}px;right:${window.innerWidth-r.right}px;`
                    },
                    class:"bz-menu-panel"
                  },
                  _items:[
                    {
                      _if:"k8s._uiSwitch._showMenu=='link'",
                      _tag:"div",
                      _attr:{
                        class:"bz-menu-item",
                        title:"_k8sMessage._method._copy"
                      },
                      _items:[
                        {
                          _tag:"span",
                          _text:"192.168.1.1:8080",
                          _attr:{
                            style:"margin-right:10px;"
                          }
                        },
                        {
                          _tag:"button",
                          _attr:{
                            class:"btn btn-icon bz-small-btn bz-none-border bz-copy"
                          }
                        }
                      ],
                      _jqext:{
                        click:function(){
                          _Util._copyText(this.innerText.trim(),document,this.children[0])
                        }
                      }
                    },
                    {
                      _tag:"div",
                      _attr:{
                        class:"bz-menu-item"
                      },
                      _items:[
                        {
                          _tag:"span",
                          _text:"_data._item.name||_data._item"
                        }
                      ],
                      _dataRepeat:"_data._item[k8s._uiSwitch._showMenu._key]",
                      _jqext:{
                        click:function(){
                          k8s._exeItem(k8s._uiSwitch._showMenu._key,this._data._item)
                        }
                      }
                    },
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
                          k8s._openFunSetting(k8s._uiSwitch._showMenu._key)
                        }
                      }
                    }
                  ]
                }
              ],
              _jqext:{
                mouseover:function(){
                  k8s._data._curCtrl=this._data._item
                }
              }
            },
            _buildTreeNode()
          ],
          _dataRepeat:function(){
            return (k8s._data._podList||[]).filter(x=>k8s._isShowItem(x,k8s._data._config.filter))
          }
        }
      ]    
    }
  ]
};
function _attachHighlight(v,ff){
  if(ff){
    let fs=ff.split("|");
    f=new RegExp(ff,"g")
    f=v.match(f)
    if(f){
      let j=0,w="",t=""
      f=f[0]
      let g=fs.indexOf(f)+1
      let i=v.indexOf(f)
      w+=v.substring(j,i)+"<span class='g-"+g+"'>"+f+"</span>"
      v=v.substring(i+f.length)

      v="<span>"+w+v+"</span>"
    }
  }
  return v
}