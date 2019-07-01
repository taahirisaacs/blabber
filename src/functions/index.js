const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const ALGOLIA_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const ALGOLIA_INDEX_NAME = 'items';
const ALGOLIA_INDEX_NAME_STORES = 'stores';
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
  const item = change.after.data().objectID;

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

exports.onstoresCreated = functions.firestore.document('stores/{storeId}').onCreate((snap, context) => {
  // Get the note document
  const store = snap.data();

  // Add an 'objectID' field which Algolia requires
  store.objectID = context.params.storeId;

  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME_STORES);
  return index.addObject(store);
});

exports.onstoresUpdated = functions.firestore.document('stores/{storeId}').onUpdate((change, context) => {
  // Get the note document
  const storeID = change.after.data().objectID;

  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME_STORES);
  return index.saveObject(storeID);
});

exports.onstoresDelete = functions.firestore.document('stores/{storeId}').onDelete((snap, context) => {
  // Get the note document
  const store = snap.data();

  const storeID = store.objectID;
  // Write to the algolia index
  const index = client.initIndex(ALGOLIA_INDEX_NAME_STORES);
  return index.deleteObject(storeID);
});

exports.onUserAdd = functions.firestore.document('users/{userId}').onCreate((snap, context) => {
  let collectionRef = admin.firestore().collection('stores');
  const userData = snap.data();

  const name = userData.store.name;
  const category = userData.store.category;
  const location = userData.store.location;
  const whatsapp = userData.store.whatsapp;
  const user = snap.id;
  const imgUrl = userData.profileUrl;

  return collectionRef.add({
    name,
    category,
    location,
    whatsapp,
    user,
    imgUrl
  });

});
