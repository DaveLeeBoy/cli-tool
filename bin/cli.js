#!/usr/bin/env node

const program = require('commander')  // 命令行
const inquirer = require('inquirer');  // 问答
const pkg = require('../package')
const chalk = require('chalk') //  给终端的字体加上颜色
const download = require('download-git-repo');
const ora = require('ora');  // 添加加载动画
const spinner = ora('Loading undead unicorns');

const path = require('path');
const fs = require('fs');

// 加载模版
const templates = require('../temp/index');

// 拷贝文件
const { copyDir } = require('../utils')

// 命令行选择列表
let prompList = [
  {
      type:'list',
      name: 'template',
      message: '请选择你想要生成的项目模板？',
      choices: templates,
      default: templates[0]
  }
]
/**
* version
*/
program
  .version(chalk.green(`${pkg.version}`))

function resolvePath(pathName){
  return path.resolve(path.join(__dirname, pathName))
}

// 选择以自定义模板还是git的模板
function checkTem(template,filename){
  let customTem = [ 'mobile-template', 'vue-admin-template']
  if(customTem.indexOf(template)>=0){
    let sourceDir = resolvePath(`../temp/${template}`)
    let targetDir = path.resolve(`${process.cwd()}/${filename}`)
    copyDir(sourceDir, targetDir).then(()=>{
      spinner.succeed(chalk.green(`创建成功`));
    })
  }else {
    let downloadList = {
        "vue-element-admin": {
          src: "https://github.com:PanJiaChen/vue-element-admin#master"
        },
        "ts-vue": {
          src: "https://github.com:easy-wheel/ts-vue#master",
        }
    }
    downloadGitTemplate(filename,downloadList[template].src)
  }
}

// 创建项目前校验是否已存在
function checkName(projectName) {
  return new Promise((resolve, reject) => {
    fs.readdir(process.cwd(), (err, data) => {
      if (err) {
        spinner.fail(chalk.red('下载失败 \n' + err));
        return reject(err);
      }
      if (data.includes(projectName)) {
        spinner.fail(chalk.red('下载失败 \n' + `${projectName} already exists222!`));
        return reject(new Error(`${projectName} already exists!`));
      }
      resolve();
    });
  });
}
// 下载git 仓库
function downloadTemplate(gitUrl, projectName) {
  spinner.start('开始下载');
  return new Promise((resolve, reject) => {
    download(
        gitUrl,
        path.resolve(process.cwd(), projectName),
        { clone: true },
        function (err) {
          if (err) {
            spinner.stop()
            return reject(err);
          }
          spinner.stop()
          resolve();
        }
    );
  });
}

async function downloadGitTemplate(projectName, gitUrl) {
  try {
    await checkName(projectName);
    await downloadTemplate(gitUrl, projectName)
    console.log(chalk.green("download completed"));
    spinner.succeed(chalk.green(`下载成功`));
  } catch (error) {
    spinner.fail(chalk.red('下载失败 \n' + error));
    process.exit();
  }
}
/**
* init 项目
*/
// program
//   .command('init --git <app-name>')
//   .description('generate a project from a remote template (legacy API, requires ./wk-init)')
//   .option('-c, --clone', 'Use git clone when fetching remote template')
//   .action((appName, template, cmd) => {
//     spinner.start('开始下载');
//     console.log('appName', appName)
//     spinner.succeed(chalk.green(`下载成功`));
//     // download('direct:https://github.com/study-demo/cli-demo.git', appName, { clone: true }, err => {
//     //   if (err) {
//     //     spinner.fail(chalk.green('下载失败 \n' + err));
//     //     process.exit();
//     //   }
//     //   spinner.succeed(chalk.green(`下载成功`));
//     // });
//   })

program
.command('create <filename>')
.description('选择模板项目')
.action(async (filename) => {
  const res = await inquirer.prompt(prompList)  // 命令行选择的选择的选项
  spinner.succeed(chalk.green("选择了" + res.template));
  checkTem(res.template,filename)
})

program.parse(process.argv)