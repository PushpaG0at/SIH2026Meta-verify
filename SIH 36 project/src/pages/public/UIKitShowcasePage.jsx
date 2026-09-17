import React, { useState } from 'react';
import {
  Heading,
  Text,
  Label,
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  StatusBadge,
  RiskBadge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Modal,
  ConfirmDialog,
  Alert,
  Dropdown,
  Spinner,
  Skeleton,
  LoadingState,
  EmptyState,
  ErrorState,
  Breadcrumbs,
  AIAnalysisCard
} from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit,
  ExternalLink,
  Plus,
  RefreshCw,
  Mail,
  Lock,
  Eye,
  Layers,
  Sparkles
} from 'lucide-react';

export const UIKitShowcasePage = () => {
  const { showToast } = useToast();

  // State for interactive inputs
  const [textInput, setTextInput] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState('option-1');

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-blue-300 font-semibold tracking-wider uppercase">
              Design System & Component Library
            </span>
          </div>
          <Heading level="h1" className="text-white mt-1 text-2xl sm:text-3xl">
            METRA-VERIFY UI Foundation
          </Heading>
          <Text variant="lead" className="text-blue-100 text-xs sm:text-sm mt-1 max-w-2xl">
            Complete reusable primitives engineered for SIH 2026 Legal Metrology platform.
          </Text>
        </div>

        <div className="flex gap-2">
          <Button
            variant="glass"
            size="sm"
            leftIcon={Sparkles}
            onClick={() => showToast('Toast notification triggered successfully!', 'success')}
          >
            Trigger Toast
          </Button>
          <Button
            variant="outlineDark"
            size="sm"
            onClick={() => setIsConfirmOpen(true)}
          >
            Open Confirm Dialog
          </Button>
        </div>
      </div>

      {/* 1. TYPOGRAPHY & SPACING */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <Heading level="h2" size="text-xl">1. Typography & Hierarchy</Heading>
          <Text variant="muted">Inter and Plus Jakarta Sans with semantic contrast tokens</Text>
        </div>

        <Card>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline pb-4 border-b border-slate-100">
              <Heading level="h1">Heading 1 • Digital Legal Metrology</Heading>
              <Text variant="caption">Plus Jakarta Sans / Bold / 32px</Text>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline pb-4 border-b border-slate-100">
              <Heading level="h2">Heading 2 • Online Verification System</Heading>
              <Text variant="caption">Plus Jakarta Sans / Bold / 24px</Text>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline pb-4 border-b border-slate-100">
              <Heading level="h3">Heading 3 • Sectional Dossier Title</Heading>
              <Text variant="caption">Plus Jakarta Sans / Bold / 20px</Text>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline pb-4 border-b border-slate-100">
              <Heading level="h4">Heading 4 • Card and Subsection Header</Heading>
              <Text variant="caption">Plus Jakarta Sans / Bold / 18px</Text>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline">
              <div className="space-y-2">
                <Text variant="lead">Lead Paragraph text for introductions and hero statements.</Text>
                <Text variant="body">Standard body text for descriptions, form instructions, and content blocks.</Text>
                <Text variant="small">Small secondary informational notes.</Text>
                <Text variant="muted">Muted timestamp and telematics caption text.</Text>
                <Text variant="code">const certId = "MV-2026-000123";</Text>
              </div>
              <Text variant="caption">Inter Regular / Medium / Monospace</Text>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 2. BUTTONS */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <Heading level="h2" size="text-xl">2. Buttons & Actions</Heading>
          <Text variant="muted">Variants, loading states, sizes, and icon alignments</Text>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>Full spectrum of action styles across light and dark contexts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" leftIcon={ShieldCheck}>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline" leftIcon={Download}>Outline</Button>
              <Button variant="outlineDark">Outline Dark</Button>
              <Button variant="success" leftIcon={CheckCircle2}>Success</Button>
              <Button variant="danger" leftIcon={Trash2}>Danger</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" isLoading>Processing</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">Small (sm)</Button>
              <Button variant="primary" size="md">Medium (md)</Button>
              <Button variant="primary" size="lg" rightIcon={ExternalLink}>Large (lg)</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 3. INPUTS & FORM CONTROLS */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <Heading level="h2" size="text-xl">3. Inputs & Form Controls</Heading>
          <Text variant="muted">Accessible text inputs, selects, textareas, checkboxes, and radios</Text>
        </div>

        <Card>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Standard Input"
                placeholder="Enter serial number..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                helperText="Format: WS-XXXXXX"
                clearable
                onClear={() => setTextInput('')}
              />
              <Input
                label="Input with Left Icon"
                placeholder="email@domain.com"
                leftIcon={Mail}
                required
              />
              <Input
                label="Input with Error State"
                value="Invalid Format"
                error="Stamping division does not match schedule"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Accuracy Classification Select"
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                options={[
                  { label: 'Class I (Special High Precision)', value: 'class-1' },
                  { label: 'Class II (High Accuracy)', value: 'class-2' },
                  { label: 'Class III (Medium Commercial Accuracy)', value: 'class-3' },
                  { label: 'Class IIII (Ordinary Accuracy)', value: 'class-4' }
                ]}
                helperText="Select legal metrology accuracy classification"
              />

              <Textarea
                label="Inspector Audit Observations"
                placeholder="Enter eccentric error findings or remarks..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                showCount
                maxLength={200}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-3">
                <Label>Checkboxes</Label>
                <Checkbox
                  label="Instrument verified on-site"
                  description="Physical inspection confirmed at registered business coordinates"
                  checked={checkboxVal}
                  onChange={(e) => setCheckboxVal(e.target.checked)}
                />
                <Checkbox
                  label="Lead seal intact and unaltered"
                  description="Tamper wire lock tag securely applied"
                  checked={false}
                  onChange={() => {}}
                />
              </div>

              <div className="space-y-3">
                <Label>Radio Group</Label>
                <Radio
                  name="demo-radio"
                  label="Routine Periodic Verification"
                  description="Annual statutory renewal"
                  value="option-1"
                  checked={radioVal === 'option-1'}
                  onChange={(e) => setRadioVal(e.target.value)}
                />
                <Radio
                  name="demo-radio"
                  label="Post-Repair Recalibration"
                  description="Following component replacement or load cell service"
                  value="option-2"
                  checked={radioVal === 'option-2'}
                  onChange={(e) => setRadioVal(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. BADGES & STATUS PILLS */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <Heading level="h2" size="text-xl">4. Badges & Indicators</Heading>
          <Text variant="muted">Semantic badges, risk ratings, and legal status indicators</Text>
        </div>

        <Card>
          <CardContent className="space-y-5">
            <div>
              <Text variant="small" className="font-semibold mb-2 block">Generic Badges</Text>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary" dot>Primary Active</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success" dot>Verified</Badge>
                <Badge variant="warning" dot>Pending Action</Badge>
                <Badge variant="danger" dot>Flagged Non-compliant</Badge>
                <Badge variant="indigo">Field Telematics</Badge>
                <Badge variant="purple">Officer Authority</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Text variant="small" className="font-semibold mb-2 block">Status Badges</Text>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="VALID" />
                <StatusBadge status="APPROVED" />
                <StatusBadge status="INSPECTION" />
                <StatusBadge status="OFFICER_REVIEW" />
                <StatusBadge status="PENDING_REVIEW" />
                <StatusBadge status="EXPIRED" />
                <StatusBadge status="REVOKED" />
                <StatusBadge status="REJECTED" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Text variant="small" className="font-semibold mb-2 block">AI Risk Tier Badges</Text>
              <div className="flex flex-wrap gap-2">
                <RiskBadge level="LOW" score={25} />
                <RiskBadge level="MEDIUM" score={54} />
                <RiskBadge level="HIGH" score={88} />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 5. ALERTS & NOTIFICATIONS */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <Heading level="h2" size="text-xl">5. Alerts & Callouts</Heading>
          <Text variant="muted">Contextual notices for compliance, security, and errors</Text>
        </div>

        <div className="space-y-3">
          {showAlert && (
            <Alert
              variant="info"
              title="Statutory Legal Metrology Notice"
              onDismiss={() => setShowAlert(false)}
            >
              All weighing instruments utilized for commercial retail transactions must undergo mandatory annual calibration verification under Section 24 of the Legal Metrology Act.
            </Alert>
          )}

          <Alert
            variant="success"
            title="Digital Verification Certificate Successfully Issued"
          >
            Certificate #MV-2026-000123 has been sealed with SHA-256 cryptographic signature and published to public QR registry.
          </Alert>

          <Alert
            variant="warning"
            title="Periodic Verification Due in 14 Days"
          >
            Digital Weighing Scale WS123456 will reach expiration on 22 September 2026. Submit re-verification to prevent trade penalties.
          </Alert>

          <Alert
            variant="error"
            title="Maximum Permissible Error (MPE) Exceeded"
          >
            Observed error of +12.4g exceeds permissible tolerance for Class III medium accuracy scale. Re-calibration required.
          </Alert>
        </div>
      </section>

      {/* 6. DROPDOWNS & MENUS */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <Heading level="h2" size="text-xl">6. Dropdowns & Menus</Heading>
          <Text variant="muted">Click-outside dismissible action menus with dividers and destructive actions</Text>
        </div>

        <Card>
          <CardContent className="flex flex-wrap items-center gap-4">
            <Dropdown
              items={[
                { label: 'View Certificate', icon: Eye, onClick: () => showToast('Viewing certificate...') },
                { label: 'Download PDF Dossier', icon: Download, onClick: () => showToast('Downloading PDF...') },
                { divider: true },
                { label: 'Re-assign Field Inspector', icon: Edit, onClick: () => showToast('Inspector re-assigned') },
                { label: 'Revoke Certificate', icon: Trash2, danger: true, onClick: () => showToast('Revocation initiated', 'error') }
              ]}
            />

            <Dropdown
              trigger={
                <Button variant="primary" size="sm" rightIcon={ExternalLink}>
                  Export Records
                </Button>
              }
              items={[
                { label: 'Export as CSV', onClick: () => showToast('Exported CSV', 'success') },
                { label: 'Export as Excel (XLSX)', onClick: () => showToast('Exported XLSX', 'success') },
                { label: 'Export Statutory Audit PDF', onClick: () => showToast('Exported PDF', 'success') }
              ]}
            />
          </CardContent>
        </Card>
      </section>

      {/* 7. TABLES */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <Heading level="h2" size="text-xl">7. Composable Tables</Heading>
          <Text variant="muted">Primitive table components with responsive borders and hover styles</Text>
        </div>

        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead>Test Standard</TableHead>
              <TableHead>Target Weight</TableHead>
              <TableHead>Observed Value</TableHead>
              <TableHead>Calculated Error</TableHead>
              <TableHead className="text-right">Compliance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">OIML Class M1 Standard</TableCell>
              <TableCell>10.000 kg</TableCell>
              <TableCell className="font-mono">10.000 kg</TableCell>
              <TableCell className="font-mono text-slate-500">0.000 g</TableCell>
              <TableCell className="text-right">
                <Badge variant="success" size="sm">PASS</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">OIML Class M1 Standard</TableCell>
              <TableCell>25.000 kg</TableCell>
              <TableCell className="font-mono">25.001 kg</TableCell>
              <TableCell className="font-mono text-emerald-700">+0.001 kg</TableCell>
              <TableCell className="text-right">
                <Badge variant="success" size="sm">PASS</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Full Capacity Proof Load</TableCell>
              <TableCell>50.000 kg</TableCell>
              <TableCell className="font-mono">50.002 kg</TableCell>
              <TableCell className="font-mono text-emerald-700">+0.002 kg</TableCell>
              <TableCell className="text-right">
                <Badge variant="success" size="sm">PASS</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* 8. LOADING, EMPTY, AND ERROR STATES */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <Heading level="h2" size="text-xl">8. Loading, Empty & Error States</Heading>
          <Text variant="muted">Robust fallback feedback states across the platform</Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Spinners & Skeletons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Spinner size="sm" />
                <Spinner size="md" />
                <Spinner size="lg" color="text-indigo-600" />
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="80%" />
              </div>
            </CardContent>
          </Card>

          <EmptyState
            title="No Records Found"
            description="No matching verification dossiers located."
            actionText="Clear Filter"
            onAction={() => showToast('Filters cleared')}
          />

          <ErrorState
            title="Connection Timeout"
            message="Unable to reach verification repository node."
            onRetry={() => showToast('Retrying synchronization...', 'info')}
          />
        </div>
      </section>

      {/* 9. MODALS & CONFIRM DIALOGS */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <Heading level="h2" size="text-xl">9. Dialogs & Modals</Heading>
          <Text variant="muted">Accessible modals with backdrops and focus trap</Text>
        </div>

        <Card>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Standard Modal
            </Button>
            <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
              Open Confirm Dialog
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* 10. AI PRE-CHECK & OCR SCRUTINY (AIAnalysisCard) */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <Heading level="h2" size="text-xl">10. AI Pre-check & OCR Scrutiny (AIAnalysisCard)</Heading>
          <Text variant="muted">Reusable component showing uploaded document, OCR extraction, field comparison (MATCH/MISMATCH), risk score, risk level, risk factors, and statutory disclaimer</Text>
        </div>

        <AIAnalysisCard />
      </section>

      {/* Standard Modal Demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sample Modal Title"
        description="Detailed description of modal workflow and options."
      >
        <div className="space-y-4 text-xs">
          <Text variant="body">
            This modal is keyboard accessible (press Escape to dismiss, or click outside the backdrop).
          </Text>
          <Input label="Modal Input Sample" placeholder="Enter confirmation key..." />
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={() => { setIsModalOpen(false); showToast('Saved from modal!', 'success'); }}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog Demo */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          showToast('Action confirmed successfully!', 'success');
        }}
        title="Confirm Statutory Action"
        message="Are you sure you want to proceed with this operation? This will record a non-repudiable audit event in the state registry."
        confirmText="Yes, Proceed"
        variant="danger"
      />
    </div>
  );
};

export default UIKitShowcasePage;
