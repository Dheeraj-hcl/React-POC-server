const { DataStore } = require('notarealdb');

const store = new DataStore('./data');

module.exports = {
   users: store.collection('users'),
   products: store.collection('products')
};