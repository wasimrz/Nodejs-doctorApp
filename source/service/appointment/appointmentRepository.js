const {
  Appointment,
  User,
  Doctor
} = require('../../commons/models/mongo/mongodb');

function Repository() {}

Repository.prototype.getPatientById = async function (doctorId) {
  const instance = await Appointment.find({ docterId: doctorId }, { apps: 1 }).exec();
  return instance ? instance.toJSON() : null;
}

Repository.prototype.getAllAppointment = async function (query) {
  const instance = await Appointment.find(query).exec();
  return instance.length>0 ? instance : [];
},

Repository.prototype.getAppointmentById = async function(appointmentId) {
  const instance = await Appointment.findOne(
    { _id: appointmentId }
    // { apps: 1 }
  ).exec();
  return instance ? instance.toJSON() : null;
  }

Repository.prototype.getAllAppointment = async function(query) {
  const instance = await Appointment.find(query).exec();
  return instance.length > 0 ? instance : [];
};

Repository.prototype.createDoc = async function(data) {
  const instance = await new Appointment(data).save();
  return instance ? instance.toJSON() : null;
};

Repository.prototype.updateUserById = async function(userId, data) {
  return await User.updateOne(
    {
      _id: userId
    },
    data,
    { new: true }
  );
};

Repository.prototype.cancelById = async function(appointmentId) {
  return await Appointment.updateOne(
    {
      _id: appointmentId
    },
    { $set: { isUpcoming: 0, isCancelled: 1 } },
    { new: true }
  );
};

Repository.prototype.validateAvailability = async function(
  doctorDetails,
  askTime
) {
  /*
   Here we are cehcking for the availability of doctor.
1. check for the availabilityId and day.
2. if its matched, then check for the slotId and time.
3. All ok, then send status true and availability of doctor. 
   */
  let availability = doctorDetails.availability;
  let doctorId = doctorDetails._id;
  let length = availability.length;
  for (let i = 0; i < length; i++) {
    if (
      availability[i]._id == askTime.availabilityId &&
      availability[i].day == askTime.day
    ) {
      for (element of availability[i].slot) {
        if (element._id == askTime.slotId && element.time == askTime.time) {
          await Doctor.updateOne(
            { _id: doctorId },
            {
              $set: {
                'availability.$[index].slot.$[count].isAvailable': false
              }
            },
            {
              arrayFilters: [
                { 'index._id': askTime.availabilityId },
                { 'count._id': askTime.slotId }
              ]
            }
          );
          return {
            status: true,
            availability: element.isAvailable,
            message: 'Done'
          };
        }
      }
    }
  }
  return { status: false, message: 'Invalid details' };
};

Repository.prototype.makeSlotAvailable = async function(
  scheduleDate,
  doctorId
) {
  let { availabilityId, slotId } = scheduleDate;
  await Doctor.updateOne(
    { _id: doctorId },
    {
      $set: {
        'availability.$[index].slot.$[count].isAvailable': true
      }
    },
    {
      arrayFilters: [{ 'index._id': availabilityId }, { 'count._id': slotId }]
    }
  );
};

Repository.prototype.rescheduleById = async function(
  appointmentId,
  scheduleDate
) {
  return await Appointment.updateOne(
    { _id: appointmentId },
    { $set: { scheduleDate: scheduleDate } }
  );
};
module.exports = new Repository();
