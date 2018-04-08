
## Getting Started
123
### 下载或更新依赖:  <br/>
命令行进入项目根目录，运行下列命令：
```bash
$ cnpm install
```
下载**package.json** 文件声明的依赖

### Usage
#### 启动项目:
```bash
$ npm run dev
```
在 **http://127.0.0.1:8082/** 启动项目，并且监控文件变化

#### 部署项目
```bash
$ npm run build
```

## F&Q  <br/>
1、若长时间安装依赖不成功，选装cnpm，使用cnpm安装依赖
```bash
$ npm install cnpm -g --registry=https://registry.npm.taobao.org
$ cnpm install 
```
2、若提示cross-env未安装，请全局安装cross-env
```bash
$ npm install cross-env -g