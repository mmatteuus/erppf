import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import type { Permission } from "@/store/auth";

type Props = {
  required?: Permission[];
};

export function ProtectedRoute({ required }: Props) {
  const { user, hasPermission } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (required && required.length > 0) {
    const allowed = required.every((perm) => hasPermission(perm));
    if (!allowed) {
      return <div className="p-6 text-sm text-destructive">Acesso negado.</div>;
    }
  }

  return <Outlet />;
}
