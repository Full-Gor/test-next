import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      isAdmin: true
    }
  })
  console.log('Admin user created:', admin.username)

  // Create categories
  const categoriesData = [
    { name: 'Électronique', description: 'Smartphones, ordinateurs, accessoires et plus' },
    { name: 'Vêtements', description: 'Mode homme, femme et enfant' },
    { name: 'Maison & Jardin', description: 'Décoration, meubles et outils de jardinage' },
    { name: 'Sports & Loisirs', description: 'Équipements sportifs et activités de plein air' },
    { name: 'Livres & Médias', description: 'Livres, films, musique et jeux vidéo' }
  ]

  const categories = await Promise.all(
    categoriesData.map(cat =>
      prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: cat
      })
    )
  )
  console.log('Categories created:', categories.length)

  // Create 30 products
  const productsData = [
    // Électronique (6 products)
    { name: 'Smartphone Galaxy Pro', description: 'Smartphone dernière génération avec écran AMOLED 6.5"', price: 899.99, stock: 15, categoryName: 'Électronique' },
    { name: 'Laptop UltraBook 15"', description: 'Ordinateur portable performant pour le travail et le gaming', price: 1299.99, stock: 8, categoryName: 'Électronique' },
    { name: 'Écouteurs Bluetooth Premium', description: 'Écouteurs sans fil avec réduction de bruit active', price: 149.99, stock: 25, categoryName: 'Électronique' },
    { name: 'Tablette 10 pouces', description: 'Tablette légère idéale pour le divertissement', price: 349.99, stock: 12, categoryName: 'Électronique' },
    { name: 'Montre connectée Sport', description: 'Suivi fitness, GPS et notifications', price: 199.99, stock: 20, categoryName: 'Électronique' },
    { name: 'Enceinte Bluetooth portable', description: 'Son puissant et étanche IPX7', price: 79.99, stock: 30, categoryName: 'Électronique' },

    // Vêtements (6 products)
    { name: 'Jean slim homme', description: 'Jean confortable coupe moderne', price: 59.99, stock: 40, categoryName: 'Vêtements' },
    { name: 'Robe d\'été femme', description: 'Robe légère à motifs floraux', price: 45.99, stock: 25, categoryName: 'Vêtements' },
    { name: 'Veste en cuir', description: 'Veste en cuir véritable style biker', price: 189.99, stock: 10, categoryName: 'Vêtements' },
    { name: 'T-shirt basique pack de 3', description: 'T-shirts en coton bio, différentes couleurs', price: 29.99, stock: 50, categoryName: 'Vêtements' },
    { name: 'Sneakers urbaines', description: 'Baskets tendance confortables', price: 89.99, stock: 35, categoryName: 'Vêtements' },
    { name: 'Pull en laine mérinos', description: 'Pull chaud et doux pour l\'hiver', price: 79.99, stock: 20, categoryName: 'Vêtements' },

    // Maison & Jardin (6 products)
    { name: 'Lampe de bureau LED', description: 'Lampe avec variateur et port USB', price: 39.99, stock: 30, categoryName: 'Maison & Jardin' },
    { name: 'Ensemble de casseroles', description: 'Set de 5 casseroles antiadhésives', price: 129.99, stock: 15, categoryName: 'Maison & Jardin' },
    { name: 'Aspirateur robot', description: 'Aspirateur autonome avec capteurs intelligents', price: 299.99, stock: 8, categoryName: 'Maison & Jardin' },
    { name: 'Tondeuse à gazon électrique', description: 'Tondeuse légère et silencieuse', price: 149.99, stock: 12, categoryName: 'Maison & Jardin' },
    { name: 'Set d\'outils de jardinage', description: '15 outils essentiels pour le jardin', price: 49.99, stock: 25, categoryName: 'Maison & Jardin' },
    { name: 'Coussin décoratif', description: 'Coussin en velours 45x45cm', price: 24.99, stock: 40, categoryName: 'Maison & Jardin' },

    // Sports & Loisirs (6 products)
    { name: 'Vélo VTT adulte', description: 'VTT 21 vitesses tout terrain', price: 349.99, stock: 6, categoryName: 'Sports & Loisirs' },
    { name: 'Tapis de yoga premium', description: 'Tapis antidérapant 6mm d\'épaisseur', price: 34.99, stock: 35, categoryName: 'Sports & Loisirs' },
    { name: 'Haltères réglables', description: 'Set d\'haltères 2-24kg', price: 199.99, stock: 10, categoryName: 'Sports & Loisirs' },
    { name: 'Tente de camping 4 places', description: 'Tente imperméable montage rapide', price: 129.99, stock: 12, categoryName: 'Sports & Loisirs' },
    { name: 'Raquette de tennis', description: 'Raquette graphite pour niveau intermédiaire', price: 79.99, stock: 20, categoryName: 'Sports & Loisirs' },
    { name: 'Ballon de football officiel', description: 'Ballon taille 5 FIFA approved', price: 29.99, stock: 30, categoryName: 'Sports & Loisirs' },

    // Livres & Médias (6 products)
    { name: 'Coffret Harry Potter', description: 'Collection complète des 7 livres', price: 69.99, stock: 20, categoryName: 'Livres & Médias' },
    { name: 'Console de jeux portable', description: 'Console rétro avec 500 jeux inclus', price: 49.99, stock: 25, categoryName: 'Livres & Médias' },
    { name: 'Vinyle collector Beatles', description: 'Album Abbey Road édition limitée', price: 39.99, stock: 10, categoryName: 'Livres & Médias' },
    { name: 'Coffret DVD Marvel', description: '23 films de l\'univers Marvel', price: 149.99, stock: 8, categoryName: 'Livres & Médias' },
    { name: 'Livre de cuisine française', description: '200 recettes traditionnelles illustrées', price: 34.99, stock: 30, categoryName: 'Livres & Médias' },
    { name: 'Jeu de société stratégie', description: 'Jeu de plateau pour 2-6 joueurs', price: 44.99, stock: 18, categoryName: 'Livres & Médias' }
  ]

  for (const product of productsData) {
    const category = categories.find(c => c.name === product.categoryName)
    if (category) {
      await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: category.id
        }
      })
    }
  }
  console.log('Products created:', productsData.length)

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
