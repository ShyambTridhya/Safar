class ApiFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }
  search() {
    console.log('7', this.queryString.keyword)
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: 'i', //case insensitive (ABC,abc)
          },
        }
      : {}

    console.log('17', keyword)

    this.query = this.query.find({...keyword})
    return this
  }
  filter() {
    const queryCopy = {...this.queryString}
    //Removing some fields for category
    const removeFields = ['keyword', 'page', 'limit']
    removeFields.forEach((field) => delete queryCopy[field])

    //Filter for price and rating
    let queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (field) => `$${field}`)

    console.log('30', JSON.parse(queryStr))
    this.query = this.query.find(JSON.parse(queryStr))

    return this
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1
    const skip = resultPerPage * (currentPage - 1)
    this.query = this.query.limit(resultPerPage).skip(skip)
    return this
  }
}
module.exports = ApiFeatures
