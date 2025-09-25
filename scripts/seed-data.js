// Script to generate realistic fake data for the MPVI Scorecard app
// Run this in the browser console or as a Node.js script

const generateFakeData = () => {
  // Sample data arrays
  const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Jennifer', 'William', 'Jessica',
    'James', 'Ashley', 'Christopher', 'Amanda', 'Daniel', 'Stephanie', 'Matthew', 'Melissa', 'Anthony', 'Nicole',
    'Mark', 'Elizabeth', 'Donald', 'Helen', 'Steven', 'Sandra', 'Paul', 'Donna', 'Andrew', 'Carol',
    'Joshua', 'Ruth', 'Kenneth', 'Sharon', 'Kevin', 'Michelle', 'Brian', 'Laura', 'George', 'Sarah'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
  ];

  const vehicleMakes = ['Chevrolet', 'Ford', 'Toyota', 'Honda', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Hyundai'];
  const vehicleModels = {
    'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Camaro', 'Cruze', 'Traverse', 'Suburban'],
    'Ford': ['F-150', 'Explorer', 'Escape', 'Mustang', 'Edge', 'Focus', 'Expedition', 'Fusion'],
    'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Tacoma', 'Tundra', '4Runner'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'Ridgeline', 'HR-V', 'Passport'],
    'Nissan': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano', 'Frontier', 'Titan', 'Armada'],
    'BMW': ['3 Series', '5 Series', 'X3', 'X5', '7 Series', 'X1', 'X7', 'i3'],
    'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'A-Class', 'GLS', 'CLA'],
    'Audi': ['A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3', 'A8', 'e-tron'],
    'Volkswagen': ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf', 'Arteon', 'ID.4', 'Beetle'],
    'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent', 'Palisade', 'Kona', 'Veloster']
  };

  const inspectionCategories = [
    'OnStar Diagnostics', 'Engine', 'Lighting', 'Wipers & Windshield', 'Battery',
    'Under Hood Fluid Levels/Systems', 'Check for Proper Operation', 'Lubricate & Tire Sealant',
    'Tires', 'Brakes', 'Visible Under Hood Components'
  ];

  const inspectionItems = {
    'OnStar Diagnostics': ['OnStar Active', 'Enrolled in Advanced Diagnostics Report', 'Battery Dealer Maintenance Notification', 'Service History/Recall Check'],
    'Engine': ['Engine oil', 'Oil life monitor', 'Reset oil life monitor'],
    'Lighting': ['Exterior lights'],
    'Wipers & Windshield': ['Wiper blade-driver', 'Wiper blade-passenger', 'Windshield condition'],
    'Battery': ['Battery test results*', 'Battery visual inspection', 'Battery cables & connections'],
    'Under Hood Fluid Levels/Systems': ['Engine oil', 'Transmission', 'Drive axle', 'Engine cooling system', 'Power steering', 'Fuel system', 'Brake fluid reservoir', 'Windshield washer fluid'],
    'Visible Under Hood Components': ['Belt (ALT, P/S, A/C & FUNCTION)', 'Safety belt components', 'Exhaust system', 'Accelerator pedal', 'Passenger compartment air filter', 'Engine air filter', 'Hoses', 'Belts', 'Shocks and struts', 'Steering components', 'Axle boots or driveshaft & u-joints', 'Compartment lift struts', 'Floor mat secured, no interference with pedals'],
    'Check for Proper Operation': ['Horn', 'Ignition lock', 'Starter switch', 'Evaporator control system', 'Chassis components'],
    'Lubricate & Tire Sealant': ['Require pressure monitor', 'Tire sealant expiration date'],
    'Tires': ['Individual tire positions (LF, RF, LR, RR)', 'Service recommendations (Rotate, Align, Balance)'],
    'Brakes': ['Driver Front', 'Passenger Front', 'Driver Rear', 'Passenger Rear', 'Brake System overall']
  };

  const conditions = ['Pass', 'Attention Required', 'Failed', 'Not Inspected'];
  const whyItMatters = [
    'Ensures optimal performance and longevity',
    'Prevents potential safety hazards',
    'Maintains fuel efficiency',
    'Prevents costly repairs down the road',
    'Ensures proper vehicle operation',
    'Critical for safety and reliability'
  ];

  const recommendedActions = [
    'Schedule maintenance within 30 days',
    'Monitor closely and address if issues worsen',
    'Immediate attention required',
    'Replace as soon as possible',
    'Continue regular maintenance',
    'Professional inspection recommended'
  ];

  const notes = [
    'Vehicle in excellent condition',
    'Minor wear noted, within normal parameters',
    'Some components showing age but functional',
    'Well maintained vehicle',
    'Regular maintenance up to date',
    'A few items need attention',
    'Overall good condition with minor issues',
    'Vehicle performs well with proper maintenance'
  ];

  // Helper functions
  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
  const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const getRandomEmail = (firstName, lastName) => `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomItem(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com'])}`;
  const generateVIN = () => {
    const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
    let vin = '';
    for (let i = 0; i < 17; i++) {
      vin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return vin;
  };

  // Generate users
  const generateUsers = () => {
    const users = [];
    const roles = ['Tech', 'Advisor', 'Customer'];
    const roleCounts = { Tech: 8, Advisor: 7, Customer: 35 };

    // Add one admin user
    users.push({
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@mvpi.com',
      role: 'Admin',
      password: 'admin123',
      createdAt: new Date('2024-01-01').toISOString()
    });

    // Generate other users
    Object.entries(roleCounts).forEach(([role, count]) => {
      for (let i = 0; i < count; i++) {
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);
        const email = getRandomEmail(firstName, lastName);
        const createdAt = getRandomDate(new Date('2024-01-01'), new Date());

        users.push({
          id: `${role.toLowerCase()}-${i + 1}`,
          name: `${firstName} ${lastName}`,
          email,
          role,
          password: 'password123',
          createdAt: createdAt.toISOString()
        });
      }
    });

    return users;
  };

  // Generate inspection reports
  const generateInspections = (users) => {
    const inspections = [];
    const customers = users.filter(u => u.role === 'Customer');
    const techs = users.filter(u => u.role === 'Tech' || u.role === 'Advisor');
    
    // Create some customers with multiple vehicles
    const customerVehicles = {};
    customers.forEach(customer => {
      const numVehicles = Math.random() < 0.3 ? 2 : 1; // 30% chance of multiple vehicles
      customerVehicles[customer.id] = [];
      
      for (let i = 0; i < numVehicles; i++) {
        const make = getRandomItem(vehicleMakes);
        const model = getRandomItem(vehicleModels[make]);
        const year = Math.floor(Math.random() * 10) + 2015; // 2015-2024
        
        customerVehicles[customer.id].push({
          make,
          model,
          year: year.toString(),
          vin: generateVIN(),
          mileage: Math.floor(Math.random() * 150000) + 10000
        });
      }
    });

    // Generate 50 inspection reports
    for (let i = 0; i < 50; i++) {
      const customer = getRandomItem(customers);
      const vehicle = getRandomItem(customerVehicles[customer.id]);
      const tech = getRandomItem(techs);
      const createdAt = getRandomDate(new Date('2024-01-01'), new Date());
      
      // Generate inspection items
      const inspectionItemsList = [];
      inspectionCategories.forEach(category => {
        const items = inspectionItems[category];
        items.forEach(item => {
          const condition = getRandomItem(conditions);
          const score = condition === 'Pass' ? 5 : condition === 'Attention Required' ? 3 : condition === 'Failed' ? 1 : 0;
          
          inspectionItemsList.push({
            id: `${category}-${item}-${i}`,
            category,
            item,
            condition,
            notes: condition !== 'Pass' ? getRandomItem(notes) : '',
            whyItMatters: condition !== 'Pass' ? getRandomItem(whyItMatters) : '',
            recommendedAction: condition !== 'Pass' ? getRandomItem(recommendedActions) : '',
            score
          });
        });
      });

      const overallScore = Math.round(inspectionItemsList.reduce((sum, item) => sum + item.score, 0) / inspectionItemsList.length * 20);

      inspections.push({
        id: `inspection-${i + 1}`,
        customerName: customer.name,
        customerEmail: customer.email,
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
        createdBy: tech.id,
        vehicleInfo: {
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          vin: vehicle.vin,
          mileage: vehicle.mileage.toString()
        },
        inspectionItems: inspectionItemsList,
        overallScore,
        notes: getRandomItem(notes)
      });
    }

    return inspections;
  };

  // Generate feedback
  const generateFeedback = (users) => {
    const feedbacks = [];
    const customers = users.filter(u => u.role === 'Customer');
    
    const feedbackMessages = [
      'Great service! The inspection was thorough and professional.',
      'Very satisfied with the inspection process. Everything was explained clearly.',
      'The technician was knowledgeable and answered all my questions.',
      'Quick and efficient service. Would recommend to others.',
      'The inspection report was detailed and easy to understand.',
      'Excellent customer service throughout the process.',
      'The vehicle health score helped me understand what needs attention.',
      'Professional staff and clean facility.',
      'The inspection was comprehensive and well-documented.',
      'Very happy with the service quality and attention to detail.',
      'The technician was friendly and professional.',
      'Great experience overall. Will definitely return.',
      'The inspection process was smooth and efficient.',
      'Very thorough inspection. Appreciate the detailed report.',
      'Excellent service and communication throughout.',
      'The staff was helpful and knowledgeable.',
      'Quick turnaround time and quality work.',
      'Very satisfied with the inspection results.',
      'Professional and courteous service.',
      'The inspection was worth the time and money.'
    ];

    for (let i = 0; i < 25; i++) {
      const customer = getRandomItem(customers);
      const createdAt = getRandomDate(new Date('2024-01-01'), new Date());
      const isRead = Math.random() < 0.7; // 70% chance of being read

      feedbacks.push({
        id: `feedback-${i + 1}`,
        name: customer.name,
        email: customer.email,
        message: getRandomItem(feedbackMessages),
        createdAt: createdAt.toISOString(),
        isRead
      });
    }

    return feedbacks;
  };

  // Generate all data
  const users = generateUsers();
  const inspections = generateInspections(users);
  const feedbacks = generateFeedback(users);

  return { users, inspections, feedbacks };
};

