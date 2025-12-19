import { Outlet } from 'react-router-dom';
import { ERPSidebar } from './ERPSidebar';
import { ERPTopbar } from './ERPTopbar';
import { ERPFooter } from './ERPFooter';
import { ERPBreadcrumbs } from './ERPBreadcrumbs';

export function ERPLayout() {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <ERPSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <ERPTopbar />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <ERPBreadcrumbs />
          <Outlet />
        </main>
        <ERPFooter />
      </div>
    </div>
  );
}
