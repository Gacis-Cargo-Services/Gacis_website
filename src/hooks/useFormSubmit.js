import { useState } from 'react';

/**
 * Enterprise Form Submission Hook
 * Supports validation, loading states, reference generation, and mock/API endpoints.
 */
export function useFormSubmit({ endpoint = null, defaultValues = {} } = {}) {
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionReference, setSubmissionReference] = useState('');
  const [serverError, setServerError] = useState('');

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (rules = {}) => {
    const nextErrors = {};
    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const val = formData[field];

      if (rule.required && (!val || val.toString().trim() === '')) {
        nextErrors[field] = rule.message || `${field} is required`;
      } else if (rule.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        nextErrors[field] = 'Please enter a valid business email';
      } else if (rule.minLength && val && val.length < rule.minLength) {
        nextErrors[field] = `Must be at least ${rule.minLength} characters`;
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (e, rules = {}) => {
    if (e && e.preventDefault) e.preventDefault();
    setServerError('');

    const isValid = validate(rules);
    if (!isValid) return false;

    setIsSubmitting(true);

    try {
      if (endpoint) {
        // Generate enterprise transaction reference
        const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
        const ref = `GAC-${formData.service ? 'Q' : 'INQ'}-${randomSuffix}`;

        // Prepare payload with Web3Forms compatibility
        const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
        const payload = {
          ...formData,
          ...(accessKey ? { access_key: accessKey } : {}),
          reference_id: ref,
          from_name: 'GACIS Cargo Web Portal',
          subject: formData.subject 
            ? `[GACIS Inquiry] ${formData.subject} (Ref: ${ref})`
            : formData.service 
              ? `[GACIS Quote Request] ${formData.service}: ${formData.origin || 'Origin'} ➔ ${formData.destination || 'Destination'} (Ref: ${ref})`
              : `[GACIS Portal Submission] Ref: ${ref}`
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || (result.success === false)) {
          throw new Error(result.message || result.error || 'Submission failed. Please check details and try again.');
        }

        setSubmissionReference(ref);
        setIsSuccess(true);
        return true;
      } else {
        // Development / Offline Mock handler with realistic 750ms latency
        await new Promise(resolve => setTimeout(resolve, 750));
        const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
        const ref = `GAC-Q-${randomSuffix}`;
        setSubmissionReference(ref);
        setIsSuccess(true);
        return true;
      }
    } catch (err) {
      setServerError(err.message || 'An unexpected error occurred. Please contact our desk directly.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setFormData(defaultValues);
    setErrors({});
    setIsSuccess(false);
    setSubmissionReference('');
    setServerError('');
  };

  return {
    formData,
    setFormData,
    updateField,
    errors,
    isSubmitting,
    isSuccess,
    submissionReference,
    serverError,
    submit,
    reset
  };
}

export default useFormSubmit;
