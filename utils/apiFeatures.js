class ApiFeatures {
  constructor(mongooseQuery, queryStr) {
    this.mongooseQuery = mongooseQuery;
    this.queryStr = queryStr;
  }

  paginate(countDocuments) {
    //! 1) Pagination
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.totalPages = Math.ceil(countDocuments / limit);

    // Next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    // Previous page
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }

  filter() {
    //! 2) Filtering
    const queryObj = { ...this.queryStr };
    const excludedFields = ["page", "limit", "sort", "fields", "keyword"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //! - Filtering with [<, <=, >, >=]
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lt|lte|gt|gte)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    //! 3) Sorting
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    //! 4) Fields Limiting
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  search() {
    //! 5) Searching
    if (this.queryStr.keyword) {
      let query = {};
      query.$or = [
        { title: { $regex: this.queryStr.keyword, $options: "i" } },
        { description: { $regex: this.queryStr.keyword, $options: "i" } },
      ];

      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }
}

module.exports = ApiFeatures;
