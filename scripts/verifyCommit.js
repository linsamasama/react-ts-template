// Invoked on the commit-msg git hook by yorkie.

const chalk = require('chalk')

const msgPath = process.env.HUSKY_GIT_PARAMS
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim()

const commitRE = /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
  console.error(
    `${chalk.bgRed.white('ERROR ')} ${chalk.red('无效的提交消息格式')}\n\n${chalk.red(
      'git commit 需要正确的提交格式。如下面所示:\n\n',
    )}    ${chalk.green('feat(compiler): add comments option')}\n` +
      `    ${chalk.green('fix(v-model): handle events on blur (close #28)')}\n\n${chalk.red(
        '推荐使用 git cz 命令进行提交 \n\n',
      )}${chalk.red('更多信息可以查看 ： https://www.conventionalcommits.org/zh-hans/v1.0.0-beta.4/ \n')}`,
  )
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1)
}
