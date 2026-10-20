/**
 * Legal Metrology Notification Service
 * Role-isolated notification management ensuring Officers, Inspectors, and Business owners
 * strictly receive and view notifications intended for their specific statutory role.
 */

const ROLE_DEFAULT_NOTIFICATIONS = {
  OFFICER: [
    {
      id: 'notif-off-1',
      recipientRole: 'OFFICER',
      type: 'AI_DISCREPANCY',
      title: 'Statutory Dossier Flagged (MV-APP-644926)',
      titleHi: 'वैधानिक डोजियर चिह्नित (MV-APP-644926)',
      message: 'High-priority anomaly: Ramesh Kirana & General Stores declared serial "MT-303755" was NOT detected on document (88% risk). Officer adjudication required.',
      messageHi: 'उच्च-प्राथमिकता विसंगति: रमेश किराना का घोषित सीरियल "MT-303755" दस्तावेज़ में नहीं मिला (88% जोखिम)। अधिकारी निर्णय आवश्यक है।',
      time: 'Just now',
      timeHi: 'अभी-अभी',
      unread: true,
      link: '/officer/applications'
    },
    {
      id: 'notif-off-2',
      recipientRole: 'OFFICER',
      type: 'INSPECTION_SUBMITTED',
      title: 'Field Audit Report Submitted',
      titleHi: 'फ़ील्ड ऑडिट रिपोर्ट प्रस्तुत',
      message: 'Insp. Vikram Sharma submitted on-site weight verification & tamper seal #SEAL-9921 for application MV-APP-440211.',
      messageHi: 'निरीक्षक विक्रम शर्मा ने आवेदन MV-APP-440211 के लिए ऑन-साइट वजन सत्यापन एवं सील #SEAL-9921 जमा की।',
      time: '45m ago',
      timeHi: '45 मिनट पहले',
      unread: true,
      link: '/officer/inspections'
    },
    {
      id: 'notif-off-3',
      recipientRole: 'OFFICER',
      type: 'CERT_PENDING',
      title: 'Certificates Awaiting Sign-off',
      titleHi: 'डिजिटल हस्ताक्षर हेतु लंबित प्रमाणपत्र',
      message: '3 verification dossiers approved in field inspection are awaiting officer SHA-256 digital signature.',
      messageHi: 'फ़ील्ड सत्यापन में स्वीकृत 3 डोजियर अधिकारी के SHA-256 डिजिटल हस्ताक्षर की प्रतीक्षा कर रहे हैं।',
      time: '2h ago',
      timeHi: '2 घंटे पहले',
      unread: false,
      link: '/officer/certificates'
    },
    {
      id: 'notif-off-4',
      recipientRole: 'OFFICER',
      type: 'STATUTORY_ALERT',
      title: 'Statutory SLA Warning (Rule 14)',
      titleHi: 'वैधानिक एसएलए चेतावनी (नियम 14)',
      message: 'Application MV-APP-388210 is approaching the 3-day statutory decision window under the Legal Metrology Act.',
      messageHi: 'आवेदन MV-APP-388210 विधिक मापविज्ञान अधिनियम के तहत 3-दिवसीय वैधानिक निर्णय समयसीमा के करीब है।',
      time: 'Yesterday',
      timeHi: 'कल',
      unread: false,
      link: '/officer/applications'
    }
  ],

  INSPECTOR: [
    {
      id: 'notif-insp-1',
      recipientRole: 'INSPECTOR',
      type: 'INSPECTION_ASSIGNED',
      title: 'New Field Inspection Assigned',
      titleHi: 'नया फ़ील्ड निरीक्षण सौंपा गया',
      message: 'Verification task assigned for Weighbridge WB-40T at Apex Logistics (Industrial Area Phase 2). Geo-fenced test required.',
      messageHi: 'एपेक्स लॉजिस्टिक्स में वे-ब्रिज WB-40T के लिए सत्यापन कार्य सौंपा गया। जियो-फ़ेंस्ड परीक्षण आवश्यक है।',
      time: 'Just now',
      timeHi: 'अभी-अभी',
      unread: true,
      link: '/inspector/assignments'
    },
    {
      id: 'notif-insp-2',
      recipientRole: 'INSPECTOR',
      type: 'SCHEDULE_ALERT',
      title: "Today's Verification Schedule",
      titleHi: 'आज का सत्यापन कार्यक्रम',
      message: 'You have 3 field inspections scheduled today. Working standard kit #KIT-IV test verification required on site.',
      messageHi: 'आज आपके 3 फ़ील्ड निरीक्षण निर्धारित हैं। साइट पर वर्किंग स्टैंडर्ड किट #KIT-IV टेस्ट सत्यापन आवश्यक है।',
      time: '1h ago',
      timeHi: '1 घंटा पहले',
      unread: true,
      link: '/inspector/dashboard'
    },
    {
      id: 'notif-insp-3',
      recipientRole: 'INSPECTOR',
      type: 'CALIBRATION_DUE',
      title: 'Standard Weights Recalibration Due',
      titleHi: 'मानक वजन पुन: अंशांकन देय',
      message: 'Working standard 20 kg brass test weight set #TS-108 due for secondary laboratory recalibration within 7 days.',
      messageHi: 'कार्यकारी मानक 20 किग्रा पीतल टेस्ट वेट सेट #TS-108 का 7 दिनों के भीतर प्रयोगशाला पुन: अंशांकन देय है।',
      time: 'Yesterday',
      timeHi: 'कल',
      unread: false,
      link: '/inspector/assignments'
    },
    {
      id: 'notif-insp-4',
      recipientRole: 'INSPECTOR',
      type: 'INSPECTION_COMPLETED',
      title: 'Audit Synchronized to Central Registry',
      titleHi: 'ऑडिट केंद्रीय रजिस्ट्री में सिंक्रनाइज़',
      message: 'Verification report for MV-APP-440211 successfully synchronized with central trust chain.',
      messageHi: 'MV-APP-440211 की सत्यापन रिपोर्ट केंद्रीय ट्रस्ट चेन में सफलतापूर्वक सिंक्रनाइज़ की गई।',
      time: '2 days ago',
      timeHi: '2 दिन पहले',
      unread: false,
      link: '/inspector/inspections/completed'
    }
  ],

  BUSINESS: [
    {
      id: 'notif-biz-1',
      recipientRole: 'BUSINESS',
      type: 'AI_DISCREPANCY',
      title: 'AI Pre-check Discrepancy Flagged',
      titleHi: 'एआई प्री-चेक विसंगति चिह्नित',
      message: 'Statutory scrutiny detected non-conforming or mismatched document data for instrument MT-108484. Please review your invoice.',
      messageHi: 'उपकरण MT-108484 के लिए दस्तावेज़ में विसंगति पाई गई। कृपया अपने इनवॉइस की समीक्षा करें।',
      time: 'Just now',
      timeHi: 'अभी-अभी',
      unread: true,
      link: '/business/applications'
    },
    {
      id: 'notif-biz-2',
      recipientRole: 'BUSINESS',
      type: 'INSPECTION_ASSIGNED',
      title: 'Field Verification Scheduled',
      titleHi: 'दुकान सत्यापन निर्धारित',
      message: 'Legal Metrology Inspector Vikram Sharma has been scheduled for standard weight test audit at your registered store.',
      messageHi: 'विधिक मापविज्ञान निरीक्षक विक्रम शर्मा को आपकी पंजीकृत दुकान पर मानक वजन परीक्षण के लिए नियुक्त किया गया है।',
      time: '45m ago',
      timeHi: '45 मिनट पहले',
      unread: true,
      link: '/business/applications'
    },
    {
      id: 'notif-biz-3',
      recipientRole: 'BUSINESS',
      type: 'CERT_ISSUED',
      title: 'Digital Certificate Active',
      titleHi: 'डिजिटल प्रमाणपत्र सक्रिय',
      message: 'Verification Certificate #METRA-CERT-2026-595654 published with SHA-256 seal. Ready for download and storefront display.',
      messageHi: 'सत्यापन प्रमाणपत्र #METRA-CERT-2026-595654 SHA-256 सील के साथ प्रकाशित किया गया। डाउनलोड के लिए तैयार।',
      time: '3h ago',
      timeHi: '3 घंटे पहले',
      unread: false,
      link: '/business/certificates'
    },
    {
      id: 'notif-biz-4',
      recipientRole: 'BUSINESS',
      type: 'STATUTORY_ALERT',
      title: 'Periodic Verification Cycle Open',
      titleHi: 'आवधिक सत्यापन चक्र प्रारंभ',
      message: 'Quarterly compliance window open under Legal Metrology Act, 2009 for commercial weighing instruments.',
      messageHi: 'वाणिज्यिक माप उपकरणों के लिए विधिक मापविज्ञान अधिनियम, 2009 के तहत तिमाही अनुपालन विंडो खुली है।',
      time: 'Yesterday',
      timeHi: 'कल',
      unread: false,
      link: '/business/instruments'
    }
  ]
};

