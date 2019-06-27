const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const ALGOLIA_INDEX_NAME = 'items';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

const admin = require('firebase-admin');
admin.initializeApp();

exports.onItemsCreated = functions.firestore.document('items/{itemId}').onCreate((snap, context) => {
  // Get the note document
  const item = snap.data();

  // Add an 'objectID' field which Algolia requires
  item.objectID = context.params.itemId;

  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  return index.addObject(item);
});

exports.onItemsUpdated = functions.firestore.document('items/{itemId}').onUpdate((change, context) => {
  // Get the note document
  const item = change.after.data();
  const itemOldID = change.before.data().objectID;

  item.objectID = itemOldID;

  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  return index.saveObject(item);
});

exports.onItemsDelete = functions.firestore.document('items/{itemId}').onDelete((snap, context) => {
  // Get the note document
  const item = snap.data();

  const itemID = item.objectID;
  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME);
  return index.deleteObject(itemID);
});
