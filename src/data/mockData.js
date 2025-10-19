// Dados estáticos para o sistema Malabo Microcrédito

export const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
  { id: 2, username: 'tecnico', password: 'tecnico123', role: 'tecnico', name: 'Técnico Adm.' },
  { id: 3, username: 'agente', password: 'agente123', role: 'agente', name: 'Agente de Campo' },
  { id: 4, username: 'cliente', password: 'cliente123', role: 'cliente', name: 'Cliente', memberId: 2 }
];

export const members = [
  {
    id: 1,
    name: "Joaquim",
    memberNumber: "102",
    contact: "84 123 4567",
    status: "Ativo"
  },
  {
    id: 2,
    name: "Maria",
    memberNumber: "214", 
    contact: "82 567 8901",
    status: "Ativo"
  },
  {
    id: 3,
    name: "Luis",
    memberNumber: "156",
    contact: "86 345 6789", 
    status: "Ativo"
  },
  {
    id: 4,
    name: "Inês",
    memberNumber: "187",
    contact: "83 654 3210",
    status: "Ativo"
  }
];

export const loans = [
  {
    id: 1,
    member: "Joaquim",
    amount: 1000.00,
    date: "20/02/2023",
    dueDate: "20/05/2023",
    status: "Em dia"
  },
  {
    id: 2,
    member: "Maria",
    amount: 500.00,
    date: "10/01/2023", 
    dueDate: "10/04/2023",
    status: "Em atraso"
  },
  {
    id: 3,
    member: "Luis",
    amount: 800.00,
    date: "05/12/2022",
    dueDate: "05/03/2023", 
    status: "Em dia"
  }
];

export const payments = [
  { id: 1, loanId: 1, date: "25/02/2023", amount: 300.00 },
  { id: 2, loanId: 1, date: "20/03/2023", amount: 300.00 },
  { id: 3, loanId: 2, date: "15/01/2023", amount: 100.00 }
];

export const fines = [
  {
    id: 1,
    member: "Joaquim",
    reason: "Falta à reunião",
    amount: 15.00
  },
  {
    id: 2,
    member: "Maria",
    reason: "Atraso", 
    amount: 5.00
  },
  {
    id: 3,
    member: "Luis",
    reason: "Falta à reunião",
    amount: 10.00
  }
];

export const profitSharing = [
  {
    id: 1,
    member: "Joaquim",
    amount: 200.00
  },
  {
    id: 2,
    member: "Maria",
    amount: 180.00
  },
  {
    id: 3,
    member: "Luis", 
    amount: 220.00
  }
];

export const dashboardData = {
  totalLoaned: 4200,
  upcomingPayments: 1500,
  monthlyEvolution: [
    { month: "Jan", value: 2000 },
    { month: "Fev", value: 3000 },
    { month: "Mar", value: 4000 },
    { month: "Abr", value: 3500 },
    { month: "Mai", value: 7000 },
    { month: "Jun", value: 6000 },
    { month: "Jul", value: 8000 },
    { month: "Ago", value: 9500 }
  ],
  alerts: [
    { type: "meeting", message: "Reunião: 20/08/2025" },
    { type: "payment", message: "Pagamento vencido hoje" }
  ]
};
