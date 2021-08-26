const crudRepo = {};

crudRepo.save = async function (Model, data, options = {}) {
  const doc = new Model(data);
  await doc.save(options);
  return doc;
};

crudRepo.delete = async function (model, query, options = {}) {
  return model.findOneAndDelete(query, options).lean();
};

crudRepo.deleteMany = async function (model, query, options = {}) {
  return model.deleteMany(query, options).lean();
};

crudRepo.update = function (model, query, update, options) {
  options = { ...options, new: true };
  return model.findOneAndUpdate(query, update, options).lean();
};

crudRepo.updateAll = function (model, query, update, options) {
  options = { ...options, multi: true };
  return model.updateMany(query, update, options).lean();
};

crudRepo.findOne = function (model, query, options) {
  return model.find(query, null, options).lean();
};

crudRepo.find = function (model, query, page, limit, sortBy) {
  console.log(query)
  const options = {
    sort: {[sortBy]: -1},
    page,
    limit
  }
  return model.paginate(query, options);
};

module.exports = crudRepo;
