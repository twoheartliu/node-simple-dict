#!/usr/bin/env node
import {translate} from './main';

const meow = require('meow');
const chalk = require('chalk');

const log = console.log.bind(console);

const cli = meow(`  
	Usage
	  $ cli [options] [command] more...

	Commands
	  add|a      add a task

	Examples
	  $ node cli 吃饭
`, {
  flags: {
    help: {
      alias: 'h'
    },
  }
});

const commands = cli.input;

if (commands[0]) {
  translate(commands[0]);
} else {
  console.log('请输入要查询的单词');
}