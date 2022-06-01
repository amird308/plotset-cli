#! /usr/bin/env node
const inquirer = require('inquirer')
const fse = require('fs-extra')
const mkdirp = require('mkdirp');
const Conf = require('conf')
const FormData = require('form-data')
const chalk = require('chalk')
const axios = require('axios').default
const { program } = require('commander')
const AdmZip = require('adm-zip')
const exec = require('child_process').execSync;
const CURR_DIR = process.cwd()

const LOGIN_QUESTIONS = [
  {
    name: 'email',
    type: 'input',
    message: 'email:'
  },
  {
    name: 'password',
    type: 'input',
    message: 'password:'
  }
]

const TAKE_PROJECT_ID = [
  {
    name: 'templateId',
    type: 'input',
    default: 'new',
    message: 'project id( new = new project):'
  }
]

const QUESTIONS = [
  {
    name: 'project-name',
    type: 'input',
    message: 'Project name:',
    validate: function (input) {
      if (/^([a-z\-\_\d])+$/.test(input)) return true
      else
        return 'Project name may only include lowercase letters, numbers, underscores and hashes.'
    }
  }
]

const config = new Conf()

const mainAxios = axios.create({
  baseURL: 'https://plotset.com/api'
})

mainAxios.interceptors.request.use(function (conf) {
  const token = config.get('user.token')
  conf.headers.Authorization = token?.length && `${token}`
  return {
    ...conf
  }
}, null)

mainAxios.interceptors.response.use(
  response => response,
  error => {
    if (!error.response?.status) {
      console.log(chalk.red('check you connection'))
      process.exit(2)
    }
    return Promise.reject(error)
  }
)

// TODO
program.command('projects').action(async () => {
  const check = await checkAuth()
  if (!check) await login()
  console.log(chalk.green('coming soon!!!'))
})

program.command('login').action(async () => {
  const userInfo = await login()
  console.log(chalk.green(`welcome ${userInfo.email}`))
})

program.command('new').action(async () => {
  const check = await checkAuth()
  if (!check) await login()
  const result = await newProject()
  if (result)
    console.log(
      chalk.green(
      ` The project was created in ${result.projectName}.`
      )
    )
})

program.command('profile').action(async () => {
  const check = await checkAuth()
  if (!check) await login()
  const user = config.get('user')
  console.log(chalk.green(`email: ${user.email}`))
  console.log(chalk.green(`firstname: ${user?.firstname || '-'}`))
  console.log(chalk.green(`lastname: ${user?.lastname || '-'}`))
})

program.command('publish').action(async () => {
  const check = await checkAuth()
  exec('npm run build')
  if (!check) await login()
  const distExists = await fse.pathExists(`${CURR_DIR}/dist`)
  if (!distExists) {
    console.log(chalk.red('dist does not exists run this code'))
    console.log(chalk.green('npm run build'))
    return
  }
  let templateId = null
  const plotsetJsonExists = await fse.pathExists(`${CURR_DIR}/plotset.json`)
  const plotsetJson = plotsetJsonExists
    ? await fse.readJSON(`${CURR_DIR}/plotset.json`)
    : {}
  const zip = new AdmZip()
  const outputFile = 'build.zip'
  const fileNames = [
    'index.html',
    'bindings.json',
    'data.csv',
    'info.json',
    'settings.json',
    'thumbnail.png'
  ]

  for await (const fileName of fileNames) {
    const exists = await fse.pathExists(`${CURR_DIR}/dist/${fileName}`)
    if (!exists) {
      console.log(chalk.red(`${CURR_DIR}/dist/${fileName} not exist`))
      process.exit(2)
    } else {
      zip.addLocalFile(`${CURR_DIR}/dist/${fileName}`)
    }
  }

  await zip.writeZipPromise(outputFile)

  if (!plotsetJson.templateId) {
    await inquirer.prompt(TAKE_PROJECT_ID).then(async answers => {
      templateId = answers.templateId
    })
  } else {
    templateId = plotsetJson.templateId
  }
  if (templateId === 'new') {
    // create project
    const buildFile = fse.createReadStream(`${CURR_DIR}/build.zip`)
    const form_data = new FormData()
    form_data.append('file', buildFile)
    mainAxios
      .post('/template/add', form_data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        fse.remove(`${CURR_DIR}/build.zip`)
        console.log(chalk.green('deploy was successful'))
      })
      .catch(err => {
        fse.remove(`${CURR_DIR}/build.zip`)
        errorLog(err)
      })
  } else {
    // update project
    const buildFile = fse.createReadStream(`${CURR_DIR}/build.zip`)

    const form_data = new FormData()
    form_data.append('file', buildFile)
    mainAxios
      .put(`/template/edit/${templateId}`, form_data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        fse.remove(`${CURR_DIR}/build.zip`)
        console.log(res)
        console.log(chalk.green('deploy was successful'))
        
      })
      .catch(err => {
        fse.remove(`${CURR_DIR}/build.zip`)
        errorLog(err)
      })
  }
})

