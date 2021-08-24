const crudRepo = {};

crudRepo.save = async function (Model, data, options = {}) {
    const doc = new Model(data);
    await doc.save(options);
    return doc;
};

crudRepo.delete = async function (model, key, value, options = {}) {
    return model.findOneAndDelete({ key, value }, options).lean();
};

crudRepo.deleteMany = async function (model, query, options = {}) {
    return model.deleteMany(query, options).lean();
};

crudRepo.update = function (model, query, update, options) {
    return model.findOneAndUpdate(query, update, options).lean();
};

crudRepo.findOne = function (model, query, options) {
    return model.findOne(query, null, options).lean();
};

crudRepo.find = function (model, query, page, limit) {
    return model.paginate(query, { page, limit });
};

module.exports = crudRepo;
