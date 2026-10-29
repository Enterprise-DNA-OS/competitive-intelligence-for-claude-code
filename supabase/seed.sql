insert into competitors(id,name,owner,website) values
('10000000-0000-0000-0000-000000000001','Harbour Metrics','Maia','https://harbour.example'),
('10000000-0000-0000-0000-000000000002','Alpine Reports','Noah','https://alpine.example'),
('10000000-0000-0000-0000-000000000003','Harbour Analytics','Maia','https://analytics.example') on conflict do nothing;
insert into evidence(id,competitor_id,title,summary,source_url,observed_on,kind,rights,reviewed_by,reviewed_on,review_due,personal,retention_review_on) values
('20000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Export format changed','Fictional product note lists a new workbook export.','https://harbour.example/updates',current_date-3,'product','public_link','Maia',current_date-2,current_date+20,false,null),
('20000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Old package comparison','Fictional old pricing comparison needs a fresh source.','https://harbour.example/pricing',current_date-100,'pricing','public_link','Maia',current_date-90,current_date-5,false,null),
('20000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000002','Buyer interview note','Fictional buyer says onboarding influenced their decision.','https://internal.example/interview-3',current_date-12,'call','unknown',null,null,null,true,current_date-1),
('20000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000002','Integration announcement','Fictional announcement awaits verification.','https://alpine.example/news',current_date-1,'news','public_link',null,null,null,false,null) on conflict do nothing;
insert into claims(id,competitor_id,evidence_id,statement,response,status,approved_by,approved_on,review_due) values
('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Harbour offers workbook exports','Ask which workbook fields the buyer needs.','approved','Noah',current_date-1,current_date+14),
('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002','Harbour package comparison','Verify the current package before using this point.','approved','Noah',current_date-80,current_date-2),
('30000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000002',null,'Alpine setup requirements','Ask for an agreed implementation plan.','draft',null,null,null) on conflict do nothing;
insert into deals(id,competitor_id,name,owner,amount_cents,currency,outcome,reason,closed_on,next_review) values
('40000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Coastal data renewal','Aroha',2400000,'NZD','open','',null,current_date-2),
('40000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Summit reporting','Aroha',1800000,'NZD','won','Recorded buyer reason: export control',current_date-8,null),
('40000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','River monthly reports','Maia',1200000,'NZD','lost','Recorded buyer reason: incumbent familiarity',current_date-6,null),
('40000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000002','Southern analytics','Noah',3000000,'AUD','open','',null,current_date+2),
('40000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000002','Island research','Noah',900000,'AUD','no_decision','Budget paused',current_date-4,null) on conflict do nothing;
insert into tasks(id,competitor_id,name,owner,due_on) values
('50000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Verify package comparison','Maia',current_date-2),
('50000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000002','Review interview retention','Noah',current_date-1),
('50000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000002','Read integration announcement','Noah',current_date+3) on conflict do nothing;
