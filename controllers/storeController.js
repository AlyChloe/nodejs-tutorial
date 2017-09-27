const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homepage = (req, res) => {
  console.log('Chloe');
  res.render('index');
}

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
}

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save(); // having await on same line lets us use store.slug
  await store.save(); //will not move on until save has successfully happened
  req.flash('success', `Successfully created ${store.name}. Care to leave review?`);
  res.redirect(`/store/${store.slug}`);
  // for errors, we created catchErrors() - handler which will catch them for us
     /*.then(store => {
	return Store.find(); //return all of the stores: in a list
     }) //.then() means you're using a promise
     .then(stores => { //you can keep chaining as long as .then() is returning a promise
	res.render('storeList', { stores: stores });
     })
     .catch(err => {
	throw Error(err);
     });*/
}

exports.getStores = async (req, res) => {
  // 1. Query the database for a list of all stores
  const stores = await Store.find();
  console.log(stores);
  res.render('stores', { title: 'Stores', stores: stores });
}
