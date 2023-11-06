'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const { Command } = require('commander');
const prettyjson = require('prettyjson');
const jsonOptions = {};

const program = new Command();
program.version(require('./package.json').version);
program
  .option('-a, --add', 'add new food')
  .option('-g, --get', 'get food list')
  .option('-s, --search', 'search food in list')
  .option('-e, --edit', 'edit food from List')
  .option('-d, --delete', 'delete food from List');

program.parse(process.argv);

let rawdata;
try {
  rawdata = fs.readFileSync('food.json');
} catch (error) {
  console.error(
    '\x1b[31mMake sure the food list exists and follows standard json format'
  );
  process.exit(1);
}
const foodList = JSON.parse(rawdata);

if (program.add) {
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: "What's the name of the food",
    },
    {
      type: 'input',
      name: 'size',
      message: 'What size does it has per people',
    },
    {
      type: 'confirm',
      name: 'deliverable',
      message: 'Is it deliverable',
    },
    {
      type: 'number',
      name: 'effort',
      message: "What's the effort to cook",
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    let found = false;
    for (let index = 0; index < foodList.food.length; index++) {
      if (foodList.food[index].name === answers.name) {
        console.log('Food already exists');
        found = true;
      }
    }
    if (!found) {
      foodList.food.push(answers);
      fs.writeFileSync('food.json', JSON.stringify(foodList));
      console.log(prettyjson.render(answers, jsonOptions));
    }
  });
}

if (program.edit) {
  const question = [
    {
      type: 'input',
      name: 'name',
      message: "What's the name of the food you want to change",
    },
  ];

  inquirer.prompt(question).then((answer) => {
    let found = false;
    for (let index = 0; index < foodList.food.length; index++) {
      if (foodList.food[index].name === answer.name) {
        const questions = [
          {
            type: 'input',
            name: 'name',
            message: "What's the new name of the food",
            default: foodList.food[index].name,
          },
          {
            type: 'input',
            name: 'size',
            message: 'What new size does it has per people',
            default: foodList.food[index].size,
          },
          {
            type: 'confirm',
            name: 'deliverable',
            message: 'Is the new food deliverable',
            default: foodList.food[index].deliverable,
          },
          {
            type: 'number',
            name: 'effort',
            message: "What's the new effort to cook",
            default: foodList.food[index].effort,
          },
        ];

        inquirer.prompt(questions).then((answers) => {
          foodList.food[index] = answers;
          fs.writeFileSync('food.json', JSON.stringify(foodList));
          console.log(prettyjson.render(answers, jsonOptions));
        });
        found = true;
      }
    }
    if (!found) {
      console.log('Food not found');
    }
  });
}

if (program.search) {
  const question = [
    {
      type: 'input',
      name: 'name',
      message: "What's the name of the food",
    },
  ];

  inquirer.prompt(question).then((answer) => {
    let found = false;
    for (let index = 0; index < foodList.food.length; index++) {
      if (foodList.food[index].name === answer.name) {
        console.log(prettyjson.render(foodList.food[index], jsonOptions));
        found = true;
      }
    }
    if (!found) {
      console.log('Food not found');
    }
  });
}

if (program.delete) {
  const question = [
    {
      type: 'input',
      name: 'name',
      message: "What's the name of the food",
    },
  ];

  inquirer.prompt(question).then((answer) => {
    let found = false;
    for (let index = 0; index < foodList.food.length; index++) {
      if (foodList.food[index].name === answer.name) {
        foodList.food.splice(index, 1);
        fs.writeFileSync('food.json', JSON.stringify(foodList));
        foodList.food.map((item) => {
          console.log(prettyjson.render(item, jsonOptions) + '\n');
        });
        found = true;
      }
    }
    if (!found) {
      console.log('Food not found');
    }
  });
}

if (program.get) {
  foodList.food.map((item) => {
    console.log(prettyjson.render(item, jsonOptions) + '\n');
  });
}

if (process.argv.length <= 2) {
  program.help();
}
