// Dados estáticos para o sistema NOVA ESPERANÇA

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

export const savings = [
  {
    id: 1,
    member: "Joaquim",
    date: "22/02/2023",
    amount: 1500.00
  },
  {
    id: 2,
    member: "Maria", 
    date: "15/02/2023",
    amount: 750.00
  },
  {
    id: 3,
    member: "Luis",
    date: "10/01/2023", 
    amount: 1200.00
  },
  {
    id: 4,
    member: "Inês",
    date: "05/12/2022",
    amount: 500.00
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
  totalSaved: 12500,
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
  recentSavings: [
    { member: "Joaquim", date: "14/08/2025", amount: 5000 },
    { member: "Maria", date: "10/08/2025", amount: 750 },
    { member: "Inês", date: "06/08/2025", amount: 400 }
  ],
  alerts: [
    { type: "meeting", message: "Reunião: 20/08/2025" },
    { type: "payment", message: "Pagamento vencido hoje" }
  ]
};
