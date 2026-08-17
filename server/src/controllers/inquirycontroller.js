const { get } = require("mongoose");
const {
  createInquiry,
  getSentInquiries,
  getReceivedInquiries,
  updateInquiryStatus
} = require("../services/inquiryservices");

const create = async (req, res) => {
  const inquiry = await createInquiry(
    req.body.propertyId,
    req.user.userId,
    req.body.message
  );

  res.status(201).json({
    success: true,
    message: "Inquiry sent successfully",
    inquiry
  });
};
const getSent = async (req, res) => {
  const inquiries = await getSentInquiries(
    req.user.userId
  );

  res.status(200).json({
    success: true,
    count: inquiries.length,
    inquiries
  });
};
const getReceived = async (req, res) => {
  const inquiries = await getReceivedInquiries(
    req.user.userId
  );

  res.status(200).json({
    success: true,
    count: inquiries.length,
    inquiries
  });
};
const updateStatus = async (req, res) => {
  const inquiry = await updateInquiryStatus(
    req.params.id,
    req.user.userId,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Inquiry status updated successfully",
    inquiry
  });
};
module.exports = {
  create,
  getSent,
  getReceived,
  updateStatus
};