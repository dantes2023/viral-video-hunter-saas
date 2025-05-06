
// Application version information
export const VERSION = {
  major: 1,
  minor: 1,
  patch: 0,
  stage: 'beta', // 'alpha', 'beta', 'rc', 'stable'
  build: new Date().toISOString().split('T')[0], // Current date as build identifier
};

export const getVersionString = (): string => {
  return `v${VERSION.major}.${VERSION.minor}.${VERSION.patch}`;
};

export const getFullVersionString = (): string => {
  return `${getVersionString()} ${VERSION.stage} (${VERSION.build})`;
};
