const { exec } = require("child_process");
const spawn = require('child_process').spawn
const fs = require("fs");
const _config=global._config;
const k8s={
  getConfig:function(_fun){
    _fun(_config)
  },
  getNamespaceList:function(_fun){
    _exe("kubectl get namespace",_fun)
  },
  killProcess:function(k,_fun){
    let s=`ps aux | grep "${k}"`
    _exe(s,function(v){
      if(v){
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
    k8s.killProcess(d.serverName,function(){
      let s=`${_getK8sCmdHeader(d)} port-forward ${d.serverName} ${d.port}`
      s=s.split(" ")
      _monitor(s.shift(),s,_fun)
    })
  },
  getLog:function(d,_fun){
    let s=`${_getK8sCmdHeader(d)} logs -f --tail=100 ${d.serverName}`
    s=s.split(" ")
    _monitor(s.shift(),s,_fun)
  },
  getList:function(d,_fun){
    let s=`${_getK8sCmdHeader(d)} get ${d.type}`
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
  }
}
function _getK8sCmdHeader(_data){
  console.log(_data)
  return `kubectl -n ${_data.ns}`
}
function _buildRemoteK8sCmd(_data,_fun){
  return `${_getK8sCmdHeader(_data)} exec -i ${_data.name} -- ${_data.cmd}`
}
function _exe(s,_fun){
  console.log(s)
  exec(s, (_error, b, _stderr) => {
    if(_error||_stderr){
      _error=_error||_stderr
      console.error(_error)
      return _fun(_error)
    }
    console.log(b)
    _fun(b)
  });
}

function _monitor(_cmd,_args,_fun){
  console.log("_cmd: "+_cmd)
  console.log("_args: "+_args)
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
}

exports.k8s=k8s