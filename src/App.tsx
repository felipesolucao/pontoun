import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import {
  Bell,
  Building2,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Download,
  FileSpreadsheet,
  Filter,
  LayoutDashboard,
  Mail,
  Menu,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
  X,
} from "lucide-react";

type Stage = {
  id: string;
  label: string;
  color: string;
  soft: string;
};

type Lead = {
  id: number;
  company: string;
  cnpj: string;
  value: number;
  installments: number;
  employees: number;
  phone: string;
  email: string;
  union: string;
  stage: string;
  lastContact: string;
  initials: string;
};

const stages: Stage[] = [
  { id: "primeira", label: "1ª tentativa", color: "#8b5cf6", soft: "#ede9fe" },
  { id: "segunda", label: "2ª tentativa", color: "#3b82f6", soft: "#dbeafe" },
  { id: "email", label: "E-mail de cobrança", color: "#06b6d4", soft: "#cffafe" },
  { id: "negociacao", label: "Em negociação", color: "#f59e0b", soft: "#fef3c7" },
  { id: "sem-resposta", label: "Sem resposta", color: "#f97316", soft: "#ffedd5" },
  { id: "sem-contato", label: "Sem contato", color: "#64748b", soft: "#e2e8f0" },
  { id: "a-cancelar", label: "À cancelar", color: "#f43f5e", soft: "#ffe4e6" },
  { id: "cancelado", label: "Cancelado", color: "#dc2626", soft: "#fee2e2" },
  { id: "negociacao-ok", label: "Negociação ok", color: "#14b8a6", soft: "#ccfbf1" },
  { id: "negociado", label: "Negociado", color: "#10b981", soft: "#d1fae5" },
  { id: "pagamento", label: "Aguardando pagamento", color: "#22c55e", soft: "#dcfce7" },
];

const initialLeads: Lead[] = [
  { id: 1, company: "Almeida & Torres Contabilidade", cnpj: "12.345.678/0001-90", value: 12840, installments: 4, employees: 26, phone: "(11) 98812-4430", email: "financeiro@almeidatorres.com.br", union: "SESCON-SP", stage: "primeira", lastContact: "Hoje, 09:32", initials: "AT" },
  { id: 2, company: "Clínica Horizonte Saúde", cnpj: "28.019.442/0001-08", value: 8460, installments: 3, employees: 41, phone: "(11) 99102-8167", email: "adm@clinicahorizonte.com", union: "SINDHOSP", stage: "primeira", lastContact: "Ontem, 16:10", initials: "CH" },
  { id: 3, company: "Vértice Engenharia Ltda.", cnpj: "05.841.265/0001-52", value: 24700, installments: 6, employees: 68, phone: "(21) 99661-0234", email: "contato@vertice.eng.br", union: "SINDUSCON", stage: "segunda", lastContact: "Hoje, 08:15", initials: "VE" },
  { id: 4, company: "Norte Sul Logística", cnpj: "33.906.115/0001-41", value: 18920, installments: 5, employees: 92, phone: "(11) 97633-2891", email: "cobranca@nortesul.com", union: "SETCESP", stage: "segunda", lastContact: "12 set, 14:20", initials: "NS" },
  { id: 5, company: "Instituto Aprender Mais", cnpj: "46.102.774/0001-20", value: 6290, installments: 2, employees: 33, phone: "(19) 99310-2214", email: "diretoria@aprendermais.org", union: "SIEEESP", stage: "email", lastContact: "Hoje, 10:41", initials: "IA" },
  { id: 6, company: "Mercado Bom Vizinho", cnpj: "14.026.538/0001-73", value: 15350, installments: 4, employees: 57, phone: "(11) 98550-4001", email: "fiscal@bomvizinho.com", union: "SINCOVAGA", stage: "negociacao", lastContact: "Hoje, 11:08", initials: "MB" },
  { id: 7, company: "Techway Sistemas", cnpj: "39.475.881/0001-04", value: 32100, installments: 8, employees: 118, phone: "(11) 99770-1820", email: "financeiro@techway.io", union: "SEPROSP", stage: "negociacao", lastContact: "Ontem, 17:42", initials: "TS" },
  { id: 8, company: "Restaurante Manjericão", cnpj: "21.604.773/0001-62", value: 4980, installments: 2, employees: 19, phone: "(11) 98991-3300", email: "adm@manjericao.com.br", union: "SINDRESBAR", stage: "sem-resposta", lastContact: "9 set, 09:10", initials: "RM" },
  { id: 9, company: "Grupo Áurea Serviços", cnpj: "08.509.337/0001-10", value: 11760, installments: 3, employees: 74, phone: "(11) 97114-0093", email: "contas@aurea.com", union: "SEAC-SP", stage: "sem-contato", lastContact: "5 set, 15:28", initials: "GA" },
  { id: 10, company: "Construtora Pedra Alta", cnpj: "42.774.116/0001-96", value: 27640, installments: 6, employees: 86, phone: "(11) 96621-0450", email: "financeiro@pedraalta.com", union: "SINDUSCON", stage: "a-cancelar", lastContact: "11 set, 12:03", initials: "CP" },
  { id: 11, company: "Ótica Nova Visão", cnpj: "17.680.494/0001-35", value: 3870, installments: 1, employees: 12, phone: "(11) 99540-8700", email: "nova.visao@email.com", union: "SINCOÓPTICA", stage: "cancelado", lastContact: "2 set, 10:19", initials: "ON" },
  { id: 12, company: "Fênix Soluções Industriais", cnpj: "50.388.925/0001-17", value: 21400, installments: 5, employees: 63, phone: "(19) 99228-7751", email: "adm@fenixindustrial.com", union: "SINDIMAQ", stage: "negociacao-ok", lastContact: "Hoje, 09:55", initials: "FS" },
  { id: 13, company: "Essencial Farmácia", cnpj: "31.227.906/0001-48", value: 9160, installments: 3, employees: 28, phone: "(11) 97411-6562", email: "contabilidade@essencial.com", union: "SINCOFARMA", stage: "negociado", lastContact: "Ontem, 13:04", initials: "EF" },
  { id: 14, company: "Plena Gestão Empresarial", cnpj: "44.210.389/0001-29", value: 13890, installments: 4, employees: 45, phone: "(11) 98018-4230", email: "financeiro@plenagestao.com", union: "SESCON-SP", stage: "pagamento", lastContact: "Hoje, 10:26", initials: "PG" },
];

