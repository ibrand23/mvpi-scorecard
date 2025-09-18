// Script to create an admin user for testing
// Run this in the browser console on localhost:3000

const adminUser = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@test.com',
  password: 'admin123',
  role: 'Admin',
  createdAt: new Date().toISOString()
}

// Get existing users
const existingUsers = JSON.parse(localStorage.getItem('mvpi-users') || '[]')

// Check if admin user already exists
const adminExists = existingUsers.find(user => user.email === adminUser.email)

if (!adminExists) {
  // Add admin user
  existingUsers.push(adminUser)
  localStorage.setItem('mvpi-users', JSON.stringify(existingUsers))
  console.log('Admin user created successfully!')
  console.log('Email: admin@test.com')
  console.log('Password: admin123')
  console.log('Role: Admin')
} else {
  console.log('Admin user already exists!')
  console.log('Email: admin@test.com')
  console.log('Password: admin123')
  console.log('Role: Admin')
}

// Also set as current user for immediate testing
localStorage.setItem('mvpi-user', JSON.stringify(adminUser))
console.log('Admin user set as current user. Refresh the page to see admin functionality.')
