import { Profession, Professional, Client, UserRole, Quote, Denunciation, Banner, SupportTicket } from './types';

export const PROFESSIONS_LIST: Profession[] = Object.values(Profession);

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'client-test',
    fullName: 'Cliente de Teste',
    email: 'cliente@teste.com',
    phone: '11999999999',
    address: 'Rua do Teste, 10, São Paulo, SP',
    profilePictureUrl: 'https://picsum.photos/seed/clienttest/200',
    role: UserRole.CLIENT,
  },
  {
    id: 'client-1',
    fullName: 'Ana Silva',
    email: 'ana.silva@email.com',
    phone: '11987654321',
    address: 'Rua das Flores, 123, São Paulo, SP',
    profilePictureUrl: 'https://picsum.photos/seed/client1/200',
    role: UserRole.CLIENT,
  },
];

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 'prof-test',
    fullName: 'Profissional de Teste',
    email: 'profissional@teste.com',
    phone: '11988888888',
    address: 'Avenida do Teste, 20, São Paulo, SP',
    profilePictureUrl: 'https://picsum.photos/seed/proftest/200',
    role: UserRole.PROFESSIONAL,
    cpfCnpj: '111.111.111-11',
    profession: Profession.ELECTRICIAN,
    experience: '5 anos de experiência em testes de software e hardware elétrico.',
    bankAccount: '98765-4 / Ag. 0001',
    pixKey: 'profissional@teste.com',
    rating: 5.0,
    reviewsCount: 1,
    reviews: [
        { clientName: 'Empresa de QA', rating: 5, comment: 'Excelente profissional de testes!', date: new Date('2023-11-15') }
    ],
    distance: 1.5,
    isAvailable: true,
    activeClients: 1,
    servicesHistory: [
      { clientName: 'Empresa de QA', service: 'Teste de estresse de rede elétrica', date: '2023-11-15' },
    ],
    services: ['Testes de software', 'Testes de hardware', 'Automação de testes'],
    monthlyEarnings: 7250,
    acceptanceRate: 95,
  },
  {
    id: 'prof-1',
    fullName: 'Carlos Pereira',
    email: 'carlos.pereira@email.com',
    phone: '11912345678',
    address: 'Avenida Paulista, 500, São Paulo, SP',
    profilePictureUrl: 'https://picsum.photos/seed/prof1/200',
    role: UserRole.PROFESSIONAL,
    cpfCnpj: '123.456.789-00',
    profession: Profession.ELECTRICIAN,
    experience: '10 anos de experiência com instalações residenciais e comerciais.',
    bankAccount: '12345-6 / Ag. 0001',
    rating: 4.8,
    reviewsCount: 2,
    reviews: [
        { clientName: 'Mariana Costa', rating: 5, comment: 'Instalação rápida e perfeita. Recomendo!', date: new Date('2023-10-15') },
        { clientName: 'João Oliveira', rating: 4, comment: 'Bom serviço, mas atrasou um pouco.', date: new Date('2023-09-01') },
    ],
    distance: 2.5,
    isAvailable: true,
    activeClients: 2,
    servicesHistory: [
      { clientName: 'Mariana Costa', service: 'Instalação de luminárias', date: '2023-10-15' },
    ],
    services: ['Instalações residenciais', 'Instalações comerciais', 'Reparo de disjuntor', 'Instalação de ventilador de teto', 'installation of smart thermostats'],
    monthlyEarnings: 4800,
    acceptanceRate: 88,
  },
  {
    id: 'prof-2',
    fullName: 'Juliana Martins',
    email: 'juliana.martins@email.com',
    phone: '21988887777',
    address: 'Rua de Copacabana, 200, Rio de Janeiro, RJ',
    profilePictureUrl: 'https://picsum.photos/seed/prof2/200',
    role: UserRole.PROFESSIONAL,
    cpfCnpj: '00.111.222/0001-33',
    profession: Profession.GARDENER,
    experience: 'Especialista em paisagismo e manutenção de jardins tropicais.',
    bankAccount: '54321-0 / Ag. 0002',
    rating: 4.9,
    reviewsCount: 1,
    reviews: [
      { clientName: 'Pedro Almeida', rating: 5, comment: 'Deixou meu jardim impecável, muito caprichosa.', date: new Date('2023-11-01') },
    ],
    distance: 5.1,
    isAvailable: true,
    activeClients: 4,
    servicesHistory: [
        { clientName: 'Pedro Almeida', service: 'Manutenção de jardim', date: '2023-11-01' },
    ],
    services: ['Paisagismo', 'Manutenção de jardins', 'Poda de árvores', 'Controle de pragas'],
    monthlyEarnings: 3500,
    acceptanceRate: 92,
  },
  {
    id: 'prof-3',
    fullName: 'Roberto Souza',
    email: 'roberto.souza@email.com',
    phone: '31977776666',
    address: 'Avenida Afonso Pena, 1500, Belo Horizonte, MG',
    profilePictureUrl: 'https://picsum.photos/seed/prof3/200',
    role: UserRole.PROFESSIONAL,
    cpfCnpj: '987.654.321-11',
    profession: Profession.PLUMBER,
    experience: 'Soluções rápidas para vazamentos e desentupimentos.',
    bankAccount: '67890-1 / Ag. 0003',
    rating: 4.7,
    reviewsCount: 1,
    reviews: [
        { clientName: 'Fernanda Lima', rating: 4, comment: 'Resolveu o vazamento, mas o atendimento poderia ser mais cordial.', date: new Date('2023-09-20') },
    ],
    distance: 1.8,
    isAvailable: false,
    activeClients: 3,
    servicesHistory: [
        { clientName: 'Fernanda Lima', service: 'Reparo de vazamento', date: '2023-09-20' },
    ],
    services: ['Reparo de vazamento', 'Desentupimento de canos', 'Instalação de pias e torneiras', 'drain cleaning'],
    monthlyEarnings: 5100,
    acceptanceRate: 75,
  },
  {
    id: 'prof-4',
    fullName: 'Fernanda Lima',
    email: 'fernanda.lima@email.com',
    phone: '41966665555',
    address: 'Rua XV de Novembro, 300, Curitiba, PR',
    profilePictureUrl: 'https://picsum.photos/seed/prof4/200',
    role: UserRole.PROFESSIONAL,
    cpfCnpj: '11.222.333/0001-44',
    profession: Profession.HOUSEKEEPER,
    experience: 'Organização e limpeza residencial com atenção aos detalhes.',
    bankAccount: '11223-3 / Ag. 0004',
    rating: 5.0,
    reviewsCount: 1,
    reviews: [
        { clientName: 'Lucas Ferreira', rating: 5, comment: 'Limpeza impecável, superou minhas expectativas. Contratarei novamente com certeza.', date: new Date('2023-10-25') },
    ],
    distance: 8.2,
    isAvailable: true,
    activeClients: 1,
    servicesHistory: [
        { clientName: 'Lucas Ferreira', service: 'Limpeza pós-obra', date: '2023-10-25' },
    ],
    services: ['Limpeza pós-obra', 'Limpeza residencial', 'Organização de armários', 'Passar roupas'],
    monthlyEarnings: 2200,
    acceptanceRate: 100,
  },
];

