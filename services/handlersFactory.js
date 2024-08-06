const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findOneAndDelete({ _id: id });
    if (!document)
      return next(new ApiError(`No product found with this ID ${id}`, 404));

    res.status(204).send(); // No Content = deleted
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    // Find category by id and update with data from req.body
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document)
      return next(
        new ApiError(`No document found with this ID ${req.params.id}`, 404)
      );

    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);

    if (!document)
      return next(
        new ApiError(`No brand found with this ID ${req.params.id}`, 404)
      );

    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filteredObj) {
      filter = req.filteredObj;
    }
    //! Build a query
    const countDocuments = await Model.countDocuments();

    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(countDocuments)
      .filter()
      .sort()
      .limitFields()
      .search(modelName);

    //! Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