const normalizeRole = (role) => {
  if (!role) return 'BUSINESS';
  const upper = String(role).toUpperCase();
  if (upper === 'ADMIN' || upper.includes('OFFICER')) return 'OFFICER';
  if (upper.includes('INSPECT')) return 'INSPECTOR';
  return 'BUSINESS';
};

const getStorageKey = (role, user) => {
  const normRole = normalizeRole(role);
  const userId = user?.id || user?.email ? String(user.id || user.email).replace(/[^a-zA-Z0-9_-]/g, '_') : 'shared';
  return `mv_notifs_${normRole.toLowerCase()}_${userId}`;
};

export const notificationService = {
  /**
   * Strictly retrieves notifications intended for this specific role and user.
   * Isolates officers, inspectors, and business users so no role ever sees another's notifications.
   */
  getNotifications: (role, user) => {
    const normRole = normalizeRole(role);
    const key = getStorageKey(normRole, user);

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Strictly filter out any items that do not belong to this role
          return parsed.filter((item) => {
            const itemRole = normalizeRole(item.recipientRole);
            if (itemRole !== normRole) return false;
            if (item.recipientId && user?.id && item.recipientId !== user.id) return false;
            return true;
          });
        }
      }
    } catch (e) {
      console.warn('[NotificationService] Error reading stored notifications:', e);
    }

    // Default curated notifications strictly for this role
    const defaults = ROLE_DEFAULT_NOTIFICATIONS[normRole] || ROLE_DEFAULT_NOTIFICATIONS.BUSINESS;
    try {
      localStorage.setItem(key, JSON.stringify(defaults));
    } catch {
      // storage unavailable
    }
    return defaults;
  },

  /**
   * Mark a single notification as read within this role's isolated inbox.
   */
  markAsRead: (role, user, notifId) => {
    const normRole = normalizeRole(role);
    const key = getStorageKey(normRole, user);
    const current = notificationService.getNotifications(normRole, user);
    const updated = current.map((n) => (n.id === notifId ? { ...n, unread: false } : n));
    try {
      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('metra:notification:update', { detail: { role: normRole } }));
    } catch (e) {
      console.warn('[NotificationService] Error updating notification:', e);
    }
    return updated;
  },

  /**
   * Mark all notifications as read strictly for this role.
   */
  markAllAsRead: (role, user) => {
    const normRole = normalizeRole(role);
    const key = getStorageKey(normRole, user);
    const current = notificationService.getNotifications(normRole, user);
    const updated = current.map((n) => ({ ...n, unread: false }));
    try {
      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('metra:notification:update', { detail: { role: normRole } }));
    } catch (e) {
      console.warn('[NotificationService] Error marking all as read:', e);
    }
    return updated;
  },

  /**
   * Clear all notifications strictly for this role without touching other users.
   */
  clearAll: (role, user) => {
    const normRole = normalizeRole(role);
    const key = getStorageKey(normRole, user);
    try {
      localStorage.setItem(key, JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('metra:notification:update', { detail: { role: normRole } }));
    } catch (e) {
      console.warn('[NotificationService] Error clearing notifications:', e);
    }
    return [];
  },

  /**
   * Dispatch a new notification targeted strictly to a specific recipient role/user.
   */
  addNotification: (notification) => {
    const recipientRole = normalizeRole(notification.recipientRole || 'BUSINESS');
    const key = getStorageKey(recipientRole, { id: notification.recipientId });
    const current = notificationService.getNotifications(recipientRole, { id: notification.recipientId });
    const newNotif = {
      id: notification.id || `notif-${Date.now()}`,
      recipientRole,
      type: notification.type || 'STATUTORY_ALERT',
      title: notification.title,
      titleHi: notification.titleHi || notification.title,
      message: notification.message,
      messageHi: notification.messageHi || notification.message,
      time: notification.time || 'Just now',
      timeHi: notification.timeHi || 'अभी-अभी',
      unread: true,
      link: notification.link || notificationService.getViewAllRoute(recipientRole),
      ...notification
    };

    const updated = [newNotif, ...current.filter((n) => n.id !== newNotif.id)];
    try {
      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('metra:notification:update', { detail: { role: recipientRole } }));
    } catch (e) {
      console.warn('[NotificationService] Error adding notification:', e);
    }
    return updated;
  },

  /**
   * Target destination for the "View All" footer action in Topbar based on role.
   */
  getViewAllRoute: (role) => {
    const normRole = normalizeRole(role);
    switch (normRole) {
      case 'OFFICER':
        return '/officer/applications';
      case 'INSPECTOR':
        return '/inspector/assignments';
      case 'BUSINESS':
      default:
        return '/business/applications';
    }
  },

  /**
   * Action button label for Topbar footer based on role and language.
   */
  getViewAllLabel: (role, isHindi) => {
    const normRole = normalizeRole(role);
    switch (normRole) {
      case 'OFFICER':
        return isHindi ? 'सभी समीक्षा डोजियर देखें →' : 'View Review Dossiers →';
      case 'INSPECTOR':
        return isHindi ? 'सभी असाइनमेंट देखें →' : 'View All Assignments →';
      case 'BUSINESS':
      default:
        return isHindi ? 'सभी आवेदन देखें →' : 'View All Applications →';
    }
  }
};

export default notificationService;
