import React from "react";
import Categories from "@/components/Categories";
import { fetchCategories } from "@/lib/functions";

const Home = async () => {
  const response = await fetchCategories();
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
