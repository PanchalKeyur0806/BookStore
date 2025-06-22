import { json } from "express";

class AppFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields"];

    excludedFields.forEach((ele) => delete queryObj[ele]);

    const transformedQuery = {};
    for (const key in queryObj) {
      const operatorMatch = key.match(/^(.+)\[(gte|gt|lte|lt)\]$/);

      if (operatorMatch) {
        const field = operatorMatch[1];
        const operator = operatorMatch[2];
        const value = isNaN(queryObj[key])
          ? queryObj[key]
          : Number(queryObj[key]);

        if (!transformedQuery[field]) {
          transformedQuery[field] = {};
        }

        transformedQuery[field][`$${operator}`] = value;
      } else {
        // Regular field without operators
        transformedQuery[key] = queryObj[key];
      }
    }

    this.query = this.query.find(transformedQuery);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  pagination() {
    if (this.queryString.page) {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 10;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
    }

    return this;
  }
}

export default AppFeatures;
