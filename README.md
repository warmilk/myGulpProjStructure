# myGulp
a gulp project structure for my self

## 目录结构

#### /src   (项目生产环境下的源代码)

包含 /css, /js, /static, /lib, index.html 。其中/static目录内放的是静态资源（图片音频视频等），/lib目录放的是用到的css库或者js库

#### /test   (项目生产环境下的测试代码)
你这样理解吧，src目录是乱糟糟的厨房重地，test目录则是用来暂存放厨房重地生产出来的成品，跟正式表演前要排练差不多的意思。dest目录放的是经过无数次测试之后可以放心发布到线上的最终代码（并且已优化）
  
#### /dest   (项目最终上线代码)

目录结构同/src

#### package.json  （npm的配置文件，也就是项目的依赖+生产依赖清单）

#### gulpfile.js   （gulp的配置文件，一个用管道思想构建很多个task解放双手的玩意儿，跟项目的目录结构很大关系）

## 如何使用
git clone到你的电脑，cd进入项目目录，之后npm i安装开发清单（package.json）上列出的所需工具和原料后，键入gulp即可
