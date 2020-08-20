'use strict'

module.exports = {
  types: [
    { value: 'feat', name: '功能:    一个新的功能' },
    { value: 'fix', name: '修复:    修复一个Bug' },
    { value: 'docs', name: '文档:    文档更新' },
    {
      value: 'style',
      name: '格式:    不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)',
    },
    { value: 'refactor', name: '重构:    重构代码(既没有新增功能，也没有修复 bug)' },
    { value: 'perf', name: '性能:    性能, 体验优化' },
    { value: 'test', name: '测试:    新增测试用例或是更新现有测试' },
    { value: 'chore', name: '工具:    不属于以上类型的其他类型，比如构建流程, 依赖管理' },
    { value: 'revert', name: '回滚:    回滚某个更早之前的提交' },
  ],
  scopes: [{ name: '组件一' }, { name: '组件二' }],
  messages: {
    type: '选择当前的提交类型:',
    scope: '选择一个scope(影响面) (可选):',
    customScope: '自定义影响面(可选):',
    subject: '短说明:\n',
    body: '长说明，使用"|"换行(可选)：\n',
    breaking: '列举主要变化点(可选):\n',
    footer: '关联的issue，例如：#31, #34(可选):\n',
    confirmCommit: '确定提交说明?',
  },
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 100,
}
