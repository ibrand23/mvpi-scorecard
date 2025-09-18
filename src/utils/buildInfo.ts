// Build information utility
let buildNumber = '1'

// Try to read build number from file (client-side safe)
if (typeof window === 'undefined') {
  try {
    const fs = require('fs')
    const path = require('path')
    const buildNumberPath = path.join(process.cwd(), 'build-number.txt')
    if (fs.existsSync(buildNumberPath)) {
      buildNumber = fs.readFileSync(buildNumberPath, 'utf8').trim()
    }
  } catch (error) {
    console.log('Could not read build number file, using default')
  }
}

export const BUILD_INFO = {
  buildNumber: process.env.NEXT_PUBLIC_BUILD_NUMBER || buildNumber,
  buildDate: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
}

export const getBuildDisplay = () => {
  return `Build #${BUILD_INFO.buildNumber}`
}
