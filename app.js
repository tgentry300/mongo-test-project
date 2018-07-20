const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const url = 'mongodb://localhost:27017'

const dbName = 'myproject'

//connecting to mongo database
MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // client.close(); 

    insertDocuments(db, () => {
        findDocuments(db, () => {
            updateDocument(db, () => {
                removeDocument(db, () => {
                    indexCollection(db, () => {
                        client.close()
                    })
                })
            })
        })
    })

});


//inserting multiple documents
const insertDocuments = (db, callback) => {

    const collection = db.collection('documents')

    collection.insertMany(
        [{
            a: 1
        }, {
            a: 2
        }, {
            a: 3
        }],
        (err, result) => {
            assert.equal(err, null);
            assert.equal(3, result.result.n);
            assert.equal(3, result.ops.length);
            console.log("Inserted 3 documents into the collection");
            callback(result);
        })

}


//find documents
const findDocuments = (db, callback) => {

    const collection = db.collection('documents')

    collection.find({}).toArray((err, docs) => {
        assert.equal(err, null)
        console.log('found the following records: ' + docs)
        callback(docs)
    })
}


//update a document
const updateDocument = (db, callback) => {
    const collection = db.collection('documents')

    collection.updateOne({
        a: 2
    }, {
        $set: {
            b: 1
        }
    }, (err, result) => {
        assert.equal(err, null)
        assert.equal(1, result.result.n)
        console.log('updated the document with the field "a" equal to 2')
        callback(result)
    })
}



//remove a document
const removeDocument = (db, callback) => {
    const collection = db.collection('documents')

    collection.deleteOne({
        a: 3
    }, (err, result) => {
        assert.equal(err, null)
        assert.equal(1, result.result.n)
        console.log('removed the document with the field "a" equal to 3')
        console.log('result: ' + result)
        callback(result)
    })
}



//index a collection
const indexCollection = (db, callback) => {
    db.collection('documents').createIndex({
            'a': 1
        },
        null,
        (err, results) => {
            console.log(results)
            callback()
        }
    )
}