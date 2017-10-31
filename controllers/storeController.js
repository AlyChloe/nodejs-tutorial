const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter (req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false);
    }
  }
}

exports.homepage = (req, res) => {
  console.log('Chloe');
  res.render('index');
}

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  //check if there is a new filea
  if (!req.file) {
    next(); //skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
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

exports.editStore = async (req, res) => {
  // 1. Find the store given the ID
  const store = await Store.findOne({ _id: req.params.id });
  // 2. Confirm they are the owner of the store
  // TODO
  // 3. Render out the edit form so the user can update their store
  res.render('editStore', { title: `Edit ${store.name}`, store: store });
}

exports.updateStore = async (req, res) => {
  //set location data to be a point
  req.body.location.type = 'Point';
  // Find and update the store
  const store = await Store.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true } // return new store instead of old one
  ).exec(); // runs query

  // Redirect them and tell them it worked
  req.flash('success', `Successfully updated ${store.name}. <a href="/stores/${store.slug}">View store here</a>`);
  res.redirect(`/stores/${store._id}/edit`);
}
