const dbService = require('../../services/db-service');
const logger = require('../../services/logger-service');
const ObjectId = require('mongodb').ObjectId;

async function query(filterBy) {
  try {
    const criteria = _buildCriteria(filterBy);

    const collection = await dbService.getCollection('toy');
    const toys = await collection.find(criteria).toArray();
    return toys;
  } catch (err) {
    logger.error('cannot find toys', err);
    throw err;
  }
}

async function getById(toyId) {
  try {
    const collection = await dbService.getCollection('toy');
    const toy = collection.findOne({ _id: ObjectId(toyId) });
    return toy;
  } catch (err) {
    logger.error(`while finding toy ${toyId}`, err);
    throw err;
  }
}

async function remove(toyId) {
  try {
    const collection = await dbService.getCollection('toy');
    await collection.deleteOne({ _id: ObjectId(toyId) });
    return toyId;
  } catch (err) {
    logger.error(`cannot remove toy ${toyId}`, err);
    throw err;
  }
}

async function add(toy) {
  try {
    const collection = await dbService.getCollection('toy');
    const { insertedId } = await collection.insertOne(toy);
    // Maybe toy id will return an object and not a string id
    toy._id = insertedId;
    return toy;
  } catch (err) {
    logger.error('cannot insert toy', err);
    throw err;
  }
}
async function update(toy) {
  try {
    const id = ObjectId(toy._id);
    delete toy._id;
    const collection = await dbService.getCollection('toy');
    await collection.updateOne({ _id: id }, { $set: { ...toy } });
    return toy;
  } catch (err) {
    logger.error(`cannot update toy ${toyId}`, err);
    throw err;
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
};

function _buildCriteria(filterBy = { minPrice: 0 }) {
  const criteria = {};
  if (filterBy.minPrice) {
    criteria.price = { $gte: filterBy.minPrice };
  }
  return criteria;
}
