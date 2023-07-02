const { exec } = require("child_process");
const spawn = require('child_process').spawn
const fs = require("fs");
const _config=global._config;
let settings;
const k8s={
  getConfig:function(d,_fun){
    if(!settings){
      settings=fs.readFileSync("config/env/setting.txt")||"{}"
      settings=JSON.parse(settings)
    }
    _fun(settings)
  },
  saveConfig:function(c){
    console.log(c)
    settings=c
    fs.writeFileSync("config/env/setting.txt",JSON.stringify(c,0,2))
  },
  getNamespaceList:function(_fun){
    _exe("kubectl get namespace",_fun)
  },
  killProcess:function(k,_fun){
    let s=`ps aux | grep -P "${k}"`
    console.log(s)
    _exe(s,function(v){
      if(v){
        console.log(v)
        v=v.split(/\s+/)
        v.shift()
        s=`kill -9 `+v.shift()
        _exe(s,_fun)
      }
    })
  },
  forward:function(d,_fun){
    console.log("Forward: ")
    console.log(d)
    k8s.killProcess("port-forward.+"+d.port,function(){
      let s=`${_getK8sCmdHeader(d)} port-forward ${d.serverName} ${d.port}`
      console.log(s)
      s=s.split(" ")
      _monitor(s.shift(),s,_fun)
    })
  },
  getLog:function(d,_fun){
    let s=`logs -f --tail=100 ${d.serverName}`,
        _size=0,_timer=0,_stop;
    k8s.killProcess(s,function(){
      s=`${_getK8sCmdHeader(d)} ${s}`
      s=s.split(" ")
      _monitorLog(s.shift(),s,_fun)
    })

    function _monitorLog(_cmd,_args,_fun){
      console.log(Date.now())
      console.log("_cmd: "+_cmd)
      console.log("_args: "+_args)
      try{
        let ls = spawn(_cmd, _args);
    
        ls.stdout.on('data', function (d) {
          _sendData(d,"log")
        });
        
        ls.stderr.on('data', function (d) {
          _sendData(d,"log-err")
        });
        
        ls.on('exit', function (code) {
          _fun("COMPLETE-LOG: " + code);
        });
      }catch(ex){
        _fun(ex.message)
      }
    }
    
    function _sendData(dd,_mark){
      if(_stop){
        console.log("stop pre-log!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        return
      }
      _size++
      dd=dd.toString()
      // console.log(_mark+":"+d.length)
      _fun(dd);
      clearTimeout(_timer)
      _timer=setTimeout(()=>{
        _stop=1
        console.log("Redo log: "+d.serverName+" ..........................................................................")
        console.log(new Date())
        k8s.getLog(d,_fun)
      },_getTimeout(_size))
    }

    function _getTimeout(s){
      if(_size>1000){
        return 5000
      }else if(_size>500){
        return 10000
      }
      return 100000
    }
  },
  getList:function(d,_fun){
    let s=`${_getK8sCmdHeader(d)} get ${d.type}`
    console.log(s)
    _exe(s,_fun)
  },
  getPSList:function(d,_fun){
    let s="ps aux | grep 'kubectl -n'"
    _exe(s,_fun)
  },
  downloadFolder:function(d,_fun){
    let f=d.path.split("/")
    f=f.pop()||f.pop()
    f="download/"+f
    if(!fs.existsSync("download")){
      fs.mkdirSync("download")
    }
    if(fs.existsSync(f)){
      fs.rmdirSync(f)
    }
    fs.mkdirSync(f)
    _handlerFolder(d,f,_fun)
    function _handlerFolder(d,r,fff){
      k8s.getFileList(d,function(vs){
        vs=vs.trim().split("\n").map(x=>x.split(/\s+/)).filter(x=>x.length>5).map(x=>{
          let n=x.pop()
          if(x[x.length-1]=="->"){
            x.pop()
            n=x.pop()
          }
          return {
            name:n,
            _folder:x[0][0]=="d",
            path:d.path+"/"+n,
            serverName:d.serverName
          }
        })
        _handlerItem(vs,r,fff)
      })
    }

    function _handlerItem(vs,r,fff){
      let x=vs.shift()
      if(x){
        if(x._folder){
          console.log("Do folder: "+r+"/"+x.name)
          fs.mkdirSync(r+"/"+x.name)

          _handlerFolder(x,r+"/"+x.name,function(){
            _handlerItem(vs,r,fff)
          })
        }else{
          x.localFolder=r
          k8s.copyFile(x,function(v){
            _handlerItem(vs,r,fff)
          })
        }
      }else{
        fff()
      }
    }
  },
  copyFile:function(_data,_fun){
    let n=_data.name
    if(_data.localFolder){
      n=_data.localFolder+"/"+n
    }else{
      if(!fs.existsSync("download")){
        fs.mkdirSync("download")
      }
      n="download/"+n
    }
    let s=`${_getK8sCmdHeader(_data)} cp ${_data.serverName}:${_data.path} ${n}`
    _exe(s,_fun)
  },
  getFileList:function(_data,_fun){
    let s=_buildRemoteK8sCmd({ns:_data.ns,name:_data.serverName,cmd:"ls -ltr "+(_data.path||"")})
    s=s.split(" ")
    _monitor(s.shift(),s,_fun)
    // _exe(s,_fun)
  },
  //Load stars(files)
  searchStars:function(_data,_fun){
    let s=_data.stars.map(x=>`ls -ltr ${x}`).join(" && ")
    s=_buildRemoteK8sCmd({ns:_data.ns,name:_data.serverName,cmd:s}).split(" ")
    _monitor(s.shift(),s,_fun)
  },
  openFile:function(_data,_fun){
    let s=_buildRemoteK8sCmd({ns:_data.ns,name:_data.serverName,cmd:"cat "+_data.path})
    _exe(s,function(v){
      v=v||""
      if(v.cmd){
        _data.name=_data.path.split("/").pop()
        k8s.copyFile(_data,function(){
          _fun({msg:"download"})
        })
      }else{
        _fun(v)
      }
    })
  },
  deleteFile:function(d,_fun){
    let s=`${_getK8sCmdHeader(d)} exec -i ${d.serverName} -- rm ${d.folder?"-r":""} ${d.path}`
    s=s.split(" ")
    _monitor(s.shift(),s,_fun)
  },
  sweapFile:function(d,_fun){
    console.log("------- Sweap file:")
    let s=`${_getK8sCmdHeader(d)} exec -i ${d.serverName} -- truncate -s 0 ${d.path}`
    console.log(s)
    s=s.split(" ")
    _monitor(s.shift(),s,_fun)
  },
  sweapFiles:function(d,_fun){
    let f=d.path
    
    _handlerFolder(d,f,_fun)
    function _handlerFolder(d,r,fff){
      k8s.getFileList(d,function(vs){
        vs=vs.trim().split("\n").map(x=>x.split(/\s+/)).filter(x=>x.length>5).map(x=>{
          let n=x.pop()
          if(x[x.length-1]=="->"){
            x.pop()
            n=x.pop()
          }
          console.log("Get file: "+d.path+"/"+n)
          return {
            name:n,
            path:d.path+"/"+n,
            _folder:x[0][0]=="d",
            serverName:d.serverName,
            ns:d.ns
          }
        })
        _handlerItem(vs,r,fff)
      })
    }

    function _handlerItem(vs,r,fff){
      let x=vs.shift()
      if(x){
        if(x._folder){
          console.log("Sweap folder: "+r+"/"+x.name)
          _handlerFolder(x,r+"/"+x.name,function(){
            _handlerItem(vs,r,fff)
          })
        }else{
          k8s.sweapFile(x,function(v){
            _handlerItem(vs,r,fff)
          })
        }
      }else{
        fff()
      }
    }
  },
  addFile:function(d,_fun){
    if(d.folder){
      let s=`${_getK8sCmdHeader(d)} exec -i ${d.serverName} -- mkdir ${d.path}`
      _exe(s,_fun)
    }else{
      k8s.saveFile(d,_fun)
    }
  },
  removePod:function(d,_fun){
    let s=`${_getK8sCmdHeader(d)} delete pod ${d.serverName}`
    _exe(s,_fun)
  },
  saveFile:function(_data,_fun){
    fs.writeFileSync("tmp",(_data.content||""))
    let s=`${_getK8sCmdHeader(_data)} cp tmp ${_data.ns}/${_data.serverName}:${_data.path}`
    _exe(s,function(r){
      console.log("upload completed, going to delete tmp file")
      fs.rmSync("tmp")
      console.log("Delete tmp file, call back ")
      _fun(r)
    })
  },
  searchFile:function(d,_fun){
    let s=`${_getK8sCmdHeader(d)} exec -i ${d.serverName} -- find ${d.path} -name ${d.file} -ls`
    s=s.split(" ")
    _monitor(s.shift(),s,_fun)
    // _exe(s,_fun)
  },
  logFile:function(_data,_fun){
    let s=`${_getK8sCmdHeader(_data)} logs -f ${_data.serverName}`
    s=s.split(" ")
    _monitor(s.shift(),s,_fun)
  },
  updateScaleConfig:function(_data){
    let s=`${_getK8sCmdHeader(_data)} scale --${_data.name}=${_data.value} deployment/${_data.serverName}`
  },
  exeAPI:function(d,_fun){
    console.log(d)
    let s=d.api.split(" ")
    for(let i=0;i<d.times;i++){
      _exe(d.api,_fun)
    }
    // _monitor(s.shift(),s,function(v){
    //   _fun(v)
    // })
  },
  exeCmd:function(d,_fun){
    // console.log(d)
    if(d.fileName){
      fs.writeFileSync("download/"+d.fileName,d.fileContent||"");
    }

    let cs=d.cmd.split("\n")
    cs=cs.filter(x=>x).map(x=>{
      if(d.name){
        return _buildRemoteK8sCmd({
          ns:d.ns,
          name:d.name,
          cmd:x
        })
      }else{
        return x
      }
    })
    _exeCmd(cs)

    function _exeCmd(cs,_split){
      let c=cs.shift()
      if(c){
        // console.log(c)
        if(c.includes("|")||c.includes(">")){
          _exe(c,function(v){
            console.log(v)

            if(_split||d.split){
              let s=d.split||""
              if(s){
                s+=". "
              }
              _split="\n=== "+s+new Date()+" "+"=".repeat("30")+"\n\n"
            }
            v=(_split||"")+c+"\n"+v

            _fun(v)
            _exeCmd(cs,_split)

          })
          return
        }
        let s=c.split(" "),_start;
        // let ss=s.shift().trim().split(" "),
        //     _cmd=ss.shift();
        // if(s.length){
        //   ss.push("--")
        //   ss.push(...s.map(x=>"'"+x.trim()+"'"))
        // }
        _monitor(s.shift(),s,function(v){
          if(v.startsWith("COMPLETE:")){
            _start=0
            _exeCmd(cs,1)
          }else{
            if(!_start){
              if(_split||d.split){
                let s=d.split||""
                if(s){
                  s+=". "
                }
                _split="\n=== "+s+new Date()+" "+"=".repeat("30")+"\n\n"
              }
              v=(_split||"")+c+"\n"+v
              _start=1
            }
            _fun(v)
          }
        })
      }else{
        _fun("BZ-COMPLETE")
      }
    }
  }
}
function _getK8sCmdHeader(_data){
  // console.log(_data)
  return `kubectl -n ${_data.ns}`
}
function _buildRemoteK8sCmd(_data,_fun){
  return `${_getK8sCmdHeader(_data)} exec -i ${_data.name} -- ${_data.cmd}`
}
function _exe(s,_fun){
  // console.log(s)
  exec(s, (_error, b, _stderr) => {
    if(_error||_stderr){
      _error=_error||_stderr
      console.error(_error)
      return _fun(_error)
    }
    // console.log(b)
    _fun(b)
  });
}

function _monitor(_cmd,_args,_fun){
  // console.log(Date.now())
  // console.log("_cmd: "+_cmd)
  // console.log("_args: "+_args)
  // console.log(_cmd)
  // console.log(_args)
  // console.log(_args.length)
  try{
    let ls = spawn(_cmd, _args);

    ls.stdout.on('data', function (data) {
      _fun(data.toString());
    });
    
    ls.stderr.on('data', function (data) {
      _fun(data.toString());
    });
    
    ls.on('exit', function (code) {
      _fun("COMPLETE: " + code);
    });
  }catch(ex){
    _fun(ex.message)
  }
}

exports.k8s=k8s