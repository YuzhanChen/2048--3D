# 2048-3d

This is a 3D version of the [2048 game](https://play2048.co).
I use the [Three.js](https://github.com/mrdoob/three.js) WebGL library to build my game, [dat.gui](https://github.com/dataarts/dat.gui) to add controller to my game and [vue-cli](https://cli.vuejs.org/) to help to manage my project.

## PLAY

this game has been deployed on [https://yuzhanchen.github.io/games/2048-3d](https://yuzhanchen.github.io/games/2048-3d)

### How to play

![](https://yuzhanchen.github.io/img/Snipaste_2020-02-24_19-45-53.png)
+ on PC : w, a, s, d to move cubes
+ on mobile devices : touch and slide to move cubes
+ you can find the control panel on right top.
  + easy mode will prevent random falling down of new cube
  + adjust camera distance when the game scene is outside your screen
  + unlock camera control will allow you to adjust camera with mouse or touch control
  + click restart to clear all cubes and restart

+ 桌面端 ：w, a, s, d 操作方块
+ 移动端：触摸滑动操作方块
+ 可以在右侧打开控制面板。
    + 打开简单模式将不下落方块。
    + 当您的屏幕不能容纳所有游戏画面时可以调整摄像头距离。
    + 解锁摄像头控制可以让您通过鼠标拖动或手指控制视角。
    + 点击重新开始以清空所有方块。

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
