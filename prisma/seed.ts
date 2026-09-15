import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Macky Hoodie',
    price: 899.99,
    stock: 25,
    category: 'Apparel',
    sku: 'HOOD-001',
    description: 'Unisex fleece hoodie',
  },
  {
    name: 'Macky T-Shirt',
    price: 349.0,
    stock: 100,
    category: 'Apparel',
    sku: 'TEE-001',
    description: 'Cotton crewneck tee',
  },
  {
    name: 'Macky Tote Bag',
    price: 199.5,
    stock: 40,
    category: 'Accessories',
    sku: 'BAG-001',
    description: null,
  },
  {
    name: 'Macky Sticker Pack',
    price: 79.0,
    stock: 200,
    category: 'Accessories',
    sku: 'STK-001',
    description: 'Set of 5 vinyl stickers',
  },
  {
    name: 'Macky Pin',
    price: 59.0,
    stock: 150,
    category: 'Accessories',
    sku: 'PIN-001',
    description: 'Enamel pin',
  },
  {
    name: 'Macky Lanyard',
    price: 89.0,
    stock: 120,
    category: 'Accessories',
    sku: 'LAN-001',
    description: null,
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
