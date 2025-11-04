const https = require('https');
const http = require('http');

// Import shoe data from server.js
const shoeData = `
// Sample Nike shoe data
const shoes = [
  // Available Now
  {
    id: 1,
    name: "Nike Air Force 1 '07",
    price: 115,
    image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400&h=300&fit=crop",
    availability: "Available Now",
    status: "available",
    stores: [
      { name: "Nike.com", url: "https://www.nike.com/t/air-force-1-07-mens-shoes-jBrhbr/CW2288-111" },
      { name: "Foot Locker", url: "https://www.footlocker.com/search?query=nike%20air%20force%201" },
      { name: "Amazon", url: "https://www.amazon.com/s?k=nike+air+force+1" }
    ]
  },
  {
    id: 2,
    name: "Nike Dunk Low Retro",
    price: 115,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop",
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
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=300&fit=crop",
    availability: "Available Now",
    status: "available",
    stores: [
      { name: "Nike.com", url: "https://www.nike.com/t/blazer-mid-77-vintage-mens-shoes-nw30B2/BQ6806-100" },
      { name: "Foot Locker", url: "https://www.footlocker.com/search?query=nike%20blazer%20mid%2077" },
      { name: "Amazon", url: "https://www.amazon.com/s?k=nike+blazer+mid+77" }
    ]
  },
  {
    id: 4,
    name: "Nike Court Vision Low",
    price: 75,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    availability: "Available Now",
    status: "available",
    stores: [
      { name: "Nike.com", url: "https://www.nike.com/t/court-vision-low-mens-shoes-Z7NwJP/CD5463-100" },
      { name: "Foot Locker", url: "https://www.footlocker.com/search?query=nike%20court%20vision" },
      { name: "Dick's Sporting", url: "https://www.dickssportinggoods.com/search/SearchDisplay?searchTerm=nike+court+vision" }
    ]
  },
  {
    id: 5,
    name: "Nike Air Jordan 1 Retro High OG",
    price: 180,
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop",
    availability: "Coming Soon",
    status: "coming-soon",
    releaseDate: "December 15, 2025",
    stores: [
      { name: "Nike SNKRS", url: "https://www.nike.com/launch?s=upcoming" },
      { name: "Foot Locker", url: "https://www.footlocker.com/release-dates" },
      { name: "StockX", url: "https://stockx.com/retro-jordans" }
    ]
  },
  {
    id: 6,
    name: "Nike SB Dunk Low Pro",
    price: 130,
    image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=300&fit=crop",
    availability: "Coming Soon",
    status: "coming-soon",
    releaseDate: "December 20, 2025",
    stores: [
      { name: "Nike SNKRS", url: "https://www.nike.com/launch?s=upcoming" },
      { name: "Skate Shops", url: "https://www.tactics.com/nike-sb" },
      { name: "StockX", url: "https://stockx.com/nike-sb" }
    ]
  },
  {
    id: 7,
    name: "Nike Cortez Leather",
    price: 90,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
    availability: "Rare & Affordable",
    status: "rare",
    stores: [
      { name: "Nike.com", url: "https://www.nike.com/w/cortez-shoes-1i6l5zy7ok" },
      { name: "StockX", url: "https://stockx.com/nike-cortez" },
      { name: "GOAT", url: "https://www.goat.com/search?query=nike%20cortez%20leather" },
      { name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw=nike+cortez+leather" }
    ]
  },
  {
    id: 8,
    name: "Nike Air Pegasus 83",
    price: 95,
    image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=400&h=300&fit=crop",
    availability: "Rare & Affordable",
    status: "rare",
    stores: [
      { name: "Nike.com", url: "https://www.nike.com/w/air-pegasus-shoes-1r9y6zy7ok" },
      { name: "StockX", url: "https://stockx.com/nike-pegasus" },
      { name: "GOAT", url: "https://www.goat.com/search?query=air%20pegasus%2083" },
      { name: "eBay", url: "https://www.ebay.com/sch/i.html?_nkw=nike+air+pegasus+83" }
    ]
  }
];
`;

// Parse the shoe data
const shoes = eval(shoeData + '; shoes;');

// Function to test URL
function testUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    };

    const req = protocol.request(options, (res) => {
      const status = res.statusCode;
      // Accept 200, 301, 302, 307, 308 as valid
      const isValid = status >= 200 && status < 400;
      resolve({
        url,
        status,
        valid: isValid
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: 0,
        valid: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        valid: false,
        error: 'Timeout'
      });
    });

    req.end();
  });
}

// Test all URLs
async function testAllLinks() {
  console.log('🔍 Testing all store links...\n');
  
  let totalLinks = 0;
  let validLinks = 0;
  let invalidLinks = [];

  for (const shoe of shoes) {
    console.log(`\n📦 ${shoe.name}`);
    
    for (const store of shoe.stores) {
      totalLinks++;
      const result = await testUrl(store.url);
      
      if (result.valid) {
        validLinks++;
        console.log(`  ✅ ${store.name}: ${result.status} - ${result.url}`);
      } else {
        invalidLinks.push({
          shoe: shoe.name,
          store: store.name,
          url: result.url,
          status: result.status,
          error: result.error
        });
        console.log(`  ❌ ${store.name}: ${result.status || 'FAILED'} - ${result.url}`);
        if (result.error) {
          console.log(`     Error: ${result.error}`);
        }
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Test images
  console.log('\n\n📸 Testing all images...\n');
  for (const shoe of shoes) {
    totalLinks++;
    const result = await testUrl(shoe.image);
    
    if (result.valid) {
      validLinks++;
      console.log(`  ✅ ${shoe.name} image: ${result.status}`);
    } else {
      invalidLinks.push({
        shoe: shoe.name,
        store: 'Image',
        url: result.url,
        status: result.status,
        error: result.error
      });
      console.log(`  ❌ ${shoe.name} image: ${result.status || 'FAILED'}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total links tested: ${totalLinks}`);
  console.log(`✅ Valid links: ${validLinks} (${((validLinks/totalLinks)*100).toFixed(1)}%)`);
  console.log(`❌ Invalid links: ${invalidLinks.length} (${((invalidLinks.length/totalLinks)*100).toFixed(1)}%)`);
  
  if (invalidLinks.length > 0) {
    console.log('\n⚠️  Invalid Links:');
    invalidLinks.forEach(link => {
      console.log(`\n  Shoe: ${link.shoe}`);
      console.log(`  Store: ${link.store}`);
      console.log(`  URL: ${link.url}`);
      console.log(`  Status: ${link.status || 'FAILED'}`);
      if (link.error) {
        console.log(`  Error: ${link.error}`);
      }
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  if (invalidLinks.length === 0) {
    console.log('🎉 All links are working!\n');
  } else {
    console.log('⚠️  Some links need to be fixed.\n');
  }
}

// Run tests
testAllLinks().catch(console.error);
