import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
const query = request.nextUrl.searchParams.get("query")
const uri = "mongodb+srv://mongodb:N5cK1tOz2Yzb8QuF@cluster0.nvw587a.mongodb.net/";
const client = new MongoClient(uri);
    try {
        const database = client.db('inventory');
        const inventory = database.collection('stock');
        
        // Query for a item that has the title 'Back to the Future'
        const products = await inventory.aggregate([
            {
              $match: {
                $or: [
                  { slug: { $regex: query, $options: "i" } }, 
                  { quantity: { $regex: query, $options: "i" } },
                  { price: { $regex: query, $options: "i" } }
                ]
              }
            }
          ]).toArray()
        return NextResponse.json({ success:true, products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
