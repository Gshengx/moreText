import Canvas from '@/components/Canvas';
import Sign from '@/components/sign';
import Landmine from '@/components/landMine';
import Index from '@/components/index';
import TxtReader from '@/components/TxtReader';
import Chart from '@/components/chars/line';


const router = [
  {
    path: '/',
    name: 'index',
    component: Index,
  },
  {
    path: '/canvas',
    name: 'Canvas签名',
    component: Canvas,
  },
  {
    path: '/sign',
    name: '手写签名',
    component: Sign,
  },
  {
    path: '/landmine',
    name: '扫雷小游戏',
    component: Landmine,
  },
  {
    path: '/txtReader',
    name: 'txt文本阅读器',
    component: TxtReader,
  },
  {
    path: '/chart',
    name: '图表',
    component: Chart,
  },
];

export default router;
