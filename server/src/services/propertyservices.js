const Property = require("../models/property");

const createProperty = async (propertyData, ownerId) => {
  const property = await Property.create({
    ...propertyData,
    owner: ownerId
  });

  return property;
};
const getAllProperties = async (queryParams) => {
  const {
    search,
    propertyType,
    listingType,
    city,
    minPrice,
    maxPrice,
    bedrooms,
    page = 1,
    limit = 10,
    sort = "newest"
  } = queryParams;

  const filter = {
    status: "available"
  };

  // Search by title or description
  if (search) {
    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i"
        }
      },
      {
        description: {
          $regex: search,
          $options: "i"
        }
      },
      {
      "location.city": {
        $regex: search,
        $options: "i"
      }
    },
    {
      "location.subCity": {
        $regex: search,
        $options: "i"
      }
    },
    {
      "location.address": {
        $regex: search,
        $options: "i"
      }
    }
  ];
  }

  // Property type
  if (propertyType) {
    filter.propertyType = propertyType;
  }

  // Sale or rent
  if (listingType) {
    filter.listingType = listingType;
  }

  // City
  if (city) {
    filter["location.city"] = {
      $regex: city,
      $options: "i"
    };
  }

  // Price range
  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  // Bedrooms
  if (bedrooms) {
    filter.bedrooms = {
      $gte: Number(bedrooms)
    };
  }

  // Pagination
  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.min(
    Math.max(Number(limit), 1),
    100
  );

  const skip = (pageNumber - 1) * limitNumber;

  // Sorting
  let sortOption = {
    createdAt: -1
  };

  if (sort === "price_asc") {
    sortOption = {
      price: 1
    };
  }

  if (sort === "price_desc") {
    sortOption = {
      price: -1
    };
  }

  const [properties, total] = await Promise.all([
    Property.find(filter)
      .populate("owner", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber),

    Property.countDocuments(filter)
  ]);

  return {
    properties,
    total,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.ceil(total / limitNumber)
  };
};
const getPropertyById = async (propertyId) => {
  const property = await Property.findById(propertyId)
    .populate("owner", "name email");

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};
const updateProperty = async (propertyId, updateData, userId, userRole) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new Error("Property not found");
  }

  const isOwner = property.owner.toString() === userId.toString();
  const isAdmin = userRole === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error(
      "You do not have permission to update this property"
    );

    error.statusCode = 403;
    throw error;
  }

  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).populate("owner", "name email");

  return updatedProperty;
};
const deleteProperty = async (propertyId, userId, userRole) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new Error("Property not found");
  }

  const isOwner = property.owner.toString() === userId.toString();
  const isAdmin = userRole === "admin";

  if (!isOwner && !isAdmin) {
    const error = new Error(
      "You do not have permission to delete this property"
    );

    error.statusCode = 403;
    throw error;
  }

  await Property.findByIdAndDelete(propertyId);

  return property;
};
module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
};