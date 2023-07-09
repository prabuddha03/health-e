const express = require('express');
const doctorController = require('./../controllers/doctorController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:doctorId/reviews', reviewRouter);

// router
//   .route('/top-5-cheap')
//   .get(doctorController.aliasTopDoctors, doctorController.getAllDoctors);

router
  .route('/doctors-within/:distance/center/:latlng/unit/:unit')
  .get(doctorController.getDoctorsWithin);

// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router
  .route('/')
  .get(doctorController.getAllDoctors)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'doctor'),
    doctorController.createDoctor
  );

router
  .route('/:id')
  .get(doctorController.getDoctor)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'doctor'),
    doctorController.updateDoctor
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'doctor'),
    doctorController.deleteDoctor
  );

module.exports = router;
