import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, AlertCircle, Save, Percent, Sparkles, Eye, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import AdminNav from '../../components/AdminNav';
import Loader from '../../components/Loader';

const AdminSettingsScreen = () => {
  const [isActive, setIsActive] = useState(true);
  const [percentage, setPercentage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/settings');
        if (data && data.cardPaymentDiscount) {
          setIsActive(Boolean(data.cardPaymentDiscount.isActive));
          setPercentage(
            data.cardPaymentDiscount.percentage !== undefined
              ? Number(data.cardPaymentDiscount.percentage)
              : 5
          );
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to load settings:', err);
        setErrorMessage(
          err.response?.data?.message || 'Failed to load settings. Please try again.'
        );
        setLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const numericPercentage = Number(percentage);
    if (isNaN(numericPercentage) || numericPercentage < 0 || numericPercentage > 100) {
      setErrorMessage('Please enter a valid percentage between 0 and 100.');
      return;
    }

    try {
      setSaving(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const payload = {
        cardPaymentDiscount: {
          isActive: Boolean(isActive && numericPercentage > 0),
          percentage: numericPercentage,
        },
      };

      const { data } = await axios.put('/api/settings', payload, config);

      if (data && data.cardPaymentDiscount) {
        setIsActive(Boolean(data.cardPaymentDiscount.isActive));
        setPercentage(Number(data.cardPaymentDiscount.percentage));
      }

      setSuccessMessage('Card payment offer settings updated successfully!');
      setSaving(false);

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to save settings. Please try again.'
      );
      setSaving(false);
    }
  };

  const sampleSubtotal = 7500;
  const sampleDelivery = 350;
  const isCurrentlyEffective = isActive && Number(percentage) > 0;
  const sampleDiscount = isCurrentlyEffective
    ? Math.round((sampleSubtotal * Number(percentage)) / 100)
    : 0;
  const sampleTotal = sampleSubtotal + sampleDelivery - sampleDiscount;

  return (
    <div className="container" style={{ padding: '120px 24px 60px', minHeight: '85vh' }}>
      <AdminNav />

      {/* Header */}
      <div
        className="admin-header-flex"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 className="title-medium" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CreditCard size={28} style={{ color: 'var(--color-primary)' }} />
            Payment Offer Settings
          </h1>
          <p style={{ color: 'var(--color-text-light)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
            Configure the instant card payment discount offered to customers during checkout.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              backgroundColor: isCurrentlyEffective ? '#e6f4ea' : '#fce8e6',
              color: isCurrentlyEffective ? '#137333' : '#c5221f',
              border: `1px solid ${isCurrentlyEffective ? '#ceead6' : '#fad2cf'}`,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isCurrentlyEffective ? '#137333' : '#c5221f',
              }}
            />
            {isCurrentlyEffective ? `${percentage}% Discount Active` : 'Offer Inactive'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '350px' }}>
          <Loader size={48} />
        </div>
      ) : (
        <div className="admin-settings-grid">
          {/* Form Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              padding: '2.5rem 2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {successMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#e6f4ea',
                  color: '#137333',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '2rem',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  borderLeft: '4px solid #137333',
                }}
              >
                <CheckCircle2 size={20} />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#fce8e6',
                  color: '#c5221f',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '2rem',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  borderLeft: '4px solid #c5221f',
                }}
              >
                <AlertCircle size={20} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Toggle Switch */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem',
                  backgroundColor: '#fafafa',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #f0f0f0',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                    Enable Card Payment Offer
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', margin: '0.25rem 0 0' }}>
                    When disabled, no discount or badge is shown to customers.
                  </p>
                </div>

                <label
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '56px',
                    height: '30px',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: isActive ? 'var(--color-primary)' : '#ccc',
                      transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderRadius: '34px',
                      boxShadow: isActive ? '0 2px 8px rgba(29, 78, 58, 0.3)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        content: '""',
                        height: '22px',
                        width: '22px',
                        left: isActive ? '30px' : '4px',
                        bottom: '4px',
                        backgroundColor: 'white',
                        transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    />
                  </span>
                </label>
              </div>

              {/* Percentage Input */}
              <div>
                <label
                  htmlFor="offer-percentage"
                  style={{
                    display: 'block',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  Discount Percentage (%)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    id="offer-percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    className="input-field"
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      paddingRight: '3rem',
                    }}
                    placeholder="5"
                    disabled={!isActive}
                  />
                  <Percent
                    size={20}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      color: 'var(--color-text-light)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
                  Enter a value between 0 and 100. If set to 0%, the discount will be inactive.
                </p>

                {/* Quick Presets */}
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', alignSelf: 'center', marginRight: '0.25rem' }}>
                    Quick presets:
                  </span>
                  {[0, 3, 5, 7.5, 10, 15].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setPercentage(preset);
                        if (preset > 0 && !isActive) {
                          setIsActive(true);
                        }
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        border: Number(percentage) === preset ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: Number(percentage) === preset ? '#f0f4f2' : '#ffffff',
                        color: Number(percentage) === preset ? 'var(--color-primary)' : 'var(--color-text)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Gateway & Safety Note */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  color: '#495057',
                }}
              >
                <ShieldCheck size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Payment Gateway Integration:</strong> The discounted total is recalculated on the backend and sent securely to PAYable with cryptographic signature verification. When deactivated or set to 0%, the standard order total is processed.
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{
                  padding: '16px 24px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  width: '100%',
                }}
              >
                {saving ? <Loader size={18} /> : <Save size={18} />}
                {saving ? 'Saving Changes...' : 'Save Offer Settings'}
              </button>
            </form>
          </div>

          {/* Right Column: Live Customer Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--color-text-light)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              <Eye size={18} /> Live Customer Checkout Preview
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#999', marginBottom: '1rem', fontWeight: 600 }}>
                Step 2: Payment Method
              </p>

              {/* Preview Card Option */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  backgroundColor: '#fdfdfd',
                  marginBottom: '2rem',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '6px solid var(--color-primary)',
                    backgroundColor: 'white',
                  }}
                />
                <CreditCard size={24} style={{ color: 'var(--color-primary)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ fontWeight: 600, margin: 0 }}>Credit / Debit Card</h4>
                    {isCurrentlyEffective ? (
                      <span
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: 'white',
                          padding: '3px 9px',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          letterSpacing: '0.5px',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Sparkles size={10} />
                        {percentage}% OFF
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#888',
                          fontStyle: 'italic',
                        }}
                      >
                        (No offer active)
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: '0.25rem 0 0' }}>
                    Securely pay via PAYable — Visa, Mastercard, Amex, Diners & Discover
                  </p>
                </div>
              </div>

              {/* Preview Order Summary */}
              <div
                style={{
                  backgroundColor: '#fafafa',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.5rem',
                  border: '1px solid #f0f0f0',
                }}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Sample Order Summary
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
                    <span>Subtotal</span>
                    <span>Rs. {sampleSubtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-light)' }}>
                    <span>Delivery</span>
                    <span>Rs. {sampleDelivery.toLocaleString()}</span>
                  </div>

                  {isCurrentlyEffective && sampleDiscount > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                        backgroundColor: '#f0f4f2',
                        padding: '6px 10px',
                        borderRadius: '4px',
                      }}
                    >
                      <span>Card Payment Offer ({percentage}%)</span>
                      <span>- Rs. {sampleDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      marginTop: '0.5rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #ddd',
                    }}
                  >
                    <span>Total Charged</span>
                    <span>Rs. {sampleTotal.toLocaleString()} LKR</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--color-text-light)', textAlign: 'center' }}>
                {isCurrentlyEffective ? (
                  <span style={{ color: '#137333', fontWeight: 600 }}>
                    ✓ Customers will save Rs. {sampleDiscount.toLocaleString()} ({percentage}%) when paying via Card.
                  </span>
                ) : (
                  <span style={{ color: '#666' }}>
                    ⓘ No discount will be applied; customers pay full price.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsScreen;
