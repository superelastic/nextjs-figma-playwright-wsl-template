'use client';

import React, { useState } from 'react';

interface FormData {
  email: string;
  apiKey: string;
  frequency: string;
}

interface ValidationErrors {
  email?: string;
  apiKey?: string;
  frequency?: string;
}

export default function FormWithValidation() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    apiKey: '',
    frequency: 'daily'
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Email validation
  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  // API Key validation
  const validateApiKey = (apiKey: string): string | undefined => {
    if (!apiKey) {
      return 'API Key is required';
    }
    if (apiKey.length < 10) {
      return 'API Key must be at least 10 characters';
    }
    if (!/^[A-Za-z0-9-_]+$/.test(apiKey)) {
      return 'API Key can only contain letters, numbers, hyphens, and underscores';
    }
    return undefined;
  };

  // Handle field changes with real-time validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear submit success on new input
    if (submitSuccess) {
      setSubmitSuccess(false);
    }

    // Real-time validation
    let error: string | undefined;
    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'apiKey':
        error = validateApiKey(value);
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: ValidationErrors = {
      email: validateEmail(formData.email),
      apiKey: validateApiKey(formData.apiKey)
    };

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== undefined);
    if (hasErrors) {
      return;
    }

    // Simulate API call
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted with data:', formData);
      setSubmitSuccess(true);
      // Reset form after successful submission
      setFormData({
        email: '',
        apiKey: '',
        frequency: 'daily'
      });
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ds-panel">
      <h2 className="ds-chart-title">Data Feed Configuration</h2>
      <p className="ds-info-text">Configure your FRED data feed settings</p>
      
      <form onSubmit={handleSubmit} className="ds-form">
        {/* Email Field */}
        <div className="ds-form-group">
          <label htmlFor="email" className="ds-form-label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`ds-form-input ${errors.email ? 'ds-input-error' : ''}`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.email && (
            <span id="email-error" className="ds-error-text" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        {/* API Key Field */}
        <div className="ds-form-group">
          <label htmlFor="apiKey" className="ds-form-label">
            FRED API Key
          </label>
          <input
            id="apiKey"
            name="apiKey"
            type="text"
            value={formData.apiKey}
            onChange={handleChange}
            className={`ds-form-input ${errors.apiKey ? 'ds-input-error' : ''}`}
            placeholder="Enter your FRED API key"
            aria-invalid={!!errors.apiKey}
            aria-describedby={errors.apiKey ? 'apiKey-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.apiKey && (
            <span id="apiKey-error" className="ds-error-text" role="alert">
              {errors.apiKey}
            </span>
          )}
        </div>

        {/* Update Frequency Field */}
        <div className="ds-form-group">
          <label htmlFor="frequency" className="ds-form-label">
            Update Frequency
          </label>
          <select
            id="frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="ds-form-select"
            disabled={isSubmitting}
          >
            <option value="realtime">Real-time</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="ds-form-actions">
          <button
            type="submit"
            className="ds-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Configuration'}
          </button>
          
          {submitSuccess && (
            <span className="ds-success-text" role="status">
              ✓ Configuration saved successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * import FormWithValidation from './components/FormWithValidation';
 * 
 * function SettingsPage() {
 *   return (
 *     <DashboardLayout>
 *       <FormWithValidation />
 *       {/* Other settings panels */}
 *     </DashboardLayout>
 *   );
 * }
 * 
 * FEATURES:
 * ✅ Real-time field validation
 * ✅ Multiple validation rules per field
 * ✅ Accessible error messages with ARIA attributes
 * ✅ Loading states during submission
 * ✅ Success feedback
 * ✅ Form reset after successful submission
 * ✅ Proper TypeScript types
 * 
 * REQUIRED CSS CLASSES:
 * Add these to your design-system.css:
 * 
 * .ds-form { ... }
 * .ds-form-group { margin-bottom: 20px; }
 * .ds-form-label { display: block; margin-bottom: 8px; font-weight: 500; }
 * .ds-form-input { width: 100%; padding: 10px; border: 1px solid var(--color-border); }
 * .ds-form-select { width: 100%; padding: 10px; border: 1px solid var(--color-border); }
 * .ds-input-error { border-color: #ef4444; }
 * .ds-form-actions { display: flex; align-items: center; gap: 16px; margin-top: 24px; }
 * .ds-btn-primary { ... your button styles ... }
 */