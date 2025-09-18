// Build information utility
export const BUILD_INFO = {
  buildNumber: process.env.NEXT_PUBLIC_BUILD_NUMBER || '1',
  buildDate: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  commitHash: process.env.NEXT_PUBLIC_COMMIT_HASH || 'unknown',
  commitShort: process.env.NEXT_PUBLIC_COMMIT_SHORT || 'unknown',
  commitDate: process.env.NEXT_PUBLIC_COMMIT_DATE || new Date().toISOString()
}

export const getBuildDisplay = () => {
  return `Build #${BUILD_INFO.buildNumber} (${BUILD_INFO.commitShort})`
}

export const getDetailedBuildInfo = () => {
  return {
    buildNumber: BUILD_INFO.buildNumber,
    commitHash: BUILD_INFO.commitHash,
    commitShort: BUILD_INFO.commitShort,
    commitDate: BUILD_INFO.commitDate,
    buildDate: BUILD_INFO.buildDate
  }
}
