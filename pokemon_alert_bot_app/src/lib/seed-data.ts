import { prisma } from './prisma';
import { StockStatus } from '@prisma/client';

export async function seedStoreData() {
  try {
    console.log('Seeding store data...');

    // Create stores
    const pokemonCenter = await prisma.store.upsert({
      where: { name: 'pokemon_center' },
      update: {},
      create: {
        name: 'pokemon_center',
        displayName: 'Pokémon Center',
        url: 'https://www.pokemoncenter.com',
        logoUrl: 'https://www.pokemoncenter.com/static/images/logo.png',
        isActive: true,
      },
    });

    const bestBuy = await prisma.store.upsert({
      where: { name: 'best_buy' },
      update: {},
      create: {
        name: 'best_buy',
        displayName: 'Best Buy',
        url: 'https://www.bestbuy.com',
        logoUrl: 'https://logo.clearbit.com/bestbuy.com',
        isActive: false, // Will be activated when monitor is implemented
      },
    });

    const target = await prisma.store.upsert({
      where: { name: 'target' },
      update: {},
      create: {
        name: 'target',
        displayName: 'Target',
        url: 'https://www.target.com',
        logoUrl: 'https://logo.clearbit.com/target.com',
        isActive: false,
      },
    });

    const walmart = await prisma.store.upsert({
      where: { name: 'walmart' },
      update: {},
      create: {
        name: 'walmart',
        displayName: 'Walmart',
        url: 'https://www.walmart.com',
        logoUrl: 'https://logo.clearbit.com/walmart.com',
        isActive: false,
      },
    });

    // Create some sample Pokemon Center products
    const sampleProducts = [
      {
        name: 'Pokémon Trading Card Game Battle Academy',
        sku: 'POK80922',
        url: 'https://www.pokemoncenter.com/product/290-80922/pokemon-trading-card-game-battle-academy',
        category: 'TCG',
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/trading-card-game/series/swsh12/swsh12-booster-169.png',
      },
      {
        name: 'Pokémon TCG: Crown Zenith Elite Trainer Box',
        sku: 'POK15233',
        url: 'https://www.pokemoncenter.com/product/715-15233/pokemon-tcg-crown-zenith-elite-trainer-box',
        category: 'TCG',
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/trading-card-game/series/swsh12/swsh12-elite-trainer-box.png',
      },
      {
        name: 'Pokémon TCG: Paldea Evolved Booster Pack',
        sku: 'POK15401',
        url: 'https://www.pokemoncenter.com/product/715-15401/pokemon-tcg-paldea-evolved-booster-pack',
        category: 'TCG',
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/trading-card-game/series/sv02/sv02-booster-169.png',
      },
      {
        name: 'Pokémon TCG: Scarlet & Violet Ultra Premium Collection',
        sku: 'POK15500',
        url: 'https://www.pokemoncenter.com/product/715-15500/pokemon-tcg-scarlet-violet-ultra-premium-collection',
        category: 'TCG',
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/trading-card-game/series/sv01/sv01-ultra-premium-collection.png',
      },
    ];

    for (const productData of sampleProducts) {
      await prisma.product.upsert({
        where: { 
          sku_storeId: { 
            sku: productData.sku, 
            storeId: pokemonCenter.id 
          } 
        },
        update: {},
        create: {
          ...productData,
          storeId: pokemonCenter.id,
          currentStock: StockStatus.UNKNOWN,
        },
      });
    }

    console.log('Store data seeded successfully!');
    console.log(`Created stores: Pokemon Center, Best Buy, Target, Walmart`);
    console.log(`Created ${sampleProducts.length} sample Pokemon Center products`);

    return {
      stores: {
        pokemonCenter,
        bestBuy,
        target,
        walmart,
      },
      productCount: sampleProducts.length,
    };

  } catch (error) {
    console.error('Error seeding store data:', error);
    throw error;
  }
}

export async function seedTestAlert(userId: string) {
  try {
    console.log('Creating test alert...');

    // Get a sample product
    const product = await prisma.product.findFirst({
      where: {
        store: {
          name: 'pokemon_center'
        }
      }
    });

    if (!product) {
      throw new Error('No Pokemon Center products found. Run seedStoreData first.');
    }

    // Create a test alert
    const testAlert = await prisma.alert.create({
      data: {
        userId,
        productId: product.id,
        name: `Test Alert - ${product.name}`,
        stockConditions: [StockStatus.IN_STOCK, StockStatus.PREORDER],
        emailNotify: true,
        pushNotify: true,
        isActive: true,
      },
    });

    console.log('Test alert created successfully!');
    return testAlert;

  } catch (error) {
    console.error('Error creating test alert:', error);
    throw error;
  }
}

// Utility function to get store and product counts
export async function getStoreStats() {
  const stores = await prisma.store.count();
  const products = await prisma.product.count();
  const alerts = await prisma.alert.count();
  const users = await prisma.user.count();

  return {
    stores,
    products,
    alerts,
    users,
  };
}