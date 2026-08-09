require("dotenv").config();

const neo4j = require("neo4j-driver");

const repositories = require("./data/repositories");
const services = require("./data/services");
const packages = require("./data/packages");

const driver = neo4j.driver(
  process.env.COGNODB_URI,
  neo4j.auth.basic(process.env.COGNODB_USERNAME, process.env.COGNODB_PASSWORD),
);

async function seedDatabase() {
  const session = driver.session();

  try {
    console.log("🌱 Starting database seed...");

    // --------------------------------------------------
    // 1. Clear existing database
    // --------------------------------------------------

    await session.run(`
            MATCH (n)
            DETACH DELETE n
        `);

    console.log("✓ Existing graph cleared");

    // --------------------------------------------------
    // 2. Create repositories
    // --------------------------------------------------

    await session.run(
      `
            UNWIND $repositories AS repo

            CREATE (r:Repository {
                name: repo.name,
                githubUrl: repo.githubUrl,
                owner: repo.owner
            })
            `,
      { repositories },
    );

    console.log(`✓ Created ${repositories.length} repositories`);

    // --------------------------------------------------
    // 3. Create services
    // --------------------------------------------------

    await session.run(
      `
            UNWIND $services AS service

            CREATE (s:Service {
                name: service.name,
                language: service.language,
                team: service.team
            })
            `,
      { services },
    );

    console.log(`✓ Created ${services.length} services`);

    // --------------------------------------------------
    // 4. Connect services to repositories
    // --------------------------------------------------

    await session.run(
      `
            UNWIND $services AS service

            MATCH (s:Service {
                name: service.name
            })

            MATCH (r:Repository {
                name: service.repository
            })

            CREATE (r)-[:CONTAINS]->(s)
            `,
      { services },
    );

    console.log("✓ Connected services to repositories");

    // --------------------------------------------------
    // 5. Create packages
    // --------------------------------------------------

    await session.run(
      `
            UNWIND $packages AS pkg

            CREATE (p:Package {
                name: pkg.name,
                version: pkg.version,
                ecosystem: pkg.ecosystem,
                description: pkg.description
            })
            `,
      { packages },
    );

    console.log(`✓ Created ${packages.length} packages`);

    // --------------------------------------------------
    // 6. Service -> Package relationships
    // --------------------------------------------------

    const servicePackages = [
      // API Gateway
      { service: "api-gateway", package: "express" },
      { service: "api-gateway", package: "axios" },
      { service: "api-gateway", package: "winston" },

      // Authentication
      { service: "auth-service", package: "express" },
      { service: "auth-service", package: "jsonwebtoken" },
      { service: "auth-service", package: "bcrypt" },
      { service: "auth-service", package: "redis" },

      // User
      { service: "user-service", package: "express" },
      { service: "user-service", package: "mongoose" },
      { service: "user-service", package: "axios" },

      // Profile
      { service: "profile-service", package: "express" },
      { service: "profile-service", package: "mongoose" },
      { service: "profile-service", package: "joi" },

      // Catalog
      { service: "catalog-service", package: "pg" },
      { service: "catalog-service", package: "express" },

      // Search
      { service: "search-service", package: "express" },
      { service: "search-service", package: "elasticsearch" },
      { service: "search-service", package: "axios" },

      // Cart
      { service: "cart-service", package: "express" },
      { service: "cart-service", package: "redis" },

      // Checkout
      { service: "checkout-service", package: "express" },
      { service: "checkout-service", package: "redis" },
      { service: "checkout-service", package: "axios" },

      // Orders
      { service: "order-service", package: "pg" },
      { service: "order-service", package: "kafkajs" },

      // Payments
      { service: "payment-service", package: "express" },
      { service: "payment-service", package: "stripe" },
      { service: "payment-service", package: "redis" },

      // Fraud
      { service: "fraud-service", package: "axios" },
      { service: "fraud-service", package: "kafkajs" },

      // Inventory
      { service: "inventory-service", package: "axios" },
      { service: "inventory-service", package: "pg" },

      // Shipping
      { service: "shipping-service", package: "axios" },
      { service: "shipping-service", package: "kafkajs" },

      // Notifications
      { service: "notification-service", package: "nodemailer" },
      { service: "notification-service", package: "twilio" },

      // Analytics
      { service: "analytics-service", package: "kafkajs" },
      { service: "analytics-service", package: "prom-client" },
    ];

    await session.run(
      `
            UNWIND $dependencies AS dependency

            MATCH (s:Service {
                name: dependency.service
            })

            MATCH (p:Package {
                name: dependency.package
            })

            CREATE (s)-[:USES]->(p)
            `,
      {
        dependencies: servicePackages,
      },
    );

    console.log("✓ Connected services to packages");

    // --------------------------------------------------
    // 7. Service -> Service dependencies
    // --------------------------------------------------

    const serviceDependencies = [
      // Entry point
      {
        source: "api-gateway",
        target: "auth-service",
      },
      {
        source: "api-gateway",
        target: "user-service",
      },
      {
        source: "api-gateway",
        target: "catalog-service",
      },
      {
        source: "api-gateway",
        target: "search-service",
      },
      {
        source: "api-gateway",
        target: "cart-service",
      },
      {
        source: "api-gateway",
        target: "checkout-service",
      },

      // Identity
      {
        source: "user-service",
        target: "profile-service",
      },

      // Commerce
      {
        source: "catalog-service",
        target: "inventory-service",
      },
      {
        source: "search-service",
        target: "catalog-service",
      },
      {
        source: "cart-service",
        target: "user-service",
      },
      {
        source: "cart-service",
        target: "catalog-service",
      },
      {
        source: "checkout-service",
        target: "cart-service",
      },
      {
        source: "checkout-service",
        target: "user-service",
      },
      {
        source: "checkout-service",
        target: "payment-service",
      },

      // Orders
      {
        source: "order-service",
        target: "payment-service",
      },
      {
        source: "order-service",
        target: "inventory-service",
      },

      // Payments
      {
        source: "payment-service",
        target: "fraud-service",
      },

      // Inventory
      {
        source: "inventory-service",
        target: "shipping-service",
      },

      // Shipping
      {
        source: "shipping-service",
        target: "notification-service",
      },

      // Notifications
      {
        source: "notification-service",
        target: "analytics-service",
      },

      // Analytics
      {
        source: "analytics-service",
        target: "user-service",
      },

      // Additional business flows
      {
        source: "checkout-service",
        target: "order-service",
      },
      {
        source: "catalog-service",
        target: "search-service",
      },
    ];

    await session.run(
      `
            UNWIND $dependencies AS dependency

            MATCH (source:Service {
                name: dependency.source
            })

            MATCH (target:Service {
                name: dependency.target
            })

            CREATE (source)-[:DEPENDS_ON]->(target)
            `,
      {
        dependencies: serviceDependencies,
      },
    );

    console.log("✓ Created service dependencies");

    // --------------------------------------------------
    // 8. Package -> Package dependencies
    // --------------------------------------------------

    const packageDependencies = [
      {
        source: "express",
        target: "axios",
      },
      {
        source: "express",
        target: "winston",
      },
      {
        source: "express",
        target: "joi",
      },
      {
        source: "jsonwebtoken",
        target: "express",
      },
      {
        source: "bcrypt",
        target: "express",
      },
      {
        source: "redis",
        target: "axios",
      },
      {
        source: "stripe",
        target: "axios",
      },
      {
        source: "mongoose",
        target: "axios",
      },
      {
        source: "pg",
        target: "axios",
      },
      {
        source: "kafkajs",
        target: "axios",
      },
      {
        source: "elasticsearch",
        target: "axios",
      },
      {
        source: "nodemailer",
        target: "axios",
      },
      {
        source: "twilio",
        target: "axios",
      },
      {
        source: "prom-client",
        target: "winston",
      },
    ];

    await session.run(
      `
            UNWIND $dependencies AS dependency

            MATCH (source:Package {
                name: dependency.source
            })

            MATCH (target:Package {
                name: dependency.target
            })

            CREATE (source)-[:DEPENDS_ON]->(target)
            `,
      {
        dependencies: packageDependencies,
      },
    );

    console.log("✓ Created package dependencies");

    console.log("\n🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Failed to seed database:");
    console.error(error);

    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();

    console.log("Database connection closed.");
  }
}

seedDatabase();
