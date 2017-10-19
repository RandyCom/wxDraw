/*
 * @Author: Thunderball.Wu 
 * @Date: 2017-10-19 16:52:13 
 * @Last Modified by: Thunderball.Wu
 * @Last Modified time: 2017-10-19 18:03:36
 * 常用的一些属性
 * 
 */

 export const  commonAttr = {
     //这些样式是可以被动画来设置的
      lineWidth:12,//线宽
      Shadow:{
          offsetX:5,
          offsetY:5,
          blur:5,
          color:"#000000"
      }

 }



export const commonUnAttr = { //这些样式只能单独设定 
    lineCap:"",      // lineCap	String	'butt'、'round'、'square'	线条的结束端点样式
    lineJoin:"",   //lineJoin	String	'bevel'、'round'、'miter'	线条的结束交点样式
    miterLimit:""   //最大斜接长度
} 


