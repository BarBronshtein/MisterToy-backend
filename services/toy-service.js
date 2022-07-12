const fs = require('fs');
const toys = require('../data/toy.json');
module.exports = {
  query,
  getById,
  remove,
  save,
};

function query(filterBy) {
  return _filter(filterBy);
}

function _filter({ txt = '', inStock, labels }) {
  let filteredToys = toys;
  inStock = JSON.parse(inStock);
  const regex = new RegExp(txt, 'i');
  // TODO: make it more efficent
  if (inStock) filteredToys = filteredToys.filter(toy => toy.inStock);
  filteredToys = filteredToys.filter(toy => regex.test(toy.name));
  if (labels?.length) {
    filteredToys = filteredToys.filter(toy =>
      toy.labels.some(label => labels.includes(label))
    );
  }
  return Promise.resolve(filteredToys);
}

function getById(toyId) {
  const toy = toys.find(toy => toy._id === toyId);
  return toy ? Promise.resolve(toy) : Promise.reject("Couldn't find toy");
}

function remove(toyId) {
  const idx = toys.findIndex(toy => toy._id === toyId);
  if (idx == -1) return Promise.reject('No such toy');

  toys.splice(idx, 1);
  return _savetoysToFile();
}

function save(toy) {
  if (!toy._id) {
    toy._id = _makeId();
    toys.push(toy);
  } else {
    const idx = toys.findIndex(oldtoy => oldtoy._id == toy._id);

    if (idx === -1) return Promise.reject('No such toy');

    toys[idx] = toy;
  }
  return _savetoysToFile().then(() => toy);
}

function _savetoysToFile() {
  return new Promise((resolve, reject) => {
    const content = JSON.stringify(toys, null, 2);
    fs.writeFile('./data/toy.json', content, err => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      resolve();
    });
  });
}

function _makeId(length = 5) {
  var txt = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}
