const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const semver = require('semver') // 语义化版本
const { prompt } = require('enquirer') // 交互式命令行工具
const execa = require('execa') // 启动子进程执行shell和本地外部程序,支持多操作系统，包括windows。如果父进程退出，则生成的全部子进程都被杀死。
const { PROJECT_PATH } = require('./constants')

// eslint-disable-next-line import/no-dynamic-require
const currentVersion = require(path.resolve(PROJECT_PATH, './package.json')).version
const preId = (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0]) || 'alpha'
const versionIncrements = [
  'patch', // 补丁版本，修复BUG，没有新功能，没有破坏性变更。
  'minor', // 次版本号，增加新功能，没有破坏性变更。
  'major', // 主版本号，引入破坏性变更。
]

const inc = (i) => semver.inc(currentVersion, i, preId)
const bin = (name) => path.resolve(__dirname, `../node_modules/.bin/${name}`)
const run = (bins, args, opts = {}) => execa(bins, args, { stdio: 'inherit', ...opts })
const step = (msg) => console.log(chalk.cyan(msg))

async function main() {
  let targetVersion = false

  if (!targetVersion) {
    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements.map((i) => `${i} (${inc(i)})`).concat(['custom']),
    })

    if (release === 'custom') {
      targetVersion = (
        await prompt({
          type: 'input',
          name: 'version',
          message: 'Input custom version',
          initial: currentVersion,
        })
      ).version
    } else {
      // eslint-disable-next-line prefer-destructuring
      targetVersion = release.match(/\((.*)\)/)[1]
    }
  }
  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }
  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  })

  if (!yes) {
    return
  }

  // run tests before release
  step('\nRunning tests...')
  await run(bin('jest'), ['--clearCache'])
  await run('npm', ['run', 'test'])

  // update package.json versions
  const pkgPath = path.resolve(__dirname, '../package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.version = targetVersion
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

  // generate changelogs
  await run('npm', ['run', 'changelog'])

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await run('git', ['add', '-A'])
    await run('git', ['commit', '-m', `release: v${targetVersion}`, '--no-verify'])
  } else {
    console.log('No changes to commit.')
  }

  // push to Git
  step('\nPushing to Git...')
  await run('git', ['tag', `v${targetVersion}`])
  await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
  await run('git', ['push'])
}

main().catch((error) => {
  console.error(error)
})
