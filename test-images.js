const https = require('https');
const http = require('http');

// Import shoes data from server
const shoes = [
  // Available Now
  {
    id: 1,
    name: "Nike Air Force 1 '07",
    price: 115,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&q=80",
    availability: "Available Now",
    status: "available",
    stores: [
      { name: "Nike.com", url: "https://www.nike.com/t/air-force-1-07-mens-shoes-jBrhbr/CW2288-111" },
      { name: "Foot Locker", url: "https://www.footlocker.com/search?query=nike%20air%20force%201" },
      { name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw=nike+air+force+1" }
    ]
  },
  {
    id: 2,
    name: "Nike Dunk Low Retro",
    price: 115,
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=300&fit=crop&q=80",
    availability: "Available Now",
    status: "available",
    stores: [
      { name: "Nike.com", url: "https://www.nike.com/t/dunk-low-retro-mens-shoes-76r2z0/DD1391-100" },
      { name: "Foot Locker", url: "https://www.footlocker.com/search?query=nike%20dunk%20low" },
      { name: "Champs Sports", url: "https://www.champssports.com/search?query=nike%20dunk%20low" }
    ]
  },
  {
    id: 3,
    name: "Nike Blazer Mid '77 Vintage",
    price: 100,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop&q=80",
    availability: "Available Now",
    status: "available",
    stores: [
      { name: "Nike.com", url: "https://www.nike.com/t/blazer-mid-77-vintage-mens-shoes-nw30B2/BQ6806-100" },
      { name: "Foot Locker", url: "https://www.footlocker.com/search?query=nike%20blazer%20mid%2077" },
      { name: "GOAT", url: "https://www.goat.com/search?query=nike%20blazer%20mid%2077" }
    ]
  },
  {
    id: 4,
    name: "Nike Court Vision Low",
    price: 75,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&q=80",
    availability: "Available Now",
    status: "available",
    stores: [
      { name: "Nike.com", url: "https://www.nike.com/w/mens-court-vision-shoes-1r9y6zy7ok" },
      { name: "Foot Locker", url: "https://www.footlocker.com/search?query=nike%20court%20vision" },
      { name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw=nike+court+vision+low" }
    ]
  },
  // Coming Soon
  {
    id: 5,
    name: "Nike Air Jordan 1 Retro High OG",
    price: 180,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop&q=80",
    availability: "Coming Soon",
    status: "coming-soon",
    releaseDate: "December 15, 2025",
    stores: [
      { name: "Nike.com", url: "https://www.nike.com/w/jordan-1-shoes-3glsmz6ymx6znik1" },
      { name: "Foot Locker", url: "https://www.footlocker.com/release-dates" },
      { name: "GOAT", url: "https://www.goat.com/search?query=air%20jordan%201%20high" }
    ]
  },
  {
    id: 6,
    name: "Nike SB Dunk Low Pro",
    price: 130,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop&q=80",
    availability: "Coming Soon",
    status: "coming-soon",
    releaseDate: "December 20, 2025",
    stores: [
      { name: "Nike.com", url: "https://www.nike.com/w/sb-dunk-shoes-1hzfznik1zy7ok" },
      { name: "Skate Shops", url: "https://www.tactics.com/nike-sb" },
      { name: "GOAT", url: "https://www.goat.com/search?query=nike%20sb%20dunk%20low" }
    ]
  },
  // Rare & Affordable
  {
    id: 7,
    name: "Nike Cortez Leather",
    price: 90,
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=300&fit=crop&q=80",
    availability: "Rare & Affordable",
    status: "rare",
    stores: [
      { name: "Nike.com", url: "https://www.nike.com/w/cortez-shoes-1i6l5zy7ok" },
      { name: "GOAT", url: "https://www.goat.com/search?query=nike%20cortez%20leather" },
      { name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw=nike+cortez+leather" }
    ]
  },
  {
    id: 8,
    name: "Nike Air Pegasus 83",
    price: 95,
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=300&fit=crop&q=80",
    availability: "Rare & Affordable",
    status: "rare",
    stores: [
      { name: "Nike.com", url: "https://www.nike.com/w/air-pegasus-shoes-1r9y6zy7ok" },
      { name: "GOAT", url: "https://www.goat.com/search?query=air%20pegasus%2083" },
      { name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw=nike+air+pegasus+83" }
    ]
  }
];

// Known keywords for each shoe model to validate images
const shoeKeywords = {
  'Air Force 1': ['air force', 'af1', 'basketball', 'white', 'nike'],
  'Dunk Low': ['dunk', 'basketball', 'skateboard', 'sb', 'low'],
  'Blazer Mid': ['blazer', 'vintage', 'basketball', 'mid', '77'],
  'Court Vision': ['court vision', 'basketball', 'retro', 'low'],
  'Air Jordan 1': ['jordan', 'aj1', 'basketball', 'high top', 'dunk'],
  'SB Dunk': ['dunk', 'sb', 'skateboard', 'skating', 'pro'],
  'Cortez': ['cortez', 'running', 'retro', 'classic', 'leather'],
  'Pegasus': ['pegasus', 'running', 'air', 'retro', '83']
};

function testImageUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(url, { method: 'HEAD', timeout: 10000 }, (res) => {
      const contentType = res.headers['content-type'] || '';
      resolve({
        success: res.statusCode === 200,
        statusCode: res.statusCode,
        contentType: contentType,
        isImage: contentType.startsWith('image/')
      });
    });
    
    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Request timeout'
      });
    });
    
    req.end();
  });
}