const money = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);

function App() {
  const [leads, setLeads] = useState(initialLeads);
  const [query, setQuery] = useState("");
  const [dragged, setDragged] = useState<number | null>(null);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [notice, setNotice] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => leads.filter((lead) => `${lead.company} ${lead.cnpj} ${lead.email}`.toLowerCase().includes(query.toLowerCase())), [leads, query]);
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const negotiating = leads.filter((lead) => ["negociacao", "negociacao-ok", "negociado"].includes(lead.stage));
  const recovered = leads.filter((lead) => ["negociado", "pagamento"].includes(lead.stage)).reduce((sum, lead) => sum + lead.value, 0);
  const success = Math.round((leads.filter((lead) => ["negociado", "pagamento"].includes(lead.stage)).length / leads.length) * 100);

  const notify = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const drop = (event: DragEvent, stage: string) => {
    event.preventDefault();
    if (dragged === null) return;
    setLeads((current) => current.map((lead) => lead.id === dragged ? { ...lead, stage, lastContact: "Agora" } : lead));
    const target = stages.find((item) => item.id === stage)?.label;
    notify(`Lead movido para “${target}”`);
    setDragged(null);
  };

  const importCsv = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = String(reader.result).split(/\r?\n/).slice(1).filter(Boolean);
      const imported = rows.map((row, index) => {
        const [company = "Cliente importado", cnpj = "", value = "0", installments = "1", employees = "0", phone = "", email = "", union = ""] = row.split(/[;,]/);
        return { id: Date.now() + index, company, cnpj, value: Number(value.replace(/[^\d]/g, "")), installments: Number(installments), employees: Number(employees), phone, email, union, stage: "primeira", lastContact: "Importado agora", initials: company.slice(0, 2).toUpperCase() };
      });
      setLeads((current) => [...imported, ...current]);
      notify(`${imported.length} clientes importados com sucesso`);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const addLead = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const company = String(data.get("company"));
    setLeads((current) => [{ id: Date.now(), company, cnpj: String(data.get("cnpj")), value: Number(data.get("value")), installments: Number(data.get("installments")), employees: Number(data.get("employees")), phone: String(data.get("phone")), email: String(data.get("email")), union: String(data.get("union")), stage: "primeira", lastContact: "Criado agora", initials: company.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase() }, ...current]);
    setShowAdd(false);
    notify("Novo cliente adicionado ao funil");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand"><div className="brand-mark"><TrendingUp size={19} /></div><strong>Ponto<span>CRM</span></strong><button className="mobile-close" onClick={() => setSidebarOpen(false)}><X /></button></div>
        <div className="workspace"><div className="workspace-icon">GS</div><div><small>ESPAÇO DE TRABALHO</small><b>Grupo Sindical</b></div><ChevronDown size={16} /></div>
        <nav>
          <p>MENU PRINCIPAL</p>
          <a className="active"><LayoutDashboard />Pipeline de cobrança</a>
          <a><Users />Todos os clientes <span>{leads.length}</span></a>
          <a><CalendarDays />Agenda</a>
          <a><FileSpreadsheet />Importações</a>
          <p>GESTÃO</p>
          <a><TrendingUp />Relatórios</a>
          <a><Settings2 />Configurações</a>
        </nav>
        <div className="sidebar-help"><Sparkles /><b>Central de ajuda</b><span>Tire dúvidas sobre seu CRM</span></div>
        <div className="user"><div className="avatar">MP</div><div><b>Marina Prado</b><span>Administradora</span></div><MoreHorizontal /></div>
      </aside>

      <main>
        <header>
          <div className="title-row"><button className="menu-button" onClick={() => setSidebarOpen(true)}><Menu /></button><div><p>GESTÃO DE RECEBÍVEIS</p><h1>Pipeline de cobrança</h1></div></div>
          <div className="header-actions"><label className="search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente, CNPJ..." /></label><button className="icon-button"><Bell /></button><button className="import" onClick={() => fileRef.current?.click()}><Upload /> Importar planilha</button><button className="primary" onClick={() => setShowAdd(true)}><Plus /> Novo cliente</button><input ref={fileRef} type="file" accept=".csv" hidden onChange={importCsv} /></div>
        </header>

        <section className="content">
          <div className="summary-grid">
            <article className="summary"><div className="summary-head"><span className="metric-icon purple"><Users /></span><span className="trend positive">+8,2%</span></div><p>Clientes no pipeline</p><div><strong>{leads.length}</strong><small> empresas ativas</small></div></article>
            <article className="summary"><div className="summary-head"><span className="metric-icon blue"><CircleDollarSign /></span><span className="trend positive">+12,5%</span></div><p>Valor total em aberto</p><div><strong>{money(totalValue)}</strong></div></article>
            <article className="summary"><div className="summary-head"><span className="metric-icon amber"><Clock3 /></span><span className="summary-meta">{negotiating.length} clientes</span></div><p>Em negociação</p><div><strong>{money(negotiating.reduce((sum, lead) => sum + lead.value, 0))}</strong></div></article>
            <article className="summary highlight"><div className="summary-head"><span className="metric-icon green"><TrendingUp /></span><span className="trend positive">+4,1%</span></div><p>Taxa de recuperação</p><div><strong>{success}%</strong><small> • {money(recovered)}</small></div></article>
          </div>

          <div className="progress-card"><div className="progress-copy"><div><b>Visão geral do funil</b><span>Distribuição dos {leads.length} clientes por etapa</span></div><div className="legend"><span><i className="green-dot" />{success}% recuperados</span><span><i className="orange-dot" />{Math.round((negotiating.length / leads.length) * 100)}% em negociação</span></div></div><div className="progress-bar">{stages.map((stage) => { const count = leads.filter((lead) => lead.stage === stage.id).length; return <span key={stage.id} style={{ width: `${(count / leads.length) * 100}%`, background: stage.color }} title={`${stage.label}: ${count}`} />; })}</div></div>

          <div className="board-toolbar"><div><h2>Funil de cobrança</h2><span>Arraste os cards entre as etapas para atualizar o processo</span></div><div><button><Filter /> Filtros <em>2</em></button><button><SlidersHorizontal /> Personalizar</button><button aria-label="Mais opções"><MoreHorizontal /></button></div></div>

          <div className="board">
            {stages.map((stage) => {
              const stageLeads = filtered.filter((lead) => lead.stage === stage.id);
              const stageTotal = stageLeads.reduce((sum, lead) => sum + lead.value, 0);
              return <section className="column" key={stage.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, stage.id)}>
                <div className="column-accent" style={{ background: stage.color }} />
                <div className="column-header"><div><i style={{ background: stage.color, boxShadow: `0 0 0 4px ${stage.soft}` }} /><b>{stage.label}</b><span>{stageLeads.length}</span></div><button><MoreHorizontal /></button></div>
                <div className="column-total"><span>{money(stageTotal)}</span><small>em aberto</small></div>
                <div className="cards">
                  {stageLeads.map((lead) => <article className={`lead-card ${dragged === lead.id ? "dragging" : ""}`} draggable key={lead.id} onDragStart={() => setDragged(lead.id)} onDragEnd={() => setDragged(null)} onClick={() => setSelected(lead)}>
                    <div className="lead-top"><div className="company-avatar" style={{ color: stage.color, background: stage.soft }}>{lead.initials}</div><div className="company-name"><b>{lead.company}</b><span>{lead.cnpj}</span></div><button><MoreHorizontal /></button></div>
                    <div className="amount"><strong>{money(lead.value)}</strong><span>{lead.installments}x parcelas</span></div>
                    <div className="lead-details"><span><Users />{lead.employees} colaboradores</span><span><Building2 />{lead.union}</span></div>
                    <div className="lead-footer"><span><Clock3 />{lead.lastContact}</span><div><button aria-label="Telefone"><Phone /></button><button aria-label="E-mail"><Mail /></button></div></div>
                  </article>)}
                  {stageLeads.length === 0 && <div className="empty-column">Solte um cliente aqui</div>}
                </div>
                <button className="quick-add" onClick={() => setShowAdd(true)}><Plus /> Adicionar cliente</button>
              </section>;
            })}
          </div>
        </section>
      </main>

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      {notice && <div className="toast"><span>✓</span>{notice}</div>}
      {(showAdd || selected) && <div className="modal-backdrop" onMouseDown={() => { setShowAdd(false); setSelected(null); }}>
        <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
          <div className="modal-head"><div><span>{selected ? "DETALHES DO CLIENTE" : "NOVO CADASTRO"}</span><h2>{selected?.company || "Adicionar cliente"}</h2></div><button onClick={() => { setShowAdd(false); setSelected(null); }}><X /></button></div>
          {selected ? <div className="detail-grid"><div><span>Valor em aberto</span><b>{money(selected.value)}</b></div><div><span>Parcelas</span><b>{selected.installments}x</b></div><div><span>Colaboradores</span><b>{selected.employees}</b></div><div><span>CNPJ</span><b>{selected.cnpj}</b></div><div className="wide"><span>Telefone</span><b>{selected.phone}</b></div><div className="wide"><span>E-mail</span><b>{selected.email}</b></div><div className="wide"><span>Sindicato patronal</span><b>{selected.union}</b></div><button className="primary wide" onClick={() => { setSelected(null); notify("Dados prontos para edição"); }}>Editar informações</button></div> : <form onSubmit={addLead} className="lead-form"><label className="wide">Empresa<input required name="company" placeholder="Razão social ou nome fantasia" /></label><label>CNPJ<input required name="cnpj" placeholder="00.000.000/0001-00" /></label><label>Valor em aberto<input required name="value" type="number" placeholder="0,00" /></label><label>Parcelas<input name="installments" type="number" defaultValue="1" /></label><label>Colaboradores<input name="employees" type="number" defaultValue="1" /></label><label>Telefone<input name="phone" placeholder="(00) 00000-0000" /></label><label>E-mail<input name="email" type="email" placeholder="financeiro@empresa.com" /></label><label className="wide">Sindicato patronal<input name="union" placeholder="Nome do sindicato" /></label><div className="form-actions wide"><button type="button" onClick={() => setShowAdd(false)}>Cancelar</button><button className="primary" type="submit">Adicionar ao pipeline</button></div></form>}
        </div>
      </div>}
    </div>
  );
}

export default App;
