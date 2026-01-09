import mongoose from "mongoose";

/******************** DB connection ********************/
const MONGO_URL = "mongodb+srv://user:password@cluster.mongodb.net/libraryDB";

export async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB error:", err);
    }
}

/******************** DB specific middleware and functions ********************/
// Conversion of Mongo _id to id in the res.json for the APIs
export function mongoResponseIdMiddleware(req, res, next) {
    const originalJson = res.json.bind(res);

    res.json = (data) => {
        const normalized = normalizeIdsDeep(data);
        return originalJson(normalized);
    };

    next();
}

function isPlainObject(v) {
    return v && typeof v === "object" && v.constructor === Object;
}


// Conversion of ObjectId to string and replacing _id to id (if doesn't exist)
function normalizeIdsDeep(value) {
    if (value == null) return value;

    if (value?.toObject && typeof value.toObject === "function") {
        return normalizeIdsDeep(value.toObject());
    }

    if (Array.isArray(value)) {
        return value.map(normalizeIdsDeep);
    }

    if (isPlainObject(value)) {
        const out = {};
        for (const [k, v] of Object.entries(value)) {
            if (k === "_id") {
                if (out.id === undefined) out.id = v?.toString?.() ?? v;
                continue;
            }
            out[k] = normalizeIdsDeep(v);
        }
        return out;
    }

    return value;
}

export function normalizeMongoId(entity) {
    if (!entity) return null;

    const _id = entity._id;
    const id = _id?.toString?.() ?? _id;

    // Convert document to object
    const base = entity.toObject ? entity.toObject() : entity;

    // return object with id instead of _id
    const { _id: removed, ...rest } = base;
    return { id, ...rest };
}

