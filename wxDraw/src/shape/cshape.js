/*
 * @Author: Thunderball.Wu
 * @Date: 2017-10-13 13:31:22
 * @Last Modified by: Thunderball.Wu
 * @Last Modified time: 2017-11-29 10:11:17
 * cshape 用户自定义的图形
 * 拿到形状点位后
 * 算出中心
 * 算出相对 距离
 * 然后 点位旋转 如果没有旋中心 那就围着中心点旋转
 * 如果被移动了 那就是中心点移动
 * 然后 计算出相对点ori
 * 然后计算出真实点
 *
 */

import { util, matrixToarray } from "../util/utils.js";
import { Point } from "./mixins/points.js";
import { commonAttr, commonUnAttr } from "./mixins/commonAttr.js"; //共有属性
import { CommonMethods } from "./mixins/commonMethods.js"; //共有方法
import { getCurvePoints } from "./mixins/getCurvePoints.js"; //计算smooth点

export class Cshape extends CommonMethods {
  constructor(option) {
    super();
    let cOption = {
      points: [
        [145, 30],
        [0, -211],
        [300, 400],
        [113, 50],
        [30, -31],
        [3, 40],
        [123, 90],
        [20, -1],
        [30, 60],
        [131, 40],
        [90, -12],
        [0, 400],
        [13, 6],
        [70, -17],
        [30, 42],
      ],
      ...commonAttr(),
    };

    let cUoption = {
      smooth: true,
      ...commonUnAttr(),
    };
    let _temOption = util.extend(option, cOption);
    let _temUnOption = util.extend(option, cUoption);

    this.Option = _temOption;
    this.UnOption = _temUnOption; //不参与动画的属性

    this.max = {
      maxX: null,
      maxY: null,
      minX: null,
      minY: null,
    };

    this.massCenter = this.genMassCenter(this.Option.points); // 拿到点位 先计算重心
    this.posPoints = this.genPointsPositiveLoc();
    // //console.log(this.massCenter);
    // //console.log(this.posPoints);
    this._CurvePoints = this.Option.points;

    this.oriPoints = this.Option.points;
    this._Points = this.Option.points; //用于绘制的点

    // this.getOriPoints();
    this.getMax();
    // //console.log(this.max);
    this._isChoosed = false;

    this.rotateOrigin = null;
    this._dirty = true;
    this._type = "cshape";
    this._canRotateOrigin = true;
  }
  genPointsPositiveLoc() {
    // 计算出所有 点与中心的相对位置 只用一次。。。 之后不再用 所以 cshaoe
    // 不能放大 缩小
    let _allPos = [];
    this.Option.points.forEach(function (item) {
      _allPos.push([this.massCenter.x - item[0], this.massCenter.y - item[1]]);
    }, this);
    return _allPos;
  }
  genMassCenter(points) {
    //计算质心
    let _allX = 0;
    let _allY = 0;
    Array.prototype.forEach.call(points, function (item) {
      _allX += item[0];
      _allY += item[1];
    });

    return {
      x: _allX / points.length,
      y: _allY / points.length,
    };
  }
  getOriPoints(x, y) {
    let _points = [];

    this.posPoints.forEach(function (item) {
      _points.push([this.massCenter.x - item[0], this.massCenter.y - item[1]]);
    }, this); //计算点位
    this.oriPoints = _points;
  }
  genPoints() {
    let _points = [];
    let origin = null;
    if (!this.rotateOrigin) {
      origin = [this.massCenter.x, this.massCenter.y];
    } else {
      origin = this.rotateOrigin;
    }

    // //console.log('item', origin);

    this.oriPoints.forEach(function (item) {
      _points.push(this.getPointTodraw(item[0], item[1], origin));
    }, this);

    // //console.log('points',_points);
    this._Points = matrixToarray(_points); //除掉矩阵多余的部分
    // //console.log(this._Points);
    // //console.log(this.oriPoints);
    if (this.UnOption.smooth) {
      this._CurvePoints = getCurvePoints(this._Points, 0.1, false, 20);
    }
    return this._Points; //除掉矩阵多余的部分;
  }
  getPointTodraw(x, y, origin) {
    let angle = this.Option.rotate;
    return new Point(x, y).rotate(origin, angle); //计算出每一个点变化之后的位置
  }
  getMax() {
    //绘制 与检测 不能在统一个地方
    let _Points = this._Points;

    this.max = {
      maxX: null,
      maxY: null,
      minX: null,
      minY: null,
    };

    _Points.forEach(function (element) {
      // //console.log('el',element[1]);
      if (element[0] > this.max.maxX) {
        this.max.maxX = element[0];
      }
      if (!this.max.minX && this.max.minX !== 0) {
        this.max.minX = element[0];
      }
      if (this.max.minX && element[0] < this.max.minX) {
        this.max.minX = element[0];
      }

      if (element[1] > this.max.maxY) {
        this.max.maxY = element[1];
      }
      if (!this.max.minY && this.max.minY !== 0) {
        this.max.minY = element[1];
      }
      if (this.max.minY && element[1] < this.max.minY) {
        this.max.minY = element[1];
      }
    }, this);
  }
  createPath(context) {
    //创建路径
    let points = [];

    if (this.UnOption.smooth) {
      points = this._CurvePoints;
    } else {
      points = this._Points;
    }
    if (points.length <= 0) {
      return false;
    }
    context.beginPath();
    // //console.log(points.length);
    context.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i][0], points[i][1]);
    }
    context.closePath();
  }
  _draw(context) {
    // //console.log(this.massCenter);
    //    //console.log(this.oriPoints);
    if (this._dirty) {
      this.getOriPoints();
      this.genPoints(); //拿到所有真实点
      // //console.log('_POINTS',this._Points);
      this.getMax(); //所有真实点max min
    }
    this.createPath(context); //绘制
    this._dirty = false;
  }
  move(x, y) {
    this.massCenter.x = x;
    this.massCenter.y = y;
    this._dirty = true;
    // //console.log('---------------', this.Option);
  }
  detected(x, y) {
    // pnpoly 算法区域

    // 首先找到 最大x 最小x 最大y 最小y
    // //console.log('多边形点击',x,y,this.max)
    if (
      x > this.max.minX &&
      x < this.max.maxX &&
      y > this.max.minY &&
      y < this.max.maxY
    ) {
      //在最小矩形里面才开始
      //console.log('点中');
      // this.points = this.genPoints(this.Option.x, this.Option.y);

      this._offsetX = this.massCenter.x - x;
      this._offsetY = this.massCenter.y - y;
      if (this._pnpolyTest(x, y)) {
        this._isChoosed = true;
        return true;
      } else {
        return false;
      }
    }

    return false;
  }
  moveDetect(x, y) {
    if (this._isChoosed == true) {
      this.move(x + this._offsetX, y + this._offsetY);
      // this.getOriPoints();
      // // //console.log(this.massCenter);
      // // //console.log(this.oriPoints);
      // this.genPoints();
      // this.getMax();
    }
  }
  _pnpolyTest(x, y) {
    // 核心测试代码 理论源于  https://wrf.ecse.rpi.edu//Research/Short_Notes/pnpoly.html
    // let A = this.points[0];// 拿到前面两个点
    // let B = this.points[1];
    let ifInside = false;

    for (
      let i = 0, j = this._Points.length - 1;
      i < this._Points.length;
      j = i++
    ) {
      /**
             * 0 4
               1 0
               2 1
               3 2
               4 3
             */
      let Xi = this._Points[i][0],
        Yi = this._Points[i][1];
      let Xj = this._Points[j][0],
        Yj = this._Points[j][1];

      let insect =
        Yi > y != Yj > y && x < ((Xj - Xi) * (y - Yi)) / (Yj - Yi) + Xi;

      if (insect) ifInside = !ifInside;
    }

    return ifInside;
  }
}
