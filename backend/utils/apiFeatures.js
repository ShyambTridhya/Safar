class ApiFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
  }
  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: 'i', //case insensitive (ABC,abc)
          },
        }
      : {}

    this.query = this.query.find({...keyword})
    return this
  }
  filter() {
    const queryCopy = {...this.queryString}
    console.log('21', queryCopy)
    //Removing some fields for category
    const removeFields = ['keyword', 'page', 'limit']
    removeFields.forEach((field) => delete queryCopy[field])
    console.log('25', queryCopy)
    this.query = this.query.find(queryCopy)
    return this
  }
}
module.exports = ApiFeatures
