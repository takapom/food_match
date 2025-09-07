import { NextRequest, NextResponse } from "next/server";
import { FOOD_CATEGORIES, type FoodCategory } from "../../../lib/constants";

// Mock data
const mockFoodItems = [
  {
    id: "1",
    name: "Sushi",
    description: "Fresh Japanese sushi with various fish",
    category: "Japanese",
    imageUrl: "/images/sushi.jpg",
    tags: ["seafood", "rice", "healthy"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Pizza Margherita",
    description: "Classic Italian pizza with tomato, mozzarella, and basil",
    category: "Italian",
    imageUrl: "/images/pizza.jpg",
    tags: ["cheese", "tomato", "vegetarian"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Pad Thai",
    description: "Traditional Thai stir-fried noodles",
    category: "Thai",
    imageUrl: "/images/pad-thai.jpg",
    tags: ["noodles", "peanuts", "shrimp"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let filteredItems = [...mockFoodItems];

    // Filter by category
    if (category && FOOD_CATEGORIES.includes(category as FoodCategory)) {
      filteredItems = filteredItems.filter(item => item.category === category);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json({
      items: filteredItems,
      total: filteredItems.length,
    });
  } catch (error) {
    console.error("Food list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, tags } = body;

    // Validate input
    if (!name || !description || !category) {
      return NextResponse.json(
        { error: "Name, description, and category are required" },
        { status: 400 }
      );
    }

    // Create new food item
    const newItem = {
      id: Date.now().toString(),
      name,
      description,
      category,
      imageUrl: "",
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        message: "Food item created successfully",
        item: newItem
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Food creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}