create table competitors (
 id uuid primary key default gen_random_uuid(), name text not null check(length(trim(name))>0), owner text not null,
 website text not null default '', active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index competitor_name on competitors(lower(name));
create table evidence (
 id uuid primary key default gen_random_uuid(), competitor_id uuid not null references competitors,
 title text not null, summary text not null, source_url text not null default '', observed_on date not null,
 kind text not null check(kind in ('pricing','product','review','call','news','other')),
 rights text not null default 'unknown' check(rights in ('unknown','owned','licensed','public_link')),
 personal boolean not null default false, retention_review_on date,
 reviewed_by text, reviewed_on date, review_due date,
 source_id text unique, raw jsonb not null default '{}',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check((reviewed_by is null and reviewed_on is null) or (reviewed_by is not null and reviewed_on is not null))
);
create table claims (
 id uuid primary key default gen_random_uuid(), competitor_id uuid not null references competitors,
 evidence_id uuid references evidence, statement text not null, response text not null,
 status text not null default 'draft' check(status in ('draft','approved','retired')),
 approved_by text, approved_on date, review_due date,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(status <> 'approved' or (evidence_id is not null and approved_by is not null and approved_on is not null and review_due is not null))
);
create table deals (
 id uuid primary key default gen_random_uuid(), competitor_id uuid not null references competitors,
 name text not null, owner text not null, amount_cents bigint not null check(amount_cents>=0), currency text not null check(currency ~ '^[A-Z]{3}$'),
 outcome text not null default 'open' check(outcome in ('open','won','lost','no_decision')),
 reason text not null default '', closed_on date, next_review date,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check((outcome='open' and closed_on is null) or (outcome<>'open' and closed_on is not null and length(trim(reason))>0))
);
create table tasks (
 id uuid primary key default gen_random_uuid(), competitor_id uuid not null references competitors,
 name text not null, owner text not null, due_on date not null, done_on date,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table activity (
 id uuid primary key default gen_random_uuid(), competitor_id uuid references competitors, actor text not null,
 action text not null, detail text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create function touch_updated() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create function immutable_activity() returns trigger language plpgsql as $$ begin raise exception 'Activity is append-only'; end $$;
create trigger protect_activity before update or delete on activity for each row execute function immutable_activity();
do $$ declare tab text; begin
 foreach tab in array array['competitors','evidence','claims','deals','tasks'] loop
 execute format('create trigger touch before update on %I for each row execute function touch_updated()',tab);
 end loop;
 foreach tab in array array['competitors','evidence','claims','deals','tasks','activity'] loop
 execute format('alter table %I enable row level security',tab);
 execute format('revoke all on %I from public',tab);
 end loop;
end $$;
create view evidence_review with (security_invoker=true) as
 select e.id,c.name competitor,e.title,e.kind,e.observed_on,e.rights,e.reviewed_by,e.review_due,
 case when e.reviewed_on is null then 'unreviewed' when e.rights='unknown' then 'rights unknown'
 when e.observed_on>current_date then 'future observation' when e.review_due is null then 'no review date'
 when e.review_due<current_date then 'review overdue' else 'current' end as review_state
 from evidence e join competitors c on c.id=e.competitor_id;
create view battlecards with (security_invoker=true) as
 select cl.id,cl.competitor_id,c.name competitor,cl.statement,cl.response,cl.status,e.title evidence,e.source_url,
 cl.review_due,
 (cl.status='approved' and cl.review_due>=current_date and e.reviewed_on is not null and e.review_due>=current_date
 and e.rights<>'unknown' and e.observed_on<=current_date and length(e.source_url)>0
 and e.competitor_id=cl.competitor_id and (not e.personal or e.retention_review_on>current_date)) as usable
 from claims cl join competitors c on c.id=cl.competitor_id left join evidence e on e.id=cl.evidence_id;
create view win_loss with (security_invoker=true) as
 select c.name competitor,d.currency,count(*) filter(where outcome='open') as open_deals,
 count(*) filter(where outcome='won') as won,count(*) filter(where outcome='lost') as lost,
 count(*) filter(where outcome='no_decision') as no_decision,
 coalesce(sum(amount_cents) filter(where outcome='open'),0)::bigint open_cents,
 round(100.0*count(*) filter(where outcome='won')/nullif(count(*) filter(where outcome in ('won','lost')),0),1) win_rate_pct
 from competitors c join deals d on d.competitor_id=c.id group by c.name,d.currency;
create view attention with (security_invoker=true) as
 select 'task' kind,t.id,c.name competitor,t.name item,t.owner,t.due_on due_on from tasks t join competitors c on c.id=t.competitor_id where t.done_on is null and t.due_on<=current_date
 union all select 'evidence',e.id,c.name,e.title,c.owner,e.review_due from evidence e join competitors c on c.id=e.competitor_id where e.reviewed_on is null or e.review_due is null or e.review_due<current_date
 union all select 'claim',b.id,b.competitor,b.statement,c.owner,b.review_due from battlecards b join competitors c on c.id=b.competitor_id where b.status<>'retired' and not coalesce(b.usable,false)
 union all select 'deal',d.id,c.name,d.name,d.owner,d.next_review from deals d join competitors c on c.id=d.competitor_id where d.outcome='open' and (d.next_review is null or d.next_review<=current_date);
revoke all on evidence_review,battlecards,win_loss,attention from public;
create index evidence_competitor on evidence(competitor_id);
create index claims_competitor on claims(competitor_id);
create index deals_competitor on deals(competitor_id);
