import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadAdminRole(currentUser: User | null) {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser.id)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!error && !!data);
  }

  useEffect(() => {
    // Sync listener first
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setLoading(true);
      setSession(sess);
      const currentUser = sess?.user ?? null;
      setUser(currentUser);
      setTimeout(() => {
        loadAdminRole(currentUser).finally(() => setLoading(false));
      }, 0);
    });

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      await loadAdminRole(currentUser);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user, isAdmin, loading };
}