export const MOCK_QUOTES: Quote[] = [
    {
        id: 'quote-1',
        from: MOCK_CLIENTS[1],
        to: MOCK_PROFESSIONALS[1],
        messages: [
            { sender: 'client', text: 'Olá, preciso instalar 3 ventiladores de teto. Poderia me passar um orçamento?', timestamp: new Date() }
        ],
        status: 'pending',
        paymentStatus: 'unpaid',
    },
    {
        id: 'quote-completed-1',
        from: MOCK_CLIENTS[0],
        to: MOCK_PROFESSIONALS[3], // Roberto Souza
        messages: [
             { sender: 'client', text: 'Meu cano da cozinha estourou, preciso de ajuda urgente!', timestamp: new Date('2023-11-18T10:00:00Z') },
             { sender: 'professional', text: 'Reparo de emergência em cano estourado.', timestamp: new Date('2023-11-18T10:05:00Z'), isOffer: true, offerDetails: { laborCost: 250, materials: [], visitFee: 0, total: 250, visitDate: '2023-11-18' } }
        ],
        status: 'completed',
        scheduledVisit: '18/11/2023',
        hasBeenRated: true,
        paymentStatus: 'paid',
    },
    {
        id: 'quote-completed-2',
        from: MOCK_CLIENTS[1],
        to: MOCK_PROFESSIONALS[3], // Roberto Souza
        messages: [
             { sender: 'client', text: 'Desentupir pia do banheiro.', timestamp: new Date('2023-11-20T11:00:00Z') },
             { sender: 'professional', text: 'Serviço de desentupimento de pia de banheiro.', timestamp: new Date('2023-11-20T11:05:00Z'), isOffer: true, offerDetails: { laborCost: 150, materials: [], visitFee: 0, total: 150, visitDate: '2023-11-20' } }
        ],
        status: 'completed',
        scheduledVisit: '20/11/2023',
        hasBeenRated: false,
        paymentStatus: 'unpaid',
    },
    {
        id: 'quote-completed-3',
        from: MOCK_CLIENTS[0],
        to: MOCK_PROFESSIONALS[0], // Profissional de Teste
        messages: [
             { sender: 'client', text: 'Troca de chuveiro.', timestamp: new Date('2023-11-21T09:00:00Z') },
             { sender: 'professional', text: 'Troca de resistência de chuveiro elétrico.', timestamp: new Date('2023-11-21T09:15:00Z'), isOffer: true, offerDetails: { laborCost: 120, materials: [], visitFee: 0, total: 120, visitDate: '2023-11-21' } }
        ],
        status: 'completed',
        scheduledVisit: '21/11/2023',
        hasBeenRated: false,
        paymentStatus: 'requested',
    },
    {
        id: 'quote-scheduled-1',
        from: MOCK_CLIENTS[1],
        to: MOCK_PROFESSIONALS[0],
        messages: [
             { sender: 'client', text: 'Preciso de um teste de automação', timestamp: new Date() },
             { sender: 'professional', text: 'Criação de script de automação para testes de interface.', timestamp: new Date(), isOffer: true, offerDetails: { laborCost: 500, materials: [], visitFee: 0, total: 500, visitDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] } }
        ],
        status: 'scheduled',
        scheduledVisit: `${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} às 14:00`,
        paymentStatus: 'unpaid',
    },
];

