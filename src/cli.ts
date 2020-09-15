#!/usr/bin/env node
import {translate} from './main';

const meow = require('meow');
const chalk = require('chalk');

const log = console.log.bind(console);

const cli = meow(`  
	Usage
	  $ fy params

	Examples
	  $ fy 玩
	  $ fy play
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
  log(chalk.red('请输入要查询的单词'));
}