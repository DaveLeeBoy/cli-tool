const ora = require('ora'); 
const spinner = ora('Loading undead unicorns');
const chalk = require('chalk')
const fs = require( "fs" );

async function copyDir(from, to) {
  try {
    fs.mkdirSync(to);
  } catch (error) {
    spinner.fail(chalk.red('创建失败 \n' + error));
    process.exit();
  }
  await fs.readdir(from, (err, paths) => {
    console.log('eeee', err)
    paths.forEach((path)=>{
      var src = `${from}/${path}`;
      var dist = `${to}/${path}`;
      fs.stat(src,(err, stat)=> {
        if(stat.isFile()) {
          fs.writeFileSync(dist, fs.readFileSync(src));
        } else if(stat.isDirectory()) {
          copyDir(src, dist);
        }
      });
    });
  });
}
module.exports = {
  copyDir
}
