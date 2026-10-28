export const POC_SECTIONS = [
  { id: 'quem-somos', title: 'Quem somos' },
  { id: 'empresas', title: 'Empresas' },
  { id: 'servicos', title: 'O que fazemos' },
  { id: 'indicadores', title: 'Indicadores' },
  { id: 'contato', title: 'Contato' },
] as const;
export const POC_IDS: readonly string[] = [
  'conteudo',
  ...POC_SECTIONS.map((section) => section.id),
];
