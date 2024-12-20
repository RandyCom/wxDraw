/*
 * @Author: Thunderball.Wu 
 * @Date: 2017-09-28 13:43:40 
 * @Last Modified by: Thunderball.Wu
 * @Last Modified time: 2017-10-08 18:49:36
  时间函数 基于
  http://easings.net/zh-cn
 */

export const EasingFunctions = {
  // 线性函数
  linear: function (pos) {
    return pos;
  },
  easeInQuad: function (pos) {
    return Math.pow(pos, 2);
  },

  easeOutQuad: function (pos) {
    return -(Math.pow(pos - 1, 2) - 1);
  },

  easeInOutQuad: function (pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 2);
    return -0.5 * ((pos -= 2) * pos - 2);
  },

  easeInCubic: function (pos) {
    return Math.pow(pos, 3);
  },

  easeOutCubic: function (pos) {
    return Math.pow(pos - 1, 3) + 1;
  },

  easeInOutCubic: function (pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 3);
    return 0.5 * (Math.pow(pos - 2, 3) + 2);
  },

  easeInQuart: function (pos) {
    return Math.pow(pos, 4);
  },

  easeOutQuart: function (pos) {
    return -(Math.pow(pos - 1, 4) - 1);
  },

  easeInOutQuart: function (pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 4);
    return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
  },

  easeInQuint: function (pos) {
    return Math.pow(pos, 5);
  },

  easeOutQuint: function (pos) {
    return Math.pow(pos - 1, 5) + 1;
  },

  easeInOutQuint: function (pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 5);
    return 0.5 * (Math.pow(pos - 2, 5) + 2);
  },

  easeInSine: function (pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1;
  },

  easeOutSine: function (pos) {
    return Math.sin(pos * (Math.PI / 2));
  },

  easeInOutSine: function (pos) {
    return -0.5 * (Math.cos(Math.PI * pos) - 1);
  },

  easeInExpo: function (pos) {
    return pos === 0 ? 0 : Math.pow(2, 10 * (pos - 1));
  },

  easeOutExpo: function (pos) {
    return pos === 1 ? 1 : -Math.pow(2, -10 * pos) + 1;
  },

  easeInOutExpo: function (pos) {
    if (pos === 0) return 0;
    if (pos === 1) return 1;
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (pos - 1));
    return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
  },

  easeInCirc: function (pos) {
    return -(Math.sqrt(1 - pos * pos) - 1);
  },

  easeOutCirc: function (pos) {
    return Math.sqrt(1 - Math.pow(pos - 1, 2));
  },

  easeInOutCirc: function (pos) {
    if ((pos /= 0.5) < 1) return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
    return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
  },

  easeOutBounce: function (pos) {
    if (pos < 1 / 2.75) {
      return 7.5625 * pos * pos;
    } else if (pos < 2 / 2.75) {
      return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
    } else if (pos < 2.5 / 2.75) {
      return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
    } else {
      return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
    }
  },

  easeInBack: function (pos) {
    let s = 1.70158;
    return pos * pos * ((s + 1) * pos - s);
  },

  easeOutBack: function (pos) {
    let s = 1.70158;
    return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
  },

  easeInOutBack: function (pos) {
    let s = 1.70158;
    if ((pos /= 0.5) < 1)
      return 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s));
    return 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
  },

  elastic: function (pos) {
    return (
      -1 *
        Math.pow(4, -8 * pos) *
        Math.sin(((pos * 6 - 1) * (2 * Math.PI)) / 2) +
      1
    );
  },

  swingFromTo: function (pos) {
    let s = 1.70158;
    return (pos /= 0.5) < 1
      ? 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s))
      : 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
  },

  swingFrom: function (pos) {
    let s = 1.70158;
    return pos * pos * ((s + 1) * pos - s);
  },

  swingTo: function (pos) {
    let s = 1.70158;
    return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
  },

  bounce: function (pos) {
    if (pos < 1 / 2.75) {
      return 7.5625 * pos * pos;
    } else if (pos < 2 / 2.75) {
      return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
    } else if (pos < 2.5 / 2.75) {
      return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
    } else {
      return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
    }
  },

  bouncePast: function (pos) {
    if (pos < 1 / 2.75) {
      return 7.5625 * pos * pos;
    } else if (pos < 2 / 2.75) {
      return 2 - (7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75);
    } else if (pos < 2.5 / 2.75) {
      return 2 - (7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375);
    } else {
      return 2 - (7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375);
    }
  },

  easeFromTo: function (pos) {
    if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 4);
    return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
  },

  easeFrom: function (pos) {
    return Math.pow(pos, 4);
  },

  easeTo: function (pos) {
    return Math.pow(pos, 0.25);
  },
};
