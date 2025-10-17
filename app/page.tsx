import React from "react";
import { db } from "@/db";
import { categories } from "@/src/schema";
import Categories from "@/components/Categories";

const Home = async () => {
  const response = await db.select().from(categories);
  console.log(response);
  return (
    <div>
      Home
      <Categories
        categories={response.map((cat) => ({
          ...cat,
          createdAt: cat.createdAt.toISOString(),
        }))}
      />
    </div>
  );
};

export default Home;
