import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Tag,
  CheckCircle2,
  AlertCircle,
  Save,
  Percent,
  Sparkles,
  Eye,
  ShieldCheck,
  Plus,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import axios from 'axios';
import AdminNav from '../../components/AdminNav';
import Loader from '../../components/Loader';

const AdminSettingsScreen = () => {
  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'coupons'

  // Card Offer State
  const [isActive, setIsActive] = useState(true);
  const [percentage, setPercentage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Promo Code Feature State
  const [isPromoActive, setIsPromoActive] = useState(false);
  const [savingPromoToggle, setSavingPromoToggle] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newPercentage, setNewPercentage] = useState(10);
  const [creatingCoupon, setCreatingCoupon] = useState(false);
  const [couponSuccessMessage, setCouponSuccessMessage] = useState(null);
  const [couponErrorMessage, setCouponErrorMessage] = useState(null);

  const navigate = useNavigate();

  // Load Settings and Coupons
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const { data: settings } = await axios.get('/api/settings');

        if (settings) {
          if (settings.cardPaymentDiscount) {
            setIsActive(Boolean(settings.cardPaymentDiscount.isActive));
            setPercentage(
              settings.cardPaymentDiscount.percentage !== undefined
                ? Number(settings.cardPaymentDiscount.percentage)
                : 5
            );
          }
          if (settings.promoCodeFeature) {
            setIsPromoActive(Boolean(settings.promoCodeFeature.isActive));
          }
        }

        // Fetch coupons
        try {
          setLoadingCoupons(true);
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data: couponList } = await axios.get('/api/coupons', config);
          setCoupons(couponList || []);
        } catch (cErr) {
          console.error('Failed to load coupons:', cErr);
        } finally {
          setLoadingCoupons(false);
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

    fetchInitialData();
  }, [navigate]);

  // Handle Card Offer Save
  const handleCardSubmit = async (e) => {
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

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error('Failed to save card offer:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to save settings. Please try again.'
      );
      setSaving(false);
    }
  };

  // Handle Master Promo Code Feature Toggle
  const handleTogglePromoFeature = async (newVal) => {
    setCouponSuccessMessage(null);
    setCouponErrorMessage(null);
    setSavingPromoToggle(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const payload = {
        promoCodeFeature: {
          isActive: newVal,
        },
      };

      await axios.put('/api/settings', payload, config);
      setIsPromoActive(newVal);
      setCouponSuccessMessage(
        newVal
          ? 'Promo Code feature activated! Customers can now enter promo codes at checkout.'
          : 'Promo Code feature deactivated. Promo code input is now hidden from checkout.'
      );

      setTimeout(() => {
        setCouponSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error('Failed to toggle promo feature:', err);
      setCouponErrorMessage(
        err.response?.data?.message || 'Failed to update promo feature status.'
      );
    } finally {
      setSavingPromoToggle(false);
    }
  };

  // Handle Create Coupon
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCouponSuccessMessage(null);
    setCouponErrorMessage(null);

    const cleanCode = newCode.toUpperCase().trim();
    if (!cleanCode) {
      setCouponErrorMessage('Please enter a coupon code name.');
      return;
    }

    const pct = Number(newPercentage);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      setCouponErrorMessage('Discount percentage must be between 1 and 100.');
      return;
    }

    try {
      setCreatingCoupon(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data: created } = await axios.post(
        '/api/coupons',
        { code: cleanCode, percentage: pct, isActive: true },
        config
      );

      setCoupons([created, ...coupons]);
      setNewCode('');
      setNewPercentage(10);
      setCouponSuccessMessage(`Coupon "${created.code}" created successfully with ${created.percentage}% discount!`);

      setTimeout(() => {
        setCouponSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error('Failed to create coupon:', err);
      setCouponErrorMessage(err.response?.data?.message || 'Failed to create coupon.');
    } finally {
      setCreatingCoupon(false);
    }
  };

  // Handle Toggle Individual Coupon Active
  const handleToggleCouponActive = async (id, currentStatus) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data: updated } = await axios.put(
        `/api/coupons/${id}`,
        { isActive: !currentStatus },
        config
      );

      setCoupons(coupons.map((c) => (c._id === id ? updated : c)));
    } catch (err) {
      console.error('Failed to update coupon status:', err);
      setCouponErrorMessage(err.response?.data?.message || 'Failed to update coupon status.');
    }
  };

  // Handle Delete Coupon
  const handleDeleteCoupon = async (id, code) => {
    if (!window.confirm(`Are you sure you want to delete promo code "${code}"?`)) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

      await axios.delete(`/api/coupons/${id}`, config);
      setCoupons(coupons.filter((c) => c._id !== id));
      setCouponSuccessMessage(`Promo code "${code}" deleted successfully.`);

      setTimeout(() => {
        setCouponSuccessMessage(null);
      }, 4000);
    } catch (err) {
      console.error('Failed to delete coupon:', err);
      setCouponErrorMessage(err.response?.data?.message || 'Failed to delete coupon.');
    }
  };

  // Live preview calculations for card offer
  const sampleSubtotal = 7500;
  const sampleDelivery = 350;
  const isCardEffective = isActive && Number(percentage) > 0;
  const sampleCardDiscount = isCardEffective
    ? Math.round((sampleSubtotal * Number(percentage)) / 100)
    : 0;
  const sampleTotal = sampleSubtotal + sampleDelivery - sampleCardDiscount;

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
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 className="title-medium" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={28} style={{ color: 'var(--color-primary)' }} />
            Discounts & Offers
          </h1>
          <p style={{ color: 'var(--color-text-light)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
            Manage the instant card payment discount and promotional coupon codes.
          </p>
        </div>

        {/* Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
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
              backgroundColor: isCardEffective ? '#e6f4ea' : '#fce8e6',
              color: isCardEffective ? '#137333' : '#c5221f',
              border: `1px solid ${isCardEffective ? '#ceead6' : '#fad2cf'}`,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isCardEffective ? '#137333' : '#c5221f',
              }}
            />
            Card Offer: {isCardEffective ? `${percentage}% Active` : 'Off'}
          </span>

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
              backgroundColor: isPromoActive ? '#e6f4ea' : '#fce8e6',
              color: isPromoActive ? '#137333' : '#c5221f',
              border: `1px solid ${isPromoActive ? '#ceead6' : '#fad2cf'}`,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isPromoActive ? '#137333' : '#c5221f',
              }}
            />
            Promo Codes: {isPromoActive ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs-container" style={{ marginBottom: '2.5rem' }}>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'card' ? 'active' : ''}`}
          onClick={() => setActiveTab('card')}
        >
          <CreditCard size={18} />
          Card Payment Offer
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'coupons' ? 'active' : ''}`}
          onClick={() => setActiveTab('coupons')}
        >
          <Tag size={18} />
          Promo Codes & Coupons
          {coupons.length > 0 && (
            <span
              style={{
                backgroundColor: activeTab === 'coupons' ? 'var(--color-primary)' : '#e0e0e0',
                color: activeTab === 'coupons' ? '#fff' : 'var(--color-text)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginLeft: '0.25rem',
              }}
            >
              {coupons.length}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '350px' }}>
          <Loader size={48} />
        </div>
      ) : activeTab === 'card' ? (
        /* ══════════════════════════════════════════════════════════════════════════
           TAB 1: CARD PAYMENT OFFER
        ══════════════════════════════════════════════════════════════════════════ */
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

            <form onSubmit={handleCardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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

              {/* Gateway Note */}
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
                  <strong>Payment Gateway Security:</strong> The final amount sent to PAYable is recalculated on the backend and cryptographically verified.
                </div>
              </div>

              {/* Save Button */}
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
              <Eye size={18} /> Customer Checkout Preview
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
                Payment Method Selection
              </p>

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
                    {isCardEffective ? (
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
                      <span style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic' }}>
                        (No offer active)
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: '0.25rem 0 0' }}>
                    Securely pay via PAYable — Visa, Mastercard, Amex, Diners & Discover
                  </p>
                </div>
              </div>

              {/* Sample Order Summary */}
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

                  {isCardEffective && sampleCardDiscount > 0 && (
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
                      <span>- Rs. {sampleCardDiscount.toLocaleString()}</span>
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
            </div>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════════════
           TAB 2: PROMO CODES & COUPONS
        ══════════════════════════════════════════════════════════════════════════ */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Master Feature Toggle Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div style={{ maxWidth: '650px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Tag size={22} style={{ color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                  Promo Code Feature
                </h3>
                <span
                  style={{
                    backgroundColor: isPromoActive ? '#e6f4ea' : '#fce8e6',
                    color: isPromoActive ? '#137333' : '#c5221f',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {isPromoActive ? 'Active' : 'Deactivated'}
                </span>
              </div>
              <p style={{ color: 'var(--color-text-light)', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                When activated, customers will see an optional promo code input at checkout. When deactivated, no promo code input will be shown.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                className={`btn ${isPromoActive ? 'btn-outline' : 'btn-primary'}`}
                onClick={() => handleTogglePromoFeature(!isPromoActive)}
                disabled={savingPromoToggle}
                style={{
                  minWidth: '170px',
                  justifyContent: 'center',
                  padding: '12px 20px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  gap: '0.5rem',
                }}
              >
                {savingPromoToggle ? (
                  <Loader size={16} />
                ) : isPromoActive ? (
                  <>
                    <X size={16} /> Deactivate Feature
                  </>
                ) : (
                  <>
                    <Check size={16} /> Activate Feature
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {couponSuccessMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#e6f4ea',
                color: '#137333',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem',
                fontWeight: 500,
                borderLeft: '4px solid #137333',
              }}
            >
              <CheckCircle2 size={20} />
              <span>{couponSuccessMessage}</span>
            </div>
          )}

          {couponErrorMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#fce8e6',
                color: '#c5221f',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.95rem',
                fontWeight: 500,
                borderLeft: '4px solid #c5221f',
              }}
            >
              <AlertCircle size={20} />
              <span>{couponErrorMessage}</span>
            </div>
          )}

          {/* 2-Column Grid: Create Coupon Form + Coupons List */}
          <div className="admin-settings-grid">
            {/* Create Coupon Form Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} style={{ color: 'var(--color-primary)' }} />
                Add New Coupon Code
              </h3>

              <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label
                    htmlFor="coupon-code-input"
                    style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}
                  >
                    Coupon Code Name *
                  </label>
                  <input
                    id="coupon-code-input"
                    type="text"
                    placeholder="e.g. SUMMER20, VIP15"
                    className="input-field"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                    style={{
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      letterSpacing: '1px',
                    }}
                    required
                  />
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.4rem' }}>
                    Codes are case-insensitive and automatically formatted in uppercase.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="coupon-pct-input"
                    style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}
                  >
                    Discount Percentage (%) *
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      id="coupon-pct-input"
                      type="number"
                      min="1"
                      max="100"
                      step="0.5"
                      placeholder="10"
                      className="input-field"
                      value={newPercentage}
                      onChange={(e) => setNewPercentage(e.target.value)}
                      style={{ fontSize: '1.15rem', fontWeight: 700, paddingRight: '2.5rem' }}
                      required
                    />
                    <Percent
                      size={18}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        color: 'var(--color-text-light)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Presets */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', alignSelf: 'center', marginRight: '0.25rem' }}>
                    Quick presets:
                  </span>
                  {[5, 10, 15, 20, 25, 30].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewPercentage(preset)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: Number(newPercentage) === preset ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: Number(newPercentage) === preset ? '#f0f4f2' : '#ffffff',
                        color: Number(newPercentage) === preset ? 'var(--color-primary)' : 'var(--color-text)',
                        cursor: 'pointer',
                      }}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creatingCoupon}
                  style={{
                    padding: '14px 20px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                  }}
                >
                  {creatingCoupon ? <Loader size={18} /> : <Plus size={18} />}
                  {creatingCoupon ? 'Adding Coupon...' : 'Create Coupon Code'}
                </button>
              </form>
            </div>

            {/* Coupons List Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag size={20} style={{ color: 'var(--color-primary)' }} />
                  Existing Promo Codes ({coupons.length})
                </h3>
              </div>

              {loadingCoupons ? (
                <div className="flex-center" style={{ minHeight: '180px' }}>
                  <Loader size={32} />
                </div>
              ) : coupons.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    backgroundColor: '#fafafa',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px dashed #ddd',
                  }}
                >
                  <Tag size={36} style={{ color: '#ccc', marginBottom: '0.75rem' }} />
                  <p style={{ fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>No promo codes created yet.</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
                    Create your first code using the form on the left.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {coupons.map((coupon) => (
                    <div
                      key={coupon._id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 1.25rem',
                        backgroundColor: coupon.isActive ? '#ffffff' : '#f9f9f9',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${coupon.isActive ? 'var(--color-border)' : '#eee'}`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            fontSize: '1rem',
                            letterSpacing: '1px',
                            color: coupon.isActive ? 'var(--color-primary)' : '#888',
                            backgroundColor: coupon.isActive ? '#f0f4f2' : '#eee',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            border: `1px solid ${coupon.isActive ? '#d2ded7' : '#ddd'}`,
                          }}
                        >
                          {coupon.code}
                        </span>

                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            color: coupon.isActive ? 'var(--color-text)' : '#888',
                          }}
                        >
                          {coupon.percentage}% OFF
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Status Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleCouponActive(coupon._id, coupon.isActive)}
                          style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: coupon.isActive ? '#137333' : '#888',
                          }}
                          title={coupon.isActive ? 'Click to deactivate' : 'Click to activate'}
                        >
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: coupon.isActive ? '#137333' : '#aaa',
                              display: 'inline-block',
                            }}
                          />
                          <span className="hide-mobile">{coupon.isActive ? 'Active' : 'Disabled'}</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                          style={{
                            border: 'none',
                            backgroundColor: '#fff0f0',
                            color: 'var(--color-error)',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                          title="Delete coupon"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsScreen;
