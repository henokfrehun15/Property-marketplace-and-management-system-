const Inquiry = require("../models/inquiry");
const Property = require("../models/property");
const AppError = require("../utils/appError");

const createInquiry = async (propertyId, senderId, message) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  const ownerId = property.owner.toString();

  if (ownerId === senderId.toString()) {
    throw new AppError(
      "You cannot send an inquiry to yourself",
      400
    );
  }

  const inquiry = await Inquiry.create({
    property: propertyId,
    sender: senderId,
    receiver: property.owner,
    message
  });

  return inquiry;
};
const getSentInquiries = async (userId) => {
  const inquiries = await Inquiry.find({
    sender: userId
  })
    .populate("property", "title price location images")
    .populate("receiver", "name email")
    .sort({ createdAt: -1 });

  return inquiries;
};
const getReceivedInquiries = async (userId) => {
  const inquiries = await Inquiry.find({
    receiver: userId
  })
    .populate("property", "title price location images")
    .populate("sender", "name email")
    .sort({ createdAt: -1 });

  return inquiries;
};
const updateInquiryStatus = async (
  inquiryId,
  userId,
  status
) => {
  const inquiry = await Inquiry.findById(inquiryId);

  if (!inquiry) {
    throw new AppError("Inquiry not found", 404);
  }

  if (inquiry.receiver.toString() !== userId.toString()) {
    throw new AppError(
      "You do not have permission to update this inquiry",
      403
    );
  }

  const allowedStatuses = [
    "pending",
    "read",
    "replied",
    "closed"
  ];

  if (!allowedStatuses.includes(status)) {
    throw new AppError(
      "Invalid inquiry status",
      400
    );
  }

  inquiry.status = status;

  await inquiry.save();

  return inquiry;
};
module.exports = {
  createInquiry,
  getSentInquiries,
  getReceivedInquiries,
  updateInquiryStatus
};