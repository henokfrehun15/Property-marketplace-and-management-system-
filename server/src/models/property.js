const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 2000
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    propertyType: {
      type: String,
      required: true,
      enum: [
        "house",
        "apartment",
        "condominium",
        "villa",
        "land",
        "commercial"
      ]
    },

    listingType: {
      type: String,
      required: true,
      enum: ["sale", "rent"]
    },

    bedrooms: {
      type: Number,
      min: 0,
      default: 0
    },

    bathrooms: {
      type: Number,
      min: 0,
      default: 0
    },

    area: {
      type: Number,
      required: true,
      min: 0
    },

    location: {
      city: {
        type: String,
        required: true,
        trim: true
      },

      subCity: {
        type: String,
        trim: true
      },

      address: {
        type: String,
        required: true,
        trim: true
      }
    },

    amenities: {
      type: [String],
      default: []
    },

    images: {
      type: [
        {
          url: {
            type: String,
            required: true
          },
          publicId: {
            type: String,
            required: true
          }
        }
      ],
      default: []
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["available", "sold", "rented", "inactive"],
      default: "available"
    }
  },
  {
    timestamps: true
  }
);

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;