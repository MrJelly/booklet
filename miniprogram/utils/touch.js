var startX
var startY
class touch {

  constructor() {
  }

  _touchstart(e, touchIndexData) {
    let l = touchIndexData.length
    for (let i = 0; i<l; i++)
    {
      if (touchIndexData[i])
      {
        touchIndexData[i]=!1
      }
    }

    startX = e.changedTouches[0].clientX
    startY = e.changedTouches[0].clientY

    return touchIndexData
  }

  _touchmove(e, touchIndexData) {
    var index = e.currentTarget.dataset.index, //当前索引
      
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      
      //获取滑动角度
      angle = this._angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });
    if (Math.abs(angle) > 30) return;
    let l = touchIndexData.length
    for (let i = 0;i<l;i++) {
      
      let val = touchIndexData[i]
      if (i == index) {
        if (touchMoveX > startX) //右滑
          touchIndexData[i] = !1
        else //左滑
          touchIndexData[i] = !0
      }
    }
    return touchIndexData
  }

  _angle(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  }
}

export default touch
