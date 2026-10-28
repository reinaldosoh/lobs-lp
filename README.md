# lobs · landing page (Astro + Preact)

Site estático da LP do lobs (lobsbot.com.br). Partes animadas como ilhas Preact.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera dist/ (site 100% estático)
npm run preview
```

## Estrutura

- `src/components/*.astro`: seções estáticas (HTML puro, zero JS): Header, Hero, Produto, Plataforma, Tarefas, FAQ, CTA, Footer.
- `src/components/islands/*.tsx`: ilhas Preact, hidratadas quando chegam perto da tela (`client:visible`, 400px antes):
  - `HeroChat`: as 6 conversas do hero (digitando, ferramentas executando, troca de conversa)
  - `Helpdesk`, `Crm` (cards mudam de coluna com animação FLIP), `Campaigns`, `Notifications`: os painéis de "Plataforma"
  - `Niches`: seletor de nichos com o chat no celular
  - `Demo` + `Showreel`: o filme dos lobs (42s, 8 cenas) renderizado ao vivo em código, sem arquivo de vídeo. Tudo é calculado a partir do tempo, então play/pause, barra de progresso e recomeçar são exatos. Toca sozinho ao aparecer na tela. Para mudar textos ou tempos, edite `SCENES` e os componentes `Scene*` em `Showreel.tsx`.
  - `Lob`: os 5 lobs (azul, laranja, roxo, verde, rosa), cada um com formato próprio. Com `still` é só SVG. Sem `still`, os olhos seguem o mouse e ele pisca. Os lobs são vetor puro, sem filtros: o volume vem de degradês e fica nítido em qualquer tamanho. `outline` gera a versão em linha.
  - `LobCycler`: alterna os lobs no título com [Motion](https://motion.dev) (`motion/mini`). Clique para pular para o próximo.
  - `LobsLogo` (em `Lob.tsx`): o ícone completo com os 5 lobs. Para ver, acesse `/logo`.
- `src/styles/global.css`: CSS compilado (Tailwind v4) do site original. As classes dos componentes dependem dele.

As animações usam a mesma lógica e os mesmos tempos do JS original. As animações CSS (`fade-up`, `typing-dot`, `breathe`, `blink`, `pulse-ring`, `row-in`, `spin`) vêm direto do CSS original.

## Observação sobre o CSS

`global.css` já vem compilado, sem o Tailwind no build. Se você usar uma classe utilitária nova que não exista lá, ela não vai ter efeito. Para editar o design com liberdade, instale o Tailwind v4 (`@tailwindcss/vite`) e recrie os tokens do `@theme` (`--color-ink`, `--color-zappy`, etc.).

## Publicação

Serviço `lp` no projeto `api` do Easypanel, build pelo `Dockerfile` (nginx servindo `dist/`). Para atualizar: `git push` neste repositório e clicar em Implantar no serviço `lp`.
