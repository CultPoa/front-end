# CultPOA - Aplicativo de Exploração Cultural de Porto Alegre

Um aplicativo web/mobile responsivo para explorar locais culturais, eventos e experiências gamificadas na cidade de Porto Alegre.

Para iniciar o frontend acessível pelo celular:

```bash
npm run dev -- --host
```

## 🎯 Funcionalidades

### ✅ Implementadas

- **🗺️ Mapa Interativo Leaflet**:
  - Visualização de pontos culturais com filtros por categoria
  - Clustering inteligente de marcadores
  - Geolocalização em tempo real
  - Detecção de proximidade (notifica quando perto de um local)
  - Integração com Wikipedia (imagens e descrições)
  - Popups personalizados com informações detalhadas
- **📍 Detalhes do Local**: Informações completas sobre museus, monumentos e espaços culturais
- **🎭 Eventos**: Lista de eventos culturais (oficiais e da comunidade)
- **🏅 Sistema de Insígnias**: Conquistas e gamificação
- **💬 Mensagens Secretas**: Sistema de mensagens anônimas por local
- **📸 Compartilhamento**: Integração com redes sociais
- **👤 Perfil do Usuário**: Histórico e estatísticas
- **🛠️ Painel Administrativo**: Gestão de conteúdo e moderação

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── app/
│   ├── components/         # Componentes React
│   │   ├── MapView.tsx    # Mapa principal
│   │   ├── LocalDetails.tsx
│   │   ├── Events.tsx
│   │   ├── Badges.tsx
│   │   ├── Messages.tsx
│   │   ├── Share.tsx
│   │   ├── Profile.tsx
│   │   ├── Admin.tsx
│   │   └── BottomNav.tsx
│   ├── services/          # Serviços e APIs
│   │   └── api.ts         # Cliente da API REST
│   ├── types/             # TypeScript types
│   │   └── place.ts       # Interface Place e tipos relacionados
│   └── App.tsx            # Componente raiz
└── styles/
    └── theme.css          # Variáveis CSS e tema
```

### Stack Tecnológica

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **React Router DOM** - Navegação
- **Leaflet + React Leaflet** - Mapa interativo
- **React Leaflet Cluster** - Agrupamento de marcadores
- **Tailwind CSS v4** - Estilização
- **Motion (Framer Motion)** - Animações
- **Lucide React** - Ícones
- **Sonner** - Notificações toast

## 🎨 Design System

### Paleta de Cores

```css
--primary: #e63946 /* Vermelho vibrante - Museus */ --secondary: #f4a261
  /* Laranja - Monumentos */ --accent: #2a9d8f /* Verde-água - Arte */
  --event: #e76f51 /* Coral - Eventos */ --background: #fafafa /* Fundo */;
```

### Componentes Reutilizáveis

- Botões com estados hover/active
- Cards com sombras e bordas arredondadas
- Modal/Dialog system
- Sistema de filtros
- Loading states
- Empty states

## 🔌 Integração com API

### Endpoints Utilizados

```typescript
// Buscar todos os locais
GET http://localhost:8000/api/places

// Buscar local por ID
GET http://localhost:8000/api/places/:id
```

### Formato de Dados

```typescript
interface Place {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: string;
  description?: string;
  image?: string;
  wikipedia?: string;
  website?: string;
}
```

Ver documentação completa em:

- [API_INTEGRATION.md](./API_INTEGRATION.md) - Integração com API REST
- [LEAFLET_INTEGRATION.md](./LEAFLET_INTEGRATION.md) - Mapa Leaflet

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- pnpm (gerenciador de pacotes)
- API REST rodando em `http://localhost:8000`

### Instalação

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev
```

### Variáveis de Ambiente

Crie um arquivo `.env` (opcional):

```env
VITE_API_URL=http://localhost:8000
```

## 📱 Responsividade

O aplicativo é **mobile-first** e totalmente responsivo:

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🎮 Funcionalidades de Gamificação

### Sistema de Insígnias

- Explorador Cultural (primeira visita)
- Conhecedor de Museus (3 museus)
- Guardião da História (todos monumentos)
- Amante das Artes (5 eventos)
- Curador POA (10 mensagens)
- Influencer Cultural (20 compartilhamentos)

### Registro de Visitas

Cada visita registrada:

- Atualiza estatísticas do usuário
- Desbloqueia insígnias
- Permite deixar mensagens secretas
- Gera notificações de conquista

## 🔐 Painel Administrativo

Funcionalidades:

- Aprovação/rejeição de conteúdo
- Versionamento de edições
- Moderação de mensagens
- Estatísticas de uso
- Gestão de permissões (admin/curador)

## 🧪 Testes

```bash
# Executar testes (quando implementados)
pnpm test

# Type checking
pnpm tsc --noEmit
```

## 📦 Build para Produção

```bash
# Criar build otimizado
pnpm build

# Preview do build
pnpm preview
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autores

Desenvolvido com ❤️ em Porto Alegre

---

**CultPOA** - Explorando a cultura gaúcha através da tecnologia 🎨🏛️
