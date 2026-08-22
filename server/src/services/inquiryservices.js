const Inquiry = require("../models/inquiry");
const Property = require("../models/property");
const AppError = require("../utils/appError");

// Create an inquiry from a user to a property's owner
const createInquiry = async (propertyId, senderId, message) => {
  const property = await Property.findById(propertyId);

  if (!property) {
    throw new AppError("Property not found", 404);
  }

  if (property.owner.toString() === senderId.toString()) {
    throw new AppError(
      "You cannot send an inquiry to your own property",
      400
    );
  }

  const trimmedMessage = message?.trim();

  if (!trimmedMessage || trimmedMessage.length < 5) {
    throw new AppError(
      "Message must be at least 5 characters",
      400
    );
  }

  const inquiry = await Inquiry.create({
    property: property._id,
    sender: senderId,
    receiver: property.owner,
    message: trimmedMessage
  });

  return inquiry;
};

// Inquiries sent by the logged-in user
const getSentInquiries = async (userId) => {
  return Inquiry.find({ sender: userId })
    .populate("property", "title price location images")
    .populate("receiver", "name email")
    .sort({ createdAt: -1 });
};

// Inquiries received by the logged-in property owner
const getReceivedInquiries = async (userId) => {
  const inquiries = await Inquiry.find({
    receiver: userId
  })
    .populate("property", "title price location images")
    .populate("sender", "name email")
    .sort({ createdAt: -1 });

  return inquiries;
};

// Owner can mark an inquiry pending, read, replied, or closed
const updateInquiryStatus = async (inquiryId, userId, status) => {
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
    throw new AppError("Invalid inquiry status", 400);
  }

  inquiry.status = status;
  await inquiry.save();

  return inquiry;
};
const replyToInquiry = async (inquiryId, userId, reply) => {
  const inquiry = await Inquiry.findById(inquiryId);

  if (!inquiry) {
    throw new AppError("Inquiry not found", 404);
  }

  if (inquiry.receiver.toString() !== userId.toString()) {
    throw new AppError(
      "You do not have permission to reply to this inquiry",
      403
    );
  }

  const trimmedReply = reply?.trim();

  if (!trimmedReply || trimmedReply.length < 5) {
    throw new AppError(
      "Reply must be at least 5 characters",
      400
    );
  }

  inquiry.reply = trimmedReply;
  inquiry.repliedAt = new Date();
  inquiry.status = "replied";

  await inquiry.save();

  return inquiry;
};
module.exports = {
  createInquiry,
  getSentInquiries,
  getReceivedInquiries,
  updateInquiryStatus,
  replyToInquiry
};