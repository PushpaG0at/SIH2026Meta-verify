import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Scale, Search, Filter } from 'lucide-react';
import { instrumentService } from '../../services/instrumentService';
import InstrumentCard from '../../components/instruments/InstrumentCard';
import Button from '../../components/ui/Button';
import SearchBar from '../../components/ui/SearchBar';
import FilterDropdown from '../../components/ui/FilterDropdown';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';

export const InstrumentsListPage = () => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchInstruments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await instrumentService.getInstruments();
      setInstruments(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to retrieve registered instruments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstruments();
  }, []);


  const filtered = instruments.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.instrumentType.toLowerCase().includes(search.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            Registered Instruments
          </h2>
          <p className="text-xs text-slate-500">
            Commercial weighing and measuring devices under your trade registry
          </p>
        </div>
        <Link to="/business/instruments/new">
          <Button variant="primary" size="md" leftIcon={PlusCircle}>
            Register New Instrument
          </Button>
        </Link>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by ID, serial number, make, model..."
          className="flex-1"
        />
        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          label="Status"
          options={[
            { label: 'Verified', value: 'VERIFIED' },
            { label: 'Inspection Scheduled', value: 'INSPECTION_SCHEDULED' },
            { label: 'Pending Review', value: 'PENDING_REVIEW' }
          ]}
        />
      </div>

      {/* Grid listing */}
      {loading ? (
        <LoadingState message="Fetching registered instruments..." />
      ) : error ? (
        <ErrorState
          title="Unable to load instruments"
          message={error}
          onRetry={fetchInstruments}
        />
      ) : filtered.length === 0 ? (
        <EmptyState

          icon={Scale}
          title="No instruments found"
          description="No weighing or measuring instruments match your search or filter criteria."
          actionText="Register Instrument"
          onAction={() => window.location.href = '/business/instruments/new'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((inst) => (
            <InstrumentCard key={inst.id} instrument={inst} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InstrumentsListPage;
