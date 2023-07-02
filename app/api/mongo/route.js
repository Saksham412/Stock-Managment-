import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
    
    // Replace the uri string with your connection string.
const uri = "mongodb+srv://saksham@cluster0.qsouvff.mongodb.net/";
const client = new MongoClient(uri);
    try {
        const database = client.db('saksham');
        const movies = database.collection('inventory');
        
        // Query for a movie that has the title 'Back to the Future'
        const query = { };
        const movie = await movies.findOne(query);
        
        console.log(movie);
        return NextResponse.json({"s":45, movie})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
