/*
 * @Author: Thunderball.Wu
 * @Date: 2017-10-22 11:02:22
 * @Last Modified by: Thunderball.Wu
 * @Last Modified time: 2017-11-29 10:11:35
 * 椭圆
 *
 */

import { util, matrixToarray } from "../util/utils.js";
import { Matrix } from "../util/matrix.js";
import { Point } from "./mixins/points.js";
import { commonAttr, commonUnAttr } from "./mixins/commonAttr.js"; //共有属性
import { CommonMethods } from "./mixins/commonMethods.js"; //共有方法

// function Point(x, y) {
//     this.x = x;
//     this.y = y;
// }

// function Point(x, y) {
//     this.x = x;
//     this.y = y;
// }
export class Ellipse extends CommonMethods {
  constructor(option) {
    super();
    let eOption = {
      x: 10,
      y: 10,
      a: 10, //长轴
      b: 10, //短轴
      ...commonAttr(),
    };

    let _temOption = util.extend(option, eOption);
    let _temUnOption = util.extend(option, commonUnAttr());
    // console.log(_temOption);
    this.Option = _temOption;
    this.UnOption = _temUnOption; //不参与动画的属性

    this.max = {
      maxX: null,
      maxY: null,
      minX: null,
      minY: null,
    };
    this.oriPoints = null; //拿到最初的点位
    this._Points = []; //用于检测位置的 点位数组 也是当前位置

    this._isChoosed = false;
    this.rotateOrigin = null;
    this._drawLine = false; //用于标识是否画外框
    this.detectOriPoints = [];
    this._detectPoints = [];
    this.getOriPoints(); //拿到原始点
    this.getMax(); //根据原始点
    this._dirty = true;
    this._type = "ellipse";
    this._canRotateOrigin = true;
  }
  getOriPoints() {
    let points = [],
      points2 = [],
      angle = this.Option.startAngle || 0;

    for (let i = 0; i < 100; ++i) {
      points.push([
        this.Option.x + (this.Option.a / 2) * Math.sin(angle),
        this.Option.y - (this.Option.b / 2) * Math.cos(angle),
      ]);
      points2.push([
        this.Option.x +
          (this.Option.a / 2 + this.Option.lineWidth / 2) * Math.sin(angle),
        this.Option.y -
          ((this.Option.b + this.Option.lineWidth) / 2) * Math.cos(angle),
      ]);
      angle += (2 * Math.PI) / 100;
    }
    this.oriPoints = points;
    this.detectOriPoints = points2;
  }
  getPoints() {
    //getPoints修改 现在不用 tranlate+rotate形式
    let _points = [];
    let _points2 = [];
    let origin = null;
    if (!this.rotateOrigin) {
      origin = [this.Option.x, this.Option.y];
    } else {
      origin = this.rotateOrigin;
    }

    // //console.log('item', origin);

    this.oriPoints.forEach(function (item) {
      _points.push(this.getPointTodraw(item[0], item[1], origin));
    }, this);

    this.detectOriPoints.forEach(function (item) {
      _points2.push(this.getPointTodraw(item[0], item[1], origin));
    }, this);

    this._Points = matrixToarray(_points); //除掉矩阵多余的部分
    this._detectPoints = matrixToarray(_points2);
    // //console.log(this._Points);
    // //console.log(this.oriPoints);
    return this._Points; //除掉矩阵多余的部分;
  }
  getMax() {
    //绘制 与检测 不能在统一个地方
    let _Points = this._detectPoints;

    this.max = {
      maxX: null,
      maxY: null,
      minX: null,
      minY: null,
    };

    _Points.forEach(function (element) {
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
    let points = this._Points;

    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < 100; ++i) {
      context.lineTo(points[i][0], points[i][1]);
    }
    context.closePath();
  }
  _draw(context) {
    let changeMatrix = null;
    let getchaMatrix = null;
    let origin = null;
    if (this._dirty) {
      this.getOriPoints(); //拿到所有原始点
      this.getPoints(); //拿到所有真实点
      // //console.log('_POINTS',this._Points);
      this.getMax(); //所有真实点max min
    }
    this.createPath(context); //绘制
    this._dirty = false;
  }
  getPointTodraw(x, y, origin) {
    let angle = this.Option.rotate;

    //将所有变化 都转到 Point对象去了
    return new Point(x, y).rotate(origin, angle); //计算出每一个点变化之后的位置
  }
  move(x, y) {
    this.Option.x = x;
    this.Option.y = y;
    this._dirty = true;
    // //console.log('-------move--------', this.Option);
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
      // //console.log('点中');
      // this.points = this._Points;

      this._offsetX = this.Option.x - x;
      this._offsetY = this.Option.y - y;
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
      // this.getOriPoints();//拿到原始点
      // this.getPoints();//拿到变化点
      // this.getMax();//拿到边界点
    }
  }
  _pnpolyTest(x, y) {
    // 核心测试代码 理论源于  https://wrf.ecse.rpi.edu//Research/Short_Notes/pnpoly.html
    // let A = this.points[0];// 拿到前面两个点
    // let B = this.points[1];
    let ifInside = false;

    let Points = null;
    if (this._drawLine) {
      Points = this._detectPoints;
    } else {
      Points = this._Points;
    }

    for (let i = 0, j = Points.length - 1; i < Points.length; j = i++) {
      /**
             * 0 4
               1 0
               2 1
               3 2
               4 3
             */
      let Xi = Points[i][0],
        Yi = Points[i][1];
      let Xj = Points[j][0],
        Yj = Points[j][1];

      let insect =
        Yi > y != Yj > y && x < ((Xj - Xi) * (y - Yi)) / (Yj - Yi) + Xi;

      if (insect) ifInside = !ifInside;
    }

    // //console.log(ifInside);
    return ifInside;
  }
}
