import { useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { useImageUpload } from '@/hooks/useImageUpload';
import { activityOptions, difficultyOptions, uploadTripImages, createTrip } from '@/utils/tripUtils';
import type { Location, ActivityType, DifficultyLevel } from '@/types/trip';
import "react-datepicker/dist/react-datepicker.css";

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  activityType: Yup.string().required('Activity type is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  location: Yup.object({
    address: Yup.string().required('Location is required'),
    lat: Yup.number().required(),
    lng: Yup.number().required()
  }),
  difficulty: Yup.string().required('Difficulty level is required'),
  spots: Yup.number()
    .required('Number of spots is required')
    .min(1, 'Must have at least 1 spot')
    .max(50, 'Maximum 50 spots allowed'),
  description: Yup.string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters')
});

// Import LocationMap component dynamically to avoid SSR issues
const LocationMap = dynamic(() => import('./LocationMap'), {
  ssr: false, // This will only render the map on client-side
  loading: () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading map...</span>
      </div>
    </div>
  ),
});

const defaultCenter = {
  lat: 51.5074,
  lng: -0.1278
};

export default function TripForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { files, error: imageError, handleImageChange, removeImage } = useImageUpload(5);

  const formik = useFormik({
    initialValues: {
      title: '',
      activityType: '' as ActivityType,
      startDate: new Date(),
      endDate: new Date(),
      location: {
        address: '',
        lat: defaultCenter.lat,
        lng: defaultCenter.lng
      },
      difficulty: '' as DifficultyLevel,
      spots: 1,
      description: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        
        // Upload images first
        const imageUrls = await uploadTripImages(files);
        
        // Create trip in Firestore
        await createTrip({
          ...values,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
          imageUrls,
          createdBy: user!.uid
        });

        router.push('/trips');
      } catch (error) {
        console.error('Error creating trip:', error);
        // Handle error appropriately
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    formik.setValues({
      ...formik.values,
      location: {
        address,
        lat,
        lng
      }
    });
  };

  if (showPreview) {
    return (
      <div className="container py-4">
        <h2 className="mb-4">Preview Your Trip</h2>
        
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">{formik.values.title}</h3>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <p><strong>Activity:</strong> {
                  activityOptions.find(opt => opt.value === formik.values.activityType)?.label
                }</p>
                <p><strong>Dates:</strong> {
                  formik.values.startDate.toLocaleDateString()
                } - {
                  formik.values.endDate.toLocaleDateString()
                }</p>
                <p><strong>Location:</strong> {formik.values.location.address}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Difficulty:</strong> {
                  difficultyOptions.find(opt => opt.value === formik.values.difficulty)?.label
                }</p>
                <p><strong>Available Spots:</strong> {formik.values.spots}</p>
              </div>
            </div>

            <div className="mb-3">
              <h4>Description</h4>
              <p>{formik.values.description}</p>
            </div>

            {files.length > 0 && (
              <div className="mb-3">
                <h4>Images</h4>
                <div className="row g-3">
                  {files.map((file, index) => (
                    <div key={index} className="col-6 col-md-4 col-lg-3">
                      <img
                        src={file.preview}
                        alt={`Preview ${index + 1}`}
                        className="img-fluid rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => setShowPreview(false)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => formik.handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Trip...' : 'Create Trip'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Create a New Trip</h2>
      
      <form onSubmit={formik.handleSubmit} className="needs-validation">
        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Trip Title</label>
          <input
            type="text"
            className={`form-control ${
              formik.touched.title && formik.errors.title ? 'is-invalid' : ''
            }`}
            id="title"
            {...formik.getFieldProps('title')}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="invalid-feedback">{formik.errors.title}</div>
          )}
        </div>

        {/* Activity Type */}
        <div className="mb-3">
          <label htmlFor="activityType" className="form-label">Activity Type</label>
          <select
            className={`form-select ${
              formik.touched.activityType && formik.errors.activityType ? 'is-invalid' : ''
            }`}
            id="activityType"
            {...formik.getFieldProps('activityType')}
          >
            <option value="">Select an activity</option>
            {activityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
          {formik.touched.activityType && formik.errors.activityType && (
            <div className="invalid-feedback">{formik.errors.activityType}</div>
          )}
        </div>

        {/* Dates */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="startDate" className="form-label">Start Date</label>
            <DatePicker
              selected={formik.values.startDate}
              onChange={(date) => formik.setFieldValue('startDate', date)}
              className={`form-control ${
                formik.touched.startDate && formik.errors.startDate ? 'is-invalid' : ''
              }`}
              minDate={new Date()}
              dateFormat="MMMM d, yyyy"
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <div className="invalid-feedback">{formik.errors.startDate as string}</div>
            )}
          </div>
          <div className="col-md-6">
            <label htmlFor="endDate" className="form-label">End Date</label>
            <DatePicker
              selected={formik.values.endDate}
              onChange={(date) => formik.setFieldValue('endDate', date)}
              className={`form-control ${
                formik.touched.endDate && formik.errors.endDate ? 'is-invalid' : ''
              }`}
              minDate={formik.values.startDate}
              dateFormat="MMMM d, yyyy"
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <div className="invalid-feedback">{formik.errors.endDate as string}</div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="mb-3">
          <label className="form-label">Location</label>
          <LocationMap
            lat={formik.values.location.lat}
            lng={formik.values.location.lng}
            onLocationSelect={handleLocationSelect}
          />
          {formik.touched.location?.address && formik.errors.location?.address && (
            <div className="invalid-feedback">{formik.errors.location.address}</div>
          )}
          <div className="form-text mt-2">
            Click on the map to set the location. Selected: {formik.values.location.address}
          </div>
        </div>

        {/* Difficulty */}
        <div className="mb-3">
          <label htmlFor="difficulty" className="form-label">Difficulty Level</label>
          <select
            className={`form-select ${
              formik.touched.difficulty && formik.errors.difficulty ? 'is-invalid' : ''
            }`}
            id="difficulty"
            {...formik.getFieldProps('difficulty')}
          >
            <option value="">Select difficulty</option>
            {difficultyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
          {formik.touched.difficulty && formik.errors.difficulty && (
            <div className="invalid-feedback">{formik.errors.difficulty}</div>
          )}
        </div>

        {/* Spots */}
        <div className="mb-3">
          <label htmlFor="spots" className="form-label">Number of Spots</label>
          <input
            type="number"
            className={`form-control ${
              formik.touched.spots && formik.errors.spots ? 'is-invalid' : ''
            }`}
            id="spots"
            min="1"
            max="50"
            {...formik.getFieldProps('spots')}
          />
          {formik.touched.spots && formik.errors.spots && (
            <div className="invalid-feedback">{formik.errors.spots}</div>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className={`form-control ${
              formik.touched.description && formik.errors.description ? 'is-invalid' : ''
            }`}
            id="description"
            rows={5}
            {...formik.getFieldProps('description')}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="invalid-feedback">{formik.errors.description}</div>
          )}
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label">Images (Max 5)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {imageError && (
            <div className="text-danger small mt-1">{imageError}</div>
          )}
          {files.length > 0 && (
            <div className="row g-2 mt-2">
              {files.map((file, index) => (
                <div key={index} className="col-6 col-md-4 col-lg-3">
                  <div className="position-relative">
                    <img
                      src={file.preview}
                      alt={`Preview ${index + 1}`}
                      className="img-fluid rounded"
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowPreview(true)}
            disabled={!formik.isValid || !formik.dirty}
          >
            Preview Trip
          </button>
        </div>
      </form>
    </div>
  );
}
