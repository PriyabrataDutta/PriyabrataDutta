import ShikiCode from "@/components/ShikiCode";

const SupabaseRlsBody = () => (
  <>
    <p>
      Storing <span className="font-mono">role</span> directly on a{" "}
      <span className="font-mono">profiles</span> row is a classic foot-gun:
      a single UPDATE policy bug and any user can promote themselves to
      admin. The fix is a separate <span className="font-mono">user_roles</span>{" "}
      table plus a <span className="font-mono">SECURITY DEFINER</span> helper.
    </p>
    <ShikiCode
      language="sql"
      code={`create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role    app_role not null,
  unique (user_id, role)
);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;`}
    />
    <p>
      Now reference <span className="font-mono">has_role(auth.uid(), 'admin')</span>{" "}
      inside any RLS policy — no recursion, no escalation, no leaks.
    </p>
  </>
);

export default SupabaseRlsBody;
