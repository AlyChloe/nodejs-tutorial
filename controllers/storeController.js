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
  const store = new Store(req.body);
  await store.save(); //will not move on until save has successfully happened
  res.redirect('/');
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
