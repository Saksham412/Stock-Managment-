import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";


export async function POST(request) {
    
    let {action,slug,initialValue} = await request.json()
    const uri = "mongodb+srv://mongodb:N5cK1tOz2Yzb8QuF@cluster0.nvw587a.mongodb.net/";
    const client = new MongoClient(uri);
    try {
        const database = client.db('inventory');
        const inventory = database.collection('stock');
        // create a filter for a movie to update
        const filter = { slug: slug };
        let newQuantity = action=="plus"?(parseInt(initialValue)+1):(parseInt(initialValue)-1)
        // create a document that sets the plot of the movie
        const updateDoc = {
          $set: {
            quantity: newQuantity
          },
        };
        const result = await inventory.updateOne(filter, updateDoc, {});
        
        return NextResponse.json({ success:true, message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)` })
      } finally {
        await client.close();
      }
}
    