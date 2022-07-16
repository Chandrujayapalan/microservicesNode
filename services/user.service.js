const {
  product,
  userMaster,
  userDetail,
  order,
  terms,
  state,
  city,
  sociallink,
  waitlist,
  blockreport,
  help,
  impression,
  termsmaster,
  policymaster,
  feedbackdetail,
  likesDetails,
  session,
} = require("../models");

const { UserStatus, signUp, DR_STATUS } = require("../constants");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
var atob = require("atob");
const tagpostInterService = require("../interService/tagPostInterService");

const { getSingedUrl } = require("../middleware/multer");
const { password } = require("../configs/db.config");


class userService {}

userService.prototype.getUserId = async (req) => {
  var ca = req.headers["x-access-token"] || req.headers["authorization"];
  var base64Url = ca.split(".")[1];
  var decodedValue = JSON.parse(atob(base64Url));
  return decodedValue;
};

userService.prototype.createstate = async (payloads) => {
  payloads = { ...payloads, status: UserStatus.ACTIVE };
  return await state.create(payloads);
};

userService.prototype.createcity = async (payloads) => {
  payloads = { ...payloads, status: UserStatus.ACTIVE };
  return await city.create(payloads);
};

userService.prototype.createUserMaster = async (payloads) => {
  payloads = { ...payloads, status: UserStatus.ACTIVE };
  return await userMaster.create(payloads);
};

userService.prototype.createUserDetail = async (payloads) => {
  return await userDetail.create(payloads);
};

userService.prototype.createTermDetail = async (payloads) => {
  return await terms.create(payloads);
};

userService.prototype.createWaitlistDetail = async (payloads) => {
  return await waitlist.create(payloads);
};

userService.prototype.createBLockReportDetail = async (payloads) => {
  return await blockreport.create(payloads);
};

userService.prototype.createHelpKeywords = async (payloads) => {
  return await help.create(payloads);
};

userService.prototype.createHelpTopicDetail = async (payloads) => {
  return await topic.create(payloads);
};

userService.prototype.createOpenQuestionDetail = async (payloads) => {
  return await questions.create(payloads);
};

userService.prototype.createQuestionStatusDetails = async (payloads) => {
  return await questionstatus.bulkCreate(payloads);
};

userService.prototype.bulkOQHistoryCreation = async (payloads) => {
  return await questionstatus.create(payloads);
};

userService.prototype.createSocialLinks = async (payloads) => {
  return await sociallink.create(payloads);
};

userService.prototype.createQuestionImpressionDetails = async (payloads) => {
  return await impression.create(payloads);
};

userService.prototype.updateSocialLinks = async (payloads, where) => {
  return await sociallink.update(payloads, { where: where });
};

userService.prototype.updateUserMaster = async (payloads, where) => {
  return await userMaster.update(payloads, { where: where });
};

userService.prototype.updateUserDetail = async (payloads, where) => {
  return await userDetail.update(payloads, { where: where });
};

userService.prototype.updateTopicDetail = async (payloads, where) => {
  return await topic.update(payloads, { where: where });
};

userService.prototype.updateQuestionDetail = async (payloads, where) => {
  return await questions.update(payloads, { where: where });
};

userService.prototype.deleteHelpRecords = async (where) => {
  return await help.destroy({ where: where });
};

userService.prototype.unBLockReportUserDetail = async (where) => {
  return await blockreport.destroy({ where: where });
};

userService.prototype.findUser = async (find, raw = false) => {
  return await userMaster.findOne({
    where: {
      ...find,
    },raw :true

  });
};
userService.prototype.uploadproduct = async (payloads) => {
  return await product.bulkCreate(payloads)

};
userService.prototype.orderplays = async (find, raw = false) => {

  return await product.findAll({
    where: {
    ...find,
  },raw : true
  
})
};
userService.prototype.orderplacee = async (payloads) => {
  return await order.create(payloads)

};

userService.prototype.findproduct = async (find, raw = false) => {
  return await product.findOne({
    where: {
    ...find,
  },
})
};
userService.prototype.updateorders = async (payloads, where) => {
  console.log(payloads)
  console.log(where);
  return await order.update(payloads, { where: where });
};
userService.prototype.deleteorder = async (where) => {
  console.log(where)
  return await order.destroy({ where: where });
};
userService.prototype.findorder = async (find, raw = false) => {
  return await order.findAll({
    where: {
    ...find,
  },raw :true 
})
};
userService.prototype.findboolean = async (find, raw = false) => {
  return await order.findOne({
    where: {
    ...find,
  },raw :true 
})
};
userService.prototype.updateBoolean = async (payloads, where) => {
  console.log(payloads)
  console.log(where);
  return await order.update(payloads, { where: where });
};
userService.prototype.findorder1 = async (find, raw = false) => {
  return await order.findAll({
    
    include: [{
      model: userMaster,
      as: 'userMaster'
    }],
    where: {
      ...find,
    },raw :true,
    nest:true
}) 
};
userService.prototype.findproduct1 = async (find, raw = false) => {
  console.log(find)
  return await product.findAll({
    where: {
    ...find,
  },
})
};
module.exports = new userService();
