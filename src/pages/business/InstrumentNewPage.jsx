import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scale, CheckCircle2, ArrowRight, ArrowLeft, Building, Sparkles } from 'lucide-react';
import { instrumentService } from '../../services/instrumentService';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const InstrumentNewPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    instrumentType: 'Digital Weighing Scale',
    manufacturer: '',
    model: '',
    serialNumber: '',
    capacity: '',
    accuracyClass: 'Class III (Medium Accuracy)',
    purchaseDate: new Date().toISOString().split('T')[0],
    location: '',
    ownerName: user?.name || 'Authorized Trader'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdInstrument, setCreatedInstrument] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const autoFillSample = () => {
    setFormData({
      instrumentType: 'Electronic Bench Scale',
      manufacturer: 'Mettler Toledo Metrology',
      model: 'BBA231-35S',
      serialNumber: `MT-${Math.floor(100000 + Math.random() * 900000)}`,
      capacity: '35 kg',
      accuracyClass: 'Class III (Medium Accuracy)',
      purchaseDate: '2026-02-14',
      location: 'Secondary Dispatch Counter, Delhi Terminal',
      ownerName: user?.name || 'Authorized Trader'
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.instrumentType) errs.instrumentType = 'Instrument Type is required';
    if (!formData.manufacturer.trim()) errs.manufacturer = 'Manufacturer name is required';
    if (!formData.model.trim()) errs.model = 'Model number is required';
    if (!formData.serialNumber.trim()) errs.serialNumber = 'Unique Serial Number is required';
    if (!formData.capacity.trim()) errs.capacity = 'Capacity is required (e.g. 50 kg)';
    if (!formData.location.trim()) errs.location = 'Operating physical location is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await instrumentService.createInstrument(formData);
      setCreatedInstrument(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/business/instruments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Instruments</span>
        </Link>
      </div>

      {createdInstrument ? (
        /* Success Screen showing Digital Instrument ID */
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Registration Successful
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-heading">
              Instrument Registered in National Metrology Index
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your device has been assigned a unique, tamper-evident Digital Instrument Identifier.
            </p>
          </div>

          {/* Prominent Digital ID Box */}
          <div className="p-5 bg-slate-900 text-white rounded-xl max-w-md mx-auto space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-widest block">
              Assigned Digital Instrument ID
            </span>
            <p className="font-mono text-2xl font-black text-white tracking-wider">
              {createdInstrument.id}
            </p>
            <p className="text-[11px] text-slate-400">
              Serial: {createdInstrument.serialNumber} • {createdInstrument.model}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
            <Link to={`/business/instruments/${createdInstrument.id}`}>
              <Button variant="outline" size="md">
                View Instrument Details
              </Button>
            </Link>
            <Link to={`/business/applications/new?instrumentId=${createdInstrument.id}`}>
              <Button variant="primary" size="md" rightIcon={ArrowRight}>
                Create Verification Application
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-heading">
                Register Weighing or Measuring Instrument
              </h2>
              <p className="text-xs text-slate-500">
                Statutory registration under Legal Metrology Act & Rules
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={Sparkles}
              onClick={autoFillSample}
            >
              Fill Sample Data
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Owner Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner / Trader Name *
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="Owner / Proprietor Name"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            {/* Instrument Type & Accuracy Class */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instrument Type *
                </label>
                <select
                  name="instrumentType"
                  value={formData.instrumentType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Digital Weighing Scale">Digital Weighing Scale (NAWI)</option>
                  <option value="Electronic Bench Scale">Electronic Bench Scale</option>
                  <option value="Heavy Duty Platform Scale">Heavy Duty Platform Scale</option>
                  <option value="Precision Laboratory Micro-Balance">Precision Laboratory Balance (Class I/II)</option>
                  <option value="Fuel Dispenser Flow Meter">Fuel Dispenser Flow Meter</option>
                  <option value="Weighbridge Truck Scale">Weighbridge Truck Scale</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Accuracy Class *
                </label>
                <select
                  name="accuracyClass"
                  value={formData.accuracyClass}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="Class III (Medium Accuracy)">Class III (Medium Accuracy - Retail/Commercial)</option>
                  <option value="Class I (Special High Precision)">Class I (Special High Precision - Laboratory)</option>
                  <option value="Class II (High Accuracy)">Class II (High Accuracy - Precious Metals/Jewelry)</option>
                  <option value="Class IIII (Ordinary Accuracy)">Class IIII (Ordinary - Bulk Scrap/Aggregates)</option>
                </select>
              </div>
            </div>

            {/* Manufacturer & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Manufacturer / Make *
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g. ABC Instruments Ltd."
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.manufacturer ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {errors.manufacturer && <p className="mt-1 text-[11px] text-rose-600">{errors.manufacturer}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Model Designation *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. WS-500 Industrial"
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.model ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {errors.model && <p className="mt-1 text-[11px] text-rose-600">{errors.model}</p>}
              </div>
            </div>

            {/* Serial Number & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Serial Number (Stamped on plate) *
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="e.g. WS123456"
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border font-mono rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.serialNumber ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {errors.serialNumber && <p className="mt-1 text-[11px] text-rose-600">{errors.serialNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Capacity Rating *
                </label>
                <input
                  type="text"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="e.g. 50 kg"
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.capacity ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {errors.capacity && <p className="mt-1 text-[11px] text-rose-600">{errors.capacity}</p>}
              </div>
            </div>

            {/* Purchase Date & Operating Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operating Site / Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Main Billing Counter 1, New Delhi"
                  className={`w-full px-3 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {errors.location && <p className="mt-1 text-[11px] text-rose-600">{errors.location}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Link to="/business/instruments">
                <Button variant="outline" size="md">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                rightIcon={ArrowRight}
              >
                Register Instrument & Generate ID
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InstrumentNewPage;
