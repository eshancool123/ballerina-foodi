import ballerina/http;
import ballerina/io;
import ballerinax/mongodb;

type User record {
    string name;
    string email;
    string password;
    string user_image;
};

// Define the Album record for frontend interaction (Sign-Up Request)
type Album readonly & record {
    string username;
    string email;
    string password;
    string confirm_password;
    string user_image_url; 
};



// Define the LoginRequest type for user sign-in (Login Request)
type LoginRequest record {
    string username;
    string password;
};

// Define a record type for the MongoDB document (Location)
type Location record {|
    // We'll convert ObjectId to string
    string _id ;
    string uid;
    string user;
    string name;
    string location;
    string description;
    string[] types;
    string[] city;
    string[] images;
    string[] mapData;
|};

//post add location data

type LocationData record {

    string uid ;
    string user;
    string name;
    string location;
    string description;
    string[] types;
    string[] city;
    string[] images;
    string[] mapData;
};

type AlbumDelete record {|
    string username;
|};

type LocationDelete record {|
    string id;
|};

// MongoDB client setup
mongodb:Client mongoClient = checkpanic new (connection = "mongodb+srv://eshansenadhi5:ZI5M2LA6bRfR3N3X@cluster0.aqe7n.mongodb.net/?retryWrites=true&w=majority");

