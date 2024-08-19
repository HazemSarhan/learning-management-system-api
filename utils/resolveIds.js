const mongoose = require('mongoose');
const CustomError = require('../errors');

const resolveIds = async (items, Model, refName) => {
  return await Promise.all(
    items.map(async (item) => {
      // If the item has a valid ObjectId
      if (
        mongoose.Types.ObjectId.isValid(item) &&
        (await Model.findById(item))
      ) {
        return item; // If it's a validId and exists in DB, return;
      } else {
        const foundNames = await Model.findOne({ name: item });
        if (foundNames) {
          return foundNames._id; // If there any names equals to the same ID, use it!
        } else {
          throw new CustomError.NotFoundError(`${refName} not found: ${item}`);
        }
      }
    })
  );
};

module.exports = resolveIds;