async function login () {
  return new Promise(resolve => {
    inquirer.prompt(LOGIN_QUESTIONS).then(async answers => {
      mainAxios
        .post('/user/login', {
          email: answers.email,
          password: answers.password,
          remember: true
        })
        .then(function (response) {
          const userInfo = response.data.user
          config.set('user', {
            ...userInfo
          })
          resolve(userInfo)
        })
        .catch(err => {
          errorLog(err)
          resolve(false)
        })
    })
  })
}

async function checkAuth () {
  return new Promise(resolve => {
    const token = config.get('user.token')
    if (!token) resolve(false)
    mainAxios
      .get('/user/check')
      .then(_res => {
        resolve(true)
      })
      .catch(err => {
        errorLog(err)
        resolve(false)
      })
  })
}

async function newProject () {
  const answers = await inquirer.prompt(QUESTIONS)
  const projectName = answers['project-name']
  const templatePath = `${__dirname}/templates/chart`

  try {
    return new Promise(async resolve => {

      try {
        mkdirp.sync(`${CURR_DIR}/${projectName}`);
      } catch (e) {
        
      }
      createDirectoryContents(projectName, templatePath, projectName);
      // fse.copySync(templatePath, `${CURR_DIR}/${projectName}/`)

      exec(`cd ${projectName} && git init --initial-branch=master && git add . && git commit -m "initial ${projectName}" && git tag 0.0.1 -a -m "initial ${projectName} 0.0.1-beta1" && npm i -quiet && npm run build`)
      resolve({ projectName, templatePath })
    })
  } catch (err) {
    errorLog(err)
  }
}

function errorLog (err) {
  if (err?.response?.data?.message) {
    console.log(chalk.red(err?.response?.data?.message))
    return
  }
  if (err?.response?.data?.status) {
    console.log(chalk.red(err?.response?.data?.status))
    return
  }
  if (err?.response?.status) {
    console.log(chalk.red(err?.response?.status))
    return
  }
  if (err?.response?.data) {
    console.log(chalk.red(err?.response?.data))
    return
  }
  if (err) {
    console.log(chalk.red(err))
    return
  }
}

function createDirectoryContents (projectName, templatePath, newProjectPath) {
  const filesToCreate = fse.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;
    
    // get stats about the current file
    const stats = fse.statSync(origFilePath);
    if (stats.isFile()) {
      file = file.replace(/^_/, '');
      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      var imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
      if(imageReg.test(file)){
        fse.copyFile(origFilePath, writePath)
      }
      else {
      const contents = fse.readFileSync(origFilePath, 'utf8').replace(/project__name__/g, projectName);
  
      fse.writeFileSync(writePath, contents, {
        encoding: 'utf8',
        mode: '0755',
      });
    }
    } else if (stats.isDirectory()) {
      fse.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`, { mode: '0755' });
      
      // recursive call
      createDirectoryContents(projectName, `${templatePath}/${file}`, `${newProjectPath}/${file}`);
   
  }
  });
}

program.parse()