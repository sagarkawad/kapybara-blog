import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { categories, posts, postCategories } from "./schema";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env.local");

// Predefined category data for more realistic content
const predefinedCategories = [
  {
    name: "Technology",
    description: "Latest trends in technology and programming",
    slug: "technology",
  },
  {
    name: "Web Development",
    description: "Frontend and backend development tutorials",
    slug: "web-development",
  },
  {
    name: "JavaScript",
    description: "Everything about JavaScript and its ecosystem",
    slug: "javascript",
  },
  {
    name: "React",
    description: "React tutorials, tips, and best practices",
    slug: "react",
  },
  {
    name: "Next.js",
    description: "Next.js framework guides and tutorials",
    slug: "nextjs",
  },
  {
    name: "TypeScript",
    description: "Type-safe JavaScript development",
    slug: "typescript",
  },
  {
    name: "Database",
    description: "Database design and optimization",
    slug: "database",
  },
  {
    name: "DevOps",
    description: "Deployment, CI/CD, and infrastructure",
    slug: "devops",
  },
  {
    name: "UI/UX",
    description: "User interface and experience design",
    slug: "ui-ux",
  },
  {
    name: "Tutorial",
    description: "Step-by-step learning guides",
    slug: "tutorial",
  },
];

// Sample blog content templates
const blogTemplates = [
  {
    title: "Getting Started with {tech}",
    content: `<h2>Introduction</h2><p>In this comprehensive guide, we'll explore the fundamentals of {tech} and how it can revolutionize your development workflow.</p><h2>Why {tech}?</h2><p>{tech} has gained significant popularity in the developer community due to its powerful features and ease of use. Let's dive into what makes it special.</p><h2>Key Features</h2><ul><li>Performance optimization</li><li>Developer experience</li><li>Community support</li><li>Extensive ecosystem</li></ul><h2>Getting Started</h2><p>To begin your journey with {tech}, you'll need to set up your development environment...</p><h2>Conclusion</h2><p>We've covered the basics of {tech} in this tutorial. Continue exploring the documentation and building amazing projects!</p>`,
  },
  {
    title: "Advanced {tech} Techniques",
    content: `<h2>Advanced Concepts</h2><p>Now that you're familiar with the basics, let's explore some advanced {tech} techniques that will take your skills to the next level.</p><h2>Performance Optimization</h2><p>One of the most important aspects of working with {tech} is understanding how to optimize performance...</p><h2>Best Practices</h2><ol><li>Follow established patterns</li><li>Write clean, maintainable code</li><li>Implement proper error handling</li><li>Use appropriate testing strategies</li></ol><h2>Real-world Examples</h2><p>Let's look at some practical examples of how these techniques are applied in production applications.</p>`,
  },
  {
    title: "Building a {project} with {tech}",
    content: `<h2>Project Overview</h2><p>In this tutorial, we'll build a complete {project} using {tech}. This hands-on approach will help you understand practical implementation.</p><h2>Prerequisites</h2><ul><li>Basic knowledge of {tech}</li><li>Development environment setup</li><li>Understanding of web fundamentals</li></ul><h2>Step-by-Step Implementation</h2><p>Let's start by setting up our project structure and implementing the core functionality...</p><h2>Adding Features</h2><p>Now we'll add advanced features to make our {project} more robust and user-friendly.</p><h2>Deployment</h2><p>Finally, we'll deploy our {project} to a production environment and discuss best practices for maintenance.</p>`,
  },
];

const authors = [
  "Alex Johnson",
  "Sarah Chen",
  "Michael Rodriguez",
  "Emily Davis",
  "David Kim",
  "Jessica Taylor",
  "Ryan Thompson",
  "Lisa Wang",
  "John Smith",
  "Maria Garcia",
  "Kevin Lee",
  "Amanda Wilson",
];

const technologies = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "tRPC",
  "Tailwind CSS",
  "Drizzle ORM",
  "Vercel",
  "Docker",
];

const projects = [
  "Blog Platform",
  "E-commerce Site",
  "Dashboard",
  "API Server",
  "Mobile App",
  "Portfolio Website",
  "Chat Application",
  "Task Manager",
];

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function generateBlogContent(template: (typeof blogTemplates)[0]): {
  title: string;
  content: string;
  slug: string;
} {
  const tech = faker.helpers.arrayElement(technologies);
  const project = faker.helpers.arrayElement(projects);

  const title = template.title
    .replace(/{tech}/g, tech)
    .replace(/{project}/g, project);
  const content = template.content
    .replace(/{tech}/g, tech)
    .replace(/{project}/g, project);
  const slug = createSlug(title);

  return { title, content, slug };
}

const main = async () => {
  console.log("🌱 Starting database seed...");

  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(client);

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🧹 Clearing existing data...");
    await db.delete(postCategories);
    await db.delete(posts);
    await db.delete(categories);

    // Seed Categories
    console.log("📁 Seeding categories...");
    const insertedCategories = await db
      .insert(categories)
      .values(predefinedCategories)
      .returning();
    console.log(`✅ Created ${insertedCategories.length} categories`);

    // Seed Blog Posts
    console.log("📝 Seeding blog posts...");
    const blogPosts: (typeof posts.$inferInsert)[] = [];

    for (let i = 0; i < 15; i++) {
      const template = faker.helpers.arrayElement(blogTemplates);
      const { title, content, slug } = generateBlogContent(template);
      const author = faker.helpers.arrayElement(authors);
      const published = faker.datatype.boolean(0.8); // 80% chance of being published

      // Ensure unique slug
      const uniqueSlug = `${slug}-${Date.now()}-${i}`;

      blogPosts.push({
        title,
        content,
        author,
        slug: uniqueSlug,
        published,
        createdAt: faker.date.between({
          from: new Date("2024-01-01"),
          to: new Date(),
        }),
        updatedAt: new Date(),
      });
    }

    const insertedPosts = await db.insert(posts).values(blogPosts).returning();
    console.log(`✅ Created ${insertedPosts.length} blog posts`);

    // Seed Post-Category Relationships
    console.log("🔗 Creating post-category relationships...");
    const postCategoryRelations: (typeof postCategories.$inferInsert)[] = [];

    for (const post of insertedPosts) {
      // Each post gets 1-3 random categories
      const numCategories = faker.number.int({ min: 1, max: 3 });
      const selectedCategories = faker.helpers.arrayElements(
        insertedCategories,
        numCategories
      );

      for (const category of selectedCategories) {
        postCategoryRelations.push({
          postId: post.id,
          categoryId: category.id,
        });
      }
    }

    await db.insert(postCategories).values(postCategoryRelations);
    console.log(
      `✅ Created ${postCategoryRelations.length} post-category relationships`
    );

    // Summary
    console.log("\n🎉 Seed completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   • ${insertedCategories.length} categories created`);
    console.log(`   • ${insertedPosts.length} blog posts created`);
    console.log(
      `   • ${postCategoryRelations.length} category relationships created`
    );
    console.log(
      `\n🚀 You can now start the development server with: npm run dev`
    );
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await client.end();
  }
};

main().catch((error) => {
  console.error("Fatal error during seeding:", error);
  process.exit(1);
});