export const MOCK_DENUNCIATIONS: Denunciation[] = [
    {
        id: 'den-1',
        client: MOCK_CLIENTS[1], // Adjusted index
        professional: MOCK_PROFESSIONALS[3], // Adjusted index
        reason: 'Não compareceu ao serviço',
        description: 'O profissional Roberto Souza marcou uma visita para o dia 10 e não apareceu nem deu satisfação.',
        date: new Date('2023-11-10T10:00:00Z'),
    }
];

export const MOCK_BANNERS: Banner[] = [
    {
        id: 'banner-1',
        imageUrl: 'https://picsum.photos/seed/specialoffer/1000/250',
        title: 'Oferta Especial de Jardinagem: 20% de Desconto!',
        link: '#',
    },
    {
        id: 'banner-2',
        imageUrl: 'https://picsum.photos/seed/renovation/1000/250',
        title: 'Renove sua Casa para o Verão com Nossos Pedreiros',
        link: '#',
    }
];

export const DENUNCIATION_REASONS = [
    'Não compareceu ao serviço',
    'Serviço mal executado',
    'Conduta inadequada',
    'Problema com o valor cobrado',
    'Outro (descrever abaixo)',
];

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
    {
        id: 'ticket-1',
        clientOrProfessional: MOCK_CLIENTS[1],
        subject: 'Problema com pagamento',
        messages: [
            { senderId: 'client-1', senderName: 'Ana Silva', text: 'Não estou conseguindo adicionar meu cartão de crédito.', timestamp: new Date('2023-11-20T09:00:00Z') }
        ],
        status: 'open',
        createdAt: new Date('2023-11-20T09:00:00Z'),
    },
    {
        id: 'ticket-2',
        clientOrProfessional: MOCK_PROFESSIONALS[2],
        subject: 'Como atualizo meu perfil?',
        messages: [
            { senderId: 'prof-2', senderName: 'Juliana Martins', text: 'Gostaria de adicionar novos serviços ao meu perfil, mas não encontro a opção.', timestamp: new Date('2023-11-19T14:30:00Z') },
            { senderId: 'admin', senderName: 'Admin', text: 'Olá Juliana, a opção de editar serviços está na aba "Meu Perfil". Se precisar de mais ajuda, me avise.', timestamp: new Date('2023-11-19T15:00:00Z') }
        ],
        status: 'closed',
        createdAt: new Date('2023-11-19T14:30:00Z'),
    }
];