// CORS configuration for frontend-backend communication
@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:5173"],
        allowCredentials: true,
        allowHeaders: ["Content-Type", "Authorization"],
        exposeHeaders: ["X-CUSTOM-HEADER"],
        maxAge: 3600
    }
}
service /crossOriginService on new http:Listener(9100) {

    //Add location 
    resource function post AddLocations(http:Caller caller, http:Request req) returns error? {
        // Get the JSON payload from the request
        json requestBody = check req.getJsonPayload();

        // Convert JSON payload to LocationData type
        LocationData locationData = check requestBody.cloneWithType(LocationData);

        // Log the incoming request for debugging
        io:println("Received location data for user: ", locationData.user);

        // Access MongoDB database and collection
        mongodb:Database locationDb = check mongoClient->getDatabase("Location");
        mongodb:Collection locationsCollection = check locationDb->getCollection("Locations");

        // Attempt to insert the location data and handle any errors
        error? result = locationsCollection->insertOne(locationData);
        if (result is error) {
            // Log the error
            io:println("Error adding location: ", result.message());

            // Send an error response to the client
            json errorResponse = {"status": "error", "message": "Failed to add location"};
            check caller->respond(errorResponse);
            return;
        }

        // Log success
        io:println("Location added successfully to MongoDB for user: ", locationData.user);

        // Send a success response to the client
        json successResponse = {"status": "success", "message": "Location added successfully"};
        check caller->respond(successResponse);
    }

    // GET locations
    resource function get location(http:Request req) returns http:Response|error {
    // Access MongoDB database and collection
    mongodb:Database locationDb = checkpanic mongoClient->getDatabase("Location");
    mongodb:Collection locationsCollection = checkpanic locationDb->getCollection("Locations");

    // Fetch all documents from the collection
    stream<record {}, error?> locationsStream = checkpanic locationsCollection->find({});

    Location[] locations = [];

    // Iterate through the stream and collect location data
    error? e = from record {} doc in locationsStream
        do {
            // Safely retrieve and cast each field

            // Safely convert `_id` to string
            string _id = doc["_id"].toString(); 

            string uid = doc["uid"] is string ? <string>doc["uid"] : "Unknown";
            string user = doc["user"] is string ? <string>doc["user"] : "Unknown";
            string name = doc["name"] is string ? <string>doc["name"] : "Unknown";
            string location = doc["location"] is string ? <string>doc["location"] : "Unknown";
            string description = doc["description"] is string ? <string>doc["description"] : "No description";

            // Safely retrieve and convert types array
            string[] typesArray = [];
            if doc["types"] is anydata[] {
                foreach var t in <anydata[]>doc["types"] {
                    if t is string {
                        typesArray.push(t);
                    }
                }
            }

            // Safely retrieve and convert city array
            string[] cityArray = [];
            if doc["city"] is anydata[] {
                foreach var c in <anydata[]>doc["city"] {
                    if c is string {
                        cityArray.push(c);
                    }
                }
            }

            // Safely retrieve and convert images array
            string[] imagesArray = [];
            if doc["images"] is anydata[] {
                foreach var img in <anydata[]>doc["images"] {
                    if img is string {
                        imagesArray.push(img);
                    }
                }
            }

            // Safely retrieve and convert mapData array (float)
            string[] mapDataArray = [];
            if doc["mapData"] is anydata[] {
                foreach var m in <anydata[]>doc["mapData"] {
                    if m is string {
                        mapDataArray.push(m);
                    }
                }
            }

            // Create the Location record
            Location locationRecord = {
                _id: _id,
                uid:uid,
                user: user,
                name: name,
                location: location,
                description: description,
                types: typesArray,
                city: cityArray,
                images: imagesArray,
                mapData: mapDataArray  // Corrected to ensure mapData floats
            };

            // Log each location fetched for debugging
            io:println("Fetched location: ", locationRecord);
            locations.push(locationRecord);
        };

    if e is error {
        // Log the error if any occurs during iteration
        io:println("Error while processing locations stream: ", e);
        http:Response errorResponse = new;
        errorResponse.statusCode = 500;
        errorResponse.setJsonPayload({"message": "Error retrieving locations"});
        return errorResponse;
    }

    // Log the final array of locations before sending the response
    io:println("Final locations array: ", locations);

    // Create a response to send back to the client
    http:Response response = new;

    if locations.length() > 0 {
        // Ensure we have data before responding
        response.setJsonPayload(locations);
    } else {
        // Handle the case where there are no locations
        response.setJsonPayload({"message": "No locations found"});
    }

    return response;
}



    // POST method for user sign-in
    resource function post signin(LoginRequest loginRequest) returns boolean|error {
        // Access MongoDB database and collection
        mongodb:Database userDb = check mongoClient->getDatabase("user");
        mongodb:Collection usersCollection = check userDb->getCollection("users");

        // Create the BSON filter to search by username
        map<string> filter = {"name": loginRequest.username};

        // Find the user in the MongoDB collection by username
        User? user = check usersCollection->findOne(filter, {});

        if user is () {
            // Return false if no user is found with the given username
            io:println("User not found in MongoDB");
            return false;
        }

        // Compare the provided password with the one stored in the database
        if user.password == loginRequest.password {
            io:println("Password match successful");
            return true;
        } else {
            io:println("Password mismatch");
            return false;
        }
    }

    // POST method for user sign-up (add a new album/user record to MongoDB)
    resource function post signup(Album album) returns Album|error {
        // Connect to the MongoDB database
        mongodb:Database userDb = check mongoClient->getDatabase("user");
        mongodb:Collection usersCollection = check userDb->getCollection("users");

        // Check if the username already exists
        map<string> filter = {"name": album.username};
        User? existingUser = check usersCollection->findOne(filter, {});

        if existingUser is User {
            // If the user exists, return an error indicating that the username is not unique
            return error("Username already exists");
        }

        // Proceed to insert the new user if the username is unique
        User user = {
            name: album.username,
            email: album.email,
            password: album.password,
            user_image:album.user_image_url
        };

        // Insert the document (user record) into the MongoDB collection
        checkpanic usersCollection->insertOne(user);

        io:println("User inserted successfully into MongoDB");

        // Return the inserted album as the response
        return album;
    }

    // POST method to update a user record in MongoDB
resource function post updateUser(Album album) returns Album|error {
    // Connect to the MongoDB database
    mongodb:Database userDb = check mongoClient->getDatabase("user");
    mongodb:Collection usersCollection = check userDb->getCollection("users");

    // Create the filter to find the existing user (e.g., using email as the unique identifier)
    map<json> filter = {
        "name": album.username
    };
// Create the update document using the mongodb:Update type
    mongodb:Update updateDoc = {
        "set": {
            "email": album.email,
            "password": album.password,
            "user_image": album.user_image_url
        }
    };

    // Update the user in the MongoDB collection and store the result
    mongodb:UpdateResult result = checkpanic usersCollection->updateOne(filter, updateDoc);

    // Log the result
    io:println("Matched count:", result.matchedCount);
    io:println("Modified count:", result.modifiedCount);

    io:println("User updated successfully in MongoDB");

    // Return the updated album as the response
    return album;
}

    resource function post deleteUser(AlbumDelete albumDelete) returns string|error {
        // Connect to the MongoDB database
        mongodb:Database userDb = check mongoClient->getDatabase("user");
        mongodb:Collection usersCollection = check userDb->getCollection("users");

        // Create the filter to find the user to delete (using 'username' as the identifier)
        map<json> filter = {
            "name": albumDelete.username
        };

        // Delete the user from the MongoDB collection
        mongodb:DeleteResult result = checkpanic usersCollection->deleteOne(filter);

        // Log the result
        io:println("Deleted count:", result.deletedCount);

        // Return a message indicating whether the user was deleted
        if result.deletedCount > 0 {
            return "User deleted successfully from MongoDB";
        } else {
            return "User not found";
        }
    }


    resource function post deleteLocation(LocationDelete locationDelete) returns string|error {
    // Connect to the MongoDB database
    mongodb:Database userDb = check mongoClient->getDatabase("Locations");
    mongodb:Collection usersCollection = check userDb->getCollection("Locations");

    // Create the filter to find the user to delete (using 'username' as the identifier)
    map<json> filter = {
        "uid": locationDelete.id
    };

    // Delete the user from the MongoDB collection
    mongodb:DeleteResult result = checkpanic usersCollection->deleteOne(filter);

    // Log the result
    io:println("Deleted count:", result.deletedCount);

    // Return a message indicating whether the user was deleted
    if result.deletedCount > 0 {
        return "Location deleted successfully from MongoDB";
    } else {
        return "Location not found";
    }
}
}

//mongodb:Client mongoClient = check new (connection = "mongodb+srv://eshansenadhi5:ZI5M2LA6bRfR3N3X@cluster0.aqe7n.mongodb.net/?retryWrites=true&w=majority");
