import React, { useState, useEffect } from 'react';
import { Award, Search, Filter } from 'lucide-react';
import { certificateService } from '../../services/certificateService';
import CertificateCard from '../../components/certificates/CertificateCard';
import SearchBar from '../../components/ui/SearchBar';
import FilterDropdown from '../../components/ui/FilterDropdown';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export const CertificatesListPage = () => {
  const { t, isHindi } = useLanguage();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { showToast } = useToast();

  const fetchCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await certificateService.getCertificates();
      setCertificates(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to retrieve certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);


  const handleDownload = (cert) => {
    showToast(`Downloading digital PDF certificate for ${cert.id}...`, 'success');
  };

  const filtered = certificates.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.businessName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? c.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            {t.verificationCertificatesTitle || 'Verification Certificates'}
          </h2>
          <p className="text-xs text-slate-500">
            {t.verificationCertificatesSub || 'Official cryptographically signed legal metrology verification certificates'}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={isHindi ? "प्रमाणपत्र आईडी, सीरियल, व्यवसाय द्वारा खोजें..." : "Search by Certificate ID, Serial, Business..."}
          className="flex-1"
        />
        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          label={isHindi ? "स्थिति" : "Status"}
          options={[
            { label: isHindi ? 'वैध एवं सक्रिय' : 'Valid & Active', value: 'VALID' },
            { label: isHindi ? 'समाप्त' : 'Expired', value: 'EXPIRED' },
            { label: isHindi ? 'रद्द' : 'Revoked', value: 'REVOKED' }
          ]}
        />
      </div>

      {loading ? (
        <LoadingState message={isHindi ? "जारी किए गए प्रमाणपत्र लोड हो रहे हैं..." : "Fetching issued certificates..."} />
      ) : error ? (
        <ErrorState
          title={isHindi ? "प्रमाणपत्र लोड करने में असमर्थ" : "Unable to load certificates"}
          message={error}
          onRetry={fetchCertificates}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Award}
          title={isHindi ? "कोई प्रमाणपत्र नहीं मिला" : "No certificates found"}
          description={isHindi ? "आपकी खोज या मानदंडों से मेल खाने वाला कोई डिजिटल प्रमाणपत्र नहीं मिला है।" : "No digital certificates match your query or have been issued under this criteria."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesListPage;
