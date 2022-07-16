const dbService = require('../../services/db-service');
const logger = require('../../services/logger-service');
const ObjectId = require('mongodb').ObjectId;
async function query(filterBy) {
  try {
    let toys;
    const sortBy = JSON.parse(filterBy.sortBy);
    const criteria = _buildCriteria(filterBy);
    const collection = await dbService.getCollection('toy');
    if (sortBy.status) {
      toys = await collection
        .find(criteria)
        .sort({ [sortBy.status]: sortBy.state })
        .toArray();
    } else {
      toys = await collection.find(criteria).toArray();
    }
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
    // Todo remove _id in the front
    delete toy._id;
    const collection = await dbService.getCollection('toy');
    await collection.insertOne(toy);
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
    toy._id = id;
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

function _buildCriteria(filterBy) {
  const criteria = {};
  if (filterBy.txt) {
    criteria.name = { $regex: filterBy.txt, $options: 'i' };
  }
  if (filterBy.inStock) {
    criteria.inStock = { $eq: true };
  }
  if (filterBy.labels?.length > 0) {
    criteria.labels = { $all: filterBy.labels };
  }

  return criteria;
}
