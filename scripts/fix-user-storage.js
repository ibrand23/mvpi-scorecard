// Script to fix the localStorage key inconsistency issue
// Run this in the browser console

const fixUserStorage = () => {
  console.log('🔧 Fixing user storage key inconsistency...')
  
  // Check for the old incorrect key
  const oldUserData = localStorage.getItem('mvpi-user')
  const correctUserData = localStorage.getItem('mpvi-user')
  
  console.log('Old key (mvpi-user):', oldUserData)
  console.log('Correct key (mpvi-user):', correctUserData)
  
  if (oldUserData && !correctUserData) {
    // If we have data in the old key but not the correct key, move it
    console.log('Moving user data from old key to correct key...')
    localStorage.setItem('mpvi-user', oldUserData)
    localStorage.removeItem('mvpi-user')
    console.log('✅ User data moved successfully!')
  } else if (oldUserData && correctUserData) {
    // If we have data in both keys, keep the correct one and remove the old one
    console.log('Removing old incorrect key...')
    localStorage.removeItem('mvpi-user')
    console.log('✅ Old key removed!')
  } else if (!oldUserData && !correctUserData) {
    console.log('No user data found in localStorage')
  } else {
    console.log('User data is already in the correct key')
  }
  
  // Verify the fix
  const finalUserData = localStorage.getItem('mpvi-user')
  if (finalUserData) {
    try {
      const user = JSON.parse(finalUserData)
      console.log('✅ Current user data:', user)
      console.log('User role:', user.role)
    } catch (error) {
      console.error('❌ Error parsing user data:', error)
    }
  }
}

// Make it available globally
if (typeof window !== 'undefined') {
  window.fixUserStorage = fixUserStorage
  console.log('Fix function available: fixUserStorage()')
}
