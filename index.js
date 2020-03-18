const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');
const firebase = require('firebase');

// load values from the .env file in this directory into process.env
dotenv.config();

// configure firebase
const config = {
    apiKey: "AIzaSyBGEMdMSXpacfFH5AaOn8eDA2-58zi6ciw",
    authDomain: "svibe-4ed1c.firebaseapp.com",
    databaseURL: "https://svibe-4ed1c.firebaseio.com",
    projectId: "svibe-4ed1c",
    storageBucket: "",
    messagingSenderId: "830705986621",
    appId: "1:830705986621:web:9ee1b64075c310c2"
  };
  firebase.initializeApp(config);
const database = firebase.firestore();

// configure algolia
const algolia = algoliasearch(
    "3Q7RE1XCOS",
    "94e8fefaafe6fe5f311181df957b29bc"
);
const index = algolia.initIndex('keywords');

const keywordRef = database.collection('keywords');
keywordRef.onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        addOrUpdateIndexRecord(change.doc);
      }
      if (change.type === 'modified') {
        addOrUpdateIndexRecord(change.doc);
      }
      if (change.type === 'removed') {
        deleteIndexRecord(change.doc);
      }
    });
  });

function addOrUpdateIndexRecord(keyword) {
  // Get Firebase object
  const record = keyword.data();
  // Specify Algolia's objectID using the Firebase object key
  record.objectID = keyword.id;
  // Add or update object
  index
    .saveObject(record)
    .then(() => {
      console.log('Firebase object indexed in Algolia', record.objectID);
    })
    .catch(error => {
      console.error('Error when indexing contact into Algolia', error);
      process.exit(1);
    });
}

function deleteIndexRecord({id}) {
  // Get Algolia's objectID from the Firebase object key
  const objectID = id;
  // Remove the object from Algolia
  index
    .deleteObject(objectID)
    .then(() => {
      console.log('Firebase object deleted from Algolia', objectID);
    })
    .catch(error => {
      console.error('Error when deleting contact from Algolia', error);
      process.exit(1);
    });
}
