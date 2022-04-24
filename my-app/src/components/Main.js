import { useEffect,useState } from "react"
import { useSelector } from "react-redux"
function Main({width, height}) {
  const [mainWidth, setMainWidth] = useState(500)
  const [mainHeight, setMainHeight] = useState(500)
  const [ctx, setCtx] = useState({})
  const dicomSrc = useSelector((state)=>state.global.dicomSrc)
  const dicomInfo = useSelector((state)=>state.global.dicomInfo)
  const activeIndex = useSelector((state)=>state.global.activeIndex)
  const menuHeight = useSelector((state) => state.global.menuHeight)
  const sidebarWidth = useSelector((state) => state.global.sidebarWidth)
  const x_del = Math.round((width - mainWidth)/2) + sidebarWidth
  const y_del = Math.round((height - mainHeight) / 2) + menuHeight
  const [cvs, setCvs] = useState({})
  const [begin, setBegin] = useState([])
  // const [end, setEnd] = useState([])
  useEffect(()=>{
      let canvas = document.querySelector("#canvas");
      let tctx = canvas.getContext("2d")
      tctx.fillStyle = "#e2e8f0";
      tctx.fillRect(0, 0, canvas.width, canvas.height);
      setCtx(tctx)
      setCvs(canvas)
  },[mainHeight,mainWidth])
  
  useEffect(() => {
    if(dicomSrc){
      let img = new Image();
      img.src = dicomSrc;
      img.onload = () => {
        ctx.drawImage(img, Math.round((mainWidth - dicomInfo.width)/2), Math.round((mainHeight - dicomInfo.height)/2), dicomInfo.width, dicomInfo.height);
        // console.log(img)
      }
    }
  }, [mainHeight,mainWidth,ctx, dicomInfo,dicomSrc])
  
  useEffect(()=>{
    if(activeIndex === 0 && dicomSrc.length !== 0){
      cvs.oncontextmenu = (e) => {e.preventDefault()}
      cvs.onmousedown = (e) => {
        e.preventDefault()
        if(e.which === 1){
          setBegin([e.clientX, e.clientY])
        }else if(e.which === 3){
          let img = new Image();
          img.src = dicomSrc;
          img.onload = () => {
            ctx.drawImage(img, Math.round((mainWidth - dicomInfo.width)/2), Math.round((mainHeight - dicomInfo.height)/2), dicomInfo.width, dicomInfo.height);
            // console.log(img)
          }
        }
      }
    
      cvs.onmouseup = (e) => {
        e.preventDefault()
        if (begin[0] !== e.clientX || begin[1] !== e.clientY){
          let x = begin[0] < e.clientX  ? begin[0]: e.clientX ;
          let y = begin[1] < e.clientY ? begin[1]: e.clientY;
          // setEnd([e.clientX, e.clientY])
          if(e.which === 1){
            ctx.strokeStyle = 'red';
            ctx.strokeRect(x - x_del, y - y_del, Math.abs(begin[0] - e.clientX), Math.abs(begin[1] - e.clientY))
            console.log(dicomInfo.PhysicalDelta[0] * (Math.abs(begin[0] - e.clientX)),
            dicomInfo.PhysicalDelta[1]*(Math.abs(begin[1] - e.clientY)))
          }
        }
      
      }
    }
  },[activeIndex,ctx,cvs,begin,x_del,y_del,dicomInfo.PhysicalDelta,dicomInfo.height,dicomInfo.width,dicomSrc,
    mainHeight,mainWidth])
  
  const zoomCanvas = (e) => {
  
    if(e.deltaY < 0 && mainHeight + 30 < height && mainWidth + 30 < width){
        setMainHeight(mainHeight + 30);
        setMainWidth(mainWidth + 30);
    }else if(e.deltaY > 0 && mainHeight - 30 > 100 && mainWidth - 30 > 100){
        setMainHeight(mainHeight - 30);
        setMainWidth(mainWidth - 30);
    }
    
  }

  return (
    <div id="Main" className="bg-slate-400 dark:bg-slate-700 flex justify-center items-center" style={{width,height}}> 
        <canvas id="canvas" width={mainWidth} height={mainHeight} onWheel={(e)=>zoomCanvas(e)}></canvas>
    </div>
  )
}

export default Main