-- ===================================================
-- MULTI-TENANT ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================

-- Disable any conflicting previous policies first
DROP POLICY IF EXISTS "Users can view workspace team members" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.users;
DROP POLICY IF EXISTS "Users can read calls from their own organization" ON public.calls;
DROP POLICY IF EXISTS "Managers/Owners can upload/insert calls" ON public.calls;
DROP POLICY IF EXISTS "Owners/Managers can edit calls" ON public.calls;

-- ---------------------------------------------------
-- Dynamic Session Context Helper
-- ---------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_organization_id()
RETURNS text AS $$
BEGIN
  RETURN (SELECT "organizationId" FROM public.users WHERE id = auth.uid()::text);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public."Role" AS $$
BEGIN
  RETURN (SELECT role FROM public.users WHERE id = auth.uid()::text);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------
-- 1. Users Table Policies
-- ---------------------------------------------------
CREATE POLICY "Tenant Select Users" ON public.users
    FOR SELECT USING ("organizationId" = public.current_organization_id());

CREATE POLICY "Tenant Self/Admin Update Users" ON public.users
    FOR UPDATE USING (
        id = auth.uid()::text 
        OR (
            "organizationId" = public.current_organization_id() 
            AND public.current_user_role() IN ('OWNER'::public."Role", 'ADMIN'::public."Role")
        )
    );

CREATE POLICY "Tenant Admin Insert Users" ON public.users
    FOR INSERT WITH CHECK (
        "organizationId" = public.current_organization_id() 
        AND public.current_user_role() IN ('OWNER'::public."Role", 'ADMIN'::public."Role")
    );

-- ---------------------------------------------------
-- 2. Teams Table Policies
-- ---------------------------------------------------
CREATE POLICY "Tenant Select Teams" ON public.teams
    FOR SELECT USING ("organizationId" = public.current_organization_id());

CREATE POLICY "Tenant Admin Write Teams" ON public.teams
    FOR ALL USING (
        "organizationId" = public.current_organization_id() 
        AND public.current_user_role() IN ('OWNER'::public."Role", 'ADMIN'::public."Role")
    );

-- ---------------------------------------------------
-- 3. Calls Table Policies
-- ---------------------------------------------------
CREATE POLICY "Tenant Select Calls" ON public.calls
    FOR SELECT USING ("organizationId" = public.current_organization_id());

CREATE POLICY "Tenant Admin Insert Calls" ON public.calls
    FOR INSERT WITH CHECK (
        "organizationId" = public.current_organization_id() 
        AND public.current_user_role() IN ('OWNER'::public."Role", 'ADMIN'::public."Role", 'QA_MANAGER'::public."Role", 'MANAGER'::public."Role")
    );

CREATE POLICY "Tenant Admin Update Calls" ON public.calls
    FOR UPDATE USING (
        "organizationId" = public.current_organization_id() 
        AND public.current_user_role() IN ('OWNER'::public."Role", 'ADMIN'::public."Role", 'QA_MANAGER'::public."Role", 'MANAGER'::public."Role")
    );

CREATE POLICY "Tenant Admin Delete Calls" ON public.calls
    FOR DELETE USING (
        "organizationId" = public.current_organization_id() 
        AND public.current_user_role() IN ('OWNER'::public."Role", 'ADMIN'::public."Role")
    );

-- ---------------------------------------------------
-- 4. Settings Table Policies
-- ---------------------------------------------------
CREATE POLICY "Tenant Settings Access" ON public.settings
    FOR ALL USING (
        "organization_id" = public.current_organization_id()
    );

-- ---------------------------------------------------
-- 5. QA Reports Table Policies
-- ---------------------------------------------------
CREATE POLICY "Tenant QA Reports Select" ON public.qa_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.calls 
            WHERE public.calls.id = public.qa_reports.call_id 
            AND public.calls."organizationId" = public.current_organization_id()
        )
    );

CREATE POLICY "Tenant QA Reports Write" ON public.qa_reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.calls 
            WHERE public.calls.id = public.qa_reports.call_id 
            AND public.calls."organizationId" = public.current_organization_id()
        )
        AND public.current_user_role() IN ('OWNER'::public."Role", 'ADMIN'::public."Role", 'QA_MANAGER'::public."Role", 'QA'::public."Role", 'MANAGER'::public."Role")
    );

-- ---------------------------------------------------
-- 6. CRM Notes Table Policies
-- ---------------------------------------------------
CREATE POLICY "Tenant CRM Notes Access" ON public.crm_notes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.calls 
            WHERE public.calls.id = public.crm_notes.call_id 
            AND public.calls."organizationId" = public.current_organization_id()
        )
    );

-- ---------------------------------------------------
-- 7. Call Analyses Table Policies
-- ---------------------------------------------------
CREATE POLICY "Tenant Call Analyses Access" ON public.call_analyses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.calls 
            WHERE public.calls.id = public.call_analyses.call_id 
            AND public.calls."organizationId" = public.current_organization_id()
        )
    );

-- ---------------------------------------------------
-- 8. Notifications Table Policies
-- ---------------------------------------------------
CREATE POLICY "Tenant Notifications Access" ON public.notifications
    FOR ALL USING (
        user_id = auth.uid()::text
    );
