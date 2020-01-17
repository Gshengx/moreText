<template>
  <div class='line'><canvas id='chart' height='400' width='600'>你的浏览器不支持HTML5 canvas</canvas></div>
</template>

<script>
export default {
  name: 'lineCharts',
  props: {},
  data() {
    return {
      data: [['17/01', 50], ['17/02', 60], ['17/03', 100], ['17/04', 200], ['17/05', 350], ['17/06', 600]],
      // 图表所需变量
      canvas: {},
      ctx: {},
      // 图表属性
      originX: 0,
      originY: 0,
      cMargin: 60,
      cWidth: 0,
      cHeight: 0,
      cSpace: 80,
      // 折线图属性
      totalYNomber: 10,
      tobalDots: 0,
      dotSpace: 0,
      // 运动相关
      ctr: 1,
      numctr: 100,
      speed: 6, // 绘图速度

      // 折线图样式属性
      width: 370, // 宽
      height: 370, // 高
      point: false, // 圆点
      showText: false, // 折线文字
      gridColor: 'rgb(153,153,153)', // 网格颜色
      lineWidth: 2, // 线条粗细
      lineColor: 'rgb(91,119,190)', // 折线颜色
      axisColor: 'rgb(153,153,153)', // 坐标轴颜色
      axisTextColor: 'rgb(153,153,153)', // 坐标轴文字颜色
      lineTextColor: '#566a80', // 折线文字及点颜色
      animation: true, // 绘图动画
      gradient: [],
      //   gradient: [
      //     'rgba(133,171,212,1)',
      //     'rgba(133,171,212,0.5)',
      //     'rgba(133,171,212,0.1)'
      //   ], //填充色
      yAxis: {
        title: '访问量', // 标题
        showTitle: false, // 标题展示
        align: 'top', // 标题位置
        showText: true,
        grid: true, // 网格
        showLine: true, // 轴线展示
        maxValue: 0, // y轴最大值
        offset: 0, // 最大值偏移
        offsetText: -10, // 折线文字偏移
      },
      xAxis: {
        title: '月份', // 标题
        showTitle: false,
        align: 'center', // 标题位置
        showText: true,
        grid: true,
        showLine: true,
        offsetText: -15,
      },
    };
  },
  methods: {
    // 图表初始化
    initChart() {
      //   这里是对高清屏幕的处理，
      // 方法：先将canvas的width 和height设置成本来的两倍
      //     然后将style.height 和 style.width设置成本来的宽高
      //     这样相当于把两倍的东西缩放到原来的 1/2，这样在高清屏幕上 一个像素的位置就可以有两个像素的值
      //     这样需要注意的是所有的宽高间距，文字大小等都得设置成原来的两倍才可以。
      // w:370 h:275
      this.canvas.width = this.width * 2;
      this.canvas.height = this.height * 2;
      this.canvas.style.height = `${this.height}px`;
      this.canvas.style.width = `${this.width}px`;
      this.cHeight = this.canvas.height - this.cMargin - this.cSpace;
      this.cWidth = this.canvas.width - this.cMargin - this.cSpace;
      this.originX = this.cMargin + this.cSpace;
      this.originY = this.cMargin + this.cHeight;

      // 折线图信息
      this.tobalDots = this.data.length;
      this.dotSpace = Math.floor(this.cWidth / this.tobalDots);
      for (let i = 0; i < this.data.length; i++) {
        const dotVal = Math.floor(Number(this.data[i][1]));
        if (dotVal > this.yAxis.maxValue) {
          this.yAxis.maxValue = dotVal;
        }
      }
      this.yAxis.maxValue += this.yAxis.offset;

      this.ctx.translate(0.5, 0.5); // 当只绘制1像素的线的时候，坐标点需要偏移，这样才能画出1像素实线
    },
    // 绘制图表轴、标签和标记
    drawLineLabelMarkers() {
      this.ctx.font = '24px Arial';
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.fillStyle = this.axisTextColor;
      this.ctx.strokeStyle = this.axisColor;
      // y轴
      if (this.yAxis.showLine) {
        this.drawLine(this.originX, this.originY, this.originX, this.cMargin);
      }
      // x轴
      if (this.xAxis.showLine) {
        this.drawLine(this.originX, this.originY, this.originX + this.cWidth, this.originY);
      }

      // 绘制标记
      this.drawMarkers();
    },
    // 画线的方法
    drawLine(x, y, X, Y) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(X, Y);
      this.ctx.stroke();
      this.ctx.closePath();
    },
    // 绘制标记
    drawMarkers() {
      this.ctx.strokeStyle = this.gridColor;
      // 绘制 y 轴 及中间横线
      const oneVal = Math.floor(this.yAxis.maxValue / this.totalYNomber);
      this.ctx.textAlign = 'right';
      for (let i = 0; i <= this.totalYNomber; i++) {
        const markerVal = i * oneVal;
        const xMarker = this.originX - 5;
        const yMarker = 
          Math.floor(this.cHeight * (1 - (markerVal / this.yAxis.maxValue))) + this.cMargin;
        if (this.yAxis.showText) {
          this.ctx.fillText(markerVal, xMarker, yMarker + 3, this.cSpace); // y轴文字
        }
        if (i > 0 && this.yAxis.grid) {
          // 网格横
          this.drawLine(this.originX + 2, yMarker, this.originX + this.cWidth, yMarker);
        }
      }
      // 绘制 x 轴 及中间竖线
      this.ctx.textAlign = 'center';
      for (let i = 0; i < this.tobalDots; i++) {
        const markerVal = this.data[i][0];
        const xMarker = this.originX + (i * this.dotSpace);
        const yMarker = this.originY + 30;
        if (this.xAxis.showText) {
          this.ctx.fillText(markerVal, xMarker, yMarker, this.cSpace); // x轴文字
        }
        if (i > 0 && this.xAxis.grid) {
          // 网格竖
          this.drawLine(xMarker, this.originY - 2, xMarker, this.cMargin);
        }
      }
      // 绘制标题 y
      this.ctx.save();
      //   this.ctx.rotate(-Math.PI / 2);
      if (this.yAxis.showTitle) {
        this.ctx.fillText(this.yAxis.title, this.yAxis.align === 'center' ? -this.canvas.height / 2 : 50, this.cSpace - 10);
      }
      this.ctx.restore();
      // 绘制标题 x
      if (this.xAxis.showTitle) {
        this.ctx.fillText(
          this.xAxis.title,
          this.xAxis.align === 'center' ? this.originX + (this.cWidth / 2) : (this.originX + this.cWidth) - 50,
          this.originY + (this.cSpace / 2) + 20,
        );
      }
    },
    // 绘制折线图
    drawLineAnimate() {
      this.ctx.strokeStyle = this.lineColor;

      // 连线
      this.ctx.beginPath();
      for (let i = 0; i < this.tobalDots; i++) {
        const dotVal = Number(this.data[i][1]);
        const barH = 
          Math.floor((((this.cHeight * dotVal) / this.yAxis.maxValue) * this.ctr) / this.numctr);
        const y = this.originY - barH;
        const x = this.originX + (this.dotSpace * i);
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.stroke();

      // 填充背景
      this.ctx.lineTo(this.originX + (this.dotSpace * (this.tobalDots - 1)), this.originY);
      this.ctx.lineTo(this.originX, this.originY);
      // 背景渐变色
      // 填充渐变色
      const gradient = this.ctx.createLinearGradient(0, 0, 0, 300);
      if (this.gradient.length > 0) {
        if (this.gradient.length > 1) {
          const count = parseFloat((1 / (this.gradient.length - 1)).toFixed(1));
          for (let i = 0; i < this.gradient.length; i++) {
            gradient.addColorStop(i === this.gradient.length - 1 ? 1 : count * i, this.gradient[i]);
          }
        } else {
          gradient.addColorStop(0, this.gradient[0]);
        }
      }

      this.ctx.fillStyle = gradient;
      // 文字及点颜色
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.fillStyle = this.lineTextColor;

      // 绘制点以及点的值
      for (let i = 0; i < this.tobalDots; i++) {
        const dotVal = Number(this.data[i][1]);
        const barH = 
          Math.floor((((this.cHeight * dotVal) / this.yAxis.maxValue) * this.ctr) / this.numctr);
        const y = this.originY - barH;
        const x = this.originX + (this.dotSpace * i);
        if (this.point) {
          this.drawArc(x, y, null, null); // 绘制点
        }
        if (this.showText) {
          this.ctx.fillText(
            Math.floor((dotVal * this.ctr) / this.numctr),
            x + this.xAxis.offsetText,
            y + this.yAxis.offsetText,
          ); // 文字
        }
      }
      // 动画
      if (this.ctr < this.numctr) {
        this.ctr++;
        const that = this;
        if (this.animation) {
          setTimeout(() => {
            that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
            that.drawLineLabelMarkers();
            that.drawLineAnimate();
          }, this.speed);
        } else {
          that.ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
          that.drawLineLabelMarkers();
          that.drawLineAnimate();
        }
      }
    },
    // 绘制圆点
    drawArc(x, y) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.closePath();
    },
    drawCharts() {
      this.initChart(); // 图表初始化
      this.drawLineLabelMarkers(); // 绘制图表轴、标签和标记
      this.drawLineAnimate(); // 绘制折线图的动画
    },
  },
  mounted() {
    // 获得canvas上下文
    this.canvas = document.getElementById('chart');
    if (this.canvas && this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
    }
    this.drawCharts();
    // const that = this;
    // 点击刷新图表
    // this.canvas.onclick = function() {
    //   console.log(1111111111);
    //   this.drawCharts();
    // };
  },
};
</script>

<style>
.line {
}
</style>
