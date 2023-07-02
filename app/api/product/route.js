import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {

const uri = "mongodb+srv://mongodb:N5cK1tOz2Yzb8QuF@cluster0.nvw587a.mongodb.net/";
const client = new MongoClient(uri);
    try {
        const database = client.db('inventory');
        const inventory = database.collection('stock');
        
        // Query for a movie that has the title 'Back to the Future'
        const query = { };
        const products = await inventory.find(query).toArray();
        return NextResponse.json({ success:true, products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}



export async function POST(request) {
    
    let body = await request.json()
    console.log(body)
    const uri = "mongodb+srv://mongodb:N5cK1tOz2Yzb8QuF@cluster0.nvw587a.mongodb.net/";
    const client = new MongoClient(uri);
        try {
            const database = client.db('inventory');
            const inventory = database.collection('stock');
            const product = await inventory.insertOne(body)
            return NextResponse.json({product,ok:true})
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
}
    