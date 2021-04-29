#!/usr/bin/env node


const inquirer = require('inquirer');

inquirer.prompt([{
  type: 'input',
  name: 'name',
  message: 'Project name?'
}])
.then(anwsers => {
  console.log('anwsers', anwsers)
})