// Check if image URL seems appropriate for the shoe
function validateImageRelevance(shoeName, imageUrl) {
  const warnings = [];
  
  // Check if it's from a stock photo site (Unsplash, Pexels, etc.)
  if (imageUrl.includes('unsplash.com') || imageUrl.includes('pexels.com')) {
    warnings.push('⚠️  Using stock photo from ' + (imageUrl.includes('unsplash') ? 'Unsplash' : 'Pexels'));
  }
  
  // Check if URL contains any shoe-related keywords
  const urlLower = imageUrl.toLowerCase();
  const hasShoeKeyword = ['shoe', 'sneaker', 'nike', 'jordan', 'dunk', 'air'].some(keyword => 
    urlLower.includes(keyword)
  );
  
  if (!hasShoeKeyword) {
    warnings.push('⚠️  URL does not contain shoe-related keywords');
  }
  
  // Find matching shoe type
  let foundKeyword = false;
  for (const [shoeType, keywords] of Object.entries(shoeKeywords)) {
    if (shoeName.includes(shoeType)) {
      foundKeyword = true;
      // Note: Unsplash uses generic photo IDs, so we can't validate against keywords
      break;
    }
  }
  
  return warnings;
}

async function testAllImages() {
  console.log('🖼️  Testing Image URLs for Nike Sneaker Shop\n');
  console.log('='.repeat(80));
  
  let passCount = 0;
  let failCount = 0;
  let warningCount = 0;
  const failedImages = [];
  const imageWarnings = [];
  
  for (const shoe of shoes) {
    console.log(`\n📸 Testing: ${shoe.name} (ID: ${shoe.id})`);
    console.log(`   URL: ${shoe.image}`);
    
    const result = await testImageUrl(shoe.image);
    
    if (result.success && result.isImage) {
      console.log(`   ✅ Status: ${result.statusCode} - ${result.contentType}`);
      passCount++;
      
      // Check for warnings about image relevance
      const warnings = validateImageRelevance(shoe.name, shoe.image);
      if (warnings.length > 0) {
        warningCount++;
        console.log(`   ${warnings.join('\n   ')}`);
        imageWarnings.push({
          shoe: shoe.name,
          warnings: warnings
        });
      }
    } else if (result.success && !result.isImage) {
      console.log(`   ❌ ERROR: Not an image! Content-Type: ${result.contentType}`);
      failCount++;
      failedImages.push({
        shoe: shoe.name,
        url: shoe.image,
        reason: `Not an image (${result.contentType})`
      });
    } else {
      console.log(`   ❌ ERROR: ${result.error || 'Status ' + result.statusCode}`);
      failCount++;
      failedImages.push({
        shoe: shoe.name,
        url: shoe.image,
        reason: result.error || `HTTP ${result.statusCode}`
      });
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 Image Test Summary:');
  console.log(`   Total Images: ${shoes.length}`);
  console.log(`   ✅ Passed: ${passCount} (${((passCount/shoes.length)*100).toFixed(1)}%)`);
  console.log(`   ❌ Failed: ${failCount} (${((failCount/shoes.length)*100).toFixed(1)}%)`);
  console.log(`   ⚠️  Warnings: ${warningCount}`);
  
  if (failedImages.length > 0) {
    console.log('\n❌ Failed Images:');
    failedImages.forEach(item => {
      console.log(`   • ${item.shoe}`);
      console.log(`     URL: ${item.url}`);
      console.log(`     Reason: ${item.reason}`);
    });
  }
  
  if (imageWarnings.length > 0) {
    console.log('\n⚠️  Image Relevance Warnings:');
    console.log('   Note: Using stock photos from Unsplash. Consider replacing with actual product images.');
    imageWarnings.forEach(item => {
      console.log(`\n   • ${item.shoe}`);
      item.warnings.forEach(warning => {
        console.log(`     ${warning}`);
      });
    });
    
    console.log('\n💡 Recommendation:');
    console.log('   For better accuracy, consider using official Nike product images from:');
    console.log('   • Nike.com product pages');
    console.log('   • Official Nike CDN (static.nike.com)');
    console.log('   • Nike SNKRS app images');
    console.log('   • StockX or GOAT product images (with permission)');
  }
  
  console.log('\n' + '='.repeat(80));
  
  if (failCount === 0 && warningCount === 0) {
    console.log('\n✅ All images are valid and appear appropriate!\n');
  } else if (failCount === 0) {
    console.log('\n⚠️  All images load successfully but some may not match the shoes.\n');
  } else {
    console.log('\n❌ Some images failed to load. Please fix the URLs above.\n');
  }
}

// Run the tests
testAllImages().catch(console.error);
