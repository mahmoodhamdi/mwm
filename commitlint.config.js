// Conventional Commits configuration
// https://www.conventionalcommits.org/

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature | ميزة جديدة
        'fix', // Bug fix | إصلاح خطأ
        'docs', // Documentation | توثيق
        'style', // Formatting | تنسيق
        'refactor', // Code restructuring | إعادة هيكلة
        'perf', // Performance | أداء
        'test', // Testing | اختبارات
        'build', // Build system | نظام البناء
        'ci', // CI/CD | التكامل المستمر
        'chore', // Maintenance | صيانة
        'revert', // Revert | تراجع
      ],
    ],
    'subject-case': [0], // Allow any case for Arabic support
    'header-max-length': [2, 'always', 100],
  },
};
