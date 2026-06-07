// Shared Diar.ia content for all layout variations.
// Cover images point at beehiiv's public CDN so mockups feel real.
window.DiariaData = {
  brand: {
    name: 'Diar.ia',
    tagline: 'Seu filtro no caos de notícias sobre IA.',
    description: 'Um resumo diário das principais pesquisas, notícias, tendências e insights, para ler em 5 minutos, se manter atualizado e usar IA melhor.',
    stats: { readers: '12.4k', issues: 412, retention: '94%' },
  },
  today: { weekday: 'Terça', day: 19, month: 'maio', year: 2026, edition: 412, countdown: '03:24:11' },
  issues: [
    { dateLong: '30 mar 2026', dateISO: '2026.03.30', dateShort: '30 mar', n: 412, mins: 8, title: 'IA turbina produção, mas corrói competências', dek: '170% de produção com 80% do time: um caso real | A fórmula do Claude para crescer', cover: 'https://media.beehiiv.com/cdn-cgi/image/format=auto,fit=scale-down,onerror=redirect/uploads/asset/file/1b5dc687-587f-452d-b9ac-262372bb45d3/260330_cover.jpg' },
    { dateLong: '27 mar 2026', dateISO: '2026.03.27', dateShort: '27 mar', n: 411, mins: 7, title: 'Claude Mythos: o modelo mais perigoso do mundo', dek: 'Anthropic vence o Pentágono na Justiça | Em 2030, tokens cairão 90%, mas a conta total subirá', cover: 'https://media.beehiiv.com/cdn-cgi/image/format=auto,fit=scale-down,onerror=redirect/uploads/asset/file/55ccdf83-c9d0-4bf7-bf0d-b41b0091e8c0/260327_cover.jpg' },
    { dateLong: '26 mar 2026', dateISO: '2026.03.26', dateShort: '26 mar', n: 410, mins: 7, title: 'Altman admite: a IA trará ameaças', dek: 'Gemini Robotics vai a 20 mil robôs | O benchmark que revela os limites reais da IA', cover: 'https://media.beehiiv.com/cdn-cgi/image/format=auto,fit=scale-down,onerror=redirect/uploads/asset/file/8df71afe-ab9f-4b90-8d0c-c133f32aa7b3/260326_cove.jpg' },
    { dateLong: '25 mar 2026', dateISO: '2026.03.25', dateShort: '25 mar', n: 409, mins: 6, title: 'Claude agora controla seu computador', dek: 'IA pode padronizar linguagem | Siri vs Claude vs ChatGPT no iOS', cover: 'https://media.beehiiv.com/cdn-cgi/image/format=auto,fit=scale-down,onerror=redirect/uploads/asset/file/204c71c0-5497-47a4-be6b-298e06a16d88/260325_cover.jpg' },
    { dateLong: '24 mar 2026', dateISO: '2026.03.24', dateShort: '24 mar', n: 408, mins: 8, title: 'Meta testa um "co-CEO" de IA para Zuckerberg', dek: 'OpenAI encerra o Sora | Arm abandona só licenciamento e fabrica chip próprio', cover: 'https://media.beehiiv.com/cdn-cgi/image/format=auto,fit=scale-down,onerror=redirect/uploads/asset/file/095360a4-2039-42bb-bbd4-3301b8a40667/260324_cover.jpg' },
    { dateLong: '23 mar 2026', dateISO: '2026.03.23', dateShort: '23 mar', n: 407, mins: 7, title: 'O maior estudo já feito com usuários de IA', dek: 'O maior contrabando de IA da história dos EUA | DOJ defende banimento federal à Anthropic', cover: 'https://media.beehiiv.com/cdn-cgi/image/format=auto,fit=scale-down,onerror=redirect/uploads/asset/file/5b860494-6408-4835-adb1-af3e88bf0c1d/260323_cover_3.jpg' },
  ],
  specials: [
    { kicker: 'Lista aberta', title: 'Livros sobre IA', subtitle: 'Uma coleção curada dos melhores livros sobre inteligência artificial.', count: 42, cta: 'Ver livros' },
    { kicker: 'Para assinantes', title: 'Cursos gratuitos de IA', subtitle: 'Uma coleção curada dos melhores cursos grátis de inteligência artificial.', count: 28, cta: 'Ver cursos' },
  ],
  books: [
    { title: 'Co-Intelligence',          author: 'Ethan Mollick',           level: 'iniciante', spine: '#1f3a5f' },
    { title: 'The Coming Wave',          author: 'Mustafa Suleyman',        level: 'todos',     spine: '#143d2b' },
    { title: 'Power and Progress',       author: 'Acemoglu · Johnson',      level: 'avançado',  spine: '#7c2d12' },
    { title: 'Human Compatible',         author: 'Stuart Russell',          level: 'avançado',  spine: '#3b2f1d' },
    { title: 'The Worlds I See',         author: 'Fei-Fei Li',              level: 'iniciante', spine: '#5b1f3a' },
    { title: 'Genesis',                  author: 'Kissinger · Schmidt',     level: 'todos',     spine: '#1a1612' },
    { title: 'AI Snake Oil',             author: 'Narayanan · Kapoor',      level: 'iniciante', spine: '#4a5d23' },
    { title: 'Nexus',                    author: 'Yuval Noah Harari',       level: 'todos',     spine: '#7a4019' },
  ],
  courses: [
    { title: 'AI for Everyone',           provider: 'DeepLearning.AI',  hours: 6,  level: 'iniciante', tag: 'AI4E' },
    { title: 'Generative AI for Everyone', provider: 'Coursera',         hours: 9,  level: 'iniciante', tag: 'GenAI' },
    { title: 'Prompt Engineering',         provider: 'Anthropic',        hours: 4,  level: 'intermediário', tag: 'PROMPT' },
    { title: 'Building Systems w/ LLMs',   provider: 'DeepLearning.AI',  hours: 8,  level: 'intermediário', tag: 'LLM' },
    { title: 'LangChain for LLMs',         provider: 'DeepLearning.AI',  hours: 10, level: 'avançado',  tag: 'LANG' },
    { title: 'Agents with Claude',         provider: 'Anthropic',        hours: 6,  level: 'avançado',  tag: 'AGENT' },
  ],
  faqs: [
    { q: 'Quais tópicos essa newsletter cobre?', a: 'Fazemos curadoria e resumimos pesquisas, lançamentos, notícias e outros assuntos relacionados a IA. Nosso objetivo é que você não fique perdido no mar de notícias, garantindo que as informações mais importantes cheguem até você.' },
    { q: 'Com que frequência vou receber conteúdo?', a: 'Enviamos uma edição por dia, de segunda a sexta. Eventualmente enviamos edições especiais nos finais de semana.' },
    { q: 'Como dar feedback ou sugerir temas ou notícias?', a: 'Responda a qualquer uma de nossas edições. Adoramos receber feedback e publicamos com frequência notícias de nossos leitores.' },
  ],
};
