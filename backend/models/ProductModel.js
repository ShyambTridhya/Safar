const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter Product Name'],
    trim: true,
  },
  sub_ProductName: [
    {
      name: String,
      model: [
        {
          name: String,
          price: {
            type: Number,
            required: [true, 'Please Enter Price'],
            maxlength: [8, "Price can't exceed 8 characters"],
          },
          colour: [
            {
              name: String,
              stock: {
                type: Number,
                required: [true, 'Please Enter Product stock'],
                default: 1,
              },
              image: {
                public_id: {
                  type: String,
                  required: true,
                },
                url: {
                  type: String,
                  required: true,
                },
              },
            },
          ],
        },
      ],
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, 'Please Enter Product Category'],
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comments: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Product', productSchema)
