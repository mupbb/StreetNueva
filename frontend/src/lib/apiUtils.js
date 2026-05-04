/**
 * Shared API utilities for the Street Prime Detail landing page.
 * Provides a centralized way to send events to Meta Conversions API (CAPI)
 * and other backend services.
 */

export const sendMetaEvent = async (eventName, value = 0, phone = null, email = null) => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
    
    // Skip if no backend URL is configured to avoid noise in console
    if (!backendUrl) return;

    try {
        const response = await fetch(`${backendUrl}/api/meta-event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_name: eventName,
                value: parseFloat(value) || 0,
                currency: 'MXN',
                email: email || null,
                phone: phone || null,
                event_id: `evt_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
            })
        });

        if (!response.ok) {
            // Log warning only if we have a successful connection but bad status
            console.warn(`Meta CAPI status: ${response.status}`);
        }
    } catch (error) {
        // Meta event delivery is non-critical, silence network errors in production
        if (process.env.NODE_ENV === 'development') {
            console.warn('Meta CAPI connection failed', error);
        }
    }
};

/**
 * Tracks a user action locally and via Meta CAPI
 * @param {string} action Category of the action (e.g., 'PackageSelection')
 * @param {object} data Metadata for the action
 */
export const trackUserAction = (action, data = {}) => {
    // 1. Log to console for debugging in dev
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Track] ${action}:`, data);
    }

    // 2. Map actions to Meta Standard Events
    switch (action) {
        case 'SelectPackage':
            sendMetaEvent('ViewContent', data.price, null, null);
            break;
        case 'InitiatePayment':
            sendMetaEvent('InitiateCheckout', data.price, null, null);
            break;
        case 'SubmitLead':
            sendMetaEvent('Lead', data.price, data.phone, data.email);
            break;
        default:
            break;
    }
};
