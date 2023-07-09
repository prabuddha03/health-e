const mongoose = require('mongoose');
const slugify = require('slugify');

//Schema for doctor appointment
const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'You must put your name']
    },
    slug: String,
    specialization: {
      type: String,
      default: 'General Physician'
    },
    degree: {
      type: String,
      required: [true, 'A doctor must have a valid degree']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    money: {
      type: Number,
      required: [true, 'A doctor must have a visit price']
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A doctor must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    appointmentDate: [Date],
    doctorLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    doctors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

doctorSchema.index({ price: 1, ratingsAverage: -1 });
doctorSchema.index({ slug: 1 });
doctorSchema.index({ startLocation: '2dsphere' });

// Virtual populate
doctorSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'doctor',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
doctorSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

doctorSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });

  next();
});

doctorSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
