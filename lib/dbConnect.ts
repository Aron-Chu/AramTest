// lib/dbConnect.ts
import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI || ''

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env')
}

/**
 * Cached connection object for Mongoose, so we don't re-initialize
 * a connection every time an API route is called.
 */
let cached = global.mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

/**
 * Connect to the MongoDB database via Mongoose
 * @returns a Mongoose connection
 */
export default async function dbConnect() {
  if (cached.conn) {
    // If we already have a connection, use it
    return cached.conn
  }
  
  if (!cached.promise) {
    // Otherwise, create a new connection
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseConn) => {
      return mongooseConn
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
