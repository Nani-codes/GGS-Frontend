"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { FormEvent, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { IMAGE_PATHS } from '@/config/images';

export function CareerContent() {
  const t = useTranslations();

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvLink, setCvLink] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!number.trim()) {
      newErrors.number = 'Number is required';
    } else if (!/^[0-9+()\-\s]{7,20}$/.test(number.trim())) {
      newErrors.number = 'Please enter a valid phone number';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!cvFile && !cvLink.trim()) {
      newErrors.cv = 'Please upload your CV or provide a CV link';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(null);
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('number', number.trim());
      formData.append('email', email.trim());
      formData.append('address', address.trim());
      if (cvFile) {
        formData.append('cv', cvFile);
      }
      if (cvLink.trim()) {
        formData.append('cvLink', cvLink.trim());
      }

      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message =
          data?.message ||
          'There was a problem submitting your application. Please try again.';
        throw new Error(message);
      }

      setSubmitSuccess('Application submitted successfully. We will contact you soon.');
      setName('');
      setNumber('');
      setEmail('');
      setAddress('');
      setCvFile(null);
      setCvLink('');
      setErrors({});
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'There was a problem submitting your application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout currentPage="/career">
      {/* ===== PAGE HEADER ===== */}
      <section className="page-header">
        <div className="page-header__bg" style={{ backgroundImage: `url(${IMAGE_PATHS.pageHeaderBg})` }}>
        </div>
        <div className="container">
          <div className="page-header__inner">
            <h3>{t('nav.career')}</h3>
            <div className="thm-breadcrumb__inner">
              <ul className="thm-breadcrumb list-unstyled">
                <li><Link href="/">{t('nav.home')}</Link></li>
                <li><span className="fas fa-angle-right" /></li>
                <li>{t('nav.career')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAREER SECTION ===== */}
      <section className="about-one" style={{ padding: '120px 0' }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="about-one__content">
                <div className="section-title text-center">
                  <div className="section-title__tagline-box">
                    <div className="section-title__shape-1">
                      <img src="/assets/images/resources/section-title-shape-1.png" alt="" />
                    </div>
                    <h6 className="section-title__tagline">{t('career.tagline') || 'Join Our Team'}</h6>
                    <div className="section-title__shape-1">
                      <img src="/assets/images/resources/section-title-shape-2.png" alt="" />
                    </div>
                  </div>
                  <h2 className="section-title__title">{t('career.title') || 'Career & Opportunities'}</h2>
                </div>
                <div className="about-one__text" style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
                  <p style={{ fontSize: '18px', lineHeight: '1.8', color: '#666', marginBottom: '30px' }}>
                    {t('career.description') || 'We are always looking for talented individuals to join our team. Explore exciting career opportunities with Green Gold Seeds Pvt. Ltd. and be part of our mission to transform Indian agriculture.'}
                  </p>
                </div>
                {/* ===== CAREER APPLICATION FORM ===== */}
                <div className="about-one__text" style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <h3 style={{ marginBottom: '20px' }}>
                    {t('career.formTitle') || 'Apply for a position'}
                  </h3>
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row">
                      <div className="col-md-6" style={{ marginBottom: '15px' }}>
                        <label htmlFor="career-name" className="form-label">
                          Name *
                        </label>
                        <input
                          id="career-name"
                          type="text"
                          className="form-control"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                          <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div className="col-md-6" style={{ marginBottom: '15px' }}>
                        <label htmlFor="career-number" className="form-label">
                          Number *
                        </label>
                        <input
                          id="career-number"
                          type="text"
                          className="form-control"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          aria-invalid={!!errors.number}
                        />
                        {errors.number && (
                          <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                            {errors.number}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6" style={{ marginBottom: '15px' }}>
                        <label htmlFor="career-email" className="form-label">
                          Email *
                        </label>
                        <input
                          id="career-email"
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="col-md-6" style={{ marginBottom: '15px' }}>
                        <label htmlFor="career-address" className="form-label">
                          Address
                        </label>
                        <textarea
                          id="career-address"
                          className="form-control"
                          rows={3}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6" style={{ marginBottom: '15px' }}>
                        <label htmlFor="career-cv" className="form-label">
                          CV (upload)
                        </label>
                        <input
                          id="career-cv"
                          type="file"
                          className="form-control"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setCvFile(file);
                          }}
                        />
                      </div>
                      <div className="col-md-6" style={{ marginBottom: '15px' }}>
                        <label htmlFor="career-cv-link" className="form-label">
                          CV link (optional if uploaded)
                        </label>
                        <input
                          id="career-cv-link"
                          type="url"
                          className="form-control"
                          placeholder="https://..."
                          value={cvLink}
                          onChange={(e) => setCvLink(e.target.value)}
                        />
                      </div>
                    </div>
                    {errors.cv && (
                      <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                        {errors.cv}
                      </p>
                    )}
                    {submitError && (
                      <p style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>
                        {submitError}
                      </p>
                    )}
                    {submitSuccess && (
                      <p style={{ color: 'green', fontSize: '14px', marginTop: '10px' }}>
                        {submitSuccess}
                      </p>
                    )}
                    <div style={{ marginTop: '20px' }}>
                      <button
                        type="submit"
                        className="thm-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        <i className="fal fa-long-arrow-right" />
                        <span className="hover-btn hover-bx" />
                        <span className="hover-btn hover-bx2" />
                        <span className="hover-btn hover-bx3" />
                        <span className="hover-btn hover-bx4" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* (Former contact CTA replaced by application form above) */}
    </PageLayout>
  );
}

