/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { RoleSwitcherBar } from './components/shared/RoleSwitcherBar';
import { OnboardingModal } from './components/shared/OnboardingModal';
import { OwnerLayout } from './components/owner/OwnerLayout';
import { OwnerHome } from './components/owner/OwnerHome';
import { OwnerGarage } from './components/owner/OwnerGarage';
import { OwnerAiChat } from './components/owner/OwnerAiChat';
import { OwnerDiagnosticReport } from './components/owner/OwnerDiagnosticReport';
import { OwnerExplore } from './components/owner/OwnerExplore';
import { OwnerProviderProfile } from './components/owner/OwnerProviderProfile';
import { OwnerHistory } from './components/owner/OwnerHistory';
import { OwnerProfile } from './components/owner/OwnerProfile';
import { ObdDiagnosticsView } from './components/owner/ObdDiagnosticsView';
import { ProviderDashboard } from './components/provider/ProviderDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CheckCircle2 } from 'lucide-react';

const AppShell: React.FC = () => {
  const { role, ownerTab, toastMessage } = usePlatform();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172B3A]">
      <RoleSwitcherBar />

      {role === 'car_owner' && (
        <OwnerLayout>
          {ownerTab === 'home' && <OwnerHome />}
          {ownerTab === 'garage' && <OwnerGarage />}
          {ownerTab === 'ai_chat' && <OwnerAiChat />}
          {ownerTab === 'diagnostic_report' && <OwnerDiagnosticReport />}
          {ownerTab === 'explore' && <OwnerExplore />}
          {ownerTab === 'provider_profile' && <OwnerProviderProfile />}
          {ownerTab === 'history' && <OwnerHistory />}
          {ownerTab === 'profile' && <OwnerProfile />}
          {ownerTab === 'obd' && <ObdDiagnosticsView />}
        </OwnerLayout>
      )}

      {role === 'provider' && <ProviderDashboard />}
      {role === 'admin' && <AdminDashboard />}

      <OnboardingModal />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 lg:bottom-6 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-50 bg-[#172B3A] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs sm:text-sm font-medium max-w-[92vw]"
        >
          <CheckCircle2 className="w-4 h-4 text-[#DCEFEF] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <AppShell />
    </PlatformProvider>
  );
}
