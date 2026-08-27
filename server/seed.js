require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  { name: 'Desk & Studio', slug: 'desk-studio' },
  { name: 'Home Objects', slug: 'home-objects' },
  { name: 'Travel Goods', slug: 'travel-goods' },
  { name: 'Wearables', slug: 'wearables' },
];

const products = [
  { name: 'Studio Timepiece', description: 'A quiet modern desk clock with a brushed steel case and soft readable face.', price: 128, brand: 'Form & Function', stock: 18, category: 'Desk & Studio', images: ['https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=85'], ratings: 4.8, numReviews: 12, isFeatured: true },
  { name: 'Linen Field Notebook', description: 'A tactile linen-bound notebook made for sketches, plans, and everyday observations.', price: 24, brand: 'Paper Standard', stock: 64, category: 'Desk & Studio', images: ['https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85'], ratings: 4.6, numReviews: 8, isFeatured: true },
  { name: 'Stoneware Morning Mug', description: 'Hand-finished stoneware with a generous handle and a warm speckled glaze.', price: 32, brand: 'Kiln House', stock: 35, category: 'Home Objects', images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85'], ratings: 4.9, numReviews: 19, isFeatured: true },
  { name: 'Oak Catchall Tray', description: 'Solid oak tray with rounded corners for keys, jewelry, and small daily essentials.', price: 46, brand: 'Grain Workshop', stock: 22, category: 'Home Objects', images: ['https://images.unsplash.com/photo-1602874801006-e26f7f3c9a6f?auto=format&fit=crop&w=900&q=85'], ratings: 4.5, numReviews: 6, isFeatured: false },
  { name: 'Canvas Weekender', description: 'A durable cotton canvas carryall with leather details for short trips and long weekends.', price: 148, discountPrice: 119, brand: 'Field Notes Co.', stock: 11, category: 'Travel Goods', images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85'], ratings: 4.7, numReviews: 14, isFeatured: true },
  { name: 'Everyday Leather Wallet', description: 'A slim vegetable-tanned leather wallet with room for the essentials and nothing extra.', price: 74, brand: 'Common Carry', stock: 27, category: 'Travel Goods', images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85'], ratings: 4.4, numReviews: 9, isFeatured: false },
  { name: 'Merino Everyday Cap', description: 'A breathable merino wool cap with a clean profile for cool mornings and city walks.', price: 58, brand: 'Northline', stock: 41, category: 'Wearables', images: ['https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=85'], ratings: 4.6, numReviews: 11, isFeatured: false },
  { name: 'Minimalist Field Watch', description: 'A dependable everyday watch with a clear dial, canvas strap, and timeless proportions.', price: 196, brand: 'Form & Function', stock: 9, category: 'Wearables', images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85'], ratings: 4.9, numReviews: 21, isFeatured: true },
];

const seed = async () => {
  await connectDB();
  const categoryMap = {};
  for (const category of categories) {
    const saved = await Category.findOneAndUpdate({ slug: category.slug }, category, { upsert: true, new: true, setDefaultsOnInsert: true });
    categoryMap[category.name] = saved._id;
  }
  for (const product of products) {
    const { category, ...data } = product;
    await Product.findOneAndUpdate({ name: product.name }, { ...data, category: categoryMap[category] }, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true });
  }
  console.log(`Seeded ${products.length} products and ${categories.length} categories`);
  process.exit(0);
};

seed().catch((error) => { console.error(error); process.exit(1); });