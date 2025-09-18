// Build information utility
export const BUILD_INFO = {
  buildNumber: process.env.NEXT_PUBLIC_BUILD_NUMBER || '1.0.0',
  buildDate: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
}

export const getBuildDisplay = () => {
  return `Build #${BUILD_INFO.buildNumber}`
}
