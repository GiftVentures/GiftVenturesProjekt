const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const programSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  img:{
    type: Object,
    required: false
  },
  price: {
    type: Number,
    required: true,
  },
  persons:{
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
  },
  location: {
    county: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  theme: [
    {
      type: String, 
    },
  ],
  date: [
    {
      day: {
        type: String,
        required: true,
      },
      hours: [
        {
          type: String,
          required: true,
        },
      ],
    },
  ],
});

programSchema.statics.add = async function (
  name,
  description,
  img,
  price,
  persons,
  location,
  theme,
  date
) {
  if (
    !name ||
    !description ||
    //!img||
    !price ||
    !persons ||
    !location ||
    !theme ||
    !date
    ) {
    throw Error("Minden mező kitöltése kötelező");
  }

  const program = await this.create({
    name,
    description,
    img,
    price,
    persons,
    location,
    theme,
    date
  });

  return program
};


programSchema.statics.delete = async function (_id) {
  try {
      console.log(_id);
      const program = await this.findByIdAndDelete(_id);
      console.log("Deleted Program:", program);
      return program;
  } catch (error) {
      console.error("Error deleting program:", error);
      throw error;
  }
}

module.exports = mongoose.model("Program", programSchema);