// Function to seed the data into localStorage
const seedData = () => {
  const { users, inspections, feedbacks } = generateFakeData();
  
  // Store in localStorage
  localStorage.setItem('mpvi-users', JSON.stringify(users));
  localStorage.setItem('mpvi-inspections', JSON.stringify(inspections));
  localStorage.setItem('mpvi-feedback', JSON.stringify(feedbacks));
  
  console.log('Data seeded successfully!');
  console.log(`Users: ${users.length} (${users.filter(u => u.role === 'Admin').length} Admin, ${users.filter(u => u.role === 'Tech').length} Tech, ${users.filter(u => u.role === 'Advisor').length} Advisor, ${users.filter(u => u.role === 'Customer').length} Customer)`);
  console.log(`Inspections: ${inspections.length}`);
  console.log(`Feedback: ${feedbacks.length}`);
  
  // Show some statistics
  const customersWithMultipleReports = new Set(inspections.map(i => i.customerEmail)).size;
  const totalCustomers = users.filter(u => u.role === 'Customer').length;
  console.log(`Customers with inspection reports: ${customersWithMultipleReports}/${totalCustomers}`);
  
  return { users, inspections, feedbacks };
};

// Export for use
if (typeof window !== 'undefined') {
  window.seedData = seedData;
  window.generateFakeData = generateFakeData;
  console.log('Seed functions available: seedData() and generateFakeData()');
}

// If running in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateFakeData, seedData };
}
