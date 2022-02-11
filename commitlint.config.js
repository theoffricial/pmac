// See: https://www.conventionalcommits.org/en/v1.0.0/
module.exports = {
  extends: [
    '@commitlint/config-conventional',
  ],
  rules: {
    'subject-case': [
      2,
      'always',
      [
        'sentence-case',
        'start-case',
        'pascal-case',
        'upper-case',
        'lower-case',
      ],
    ],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'sample',
      ],
    ],
  },
}
