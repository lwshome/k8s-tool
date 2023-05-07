const _k8sProxy={
  _socket:null,
  _msgQueue:[],
  _sentMap:{},
  _init:function(){
    _k8sProxy._socket=io("",{
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 500
    })
    _k8sProxy._socket.on("connect",()=>{
      console.log("connect")
      _k8sProxy._connected=1
      _k8sProxy._lanuch();
    })
    _k8sProxy._socket.on("disconnect",()=>{
      console.log("disconnect")
      _k8sProxy._connected=0
    })
    _k8sProxy._socket.on("work",_msg=>{
      k8s._data._loading=0
      if(_msg.k){
        let f=_k8sProxy._sentMap[_msg.k]
        if(f&&f._success){
          let d=_msg.data
          if(d&&d.cmd&&!d.link){
            if(f._error){
              f._error(d)
            }else{
              alert(JSON.stringify(d,0,2))
            }
            return 
          }
          f._success&&f._success(d)
        }
      }
    })
  },
  _send:function(_msg){
    _k8sProxy._msgQueue.push(_msg);
    if(_msg._data.data){
      _msg._data.data.ns=k8s._data._config.ns
    }
    _k8sProxy._lanuch();
  },
  _lanuch:function(){
    clearTimeout(_k8sProxy._lanuchTime)
    if(_k8sProxy._msgQueue.length){
      if(_k8sProxy._connected){
        let _msg=_k8sProxy._msgQueue.shift();
        if(_msg._success){
          k8s._data._loading=!_msg._noloading
          _msg._data.k=k8s._getKey()
          _k8sProxy._sentMap[_msg._data.k]=_msg;
        }
        _msg=_msg._data||_msg
        _k8sProxy._socket.emit("work",_msg);
        return _k8sProxy._lanuch()
      }else{
        _k8sProxy._lanuchTime=setTimeout(()=>{
          _k8sProxy._lanuch()
        },100)
      }
    }
  }
}
_k8sProxy._init()